import BaseService from './BaseService';
import {
    get,
    post,
    remove
} from './ApiService';
export default class ClientAdService extends BaseService {
    static _url = '/api/clientadplans';

    static getAllPlans() {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/:clientid/clientadplans');
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

    static attachVideo(planId, resource_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get(`api/:clientid/clientadplans/${planId}/attachvideo/${resource_id}`);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }

    static attachImages(planId, resources) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await post(`api/:clientid/clientadplans/${planId}/attachimages`, {
                    images: resources
                });
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
    static removeAddonResource(planId, resourceId) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await remove(`api/:clientid/addonresources?planId=${planId}&id=${resourceId}`);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}