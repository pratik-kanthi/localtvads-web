import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class TaxService extends BaseService {
    static _url = '/api/taxes';
    static getAllTaxes() {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/taxes/all');
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}