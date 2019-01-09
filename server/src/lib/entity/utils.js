export class DateTransformer {
  to (value) {
    const date = new Date();
    date.setTime(value);
    return date;
  }

  from (value) {
    return value.getTime();
  }
}
