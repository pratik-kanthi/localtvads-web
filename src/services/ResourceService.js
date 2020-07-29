import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class ResourceService extends BaseService {
    static _url = '/api/clientadplans';

    static getResources() {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/:clientid/clientresources');
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}