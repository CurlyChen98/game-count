import { isEmpty, isFinite } from 'lodash-es';
import i18n from '@/i18n';

/**
 * @function 必須項
 * @description 常規
 */
export function required(event, { message } = {}) {
  let _message = i18n.t('FormRule.message.required');
  if (isEmpty(event) && !isFinite(event)) return message ?? _message;
  return true;
}

/**
 * @function 必須項
 * @description 文件
 */
export function requiredFile(event, { message } = {}) {
  let _message = i18n.t('FormRule.message.requiredFile');
  if (!event) return message ?? _message;
  return true;
}

/**
 * @function 必須項
 * @description 多選框
 */
export function requiredCheckbox(event, { message } = {}) {
  let _message = i18n.t('FormRule.message.requiredCheckbox');
  if (!event) return message ?? _message;
  return true;
}

// 字符长度限制
export function maxLength(event, { length = 100, message } = {}) {
  let _message = i18n.t('FormRule.message.maxLength', [length]);
  if (`${event}`.length > length) return message ?? _message;
  return true;
}

// 字符长度限制
export function maxLength50(event) {
  return maxLength(event, { length: 50 });
}

// 字符长度限制
export function maxLength300(event) {
  return maxLength(event, { length: 300 });
}

// 金額校驗
export function amountCheck(value, { message } = {}) {
  if (!/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value)) {
    let _message = i18n.t('FormRule.message.amountCheck');
    return message ?? _message;
  } else if (value * 1 > 999999999) {
    let _message = i18n.t('FormRule.message.amountMax');
    return message ?? _message;
  }
  return true;
}

// 金額校驗
export function amountCheckLong(value, { message } = {}) {
  if (!/^([1-9]\d*|0)(\.\d{2})$/.test(value)) {
    let _message = i18n.t('FormRule.message.amountCheck');
    return message ?? _message;
  } else if (value * 1 > 999999999) {
    let _message = i18n.t('FormRule.message.amountMax');
    return message ?? _message;
  }
  return true;
}

// 電子郵件
export function email(value, { message } = {}) {
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  ) {
    let _message = i18n.t('FormRule.message.email');
    return message ?? _message;
  }
  return true;
}

// 八位數字校驗
export function eightNumber(value, { message } = {}) {
  if (!/^[0-9]{8}$/.test(value)) {
    let _message = i18n.t('FormRule.message.eightNumber');
    return message ?? _message;
  }
  return true;
}

// 八位數字校驗
export function passwordCheck(value, { message } = {}) {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,}$/.test(value)) {
    let _message = i18n.t('FormRule.message.password');
    return message ?? _message;
  }
  return true;
}

// 八位數字校驗
// export function eightNumber({ message } = {}) {
//   return {
//     validator: (rule, value) => {
//       if (value && !/^[0-9]{8}$/.test(value)) return false;
//       else return true;
//     },
//     message: message ?? i18n.t('Common.message.mobileRule'),
//   };
// }

// 電子郵件
// export function email({ message } = {}) {
//   return {
//     validator: (rule, value) => {
//       if (
//         value &&
//         !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
//           value
//         )
//       )
//         return false;
//       else return true;
//     },
//     message: message ?? i18n.t('Common.message.emailRule'),
//   };
// }

// 整數項
// export function onlyInteger({ message = i18n.t('Common.message.onlyInteger') } = {}) {
//   return { message, pattern: /^\d*$/ };
// }

// 澳門手機
// export function macauMobile({ message } = {}) {
//   return {
//     validator: (rule, value) => {
//       if (value && !/^[6]{1}[0-9]{7}$/.test(value)) return false;
//       else return true;
//     },
//     message: message ?? i18n.t('Common.message.mobileRule'),
//   };
// }

// 澳門手機、固話
// export function macauMobileLandline({ message } = {}) {
//   return {
//     validator: (rule, value) => {
//       if (value && !/^(?:28\d{6}|8\d{7}|6\d{7})$/.test(value)) return false;
//       else return true;
//     },
//     message: message ?? i18n.t('Common.message.mobileLandlineRule'),
//   };
// }
