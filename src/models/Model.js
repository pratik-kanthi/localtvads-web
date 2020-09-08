export default class Model {
    constructor(data) {
        Object.assign(this, data);
    }

    getImageUrl(prop) {
        prop = prop || 'ImageUrl';
        if (!this[prop]) {
            return '';
        }
        if (this[prop]) {
            if (this[prop].slice(0, 4) === 'http') {
                return this[prop];
            } else {
                return window.bucketendpoint + this[prop];
            }
        }
    }
}