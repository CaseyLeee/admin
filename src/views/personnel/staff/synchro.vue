<template>
  <div class="container-staff-list">
    <div class="operate center">
      <div class="item">
        <div class="groups center" v-if="getAgencyType == 2">
          <el-select
            v-model="groupId"
            filterable
            :placeholder="$t('statistics.staff.selectGroup')"
            @visible-change="queryGroupInfoByType"
            @change="handleGroupChange"
          >
            <el-option
              v-for="item in groupsList"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="groups center">
          <el-input
            :placeholder="$t('common.search')"
            v-model.trim="staffName"
            class="input-with-select"
            @keydown.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
        <div class="groups center">
          <el-select
            v-model="RobotId"
            filterable
            placeholder="请选择机器"
            @visible-change="queryRobotsInfo"
            @change="handleRobotChange"
          >
            <el-option
              v-for="item in robotsList"
              :key="item.identifier"
              :label="item.name"
              :value="item.identifier"
            ></el-option>
          </el-select>

          <el-button type="primary" @click="synchro('all')" class="syncall">一键同步</el-button>
        </div>
      </div>
    </div>
    <div class="content" ref="multipleTableWrapper">
      <el-table
        id="staffTable"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="visitorId"
      >
        <el-table-column prop="picturePath" :label="$t('personnel.staff.picture')" width="160">
          <template slot-scope="scope">
            <template v-if="scope.row.loadError">
              <img :src="getAvator()" class="picturePath" />
            </template>
            <template v-else>
              <img
                :src="getAvator(scope.row)"
                @click="preview(scope.row)"
                @error="handleLoadError(scope.row)"
                class="picturePath"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="visitorName" :label="$t('personnel.staff.name')"></el-table-column>
        <el-table-column :label="$t('personnel.staff.group')" v-if="getAgencyType == 2">
          <template slot-scope="scope">{{formateGroup( scope.row.visitorGroupName )}}</template>
        </el-table-column>

        <el-table-column :label="$t('personnel.staff.$register')">
          <template slot-scope="scope">{{formateTime( scope.row.visitorCreateTime )}}</template>
        </el-table-column>
        <el-table-column :label="$t('personnel.staff.deadLine')" show-overflow-tooltip>
          <template slot-scope="scope">{{ formateTime( scope.row.visitorDueTime) }}</template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')">
          <template slot-scope="scope" v-if='isInSynchroList(scope.row.visitorId)'>
            <el-button @click="synchro(scope.row)" type="text" size="small">同步</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import Register from "@/components/RegisterInBatch";
