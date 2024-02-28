export default {
  //浏览器
  getBrowser() {
    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
    const isEdge = userAgent.indexOf("Edge/") > -1;
    const isChrome = userAgent.indexOf("Chrome/") > -1;
    const isFirefox = userAgent.indexOf("Firefox/") > -1;
    const isSafari = userAgent.indexOf("Safari/") > -1;
    let Browser = "";

    if (isIE) {
      Browser = "Internet Explorer";
    } else if (isEdge) {
      Browser = "Microsoft Edge";
    } else if (isChrome) {
      Browser = "Google Chrome";
    } else if (isFirefox) {
      Browser = "Mozilla Firefox";
    } else if (isSafari) {
      Browser = "Apple Safari";
    } else {
      Browser = "Unknown Browser";
    }
    return Browser;
  },
  //屏幕分辨路
  getResolution() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    return `${screenWidth} x ${screenHeight}`
  },
  //颜色深度
  getColorDepth() {
    return window.screen.colorDepth
  },
  //操作系统
  getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const os = {
      android: /Android/.test(userAgent),
      ios: /iPhone|iPad|iPod/.test(userAgent),
      macos: /Mac/.test(platform),
      windows: /Win/.test(platform),
      linux: /Linux/.test(platform)
    };

    if (os.android) {
      return "Android";
    } else if (os.ios) {
      return "iOS";
    } else if (os.macos) {
      return "macOS";
    } else if (os.windows) {
      return "Windows";
    } else if (os.linux) {
      return "Linux";
    } else {
      return "Unknown Operating System";
    }
  }
}
