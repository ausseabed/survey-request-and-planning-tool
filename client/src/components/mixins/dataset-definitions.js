import { mapGetters } from 'vuex'

export const datasetDefinition = {
  computed: {
    ...mapGetters({
      all_formats: 'common/all_formats'
    }),
    datasetLabel() {
      return this.id ? "Update" : "Create";
    },
    isLoggedUser() {
      return this.$auth.getPayload() && this.$auth.getPayload().id;
    },
    vector_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['shp', 'kml', 'fgdb', 'tab', 'dxf'], f.value) });
    },
    raster_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['ecw', 'tiff', 'jpg', 'asc'], f.value) });
    },
    las_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['las', 'laz'], f.value) });
    },
    report_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['doc', 'pdf', 'xml'], f.value) });
    },
    meta_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['doc', 'pdf', 'xls'], f.value) });
    },
    video_formats() {
      return _.filter(this.all_formats, (f) => { return _.includes(['mp4', 'mov', 'avi', 'mxf'], f.value) });
    }
  },
  methods: {
    regex_pattern(patterns) {
      if (patterns) {
        return _.reduce(patterns, (agrregated, p) => {
          var found = _.find(this.namedpattern, (n) => { return n.label.toUpperCase() === p.toUpperCase() });
          agrregated += (found ? found.value : p);
          return agrregated;
        }, '');
      }
      else {
        return '';
      }
    },
    example_from_pattern(patterns) {
      if (patterns) {
        var examples = _.map([1, 2], (idx) => {
          return _.reduce(patterns, (agrregated, p) => {
            var split_value = p.split('|')
            var found = _.find(this.namedpattern, (n) => { return n.label.toUpperCase() === p.toUpperCase() });
            agrregated.push(found ? found.examples[_.random(0, found.examples.length - 1)] : split_value[_.random(0, split_value.length - 1)]);
            return agrregated;
          }, []).join('')
        })

        return _.filter(examples, (e) => { return e.length > 0 }).length > 0 ? 'Example file names: \n' + examples.join('\n') : ''
      }
      else {
        return '';
      }
    }
  },
  data() {
    return {
      id: null,
      namedpattern: [
        { value: '\\w+', label: 'Any Word', sublabel: 'Example values melbourne_lidar, sydney (including numerals & underscore)', examples: ['melbourne_lidar_1', 'sydney_2_cbd', 'brisbane_5_cbd'] },
        { value: '(?P<Year>\\d{4})', label: 'Year', sublabel: 'Example values 2018, 2017', examples: ['2018', '2017', '2010'] },
        { value: '(?P<MonthName>Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)', label: 'Month Name', sublabel: 'Example values Jan, January, Dec, December', examples: ['Jan', 'January'] },
        { value: '(?P<Month>1[0-2]|0[1-9])', label: 'Month', sublabel: 'Example values anything between 01 and 12', examples: ['02', '11'] },
        { value: '(?P<Date>0[1-9]|[12][0-9]|3[01])', label: 'Date', sublabel: 'Example values anything between 01 and 31', examples: ['02', '14', '31'] },
        { value: '(?P<GSD>\\d{3}|_\\d{2}|\\d{1}_\\d{1})', label: 'Ground Sampling Distance in meters', sublabel: 'Example values 010, 0_5, _10  (exactly 3 digits replace . with _ for sub meter)', examples: ['010', '0_5', '_10'] },
        { value: '(?P<Easting>\\d{3})', label: 'Easting KM', sublabel: 'Example values 580 (exactly 3 digits)', examples: ['580', '200', '200'] },
        { value: '(?P<EastingInMeters>\\d{6})', label: 'Easting in Meters', sublabel: 'Example values 580000 (exactly 6 digits)', examples: ['580000', '200000', '200000'] },
        { value: '(?P<Northing>\\d{4})', label: 'Northing KM', sublabel: 'Example values 7490 (exactly 4 digits)', examples: ['7490', '7590', '7590'] },
        { value: '(?P<NorthingInMeters>\\d{7})', label: 'Northing in Meters', sublabel: 'Example values 7490000 (exactly 7 digits)', examples: ['7490000', '7590000', '7590000'] },
        { value: '(?P<UTMZone>\\d{2})', label: 'UTM Zone', sublabel: 'Example values 54 (exactly two digits)', examples: ['54', '55'] },
        { value: '(?P<WidthKM>\\d{4}|_\\d{3})', label: 'Width in KM/Meter', sublabel: 'Example values 0001, _500 (exactly 4 digits or _ followed by 3 digits for meters)', examples: ['0001', '_500'] },
        { value: '(?P<HeightKM>\\d{4}|_\\d{3})', label: 'Height in KM/Meter', sublabel: 'Example values 0001, _500 (exactly 4 digits or _ followed by 3 digits for meters)', examples: ['0001', '_500'] },
        { value: '(?P<TileSize>\\d{4}|_\\d{3})', label: 'Tile Size in KM/Meter', sublabel: 'Example values 0001, _500 (exactly 4 digits or _ followed by 3 digits for meters)', examples: ['0001', '_500'] },
        { value: '(?P<Datum>ORT|AHD|MSL|NZV|OTP|AKL|MOT|GIS|NAP|TAR|WEL|NEL|LYT|DUN|DBL|BLU|STI|LAT|HAT|MLW|MHW|ELL)', label: 'Datum', sublabel: 'Example values ort, ahd, ell', examples: ['ort', 'ell', 'ahd'] },
        { value: '[a-zA-Z]+', label: 'Any Characters', sublabel: 'Example values abcde (no numerals)', examples: ['abcde', 'fghi', 'jklmn'] },
        { value: '\\d+', label: 'Any Numbers', sublabel: 'Example values 1234, 9999 (no characters)', examples: ['12345', '67890'] },
        { value: '(?P<Classification>c[1-4]{1})', label: 'Classification Level', sublabel: 'Example values c1, c2, c3 or c4', examples: ['c1', 'c2'] },
        { value: '(?P<Swath>\\d+)', label: 'Swath', sublabel: 'Example values 1236, 8743', examples: ['1236', '8743'] },
        { value: '(?P<LinearUnit>\\d+m|cm)', label: 'Linear Unit', sublabel: 'Example values 1m, 20cm', examples: ['1m', '10cm'] },
        { value: '(?P<ImageType>rgb|grey|nir|thermal)', label: 'Image Type', sublabel: 'Example values rgb, grey, nir or thermal', examples: ['rbg', 'grey', 'nir', 'thermal'] }
      ]
    }
  }
}