import {  queryGroupInfoByType ,queryVisitorInfo,updateStaffInfo} from "@/api/personnel";
import { queryRobotsInfo } from "@/api/robots";
import { getSynVisitors,syncData } from "@/api/group";
import store from '@/store';
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "staff-list",
  data() {
    return {
      companyId: "",
      groupId: "",
      uesrType: "1",
      startTime: moment(new Date() - 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59"),

      disabled: false,
      staffName: "",
      staffRecordName: "",
      currentPage: 1,
      pageSize: 20,
      total: 0,
      recordTotal: 0,
      tableData: [],
      group: [],
      groupsList: [],
      robotsList: [],
      synchroList: [],
      RobotId: "",
    };
  },

  computed: {
    ...mapGetters(["getAgencyInfo", "getAgencyType"]),
    isInSynchroList() {
     
      return function (value) {
       
        if (this.synchroList.length!=0&&this.synchroList.indexOf(value) == -1) {
          return true;
        } else {
          return false;
        }
        //感觉在tableData map一下 直接添加一个字段比较好
      };
    },
    pickerOptions() {
      const endTimestamp = +new Date(this.endTime);
      return {
        disabledDate(startTime) {
          const timestamp = startTime.getTime();
          if (timestamp <= endTimestamp) {
            return false;
          }
          return true;
        },
      };
    },
    pickerOptions1() {
      const startTimestamp = +new Date(this.startTime);
      return {
        disabledDate(endTime) {
          const timestamp = endTime.getTime();
          if (timestamp > startTimestamp) {
            return false;
          }
          return true;
        },
      };
    },
  },
  components: {
    Register,
  },
  methods: {
   async  synchro(value) {
        //同步
     let   needSynUser=value.visitorId?value.visitorId:"";
     let   robot=this.RobotId;//目前选中机器id
     if(robot!="")
     {
     if(needSynUser===""){//一键同步
        const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";
         let {  companyId } = store.state[USERINFO].userInfo || {};
      try{
        // let formData = new FormData();
        //  formData.append("robotIdentifier",robot);
        //  formData.append("type", 1);
        //  formData.append("robotCompanyId", companyId);
        //    try {
        // const res = await syncData(formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        let param={};
        param.robotIdentifier=robot;
        param.type=1;
        param.robotCompanyId=companyId;
        const res = await syncData(this.$qs.stringify(param));

          if (res.code == 1 && res.data) {
                 this.$Message.success("一鍵同步成功");
        } else {
          this.$Message.error(res.msg);
         
        }
         } catch (err) {
        this.$Message.error("一鍵同步失敗");
      }
     }
     else{//用編輯接口出發同步操作
     
        this.updateStaffInfo(needSynUser);
     }
     }
     else{
           this.$Message.error("請選擇機器");
     }
   
    },
     async updateStaffInfo(needSynUser) {
      try {
        let formData = new FormData();
     
      
        formData.append("visitorId", needSynUser);
     
        const res = await updateStaffInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
          this.handleRobotChange()
        } else {
          this.$Message.success(this.$t("common.saveFailure"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      } finally {
        this.formInline.picFile = null;
      }
    },
    async queryRobotsInfo() {
      try {
        let formData = new FormData();

        const res = await queryRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          this.robotsList = res.data;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },

    formateGroup(groupName) {
      return groupName && groupName.includes("默认")
        ? this.$t("common.default")
        : groupName;
    },

    handleTimeChange() {
      this.currentPage = 1;
      this.queryStaffRecord();
    },

    handleGroupChange() {
      this.queryStaffInfo();
    },
    async handleRobotChange() {
      this.synchroList=[];
      //得到目前此台机器已经同步的人员 没有同步的人加同步按钮
      //synchroeds
      //传目前选择的机器id   this.RobotId   this.synchroList
      let visitors="";
      this.tableData.map((item)=>{
         visitors=item.visitorId+","+visitors
      })
      try {
        // let formData = new FormData();
        //   formData.append("identifier", this.RobotId);
        //   formData.append("visitors",visitors);
        //     const res = await getSynVisitors(formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        let param={};
        param.visitors=visitors;
        param.identifier=this.RobotId;
        const res = await getSynVisitors(this.$qs.stringify(param));
        if (res.code == 1 && res.data) {
        
          this.synchroList=res.data.visitors
          // this.queryStaffInfo()
         
        } else {
         this.$Message.error(res.msg);
        }
      } catch (error) {
          this.$Message.error("獲取已同步人員失敗");
      }
       
     
    },

    formateTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getType(type) {
      console.log(type, "?");
      if (type == 1) {
        return this.$t("personnel.staff.in");
      }
      if (type == 2) {
        return this.$t("personnel.staff.out");
      }
      return "-";
    },
    getAvator(row) {
      let { visitorPicture, loadError, picture } = row || {};
      if (loadError || !(visitorPicture || picture)) {
        return require("@/assets/svg/stranger.svg");
      } else {
        return `${process.env.VUE_APP_BASE_API}${visitorPicture || picture}`;
      }
    },
    preview(row) {
      let { visitorPicture, loadError, picture } = row || {};
      if (!loadError && (visitorPicture || picture)) {
        this.$previewImg({
          src: `${process.env.VUE_APP_BASE_API}${visitorPicture || picture}`,
          style: {
            width: 500,
            height: 400,
            objectFit: "contain",
          },
        });
      }
    },
    handleLoadError(row) {
      row.loadError = true;
      this.tableData = [...this.tableData];
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.$refs.table && (this.$refs.table.scrollTop = 0);
      this.$refs.multipleTableWrapper &&
        (this.$refs.multipleTableWrapper.scrollTop = 0);

      this.queryStaffInfo();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    search() {
      this.queryStaffInfo();
    },

    async queryGroupInfoByType(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        if (this.getAgencyType == 2) {
          formData.append("groupType", "2");//查询访客的分组
        }
        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.groupsList = res.data.map((item) => {
            if (item) {
              return {
                value: item.id,
                label: item.name == "默认分组" ? "common.default" : item.name,
              };
            }
          });
          // this.groupsList.unshift({
          //   value: "",
          //   label: "statistics.staff.all",
          // });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryStaffInfo() {
      try {
        let formData = new FormData();
     

          formData.append('searchName', this.staffName)
        formData.append('page', this.currentPage)
        formData.append('companyId', this.companyId)
        formData.append('groupId', this.groupId)
        formData.append('operateType', 1)
        // formData.append('startTime', this.visitor_list_startTime)
        // formData.append('endTime', this.visitor_list_endTime)



        const res = await queryVisitorInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    init() {
      this.queryStaffInfo();
      this.queryRobotsInfo();
      
    },
  },
  mounted() {
    
    this.RobotId=this.$route.params.id?this.$route.params.id:""
    if(this.RobotId!="")
    {
       this.handleRobotChange();
    }
  

    this.init();
    this.$ebus.$on("/main/staff/list", () => {
      this.init();
    });
   
  },
  beforeDestroy() {
    this.$ebus.$off("/main/staff/list");
  },
};
</script>

<style lang="less" scoped>
.syncall {
  position: absolute;
  right: 30px;
}
span {
  white-space: nowrap;
}
.picturePath {
  display: inline-block;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
.container-staff-list {
  width: 100%;
  height: 100%;
  > div {
    padding-left: 20px;
    &.header {
      padding-left: 0;
      height: 60px;
      justify-content: flex-start;
      border-bottom: 1px solid #f0f0f0;
      .title {
        font-size: 12px;
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          width: auto;
          height: 28px;
          margin-left: 20px;
          color: #c5c8ce;
          background-color: #f7f7f7;
          border: 1px solid #dcdee2;
          padding: 0px 10px;
          &.active {
            background: #0084ca;
            color: #fff;
            border: none;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    &.operate {
      justify-content: space-between;
      height: 60px;
      .item {
        width: auto;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        .time {
          display: flex;
        }
        .groups {
          margin-left: 20px;
        }
      }
      .input-with-select {
        width: 192px;
        margin-left: 20px;
      }
    }
    &.content {
      height: calc(100% - 155px - 30px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
        cursor: pointer;
        &:hover {
          cursor: pointer;
        }
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 15px;
        -webkit-box-shadow: inset 0 0 5px #90ceff;
        background: #999;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px #90ceff;
        border-radius: 15px;
        background: #ededed;
      }
    }
    &.panel {
      width: 100%;
      height: calc(100% - 60px);
      padding: 0 20px;
    }
    &.pagination {
      padding: 0px 20px;
      height: 68px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>