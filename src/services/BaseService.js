import {
    count,
    get,
    query,
    remove,
    update
} from '@/services/ApiService';

export default class BaseService {
    static _query(params) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await query(this._url, params);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
    static _get(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get(this._url, id);
                resolve(_res);
            } catch (err) {
                return reject(err);
            }
        });
    }
    static _count(params) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await count(this._url, params);
                resolve(_res);
            } catch (err) {
                return reject(err);
            }
        });
    }
    static _update(id, params) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await update(this._url, id, params);
                resolve(_res);
            } catch (err) {
                return reject(err);
            }
        });
    }
    static _delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await remove(this._url, id);
                resolve(_res);
            } catch (err) {
                return reject(err);
            }
        });
    }
}