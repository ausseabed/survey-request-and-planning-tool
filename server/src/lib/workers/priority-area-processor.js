import _ from 'lodash';
import * as Boom from '@hapi/boom';
import { getConnection } from 'typeorm';
import { createConnection } from "typeorm";
var Axios = require('axios');
var shp = require('shpjs');
var sharp = require('sharp');
import simplify from '@turf/simplify';



import { geojsonToFeatureList, getParameterCaseInsensitive } from '../../lib/entity/utils';
import { sleep } from '../../routes/utils';
import { Task } from '../../lib/entity/task';
import { PriorityArea } from '../../lib/entity/priority-area';
import { MarinePark } from '../../lib/entity/marine-park';


const getDbImage = async (connection, paId, attrName, extents, imageSize) => {
  let tableName = "priority_area";

  let rasterSize = imageSize * 4;
  const dX = extents.maxX - extents.minX;
  const dY = extents.maxY - extents.minY;
  const maxDelta = dX > dY ? dX : dY;
  let scale = maxDelta / rasterSize;
  let bufferWidth = maxDelta / 350.0;

  let nrq = `ST_MakeEmptyRaster(${rasterSize},${rasterSize},${extents.minX}, ${extents.maxY}, ${scale}, ${-1 * scale}, 0,0,4326)`;
  let aoiRaster = `ST_AsRaster("${attrName}",${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[255, 0, 0, 55], ARRAY[255,255,255, 0])`;
  let aoiRasterBoundary = `ST_AsRaster(ST_Boundary("${attrName}"),${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[255, 0, 0, 255], ARRAY[255,255,255, 0])`;

  const innSel = `SELECT ${aoiRasterBoundary} as rast from ${tableName} where "id" = '${paId}' UNION ALL SELECT ${aoiRaster} as rast from ${tableName} where "id" = '${paId}' UNION ALL SELECT ${nrq}`;

  const mergedRaster = await connection
    .query(`select ST_AsPNG(ST_Union(rast, 'FIRST')) "imageData" from (${innSel}) foo`);

  const rasterImageData = mergedRaster[0].imageData;

  const resizedRasterImageData = await sharp(rasterImageData)
    .resize({
      width: imageSize,
      height: imageSize,
    })
    .png()
    .toBuffer();
  return resizedRasterImageData;
}

const getBaseMapImage = async (extents, imageSize) => {
  const sizeX = imageSize;
  const sizeY = imageSize;
  const wmsBase = `https://services.ga.gov.au/gis/rest/services/NationalBaseMap/MapServer/export`;
  const wmsBB = `BBOX=${extents.minX}%2C${extents.minY}%2C${extents.maxX}%2C${extents.maxY}`;
  const baseMapUrl = `${wmsBase}?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=${sizeX}%2C${sizeY}&${wmsBB}&BBOXSR=4326&IMAGESR=4326&DPI=180`;
  try {
    let res = await Axios.get(baseMapUrl, { responseType: 'arraybuffer' });
    // try to create an image from this data. Sometimes the server will be down
    // but not returning error codes (eg; Esri web servers)
    const testImage = await sharp(res.data)
      .modulate({ saturation: 0.7 })
      .png()
      .toBuffer();
    return res.data;
  } catch (error) {
    console.log("Error obtaining base layer");
    console.log(error);
    const noBaseMapImg =
      await sharp('src/lib/workers/no-base-layer.png')
        .resize(sizeX, sizeY)
        .png()
        .toBuffer();
    return noBaseMapImg;
  }

}



const getExtents = async (connection, paId) => {
  const extents = await connection
    .createQueryBuilder()
    .select([`ST_XMin("extent")`, `ST_XMax("extent")`, `ST_YMin("extent")`, `ST_YMax("extent")`])
    .from(subQuery => {
      return subQuery
        .select(`ST_Extent("geom")`, 'extent')
        .from('priority_area')
        .where(`"id" = :id`, { id: paId });
    }, "extent")
    .getRawOne();

  let center = {
    x: (extents.st_xmax + extents.st_xmin) / 2,
    y: (extents.st_ymax + extents.st_ymin) / 2
  }
  let dX = extents.st_xmax - extents.st_xmin
  let dY = extents.st_ymax - extents.st_ymin
  let maxDelta = dX > dY ? dX : dY
  maxDelta = maxDelta * 1.9 // 90% buffer around regions bounding box
  let newExtents = {
    minX: center.x - maxDelta / 2,
    maxX: center.x + maxDelta / 2,
    minY: center.y - maxDelta / 2,
    maxY: center.y + maxDelta / 2,
  }
  return newExtents
}

