import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class ViewUserApi extends BaseAPI {
  path = '/view-user';

  /**
   * @function 新增
   */
  async searchNumber() {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/search/cst-nbr/list`,
    });

    return data;
  }
}

export default new ViewUserApi();
