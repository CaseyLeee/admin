import request from '@/utils/request'

export function login(data) {

  return request({
    url: '/rosServer/science/1.0.0/background/userLogin',
    method: 'post',
    data
  })
}

export function getInfo(data) {

  return request({
    url: '/app/2.1.0/token/sign',
    method: 'post',
    data 
  })
}

export function logout(data) {
  
  return request({
    url: '/rosServer/science/1.0.0/background/userLogout',
    method: 'post',
    data
  })
}