const getFeaturesFromZip = async (data) => {
  let geojson = shp.parseZip(data);
  let simplifyOptions = { tolerance: 0.0005, highQuality: false, mutate: true };
  let simpleGeojson = simplify(geojson, simplifyOptions);
  let features = geojsonToFeatureList(simpleGeojson);
  return features;
};

const getFeaturesFromJson = async (data) => {
  let geojson = JSON.parse(data);
  let simplifyOptions = { tolerance: 0.0005, highQuality: false, mutate: true };
  let simpleGeojson = simplify(geojson, simplifyOptions);
  let features = geojsonToFeatureList(simpleGeojson);
  return features;
};

const setErrorState = async (connection, taskId, errorMessage) => {
  await getConnection().getRepository(Task)
    .update(
      taskId,
      {
        state: 'FAILED',
        errorMessage: errorMessage + '',
        statusMessage: '',
      }
    );
}

const featureToPriorityArea = async (feature) => {
  let pa = new PriorityArea();

  // this is where we support ingesting the same data that is exported
  // from the `shp-builder.js`
  pa.name = getParameterCaseInsensitive(feature.properties, 'A_NAME');
  if (_.isNil(pa.name)) {
    pa.name = getParameterCaseInsensitive(feature.properties, 'name');
  }
  if (_.isNil(pa.name)) {
    // Special support for data provided by Parks Australia
    // the 'TitleAll' attribute is to be used as the area of interest name
    // but only the first part of the string (before the '-')
    const titleAll = getParameterCaseInsensitive(feature.properties, 'titleall');
    if (!_.isNil(titleAll)) {
      // the test dataset provided uses unicode hyphen characters, so we need
      // to make sure we split the title with either a normal hyphen or the unicode
      // character
      const separators = ['-', '–'];
      const titleTokens = titleAll.split(new RegExp(separators.join('|'),'g'));
      if (titleTokens.length > 0) {
        pa.name = titleTokens[0];
      }
    }
  }
  // if no name is provided, then fill the name with an id value
  if (_.isNil(pa.name)) {
    pa.name = getParameterCaseInsensitive(feature.properties, 'id');
  }
  if (_.isNil(pa.name)) {
    pa.name = getParameterCaseInsensitive(feature.properties, 'objectid');
  }
  if (_.isNil(pa.name)) {
    pa.name = getParameterCaseInsensitive(feature.properties, 'fid');
  }

  // a Parks Australia specific field
  const parksPriority = getParameterCaseInsensitive(feature.properties, 'AusSeabedP');
  if (!_.isNil(parksPriority)) {
    if (parksPriority.toLowerCase() == 'level 1') {
      pa.organisationalPriority = 'High'
    } else if (parksPriority.toLowerCase() == 'level 2') {
      pa.organisationalPriority = 'Medium'
    } else if (parksPriority.toLowerCase() == 'level 3') {
      pa.organisationalPriority = 'Low'
    }
  }

  // set the features geometry
  pa.geom = feature.geometry;

  const { id } = await getConnection()
    .getRepository(PriorityArea)
    .save(pa);

  // once geometry is saved to PostGIS, update it to be valid
  await getConnection()
    .query(`UPDATE priority_area SET geom = ST_Multi(ST_CollectionExtract(ST_MakeValid(geom), 3)) WHERE id = '${id}'`);

  return id;
}

