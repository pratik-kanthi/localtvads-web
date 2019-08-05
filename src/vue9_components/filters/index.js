import Vue from "vue"
import moment from 'moment';

Vue.filter("formatDate", (date, format) => moment(date).format(format));

Vue.filter("limitTo", (arr, val) => val.slice(0, val));

Vue.filter("trucateChars", (val, num) => {
  let result = '';
  if (val) {
    result = val.substring(0, num);
    if (val.length > num) {
      result += '...';
    }
  }
  return result;
});

Vue.mixin({
  computed: {
    unique() {
      return function (arr, key) {
        var output = [];
        var usedKeys = {};
        for (var i = 0; i < arr.length; i++) {
          if (!usedKeys[arr[i][key]]) {
            usedKeys[arr[i][key]] = true;
            output.push(arr[i])
          }
        }
        return output;
      }
    }
  }
});
