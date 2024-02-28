import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class FaxInRecordApi extends BaseAPI {
  path = '/fax-in-record';

  /**
   * @function 搜索
   * @description 分頁。
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

  /**
   * @function 搜索
   * @description 根據投標箱id搜索，全部。
   */
  async searchByBoxId({ tenderBoxId }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/records/${tenderBoxId}`,
    });

    return data;
  }

  /**
   * @function 详细
   */
  async detail({ id }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  /**
   * @function 收件記錄新增
   * @description 測試用
   */
  async add(formData) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: formData,
      timeout: 0,
    });

    return data;
  }

  /**
   * @function 刪除
   */
  async delete({ id }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/${id}`,
    });

    return data;
  }

  /**
   * @function 刪除
   */
  async download({ id }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/file/download/${id}`,
      responseType: 'blob',
      timeout: 0,
    });

    return data;
  }
}

export default new FaxInRecordApi();
