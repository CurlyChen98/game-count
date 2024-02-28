import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class UsersApi extends BaseAPI {
  path = '/users';

  /**
   * @function 查詢用戶
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

  /**
   * @function 查詢用戶
   * @description cover後端對公司框架封裝出來的版本
   */
  // async searchCover({ page, size, sort, obj = {} }) {
  //   const { data } = await axios({
  //     method: 'post',
  //     url: `${this.context}/user/users/search-detail`,
  //     params: {
  //       page,
  //       size,
  //       sort,
  //     },
  //     data: obj,
  //   });

  //   return data;
  // }

  /**
   * @function 創建用戶
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
   * @function 創建用戶
   * @description cover後端對公司框架封裝出來的版本
   */
  // async createCover(obj) {
  //   const { data } = await axios({
  //     method: 'post',
  //     url: `${this.context}/user/users`,
  //     data: obj,
  //   });

  //   return data;
  // }

  async detail({ id }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  /**
   * @function 編輯用戶
   */
  async update({ id, ...obj }) {
    const { data } = await axios({
      method: 'put',
      url: `${this._getBasePath()}/${id}`,
      data: obj,
    });

    return data;
  }

  /**
   * @function 編輯用戶
   * @description cover後端對公司框架封裝出來的版本
   */
  // async updateCover({ id, ...obj }) {
  //   const { data } = await axios({
  //     method: 'put',
  //     url: `${this.context}/user/users/${id}`,
  //     data: obj,
  //   });

  //   return data;
  // }

  async delete({ id }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  async addGroups({ userId, groupIds }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/${userId}/groups`,
      params: {
        groupId: groupIds,
      },
    });

    return data;
  }

  async deleteGroups({ userId, groupIds }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${userId}/groups`,
      params: {
        groupId: groupIds,
      },
    });

    return data;
  }

  async setPassword({ userId, changePassword, password }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/${userId}/password`,
      data: {
        changePassword,
        password,
      },
    });

    return data;
  }

  // async downloadAvatar({ userId }) {
  //   const { data } = await axios({
  //     method: 'get',
  //     url: `${this._getBasePath()}/${userId}/avatar`,
  //     responseType: 'blob',
  //     timeout: 0,
  //   });

  //   return data;
  // }

  // async uploadAvatar({ userId, file }) {
  //   const { data } = await axios({
  //     method: 'post',
  //     url: `${this._getBasePath()}/${userId}/avatar`,
  //     data: file,
  //     timeout: 0,
  //   });

  //   return data;
  // }

  async unlock({ userId }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/${userId}/unlock`,
    });

    return data;
  }

  async getUnlockTime() {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/lockTime/detail`,
    });

    return data;
  }

  async setUnlockTime({ lockTime }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/lockTime`,
      params: { lockTime },
    });

    return data;
  }
}

export default new UsersApi();
