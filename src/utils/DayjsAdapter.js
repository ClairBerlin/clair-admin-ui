import Chart from 'chart.js';
import dayjs from 'dayjs';

// adapted from moment adapter of Chart.js
// https://github.com/chartjs/Chart.js/blob/2.9/src/adapters/adapter.moment.js

// uses german time formatting
// dayjs format reference: https://day.js.org/docs/en/parse/string-format
const FORMATS = {
  datetime: 'YYYY-MM-DD HH:mm:ss',
  millisecond: 'H:mm:ss.SSS',
  second: 'H:mm:ss',
  minute: 'H:mm',
  hour: 'H',
  day: 'D. MMM',
  week: 'll', // note: not supported in day.js
  month: 'MMM YYYY',
  quarter: '[Q]Q - YYYY',
  year: 'YYYY'
};

Chart._adapters._date.override({
  _id: 'dayjs',

  formats: function() {
    return FORMATS;
  },

  parse: function(value, format) {
    if (typeof value === 'string' && typeof format === 'string') {
      value = dayjs(value, format);
    } else if (!value instanceof dayjs) {
      value = dayjs(value);
    }
    return value.isValid() ? value.valueOf() : null;
  },

  format: function(time, format) {
    return dayjs(time).format(format);
  },

  add: function(time, amount, unit) {
    return dayjs(time)
      .add(amount, unit)
      .valueOf();
  },

  diff: function(max, min, unit) {
    return dayjs(max).diff(dayjs(min), unit);
  },

  startOf: function(time, unit, weekday) {
    time = dayjs(time);
    if (unit === 'isoWeek') {
      return time.isoWeekday(weekday).valueOf();
    }
    return time.startOf(unit).valueOf();
  },

  endOf: function(time, unit) {
    return dayjs(time)
      .endOf(unit)
      .valueOf();
  },

  _create: function(time) {
    return dayjs(time);
  }
});
