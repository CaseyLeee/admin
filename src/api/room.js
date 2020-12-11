import request from './interrupter';

/**
 *  获取空间列表信息
 *  searchName	String	查询空间名称
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function querySpaceInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/querySpaceInfo",
        data
    })
}
/**
 *  获取空间列表信息2
 *  agencyId	String	机构id(必传)
    spaceName	String	公司名称（用于模糊查询）
    agencyType	Int	1公司；2物业；3   公司+物业 agencyId给公司id
    page	Int	
    pageSize	Int	
 * @param {*} params 
 * 
 */
export function getSpaceList(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/get/list",
        data
    })
}
/**
 *  获取空间信息
 *  spaceId	String	空间id(必传)
 * @param {*} params 
 * 
 */
export function getSpaceInfo(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/get/info",
        data
    })
}
/**
 *  获取空间预约列表
 *  searchName	String	查询空间名称
    operateType	String	预约状态类型：1已同意；3未授权
    companyId	String	需要查询的人员所属公司id
    startTime	String	开始时间,格式：YYYY-MM-dd hh:mm:ss
    endTime	String	结束时间,格式：YYYY-MM-dd hh:mm:ss
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryReserveNoticeInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/reserve/queryReserveNoticeInfo",
        data
    })
}
/**
 *  获取空间预约列表2
 *  spaceId	String	空间id
    page	int	
    pageSize	int	
    startTime	String	预约开始时间
    endTime	String	预约结束时间
 * @param {*} params 
 * 
 */
export function queryReserveList(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/get/reserve/list",
        data
    })
}
/**
 *  获取空间预约列表3
 *  spaceId	String	空间id
    page	int	
    pageSize	int	
    startTime	String	预约开始时间
    endTime	String	预约结束时间
    operateType	String	1已同意；2已知道；3未同意；4未知道；5已拒绝6 预约撤销(,号分割)
    noticeType	String	1申请；2到访；3未出；4限时；5陌生人；6补卡；7个人申请 8 空间预约 9 预约提醒(,号分割)
 * @param {*} params 
 * 
 */
export function getReserveList(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/get/apply/notice",
        data
    })
}
/**
 *  导出空间预约列表
 *  searchName	String	查询空间名称
    operateType	String	预约状态类型：1已同意；3未授权
    companyId	String	需要查询的人员所属公司id
    startTime	String	开始时间,格式：YYYY-MM-dd hh:mm:ss
    endTime	String	结束时间,格式：YYYY-MM-dd hh:mm:ss
 * @param {*} params 
 * 
 */
export function reportReserve(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/reserve/reportReserve",
        data
    })
}
/**
 *  预约授权
 *  noticeId	String	查询空间名，姓名，公司名称，分组名称
    visitorId	String	访客id
    auth	Int	授权状态：1同意;2拒绝
 * @param {*} params 
 * 
 */
export function updateReserveNoticeInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/reserve/updateReserveNoticeInfo",
        data
    })
}
/**
 *  二十七、物业/公司-更改人员审核状态（通知）
 *  id	String	人员id
    isAuthorize	String	是否授权：1授权；2拒绝
 * @param {*} params 
 * 
 */
export function updateNoticeInfo(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/notice/user/auditing",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}
/**
 *  获取单个空间详情
 * spaceId String	空间id
 * @param {*} params 
 * 
 */
export function queryOneSpaceInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/queryOneSpaceInfo",
        data
    })
}
/**
 *  删除空间信息
 *  spaceId	String	空间id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteSpace(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/deleteSpace",
        data
    })
}
/**
 *  删除空间信息
 *  spaceId	String	空间id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteSpace2(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/del/info",
        data
    })
}
/**
 *  修改空间信息
 *  picFile	MultipartFile	空间照片
    spaceId	String	空间id
    spaceName	String	空间名称
    spaceRemark	String	空间备注
    spacePermit	String	门禁管理：1常开；2常闭；3仅授权人员开门
    spacePermissions	String	机器访问权限(多个用逗号分隔)
    spaceReserveRules	String	预定规则：1不可重复预定；2可重复预定；3无需预定
    spaceReserveTimeType	String	预定时间类型：1.30分钟；2.按天；3.按周；4.按月
 * @param {*} params 
 * 
 */
export function updateSpaceInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/updateSpaceInfo",
        data
    })
}
/**
 *  修改空间提醒时间
 *  spaceRemindHour	int	空间提醒时间 （分钟）
    spaceId	String	空间id
 * @param {*} params 
 * 
 */
export function updateSpace(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/upd/info",
        data
    })
}

/**
 *  新增空间信息
 *  picFile	MultipartFile	空间照片
    spaceName	String	空间名称
    spaceRemark	String	空间备注
    spacePermit	String	门禁管理：1常开；2常闭；3仅授权人员开门
    spacePermissions	String	机器访问权限(多个用逗号分隔)
    spaceReserveRules	String	预定规则：1不可重复预定；2可重复预定；3无需预定
    spaceReserveTimeType	String	预定时间类型：1.30分钟；2.按天；3.按周；4.按月
 * @param {*} params 
 * 
 */
