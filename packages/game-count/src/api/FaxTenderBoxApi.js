import axios from 'axios';
import { BaseAPI } from './BaseAPI';

export class FaxTenderBoxApi extends BaseAPI {
  path = '/tender-box';

  /**
   * @function 新增
   */
  async create({ ...obj }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: obj,
    });

    return data;
  }

  /**
   * @function 编辑
   */
  async edit({ ...obj }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}`,
      data: obj,
    });

    return data;
  }

  /**
   * @function 搜索
   */
  async search({ page, size, sort, obj = {} }) {
    if (obj.statusList && obj.statusList.length > 0) {
      let { statusList } = obj;
      let index = statusList.findIndex((it) => it === 'DELETE');
      if (index > -1) {
        statusList.splice(index, 1);
        obj.statusList = statusList;

        if (statusList.length === 4) obj.deleted = null;
        else obj.deleted = true;
      } else {
        obj.deleted = false;
      }
    }

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
   * @function 详细
   */
  async detail({ id, password }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/${id}`,
      params: {
        password,
      },
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
   * @function 撤回刪除，復原
   */
  async undelete({ id }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/back/${id}`,
    });

    return data;
  }

  /**
   * @function 变更密碼
   */
  async editPassword({ id, encrypted, oldPassword, password }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/update-password`,
      data: {
        id,
        encrypted,
        oldPassword,
        password,
      },
    });

    return data;
  }

  /**
   * @function 变更状态
   */
  async editStatus({ id, password, tenderStatus }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/update-status`,
      data: {
        id,
        password,
        tenderStatus,
      },
    });

    return data;
  }

  /**
   * @function 總結資料
   */
  async report({ tenderBoxId }) {
    const { data } = await axios({
      method: 'get',
      url: `${this._getBasePath()}/download/${tenderBoxId}`,
      responseType: 'blob',
      timeout: 0,
    });

    return data;
  }

  /**
   * @function 解綁標書編號，釋放編號以便再利用
   */
  async unbind({ tenderBoxId }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/unbinding/${tenderBoxId}`,
    });

    return data;
  }

  /**
   * @function 收件記錄移動
   * @description 批量
   */
  async recordMove({ ids, tenderBoxId, password }) {
    const { data } = await axios({
      method: 'post',
      url: `${this._getBasePath()}/move`,
      data: {
        ids,
        password,
        tenderBoxId,
      },
    });

    return data;
  }

  /**
   * @function 收件記錄刪除
   * @description 批量
   */
  async recordDelete({ ids }) {
    const { data } = await axios({
      method: 'delete',
      url: `${this._getBasePath()}/move`,
      data: {
        ids,
      },
    });

    return data;
  }
}

export default new FaxTenderBoxApi();
