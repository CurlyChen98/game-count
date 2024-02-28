import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class UserRoleApi extends BaseAPI {
  api = '';
  version = '';
  path = '/user/roles';

  async delete({ id }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }
}

export default new UserRoleApi();
