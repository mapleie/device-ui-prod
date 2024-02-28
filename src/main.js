import Vue from 'vue'
import App from './App'
import ElementUI, {Message, Table, TableColumn} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VForm from 'vform-builds' //引入VForm库
import router from './router'
import store from './store'
import method from './method'
import Axios from 'axios'
import * as echarts from 'echarts'
import 'vform-builds/dist/VFormDesigner.css' //引入VForm样式
import api from "./api";

//注册组件
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VForm)  //全局注册VForm(同时注册了v-form-designer和v-form-render组件)
Vue.use(method)
//配置axios
Vue.prototype.$http = Axios
//默认路径
Axios.defaults.baseURL = 'http://localhost:8888/'

Axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  const tokenName = sessionStorage.getItem('tokenName')
  config.headers[tokenName] = token // 请求头带上Token
  if (config.url !== '/upload/image' && config.url !== '/upload/file') {
    config.headers['Content-Type'] = "application/json" // 请求头带上Content-Type->参数转为json格式
  }
  config.headers["Browser"] = api.getBrowser()
  // config.headers["Resolution"]=api.getResolution()
  // config.headers["colorDepth"]=api.getColorDepth()
  config.headers["OS"] = api.getOS()
  return config;
}, error => {
  return Promise.reject(error);
})

/** 使用router钩子函数来处理 */
router.beforeEach((to, from, next) => {
  if (to.path === '/register' && from.path === '/') {
    next();
    return;
  }
  const token = sessionStorage.getItem('token')
  if (to.name !== 'login' && !token) next({name: 'login'})
  else next()
})
/** 响应拦截器 */
Axios.interceptors.response.use((success) => {
  const response = success.data
  if (success.status && success.status === 200) {
    if (response.message) {
      Message({type: response.type, message: response.message});
    }
    if (response.code === 11012) {   //token无效
      router.push("/").then(null)
      return;
    }
    if (response.code === 500 || response.code === 401 || response.code === 403) {   //接口请求成功，业务逻辑错误
      Message.error({message: response.message});
      return;
    }
  }
  return success.data.data;
}, (error) => {
  const response = error.response
  if (response.status === 504 || response.status === 404) {
    Message.error({message: '服务器被吃了( ╯□╰ )'});
  } else if (response.status === 403) {
    Message.error({message: '权限不足，请联系管理员'});
  } else if (response.status === 40 || response.status === 500) {
    Message.error({message: '请登录账号'});
      router.push('/').then(null);
  } else {
    if (response.message) {
      Message({type: response.type, message: response.message});
    } else {
      Message({message: '该错误触及盲区(●ˇ∀ˇ●)'});
    }
  }
});
new Vue({
  el: '#app',
  router,//挂载router
  store,//挂载store
  components: {App},
  template: '<App/>'
})

// 获取组件的props
const TableProps = Table.props
const TableColumnProps = TableColumn.props

// 修改默认props
// 全局el-table设置
TableProps.border.default = true // 边框
// 全局el-table-column设置
TableColumnProps.align.default = 'center' // 居中
TableColumnProps.showOverflowTooltip.default = true // 文本溢出

TableProps.border = {type: Boolean, default: true} // 边框
