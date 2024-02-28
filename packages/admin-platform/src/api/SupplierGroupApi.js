import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class SupplierGroupApi extends BaseAPI {
  path = '/group';

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
      url: `${this._getBasePath()}/syn`,
    });

    return data;
  }
}

export default new SupplierGroupApi();
