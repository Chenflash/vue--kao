import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);  //应用vueX，应用状态管理

//初始化定义state对象和mutation
const state = {
    isloading: false,  //加载中的数据
    isCount: 0,       //统计是否加载过，加载过则无需加载


}
const mutations = {
    increatement(state) {
        state.isloading = true;
    },
    decrement(state) {
        state.isloading = false;
    },
    iscreateCount(state) {
        state.isCount = 1;
    },
    indescrementCount(state) {
        state.isCount = 0;
    }


}
export default new Vuex.Store({
    state,
    mutations
})