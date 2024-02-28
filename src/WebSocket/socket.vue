<template>

</template>

<script>
import Axios from "axios";

export default {
  data() {
    return {}
  },
  mounted() {
    //初始化websocket
    this.initWebSocket()
  },
  destroyed: function () {
    // 离开页面生命周期函数
    this.websocketClose();
  },
  methods: {
    initWebSocket: function () { // 建立连接
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      const Id = sessionStorage.getItem("account");
      const url = Axios.defaults.baseURL.replace("https://", "wss://").replace("http://", "ws://") + "/WebSocket/" + Id;
      this.websock = new WebSocket(url);
      this.websock.onopen = this.websocketOpen;
      this.websock.send = this.websocketSend;
      this.websock.onerror = this.websocketError;
      this.websock.onmessage = this.websocketMessage;
      this.websock.onclose = this.websocketClose;
    },
    // 连接成功后调用
    websocketOpen: function () {
      console.log("WebSocket连接成功");
    },
    // 发生错误时调用
    websocketError: function (e) {
      console.log("WebSocket连接发生错误");
    },
    // 给后端发消息时调用
    websocketSend: function (e) {
      console.log("给后端发消息时发生错误");
    },
    // 接收后端消息
    // vue 客户端根据返回的cmd类型处理不同的业务响应
    websocketMessage: function (res) {
      //处理订阅信息
      // if(data.cmd === "topic"){
      //   //TODO 系统通知
      //
      // }else if(data.cmd === "user"){
      //   //TODO 用户消息
      //
      // }
    },
    // 关闭连接时调用
    websocketClose: function (e) {
      console.log("connection closed (" + e + ")");
    }
  }
}
</script>

<style scoped>

</style>
