// custom filters used by the app are defined here and accessible in all
// components

import { date } from 'quasar'

export default ({ Vue }) => {
  Vue.filter('capitalize', function (value) {
    // capitalise first letter of the string
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })

  Vue.filter('dateString', function (value) {
    // converts the millisecond based timestamp into human readable form
    if (_.isNil(value)) {
      return 'n/a'
    }

    const ts = new Date();
    ts.setTime(value);
    let formattedString = date.formatDate(ts, 'MMMM D, YYYY');
    return formattedString;
  })

  Vue.filter('dateValue', function (value) {
    // converts the millisecond based timestamp into human readable form
    if (_.isNil(value)) {
      return 'n/a'
    }

    const ts = new Date();
    ts.setTime(value);
    return ts;
  })
}
