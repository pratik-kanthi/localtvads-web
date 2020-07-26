import BaseService from './BaseService';
import {
    get
} from './ApiService';
export default class ClientAdService extends BaseService {
    static _url = '/api/clientadplans';

    static getAllPlans() {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/:clientid/clientadplans/all?clientId=');
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }

    static getPlanDetails(planId) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get(`api/:clientid/clientadplans/${planId}`);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}