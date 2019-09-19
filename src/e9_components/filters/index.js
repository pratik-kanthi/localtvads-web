import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', (date, format) => moment(date).format(format));

Vue.filter('limitTo', (arr, val) => val.slice(0, val));

Vue.filter('trucateChars', (val, num) => {
	let result = '';
	if (val) {
		result = val.substring(0, num);
		if (val.length > num) {
			result += '...';
		}
	}
	return result;
});

Vue.filter('currency', (value) => {
	if (typeof value !== 'number') {
		return value;
	}
	let formatter = new Intl.NumberFormat('en-UK', {
		style: 'currency',
		currency: 'GBP',
		minimumFractionDigits: 2
	});
	return formatter.format(value);
});

Vue.filter('formatValue', (value, fraction) => {
	if (typeof value !== 'number') {
		return value;
	}
	let formatter = new Intl.NumberFormat('en-UK', {
		minimumFractionDigits: fraction
	});
	return formatter.format(value);
});

Vue.mixin({
	computed: {
		unique() {
			return (arr, key) => {
				let output = [];
				let usedKeys = {};
				for (let i = 0; i < arr.length; i++) {
					if (!usedKeys[arr[i][key]]) {
						usedKeys[arr[i][key]] = true;
						output.push(arr[i]);
					}
				}
				return output;
			};
		}
	}
});
