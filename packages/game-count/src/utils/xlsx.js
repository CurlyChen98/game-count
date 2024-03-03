import dayjs from 'dayjs';
import * as xlsx from 'xlsx';

/**
 * @function 導出excel
 */
export const exportExcelByObj = async (data, fileName = 'output', options = {}) => {
  // 检查传入的数據是不是object
  if (typeof data !== 'object') return;

  // 設置options
  let defaultOptions = { nameDate: true, format: 'xlsx' };
  let _options = { ...defaultOptions, ...options };

  if (!Array.isArray(data)) data = [data];

  const SheetNames = data.map((ele) => ele.sheetName);
  const Sheets = Object.assign(
    {},
    ...data.map((ele) => {
      return {
        [ele.sheetName]: xlsx.utils.json_to_sheet(ele.data),
      };
    })
  );
  const wb = {
    SheetNames,
    Sheets,
  };

  let name = fileName;
  if (_options.nameDate) name += '-' + dayjs().format('YYYYMMDDHHmm');

  xlsx.writeFile(wb, `${name}.${_options.format}`, { bookType: _options.format });
};

/**
 * @function 读取excel
 */
export const importExcel = function (file, header) {
  return new Promise(function (resolve, reject) {
    // 獲取上傳的文件对象

    // 通过FileReader对象读取文件
    const fileReader = new FileReader(); // 異步讀取文件

    fileReader.onload = (event) => {
      try {
        const { result } = event.target;

        // 以二進制流方式读取得到整份excel表格对象
        const workbook = xlsx.read(result, { type: 'binary' });
        let data = []; // 存储獲取到的数據
        // 遍历每张工作表進行读取（这里默認只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
            // 利用 sheet_to_json 方法将 excel 轉成 json 数據
            data = data.concat(
              xlsx.utils.sheet_to_json(workbook.Sheets[sheet], { header: header })
            );
            // break; // 如果只取第一张表，就取消註释这行
          }
        }
        resolve(data);
      } catch (error) {
        // 这里可以抛出文件类型錯误不正确的相关提示--文件类型不正确
        reject(error);
      }
    };
    // 以二進制方式打開文件
    fileReader.readAsBinaryString(file);
  });
};
