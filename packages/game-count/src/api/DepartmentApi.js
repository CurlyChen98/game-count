import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class DepartmentApi extends BaseAPI {
  path = '/departments';

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
      url: `${this._getBasePath()}/create`,
      data: obj,
    });

    return data;
  }

  // async detail({ id }) {
  // const { data } = await axios({
  //   method: 'get',
  //   url: `${this._getBasePath()}/${id}`,
  // });

  // return data;
  // }

  /**
   * @function 編輯用戶
   */
  async update(obj) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/create`,
      data: obj,
    });

    return data;
  }

  async updateStatus({ ids, status }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/update-status`,
      data: { ids, status },
    });

    return data;
  }

  async delete({ ids }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/delete`,
      data: { ids },
    });

    return data;
  }
}

export default new DepartmentApi();
