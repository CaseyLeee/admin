
export default {
    // namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
    state: {
        userInfo: null,
    },
    getters: {
        getAgencyInfo: state => state.userInfo,
        getAgencyType: state => {
            let { agencyType } = state.userInfo || {};
            return agencyType == 3 ? 3 : 2; // 3 物业 | 2 公司
        },
    },
    mutations: {
        setAgencyInfo(state, playload) {
            state.userInfo = playload;
        },
        setAgencyLogo(state, paload) {
            if (state.userInfo) {
                let { agencyLogo, agencyName } = paload;
                state.userInfo.headUrl = agencyLogo;
                state.userInfo.agencyName = agencyName;
            }
        }
    },
    actions: {

    }
}