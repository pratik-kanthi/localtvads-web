import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class ChannelService extends BaseService {
    static _url = '/api/channels';
    static getLowestPrice(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/channel/lowestprice?id=' + id);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}