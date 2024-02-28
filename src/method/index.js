import Vue from "vue";
import pako from "pako";

export default {
  install() {
    /** 压缩  */
    Vue.prototype.$zip = function (str) {
      const binaryString = pako.gzip(encodeURIComponent(str), {to: 'string'})
      return btoa(binaryString);
    };
    /** 解压缩  */
    Vue.prototype.$unzip = function (b64Data) {
      const strData1 = atob(b64Data);
      // 将二进制字符串转换为字符数数组
      const charData = strData1.split("").map(function (x) {
        return x.charCodeAt(0);
      });
      // 把数字数组转换成字节数组
      const binData = new Uint8Array(charData);
      // 解压
      const data = pako.inflate(binData);
      //将解压缩完成的的byteArray转换回ascii字符串:
      const strData2 = new TextDecoder("utf-8").decode(data);//大数据使用此方法
      //const strData   = String.fromCharCode.apply(null, new Uint16Array(data));//数据不是很多可以使用此方法
      return decodeURIComponent(strData2);
    };
    /** 分页方法 */
    Vue.prototype.$getPageInfo = function (pageSize, pageNum) {
      return {
        "pageSize": pageSize,
        "pageNum": pageNum
      }
    };
    /** 后端返回的分页信息 */
    Vue.prototype.$cutPageDataList = function (response) {
      return {
        "dataList": response.list,
        "totalPage": response.total
      }
    };
    /** 将observer转换为正常对象 */
    Vue.prototype.$ObserverToObject = function (data) {
      return Object.assign([], data).map(item => {
        return item
      })
    };
    /** 字符串转JSON */
    Vue.prototype.$StrToJson = function (res) {
      const type = [];
      res.forEach(r => type.push(eval('(' + r["dict"] + ')')))
      return type;
    };
  }
}
