import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class AddOnService extends BaseService {
    static _url = '/api/serviceaddons';
    static getActiveAddOns(params) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('/api/serviceaddons/all', params);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}