import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class FaxHolidayApi extends BaseAPI {
  path = '/holiday';

  /**
   * @function 查詢
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

  async sync() {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/syn/holiday`,
    });

    return data;
  }
}

export default new FaxHolidayApi();
