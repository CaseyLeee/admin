import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'


import createPersistedState from 'vuex-persistedstate';
import userModule from './modules/userInfo';
const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    [USERINFO]: userModule,
  },
  getters,
  plugins: [createPersistedState()]
})

export default store
