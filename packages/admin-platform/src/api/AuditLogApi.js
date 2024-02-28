import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class AuditLogApi extends BaseAPI {
  path = '/audit-logs';

  /**
   * @function 搜索
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
}

export default new AuditLogApi();
