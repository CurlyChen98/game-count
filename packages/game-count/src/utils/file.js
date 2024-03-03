/**
 * @function web端下載文件
 */
export function downloadFile({ link, file, fileName }) {
  if (link) {
    window.open(link);
  } else if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, fileName);
  } else {
    let elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(file);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href);
    document.body.removeChild(elink);
  }
}
