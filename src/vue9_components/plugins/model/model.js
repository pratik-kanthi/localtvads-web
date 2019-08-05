import {
  path,
  mergeDeepRight
} from 'ramda'

import * as utils from './utils'
import instance from "../../../api";

let Vue;

class Model {
  static init (_Vue, _options) {
    utils.init(_options);
    Vue = process.env.NODE_ENV === 'test' ? require('vue') : _Vue
  }
  static schema() {
    return {
      id: {
        type: String
      }
    }
  }
  static defaults() {
    return {}
  }
  constructor(attributes = {}, options = {}) {
    const schema = this.constructor.schema();
    const default_attributes = utils.getDefaultsFromSchema(schema);

    const _options = mergeDeepRight(this.constructor.defaults(), options);

    const default_options = {
      name: 'model',
      created() {
        this.set(attributes)
      },
      data() {
        return default_attributes()
      },
      computed: {
        api() {
          const api = this.$options.api;
          return api || this.$options.name + 's'
        },
        isNew() {
          return [undefined, ''].includes(this.id)
        },
      },
      methods: {
        async fetch() {
          let response = await instance.get(this.api());
          this.set(response);
          return response
        },
        get_data() {
          let data = {};
          for (let key in schema) {
            data[key] = this[key]
          }
          return mergeDeepRight({}, data)
        },
        set(data) {
          const data_decoded = this.decode(data);
          for (let key in data_decoded) {
            if (!(key in this.$options.computed)) {
              this[key] = data_decoded[key]
            }
          }
          return this
        },
        reset() {
          return utils.resetState(this, default_attributes())
        },
        toJSON() {
          return utils.modelToJSON(this)
        },
        decode(data = this.get_data()) {
          return utils.decodeData(utils.removeUnderscores(data), schema)
        },
        encode(data = this.get_data()) {
          return utils.addUnderscores(utils.encodeData(data, schema))
        },
        schema() {
          return schema
        }
      }
    };
    const model_options = mergeDeepRight(default_options, _options);
    return new Vue(model_options)
  }
}

export { Model }
