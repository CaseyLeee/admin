import request from './interrupter';

export function userregsig(data) {

    return request({
      url: '/app/2.0.0/visitor/insert/user/no/phone',
      method: 'post',
      data 
    })
  }
  export function addrobots(data) {

    return request({
      url: '/app/2.1.0/batch/person/add/robots',
      method: 'post',
      data 
    })
  }
  export function querygroup(data) {

    return request({
      url: '/app/2.1.0/visitor/user/list',
      method: 'post',
      data 
    })
  }

  export function editgroup(data) {

    return request({
      url: '/app/2.1.0/batch/person/add/robots',
      method: 'post',
      data 
    })
  }

  export function addgroup(data) {

    return request({
      url: '/rosServer/app/1.0.0/manager/addGroupMan',
      method: 'post',
      data 
    })
  }

  
  export function deletegroup(data) {

    return request({
      url: '/app/2.1.0/batch/delete/group',
      method: 'post',
      data 
    })
  }


   
  export function getSynVisitors(data) {

    return request({
      url: '/rosServer/robot/getSynVisitors',
      method: 'post',
      data 
    })
  }

  export function syncData(data) {

    return request({
      url: '/rosWeb/robot/syncData',
      method: 'post',
      data 
    })
  }

  
  export function passwordBatch(data) {

    return request({
      url: '/app/2.1.0/device/reset/passwordBatch',
      method: 'post',
      data 
    })
  }
  export function updateuser(data) {

    return request({
      url: '/app/2.1.0/api/user/update',
      method: 'post',
      data 
    })
  }
  export function updateGroupMan(data) {

    return request({
      url: '/rosServer/app/1.0.0/manager/updateGroupMan',
      method: 'post',
      data 
    })
  }
  export function userconfigquery(data) {

    return request({
      url: '/app/2.1.0/company/user/config/query',
      method: 'post',
      data 
    })
  }