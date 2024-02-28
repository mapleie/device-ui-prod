import Vue from 'vue'
import Router from 'vue-router'
//首页路由
import Home from '@/components/common/Home'
//主页重定向路由
import index from '@/components/common/index'
//用户管理路由
import UserList from '@/components/pages/user/UserList'
//登录路由
import Login from '@/components/common/Login'
//系统管理路由
import SysUser from '@/components/pages/sys/SysUser'
import SysUserOnline from '@/components/pages/sys/SysUserOnline'
import SysRole from '@/components/pages/sys/SysRole'
import SysMenu from '@/components/pages/sys/SysMenu'
import SysLog from '@/components/pages/sys/SysLog'
import SysLogin from '@/components/pages/sys/SysLogin'
import SysNotices from '@/components/pages/sys/SysNotices'
import SysDict from '@/components/pages/sys/SysDict'


import SysVirtualLogin from '@/components/pages/sys/SysVirtualLogin'
//注册路由
import register from '@/components/common/register'
//个人中心R
import PersonalData from '@/components/pages/Personal/PersonalData'
import UpdatePassword from '@/components/pages/Personal/UpdatePassword'
//设备管理
import DeviceInformation from '@/components/pages/device/DeviceInformation'
import EquipmentScrapped from '@/components/pages/device/EquipmentScrapped'
import DeviceType from '@/components/pages/device/DeviceType'
import PatrolInformation from '@/components/pages/device/PatrolInformation'
import Factory from '@/components/pages/device/Factory'
import Repair from '@/components/pages/device/Repair'

Vue.use(Router)

export default new Router({
  routes: [
    {//主页
      path: '/Home',
      component: Home,
      redirect: '/',
      children: [
        {//主页重定向
          path: '/Home',
          name: 'index',
          component: index
        },
        {//个人资料
          path: '/PersonalData',
          name: 'PersonalData',
          component: PersonalData
        },
        {//修改密码
          path: '/UpdatePassword',
          name: 'UpdatePassword',
          component: UpdatePassword
        },
        {//用户管理
          path: '/SysUser',
          name: 'SysUser',
          component: SysUser
        },
        {//在线用户
          path: '/SysUserOnline',
          name: 'SysUserOnline',
          component: SysUserOnline
        },
        {//角色管理
          path: '/SysRole',
          name: 'SysRole',
          component: SysRole
        },
        {//菜单管理
          path: '/SysMenu',
          name: 'SysMenu',
          component: SysMenu
        },
        {//日志管理
          path: '/SysLog',
          name: 'SysLog',
          component: SysLog
        },
        {//登录记录
          path: '/SysLogin',
          name: 'SysLogin',
          component: SysLogin
        },
        {//虚拟登录
          path: '/SysVirtualLogin',
          name: 'SysVirtualLogin',
          component: SysVirtualLogin
        },
        {//系统公告
          path: '/SysNotices',
          name: 'SysNotices',
          component: SysNotices
        },
        {//用户管理
          path: '/UserList',
          name: 'UserList',
          component: UserList
        },
        {//设备信息
          path: '/DeviceInformation',
          name: 'DeviceInformation',
          component: DeviceInformation
        },
        {//设备报废
          path: '/EquipmentScrapped',
          name: 'EquipmentScrapped',
          component: EquipmentScrapped
        },
        {//设备类型
          path: '/DeviceType',
          name: 'DeviceType',
          component: DeviceType
        },
         {//巡检信息
          path: '/PatrolInformation',
          name: 'PatrolInformation',
          component: PatrolInformation
        },
         {//设备厂家
          path: '/Factory',
          name: 'Factory',
          component: Factory
        },
         {//维修信息
          path: '/Repair',
          name: 'Repair',
          component: Repair
        },
         {//数据字典
          path: '/SysDict',
          name: 'SysDict',
          component: SysDict
        },
      ]
    },
    {//登录
      path: '/',
      name: 'login',
      component: Login,
    },
    {//注册
      path: '/register',
      name: 'register',
      component: register,
    },
  ]
})

 
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}