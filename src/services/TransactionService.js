import BaseService from './BaseService';
import {
    get
} from './ApiService';

export default class TransactionService extends BaseService {
    static _url = '/api/transactions';

    static getTransactions(client, planId) {
        return new Promise(async (resolve, reject) => {
            try {
                let queryString = '';
                if (planId) {
                    queryString += `&plan=${planId}`;
                }
                let _res = await get(`api/:clientid/transactions?client=${client}${queryString}`);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }

    static downloadReceipt(transaction_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/:clientid/transaction?id=' + transaction_id);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}