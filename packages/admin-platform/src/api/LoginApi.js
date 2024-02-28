import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class LoginApi extends BaseAPI {
  api = '';
  version = '';

  /**
   * @function
   */
  async login({ username, password }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/login`,
      params: {
        username,
        password,
      },
    });

    return data;
  }

  /**
   * @function
   */
  async getProfile() {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/profile`,
    });

    return data;
  }

  /**
   * @function
   */
  async logout() {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/logout`,
    });

    return data;
  }
}

export default new LoginApi();
