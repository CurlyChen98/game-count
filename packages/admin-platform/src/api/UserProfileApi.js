import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class UserProfileApi extends BaseAPI {
  api = '';
  version = '';
  path = '/user/profile';

  /**
   * @function
   */
  async getProfile() {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}`,
    });

    return data;
  }

  /**
   * @function
   */
  async getProfileDetail() {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/detail`,
    });

    return data;
  }
}

export default new UserProfileApi();
