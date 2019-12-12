import _ from 'lodash'

export class DateTransformer {
  to (value) {
    if (_.isNil(value)) {
      return undefined
    }
    const date = new Date();
    date.setTime(value);
    return date;
  }

  from (value) {
    if (_.isNil(value)) {
      return undefined;
    }
    return value.getTime();
  }
}
