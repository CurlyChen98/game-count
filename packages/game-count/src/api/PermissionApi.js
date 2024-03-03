import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class PermissionApi extends BaseAPI {
  path = '/permissions';

  /**
   * @function 查詢
   */
  async search() {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/applications/function`,
    });

    return data;
  }
}

export default new PermissionApi();
