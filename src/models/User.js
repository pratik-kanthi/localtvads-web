import {Model} from '@/vue9_components/plugins/model/model';

export class User extends Model {
    static defaults() {
        return {
            name: 'user',
            api: 'api/users',
            computed: {
                full_name() {
                    return `${this.Name} ${this.LastName}`
                }
            }
        }
    }
    static schema() {
        return {
            Name: {
                type: String,
                required: true
            },
            LastName: {
                type: String,
                required: true
            }
        }
    }
}