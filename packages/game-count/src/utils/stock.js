import dayjs from 'dayjs';
import { PermissionApi, DepartmentApi } from '@/api';
// import i18n from '@/i18n';

//
export const ac = [
  { text: '生效', value: 'A', color: 'var(--v-success-base)' },
  { text: '失效', value: 'C', color: 'var(--v-error-base)' },
];

//
export const trueFalse = [
  { text: '是', value: true, color: 'var(--v-success-base)' },
  { text: '否', value: false, color: 'var(--v-error-base)' },
];

//
export const userStatuses = [
  { text: '生效', value: true, color: 'var(--v-success-base)' },
  { text: '失效', value: false, color: 'var(--v-error-base)' },
];

export const userTypes = [
  { text: '部門普通職員', value: 'USER' },
  { text: '部門主管', value: 'ADMIN' },
  { text: '系統管理員', value: 'IT' },
];

//
export const preferredLanguages = [
  { text: '中文', value: 'ZH_HANT' },
  { text: 'Português', value: 'PT' },
  // { text: '簡體中文', value: 'ZH_HANS' },
  // { text: '葡文', value: 'PT' },
  // { text: '英文', value: 'EN' },
];

//
export const suppliceSources = [
  { text: '系統自建', value: 'PAS_CRATE' },
  { text: '同步錄入', value: 'SYNC_USER' },
];

//
export const holidayTypes = [
  { text: '公共假期', value: '' },
  { text: '公務員假期', value: 'P' },
];

//
export const fileRecordTyeps = [
  { text: '標書/詢價', value: 'test1' },
  { text: '採購單/公函/其他', value: 'test2' },
];

//
export const tenderTypes = [
  { text: '標書', value: 'test1' },
  { text: '詢價', value: 'test2' },
];

//
export const purchaseTypes = [
  { text: '採購單', value: 'test3' },
  { text: '公函', value: 'test4' },
  { text: '其他', value: 'test5' },
];

//
export const bidBoxStatuses = [
  { text: '未開始', value: 'NOT_STARTED', color: 'var(--v-warning-base)' },
  { text: '進行中', value: 'PROCEED', color: 'var(--v-primary-base)' },
  { text: '已截標', value: 'END_TENDER', color: 'var(--v-error-base)' },
  { text: '已下載資料', value: 'ALREADY_DOWNLOAD', color: '#9E9E9E' },
  { text: '已刪除', value: 'DELETE', color: 'var(--v-secondary-darken1)' },
];

//
export function handleYears({ range = -20 } = {}) {
  let years = [];
  let currentYear = dayjs().year();
  let line = currentYear + range;

  if (range < 0) {
    for (let i = line; i <= currentYear; i++) {
      years.unshift(i);
    }
  } else if (range > 0) {
    for (let i = line; i >= currentYear; i--) {
      years.unshift(i);
    }
  } else {
    years.unshift(currentYear);
  }

  return years;
}

export function handleMonths() {
  let months = [];

  for (let i = 1; i <= 12; i++) {
    months.push(i);
  }

  return months;
}

let permissions = [];
export async function handlePermissions({ force } = {}) {
  if (permissions.length === 0 || force) {
    let temp = await PermissionApi.search();
    permissions = Object.keys(temp).reduce((last, index) => {
      let item = temp[index];
      item.forEach((it) => {
        last.push({
          ...it,
          belong: index,
          value: it.id,
          text: it.name,
        });
      });
      return last;
    }, []);

    let sortArr = [
      { alias: 'TENDER_BOX_VIEW_NO_START', name: '投標箱查看 (未開始)' },
      { alias: 'TENDER_BOX_VIEW_ING', name: '投標箱查看 (進行中)' },
      { alias: 'TENDER_BOX_VIEW_END_TIME', name: '投標箱查看 (已截標)' },
      { alias: 'TENDER_BOX_VIEW_DOWNLOAD', name: '投標箱查看 (已下載標書結果)' },
      { alias: 'TENDER_BOX_VIEW_DELETE', name: '投標箱查看 (已刪除)' },
      { alias: 'TENDER_BOX_EDIT', name: '投標箱操作 (普通)' },
      { alias: 'TENDER_SUP_BOX_EDIT', name: '投標箱操作 (高級)' },
      { alias: 'TENDER_SUP_BOX_BACK_EDIT', name: '投標箱操作 (復原)' },
      { alias: 'TENDER_SUP_BOX_EDIT_UNG', name: '投標箱操作 (解除標書綁定)' },
      //
      { alias: 'TENDER_RECORD_MOVE', name: '收件記錄移動' },
      //
      { alias: 'IN_RECORD_VIEW', name: '收件記錄查看' },
      { alias: 'IN_RECORD_FILE_VIEW', name: '收件記錄附件查看' },
      { alias: 'IN_RECORD_FILE_DOWNLOAD', name: '收件記錄附件下載' },
      { alias: 'IN_RECORD_FILE_DIRECT_VIEW', name: '收件記錄附件查看（無視狀態）' },
      { alias: 'IN_RECORD_FILE_DIRECT_DOWNLOAD', name: '收件記錄附件下載（無視狀態）' },
      //
      { alias: 'USER_VIEW', name: '用戶管理查看' },
      { alias: 'USER_EDIT', name: '用戶管理操作 (含刪除)' },
      //
      { alias: 'DEPARTMENT_VIEW', name: '群組管理查看' },
      { alias: 'DEPARTMENT_EDIT', name: '群組管理操作 (含刪除)' },
      //
      { alias: 'ROLE_VIEW', name: '角色權限查看' },
      { alias: 'ROLE_EDIT', name: '角色權限操作 (含刪除)' },
      //
      { alias: 'SUPPLIER_VIEW', name: '供應商查看' },
      { alias: 'SUPPLIER_EDIT', name: '供應商操作 (含刪除+同步)' },
      //
      { alias: 'GROUP_VIEW', name: '供應商群組查看' },
      { alias: 'GROUP_EDIT', name: '供應商群組操作 (含刪除)' },
      //
      { alias: 'HOLIDAY_VIEW', name: '假期清單查看' },
      { alias: 'HOLIDAY_EDIT', name: '假期清單操作 (含同步)' },
      //
      { alias: 'AC_LOG_VIEW', name: '操作日誌查看' },
    ];
    let newP = [];
    sortArr.forEach((item) => {
      let find = permissions.find((it) => item.alias === it.alias);
      if (find) {
        find.text = item.name;
        newP.push(find);
      }
    });
    permissions = newP;
  }

  return permissions;
}

let groups = [];
export async function handleGroups({ force } = {}) {
  if (groups.length === 0 || force) {
    let { content } = await DepartmentApi.search({
      page: 0,
      size: 9999,
      sort: 'modifiedTime:desc',
    });
    groups = content.map((item) => {
      return {
        ...item,
        value: item.id,
        text: `${item.nameTc} (${item.code})`,
      };
    });
  }

  return groups;
}

//
export function objFindValue({ list, value, val = 'value', lab = 'text' }) {
  let find = list.find((it) => {
    return value === it[val];
  });
  if (find) return find[lab];
  else return '--';
}

//
export function objFindColor({ list, value, val = 'value', lab = 'color' }) {
  let find = list.find((it) => {
    return value === it[val];
  });
  if (find) return { '--rect-color': find[lab] };
  else return '';
}
