import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class SupplierApi extends BaseAPI {
  path = '/supplier';

  /**
   * @function
   */
  async search({ page, size, sort, obj = {} }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/search`,
      params: {
        page,
        size,
        sort,
      },
      data: obj,
    });

    return data;
  }

  /**
   * @function
   */
  async create(obj) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: obj,
    });

    return data;
  }

  /**
   * @function 編輯用戶
   */
  async update(obj) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: obj,
    });

    return data;
  }

  async delete({ id }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  async syncData() {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/syn/supplier`,
    });

    return data;
  }
}

export default new SupplierApi();
