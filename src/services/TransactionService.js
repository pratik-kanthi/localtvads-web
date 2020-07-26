import BaseService from './BaseService';
import { get } from './ApiService';

export default class TransactionService extends BaseService {
    static _url = '/api/transactions';

    static getTransactions(client, planId) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/client/transactions?client=' + client + '&plan=' + planId);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }

    static downloadReceipt(transaction_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _res = await get('api/client/transaction?id=' + transaction_id);
                resolve(_res.data);
            } catch (err) {
                return reject(err);
            }
        });
    }
}
