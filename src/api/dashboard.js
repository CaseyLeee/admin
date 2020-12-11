import request from './interrupter';
/**
 *  获取组织管理列表
 *  searchName	String	查询人员名称
    companyId	String	公司id(物业登录时候可传)
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function getRecentAccess(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/visitor/get/recent/passageway",
        data
    })
}
export function getRecentAccess2(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/visitor/get/recent/passageway2",
        data
    })
}
/**
 *  导出人员记录
 *  recordId	String	进出记录id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function exportStrangerRecord(params) {
    return request({
        method: "get",
        url: "/app/2.1.0/export/stranger",
        params
    })
}
/**
 *  获取组织管理列表
 *  searchName	String	查询人员名称
    companyId	String	公司id(物业登录时候可传)
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
// export function getRecentAccess(data) {
//     return request({
//         method: "post",
//         url: "/app/2.1.0/visitor/last/web",
//         data
//     })
// }
/**
 *  获取员工注册信息
 * 
    companyId	String	公司id(物业登录时候可传)
    page	String	页数，默认1
    pageSize String
    startTime Date
    endTime Date
 * @param {*} params 
 * 
 */
export function getStaffStatistics(data, agencyType = 2) {
    return request({
        method: "post",
        url: `/app/2.1.0/statistics/staff/${agencyType == 3 ? "property" : "company"}`,
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}

/**
 *  获取员工注册信息
 * 
    companyId	String	公司id(物业登录时候可传)
    page	String	页数，默认1
    pageSize String
    startTime Date
    endTime Date
 * @param {*} params 
 * 
 */
export function getVisitorStatistics(data, agencyType) {
    return request({
        method: "post",
        url: `/app/2.1.0/statistics/visitor/${agencyType == 3 ? "property" : "company"}`,
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}
/**
 *  八十五、处理疫情记录
    userId	String	用户id
    useType	int	用户类型 1：员工 2 访客 3 陌生人
    handle	int	0 未处理 1已处理
 * @param {*} params 
 * 
 */
export function handleEpidemic(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/epidemic/handle",
        data
    })
}
/**
 *  三十一、获取公司签到人数/总人数
    propertyId	String	物业id
    page	Int	页数
    pageSize	Int	每页数目
    userType	int	1:员工 2：访客 3 员工+访客
 * @param {*} params 
 * 
 */
export function getCompanySign(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/statistics/company/sign",
        data
    })
}

/**八十二、设备位置查询
 *  compayId	String	公司id
    propertyId	String	物业id
    page	int	页码
    pageSize	int	每页个数
    z	String	当x=0,y=0时，该数据仅提供背景图
 * @param {*} params 
 * 
 */
export function getRobotPosition(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/position/search/position",
        data
    })
}

/**设备位置修改
 *  positionId	String	信息id
    compayId	String	公司id
    propertyId	String	物业Id
    X	Float	横坐标
    Y	Float	纵坐标
    Z	Float	层数（默认：0）
    deviceSn	String	设备sn号
    deviceName	String	设备名称
 * @param {*} params 
 * 
 */
export function updateRobotPosition(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/position/upd/position",
        data
    })
}
/**设备位置添加
 *  propertyId	String	物业id（必传）
    compayId	String	公司id
    x	Float	横坐标
    y	Float	纵坐标
    z	Float	层数（默认：0）
    deviceSn	String	设备sn号
    deviceName	String	设备名称
 * @param {*} params 
 * 
 */
export function addRobotPosition(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/position/add/position",
        data
    })
}
/**设备位置添加
 *  propertyId	String	物业id（必传）
    compayId	String	公司id
    ImagePath	String	背景图
    z	Float	层数（默认：0）
 * @param {*} params 
 * 
 */
export function addBackground(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/position/add/background",
        data
    })
}

/**设备位置删除
 *  positionList	List<String>	位置id
    companyId	String	公司id
    propertyId	String	物业Id（必传）
 * @param {*} params 
 * 
 */
export function delPosition(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/position/del/position",
        data
    })
}

/**查询人员
 *  visitorId	String	员工id
 * @param {*} params 
 * 
 */
export function queryUser(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/visitor/query/user",
        data
    })
}

/**
 *  八十八、设备使用情况
 *  deviceSn	String	设备sn号
    companyId	String	公司id
    propertyId	String	物业id(必传)
 * @param {*} params 
 * 
 */
export function getRobotStatus(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/device/be/use",
        data
    })
}
/**
 *  八十九、设备高温预警人数
    companyId	String	公司id
    propertyId	String	物业id(必传)
 * @param {*} params 
 * 
 */
export function getRecentHighTemperature(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/epidemic/statistics",
        data
    })
}

/**
 *  八十九、获取最近人员
    companyId	String	公司id
    propertyId	String	物业id(必传)
    startTime: String
    endTime: String
    page: int
    pageSize: int
 * @param {*} params 
 * 
 */
export function getRecentPersonnel(data, agencyType = 2) {
    return request({
        method: "post",
        url: agencyType == 3 ? "/app/2.1.0/property/last" : "/app/2.1.0/visitor/last",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}
/**
 *  获取空间使用率
    startTime String
    endTime String
    agencyId String
 * @param {*} params 
 * 
 */
export function getSpaceUseRate(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/get/bigData/sapceUseRate",
        data
    })
}

