import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class PublicUserApi extends BaseAPI {
  prefix = '/public';
  path = '/users';

  /**
   * @function
   */
  async changePassword({ oldPassword, newPassword }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/password/change`,
      params: {
        oldPassword,
        newPassword,
      },
    });

    return data;
  }
}

export default new PublicUserApi();
