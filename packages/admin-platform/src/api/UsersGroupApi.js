import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class UsersGroupApi extends BaseAPI {
  path = '/users/groups';

  /**
   * @function 查詢
   */
  async search({ page, size, sort, obj = {} }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/search-detail`,
      params: {
        page,
        size,
        sort,
      },
      data: obj,
    });

    return data;
  }

  async create({ ...obj }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: obj,
    });

    return data;
  }

  async detail({ id }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  async update({ id, ...obj }) {
    const { data } = await axios({
      method: 'put',
      url: `${this._getBasePath()}/${id}`,
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

  async getUser({ groupId, page, size }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/${groupId}/users`,
      params: {
        page,
        size,
      },
    });

    return data;
  }

  async addUser({ groupId, userIds }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/${groupId}/users`,
      params: {
        userId: userIds,
      },
    });

    return data;
  }

  async deleteUser({ groupId, userIds }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${groupId}/users`,
      params: {
        userId: userIds,
      },
    });

    return data;
  }
}

export default new UsersGroupApi();
