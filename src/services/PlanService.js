import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class ChannelProductService extends BaseService {
    static _url = '/api/clientadplan';

    static getProductsOfChannel(channelId) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/channelproducts/all?id=' + channelId);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}