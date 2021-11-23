import _ from 'lodash'
import * as Boom from '@hapi/boom'
import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
import stream from 'stream'
var shp = require('shpjs');
import { multiPolygon } from "@turf/helpers";
import truncate from "@turf/truncate";

import { getConnection } from 'typeorm'

import {
  asyncMiddleware, isAuthenticated, permitPermission,
  permitCustodianBasedPermission, isUuid
} from '../utils'
import { geojsonToFeatureList, getParameterCaseInsensitive } from '../../lib/entity/utils';
import { MarinePark } from '../../lib/entity/marine-park'

const router = express.Router()

async function processMarineParkData(data, filename) {
  console.log(`processing ${filename}`);

  let geojson = shp.parseZip(data);
  let features = geojsonToFeatureList(geojson);

  await getConnection().transaction(async transactionalEntityManager => {

    let pasQuery = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(MarinePark)
      .execute();

    for (const feature of features) {
      let mp = new MarinePark();
      mp.geometry = feature.geometry;
      mp.netname = getParameterCaseInsensitive(feature.properties, 'netname');
      mp.resname = getParameterCaseInsensitive(feature.properties, 'resname');
      mp.zonename = getParameterCaseInsensitive(feature.properties, 'zonename');
      mp.zoneuicn = getParameterCaseInsensitive(feature.properties, 'zoneuicn');
      mp.polygonid = getParameterCaseInsensitive(feature.properties, 'polygonid');
      mp.natlegend = getParameterCaseInsensitive(feature.properties, 'natlegend');

      await getConnection()
        .getRepository(MarinePark)
        .save(mp);
    }
  });

}

//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

    let data = undefined;
    let filename = undefined;

    new formidable.IncomingForm().parse(req)
      .on('field', (name, field) => {
        doc[name] = field
      })
      .on('file', async (name, file) => {
        filename = file.name
        data = fs.readFileSync(file.path)
      })
      .on('aborted', () => {
        console.error('Request aborted by the user')
      })
      .on('error', (err) => {
        console.error('Error', err)
        throw err
      })
      .on('end', async () => {
        await processMarineParkData(data, filename);
        res.end();
      })
  }));


module.exports = router;
