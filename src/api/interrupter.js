import store from '@/store';

import Axios from 'axios';

import { Spin } from 'iview';
const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";
// 创建axios实例
const axios = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API || "", // api的base_url
    timeout: 1000 * 60 * 1, // 请求超时时间,
    
});



// request拦截器
axios.interceptors.request.use(config => {
    // response.config.headers["Access-Control-Allow-Origin"]= "*";
    //     response.config.headers['Access-Control-Allow-Headers']=  'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild';
    //     response.config.headers["Access-Control-Allow-Methods"]=  "PUT,POST,GET,DELETE,OPTIONS";
    //     response.config.headers["X-Powered-By"]=  ' 3.2.1'

    if (!config) return;
    let hasSchedule = config.url.includes('schedule') ||
        config.url.includes("queryFeedBackTopicInfo") ||
        config.url.includes("space/del/reserve") ||
        config.url.includes("background/queryOneUserInfo") ||
        config.url.includes("visitor/last") ||
        config.url.includes("property/last") ||
        config.url.includes("statistics/staff/company") ||
        config.url.includes("statistics/visitor/company") ||
        config.url.includes("visitor/query/user") ||
        config.url.includes('statistics/company/sign') ||
        config.url.includes('feedback/queryFeedBackInfo') ||
        config.url.includes('robots/queryRobotsInfo') ||
        config.url.includes('epidemic/statistics') ||
        config.url.includes("statistics/visitor") ||
        config.url.includes("statistics/staff") ||
        config.url.includes('space/reserve/queryReserveNoticeInfo') ||
        config.url.includes('manager/updateVisitor') ||
        config.url.includes('get/bigData/sapceUseRate') ||
        config.url.includes('manager/checkVisitorRegisterInfo') ||
        config.url.includes('space/get/apply/notice') && config.data.hide ||
        config.url.includes('feedback/get/feedback') && config.data.hide ||
        config.url.includes("get/recent/passageway") && config.data.hide;
    if (!hasSchedule) {
        Spin.show({
            render: h => {
                return h("div", [
                    h("Icon", {
                        class: "spin-icon-load",
                        props: {
                            type: "ios-loading",
                            size: 40
                        }
                    }),
                    h("div", "")
                ]);
            }
        });
    }

    let { agencyId, companyId, propertyId, agencyType, token, extraToken } = store.state[USERINFO].userInfo || {};
    
    if (Object.prototype.toString.call(config.data).slice(8, -1) == 'FormData'&&!config.url.includes("updateRobotsInfoBatch")&&!config.url.includes("addRobotsInfo")) {

        config.data.append("msUserType", agencyType || 2);
        config.data.append("msOrganizeId", agencyId);
     
   
        if (config.url.includes("visitor/last") ||
            config.url.includes("property/last") ||
            config.url.includes("statistics/visitor") ||
            config.url.includes("statistics/staff") ||
            config.url.includes("visitor/query/user") ||
            config.url.includes("user/auditing") ||
            config.url.includes("add/robots") ||
            config.url.includes("user/list") ||
            config.url.includes("manager/addGroupMan")||
            config.url.includes("manager/updateGroupMan")||
            config.url.includes("robot/getSynVisitors")||
            config.url.includes("modify/user")||
            config.url.includes("config/query")
        ) {
            config.data.append("msToken", extraToken);
        } else {
            config.data.append("msToken", token);
        }
        if (config.url.includes("feedback/queryFeedBackTopicInfo")) {
            config.data.set("msOrganizeId", propertyId);
            config.data.set("msUserType", 3);
        }
        if (config.url.includes("user/list") ||
            config.url.includes("manager/addGroupMan") ||  config.url.includes("manager/updateGroupMan")||
            config.url.includes("queryVisitorInfo")|| config.url.includes("updateRobotsInfo")||
            config.url.includes("config/query")) {
            config.data.set("companyId", companyId);
        }
        if (config.url.includes("updateRobotsInfo")&&config.data.get("name")=="null"){
            config.data.set("companyId", "null");
        }
        if (config.url.includes("manager/addGroupMan")||  config.url.includes("manager/updateGroupMan")) {
            config.baseURL = process.env.VUE_APP_BASE_FEATURE_API;
        }
        
    }
  
   
    /**
     * 批量注册
     */
    if (config.url.includes('batch/register/staff') ||
        config.url.includes('batch/register/visitor') ||
        config.url.includes('batch/register/schedule')) {
        config.headers['msToken'] = token;
        config.baseURL = process.env.VUE_APP_BASE_UPLOAD_API;
        return config;
    }
    if (config.url.includes('manager/updateVisitor') ||
        config.url.includes('manager/deleteVisitorPicture') ||
        config.url.includes('manager/checkVisitorRegisterInfo')
    ) {
        config.baseURL = process.env.VUE_APP_BASE_FEATURE_API;
        return config;
    }
    if (config.url.includes('statistics/staff/company') ||
        config.url.includes('statistics/visitor/company')) {
        config.baseURL = process.env.VUE_APP_BASE_GET_TOKEN_API;
        if (extraToken) {
            let index = extraToken.indexOf("_");
            if (index > -1) {
                let _token = "token-" + extraToken.substring(0, index) + "-" + extraToken.substr(index + 1, 10);
                config.headers[_token] = _token;
            }
            config.headers['msToken'] = extraToken;
        }
        return config;
    }
    if (config.url.includes('app') && !
        config.url.includes('manager/updateVisitor') && !
        config.url.includes('manager/addGroupMan')&&!config.url.includes('robot/getSynVisitors') && !
        config.url.includes('manager/updateGroupMan')) {
       
        if (extraToken) {
            let index = extraToken.indexOf("_");
            if (index > 0) {
                let token = extraToken.substring(0, index + 9);
                config.headers[`token-${token}`] = token;
            }
            if(config.url.includes('reset/passwordBatch')){
                config.headers[`msToken`] = extraToken;
            }
        }
        config.baseURL = process.env.VUE_APP_BASE_GET_TOKEN_API;
        if (config && config.data) {
            Object.assign(config.data, {
                agencyId,
                companyId: config.data.companyId ? config.data.companyId : companyId,
                propertyId,
                agencyType: agencyType == 3 ? 2 : 1,
                msToken: extraToken
            })
        }
        return config
    }
    return config;
}, error => {
    Spin.hide();
    // Do something with request error
    return Promise.reject(error);
})
// respone拦截器
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err && err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config) {
        return Promise.reject(err);
    }
    if (err && err.response && err.response.status === 401) {
        console.log("无权限");
        //处理无权限
        // window.localStorage.setItem(process.env.VUE_APP_TOKEN, "");
        // window.location.hash = 'login';
        // window.location.reload();
    }
    Spin.hide();
});
// respone拦截器
axios.interceptors.response.use(
    response => {
      

        
        let hasStrangerRecord = response.config.url.includes('queryStrangerRecordStatistics');
        let hasStrangerStatistics = response.config.url.includes('queryStrangerRecordStatistics');

        if (hasStrangerRecord && hasStrangerStatistics) {
            return response.data;
        }
        Spin.hide();
        return response.data;

    },
    error => {
        Spin.hide();
        return Promise.reject(error);
    }
);
// axios.defaults.headers['Content-Type'] = 'application/json';
export default axios;