const doProcessing = async (taskId) => {
  const imageSize = 300;
  const connection = await createConnection();

  await getConnection().getRepository(Task)
    .update(taskId, {
      state: 'STARTED',
      statusMessage: "Loading task data"
    });

  const task = await getConnection().getRepository(Task)
    .findOne(
      taskId,
      {
        select: ["id", "state", "blobFileName", "blob"]
      }
    );
  const data = task.blob;

  await getConnection().getRepository(Task)
    .update(taskId, { statusMessage: "Extracting geometry" });

  let features = undefined;
  if (task.blobFileName.endsWith('.zip')) {
    try {
      features = await getFeaturesFromZip(data);
    } catch (e) {
      await setErrorState(
        connection, taskId, `Could not extract geometry from zip (${e})`);
      return;
    }
  } else if (
    task.blobFileName.endsWith('.json') ||
    task.blobFileName.endsWith('.geojson')
  ) {
    try {
      features = await getFeaturesFromJson(data);
    } catch (e) {
      await setErrorState(
        connection, taskId, `Could not extract geometry from json (${e})`);
      return;
    }
  }

  const progressType = features.length > 1 ? 'PERCENT' : 'INDETERMINATE';
  await getConnection().getRepository(Task)
    .update(taskId, {
      progressType: progressType,
      progress: 0,
      statusMessage: "Saving Priority Area data"
    });

  let count = 0;
  let priorityAreaIds = [];
  for (const feature of features) {
    let paId = await featureToPriorityArea(feature);
    priorityAreaIds.push(paId);
    count += 1;
    let percentageComplete = Math.round(count / features.length * 0.2 * 100);

    await getConnection().getRepository(Task)
      .update(taskId, {
        progress: percentageComplete
      });

  };

  await getConnection().getRepository(Task)
    .update(taskId, {
      statusMessage: "Generating thumbnails"
    });

  count = 0;
  let completedPriorityAreaIds = [];
  for (const paId of priorityAreaIds) {

    let extents = undefined;
    try {
      extents = await getExtents(getConnection(), paId);
    } catch (e) {
      await setErrorState(
        connection, taskId, `Unable to generate extents (${e})`);
      return;
    }

    let [dbImg, bmImg] = await Promise.all([
      getDbImage(getConnection(), paId, 'geom', extents, imageSize),
      getBaseMapImage(extents, imageSize)
    ]);

    // let dbImg = undefined;
    // try {
    //   dbImg = await getDbImage(connection, paId, 'geom', extents, imageSize);
    // } catch (e) {
    //   await setErrorState(
    //     connection,
    //     taskId,
    //     `Unable to generate image from database geometry (${e})`
    //   );
    //   return;
    // }
    //
    // const bmImg = await getBaseMapImage(extents, imageSize);

    const mergedImg = await sharp(bmImg)
      .modulate({ saturation: 0.7 })
      .composite([{ input: dbImg }])
      .png()
      .toBuffer();

    await getConnection().getRepository(PriorityArea)
      .update(paId, { thumbnail: mergedImg });

    count += 1;
    let percentageComplete = Math.round(
      (count / features.length * 0.4 + 0.2) * 100
    );

    completedPriorityAreaIds.push(paId);

    await getConnection().getRepository(Task)
      .update(taskId, {
        progress: percentageComplete
      });
  };

  await getConnection().getRepository(Task)
    .update(taskId, {
      statusMessage: "Finding intersections"
    });

  count = 0;
  for (const paId of priorityAreaIds) {
    let intersectsQuery = getConnection()
      .getRepository(MarinePark)
      .createQueryBuilder("marine_park")
      .leftJoinAndSelect(
        PriorityArea,
        "priority_area",
        "ST_Intersects(marine_park.geometry, priority_area.geom)"
      ).andWhere(
        `priority_area.id = :aid`,
        { aid: paId }
      );

    let intersectingItems = await intersectsQuery.getMany();
    let intersectingItemsResp = intersectingItems.map(ii => {
      // need to remove comma chars as they will mess up the simple-array based
      // db storage
      const netname = ii.netname.replace(/,/g, "")
      const zonename = ii.zonename.replace(/,/g, "")
      return `${netname} (${zonename})`;
    });

    await getConnection().getRepository(PriorityArea)
      .update(paId, { intersections: intersectingItemsResp });

    count += 1;
    let percentageComplete = Math.round(
      (count / features.length * 0.4 + 0.6) * 100
    );

    await getConnection().getRepository(Task)
      .update(taskId, {
        progress: percentageComplete
      });
  }

  await getConnection().getRepository(Task)
    .update(taskId, {
      progress: 100,
      state: 'COMPLETED',
      output: { priorityAreaIds: completedPriorityAreaIds },
    });
};

module.exports = function (taskId, callback) {
  doProcessing(taskId)
    .then(res => {
      callback(null, res);
    })
    .catch(error => {
      getConnection().getRepository(Task)
        .update(taskId, {
          state: 'FAILED',
          errorMessage: error.message
        }).then(() => {
          callback(error, null);
        })
    });
};