export function addSpaceInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/addSpaceInfo",
        data
    })
}
/**
 *  新增空间信息2
 *  agencyType	Int	机构类型 1：公司 2：物业
    agencyId	String	机构id
    spaceName	String	空间名称
    remark	String	空间备注
    reserveRules	Int	空间规则1不可重复预定；2可重复预定；3无需预定
    reserveTimeType	Int	预定时间类型：1.30分钟；2.按天；3.按周；4.按月5次数
    permissions	String	机器mac（按照半角逗号分隔,）
    tags	List	标签（建议不超过5个标签，每个标签不超过10个字）
    address	String	地址
    spacePics	List	图片
    permit	Int	门禁管理：1常开；2常闭；3仅授权人员开门'
    spaceRemindHour	Int	空间提醒时间 （分钟）
    cancelLimitHour		空间不可取消时间 （分钟）
 * @param {*} params 
 * 
 */
export function addSpaceInfo2(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/add/info",
        data
    })
}
/**
 *  获取空间预约信息
    id	String	空间id
    startTime	String	开始时间
    endTime	String	结束时间
 * @param {*} params 
 * 
 */
export function querySpaceReserveInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/querySpaceReserveInfo",
        data
    })
}
/**
 *  获取机构所有机器人信息
 * @param {*} params 
 * 
 */
export function queryRobots(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/queryRobots",
        data
    })
}

/**
 *  取消预约1
 * id String 预约id
 * @param {*} params 
 * 
 */
export function cancelReserveNotice(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/space/reserve/cancelReserveNotice",
        data
    })
}
/**
 *  取消预约2
 *  spaceReserveIds	List<String>	预约id
 * @param {*} params 
 * 
 */
export function deleteReserve(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/del/reserve",
        data,
    })
}
/**
 *  取消预约3
 *  noticeId
 * @param {*} params 
 * 
 */
export function cancelReserve(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/notice/delete",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}
/**
 *  上传文件
 *  file	MultipartFile	文件
    uploadType	Int	1人员头像 （未生效） 2 空间图片 3 语音文件
 * @param {*} params 
 * 
 */
export function uploadFile(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/upload/file",
        data
    })
}
/**
 *  删除文件
 *  path	String	上传文件路径
 * @param {*} params 
 * 
 */
export function deleteFile(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/compress/delete/file",
        data
    })
}
/**
 *  申请预约
 *  spaceId	String	空间id
    agencyId	String	机构id
    visitorId	String	申请人id
    visitorIds	list	附带人员id（务必包含申请人id）
    startTime	String	开始时间
    endTime	String	结束时间
    hour	float	耗时（单位小时）(请自行计算)
    dbIds	list	分组id
    resolveTimes	Int	使用次数，10分钟内的进出算一次
 * @param {*} params 
 * 
 */
export function applyReserve(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/space/apply/reserve/info",
        data
    })
}

/**
 *  人员基本信息-修改
    visitorId	String	员工id
    groupId	String	分组id
    userType	Int	1员工 2访客
    name	String	访客姓名
    deadLineTime	String	有效期限 format：yyyy-mm-dd hh:mm:ss)
    phone	String 	手机号
    headPath	String	头像路径
    threshold	String	权重
    fields	String/Json	自定义字段
    remarkCompany	String	公司信息备注 注：一般填写被访人联系方式
    voiceMessage	String	语音信息
    Authrize	Int	1，开门 2关门
    Reminder	Int	1：提醒 2不提醒
 * @param {*} params 
 * 
 */
export function modifyUser(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/visitor/modify/user",
        data
    })
}

/**
 *  人员基本信息-查询
    visitorId	String	员工id
 * @param {*} params 
 * 
 */
export function queryUser(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/visitor/query/user",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}


/**
 *  修改访客信息
    imageList	String	多张或一张照片集合,照片Base64字符串，多张用英文逗号分割
    visitorId	String	访客id
    name	String	访客名称
    authorize	String	对用户的操作权限，默认1：0不叫名字，不开门；1叫名字，开门；2叫名字，不开门；3不叫名字，开门
    threshold	String	权重
    groupId	String	分组人员组id
    remarkCompany	String	公司信息备注
    voiceMessage	String	语音信息
    validPeriod	String	有效日期，格式：yyyy-MM-dd hh:mm，eg:1999-01-01 09:00
 * @param {*} params 
 * 
 */
export function updateVisitor(data) {
    return request({
        method: "post",
        url: "/rosServer/app/1.0.0/manager/updateVisitor",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}

/**
 *  九十七、管理员轮询访客注册结果信息
 *  id String 根据id查询访客是否注册成功
    token	String	根据token查询访客是否注册成功
 * @param {*} params 
 * 
 */
export function checkVisitorRegisterInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/app/1.0.0/manager/checkVisitorRegisterInfo",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}
/**
 *  九十七、删除人员图片
 *  imageId String图片id
 * @param {*} params 
 * 
 */
export function deleteVisitorPicture(data) {
    return request({
        method: "post",
        url: "/rosServer/app/1.0.0/manager/deleteVisitorPicture",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    })
}

/**二十二、物业-获取物->公司信息列表
 *  propertyId	String	物业id
    page	Int	页数（默认1）
    pageSize	Int	每页条数(默认20)
 * @param {*} params 
 * 
 */
export function getCompanyList(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/property/companys",
        data,
    })
}