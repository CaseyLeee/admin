import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
   
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if(response.code!=1){
          reject(response.msg)
          return;
        }
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
       
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', process.env.VUE_APP_BASE_API +data.headUrl)

       
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state },token) {
  
    return new Promise((resolve, reject) => {
    
   //用vue.$qs.stringify({'token':state.token}) --import vue from '../../main.js'; 报错 data functions should return an object 
   
      getInfo(token).then(response => {
    
        response["roles"]="admin"
        response["introduction"]="I am a super administrator"
        response["avatar"]="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
        response["name"]="Super Admin"
        
        // const { data } = response
       
        if (!response) {
          reject('Verification failed, please Login again.')
        }
     
        const { roles, name, avatar } = response
        
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
       
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({'msToken':state.token}).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

