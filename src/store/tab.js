export default {
  state: {
    //菜单栏状态
    isCollapse: false,
    //面包屑数据
    tabsList: [
      {
        path: '/Home',
        name: '首页',
        icon: 's-home',
        label: '首页',
        url: '/Home',
      }
    ],
  },
  mutations: {
    CollapseChange(state) {
      state.isCollapse = !state.isCollapse
    },
    menuChange(state, val) {
      //更新面包屑数据
      if (val.name !== 'main') {
        //表示不是首页
        //判断数据是否存在
        const index = state.tabsList.findIndex(item => item.name === val.name)
        if (index === -1) {
          state.tabsList.push(val)
        }
      }
    },
    closeTag(state, val) {
      const index = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(index, 1)
    }
  }
}
