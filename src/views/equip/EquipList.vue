<template>
  <div class="container-robots-list">
    <!-- <div class="header center">
      <div class="title">{{$t('robots.list.title')}}</div>
    </div> -->
    <div class="operate center">
      <div class="item">
        <el-input
          :placeholder="$t('robots.list.search')"
          v-model.trim.trim="spaceName"
          class="input-with-select"
          @keydown.enter.native="search"
          size="mini"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
            size="mini"
            style="color: #ffffff; background-color: #3274ec; border-radius: 0"
          ></el-button>
        </el-input>
      </div>
      <div class="item center">
        <template>
          <el-dropdown trigger="click">
            <el-button
              size="mini"
              style="border-radius: 0; background: #3274ec; color: #ffffff"
            >
              {{ $t("common.modifyInBatch") }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleDeleteInBatch"
                :disabled="disabled"
                icon="el-icon-delete"
                >{{ $t("common.dltInbatch") }}</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="handleModifyPswADMInBatch"
                :disabled="disabled"
                icon="el-icon-delete"
                >修改管理员密码</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="handleModifyPswInBatch"
                :disabled="disabled"
                icon="el-icon-edit"
                >修改开门密码</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
      <div>
        <el-button type="primary" @click="synchro()" class="syncall" size="mini"
          >一键同步</el-button
        >
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="robot-list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>

        <el-table-column
          prop="identifier"
          :label="$t('robots.list.SN')"
          width="180"
        ></el-table-column>
        <el-table-column prop="robotModel" :label="$t('robots.add.type')">
          <!-- <template slot-scope="scope">{{
            getRobotType(scope.row.robotType)
          }}</template> -->
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('robots.list.name')"
        ></el-table-column>
        <el-table-column :label="$t('robots.list.online')">
          <template slot-scope="scope">
            <span :class="scope.row.online == 1 ? 'online' : 'offline'">{{
              online(scope.row.online)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="softwareVersion"
          :label="$t('robots.list.version')"
        ></el-table-column>
        <!-- <el-table-column :label="$t('robots.list.room')" show-overflow-tooltip>
          <template slot-scope="scope">{{
            getSpaceName(scope.row.spaceList)
          }}</template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="200"
        >
          <template slot-scope="scope">
            <div class="operates">
              <!-- <el-button
                @click="handleSynchro(scope.row)"
                type="text"
                size="small"
                style="color: #ff5b5b; margin: 0px"
                >同步</el-button
              > -->
             <el-button
                @click="record(scope.row)"
                type="text"
                size="small"
                style="color: #ff5b5b; margin-right: 10px"
                >门禁记录</el-button
              >
              <el-button
                @click="handleShowEdit(scope.row)"
                type="text"
                size="small"
                style=" margin-right: 10px"
                >{{ $t("common.edit") }}</el-button
              >
              <!-- <el-button
                v-show="scope.row.robotType == 6 || scope.row.robotType == 5"
                @click="handleReset(scope.row)"
                size="small"
                type="text"
                style="margin: 0px"
                >{{ $t("robots.list.reset") }}</el-button
              > -->
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                size="small"
                style="color: #ff5b5b; "
                >{{ $t("common.delete") }}</el-button
              >
            </div>
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
    <template>
      <el-dialog
        :title="$t('common.edit')"
        :visible.sync="centerDialogVisible"
        v-if="centerDialogVisible"
        width="600px"
      >
        <el-form
          :model="formInline"
          :rules="rules"
          ref="editForm"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('robots.list.name')" prop="name">
            <el-input
              v-model.trim="formInline.name"
              :placeholder="$t('robots.add.plzIptName')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('robots.list.SN')" prop="identifier">
            <el-input
              v-model.trim="formInline.identifier"
              :placeholder="$t('robots.add.plzIptSN')"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            @click="centerDialogVisible = false"
            style="border-radius: 0px; width: 75px"
            >{{ $t("common.cancel") }}</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="handleEditRobot('editForm')"
            style="border-radius: 0px; width: 75px"
            >{{ $t("common.confirm") }}</el-button
          >
        </span>
      </el-dialog>
    </template>
    <template>
      <el-dialog
        :title="isUpdDoorpsw ? $t('robots.edit.modify') : '批量修改管理员密码'"
        :visible.sync="showPswDialogVisible"
        v-if="showPswDialogVisible"
        width="400px"
      >
        <el-form
          :model="formOnline"
          :rules="rulesPsw"
          ref="updateForm"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('login.plzIptPsw')" prop="psw">
            <el-input
              v-model.trim="formOnline.psw"
              type="password"
              :maxlength="4"
              :placeholder="
                isUpdDoorpsw
                  ? $t('robots.edit.check')
                  : '请输入管理员密码(四位有效数字)'
              "
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            @click="showPswDialogVisible = false"
            style="border-radius: 0px; width: 75px"
            >{{ $t("common.cancel") }}</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="handleUpdateRobotOpenDoorPsw('updateForm')"
            style="border-radius: 0px; width: 75px"
            >{{ $t("common.confirm") }}</el-button
          >
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import {
  queryRobotsInfo,
  queryOneRobotsInfo,
  updateRobotsInfo,
  resetRobotPsw,
  deleteRobots,
  handleModifyInBatch,
} from "@/api/robots";
import { syncData, passwordBatch } from "@/api/group";
export default {
  name: "robot-list",
  data() {
    let _this = this;
    return {
      isUpdDoorpsw: false,
      timer: null,
      centerDialogVisible: false,
      showPswDialogVisible: false,
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      spaceName: "",
      tableData: [],
      multipleSelection: [],
      formInline: {
        name: "",
        identifier: "",
        id: "",
      },
      formOnline: {
        psw: "",
      },
      rules: null,
      rulesPsw: null,
    };
  },
  watch: {
    multipleSelection: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
    },
  },
  computed: {
    ...mapGetters(["getAgencyInfo"]),
  },
  methods: {
    async synchro() {
      //同步
      let haveOffline = false;
      // try {
      //   this.multipleSelection.forEach(async (item) => {
      //     if (item.online == "2") {
      //       haveOffline = true;
      //       throw Error();
      //     }
      //   });
      // } catch (e) {}
      if (!haveOffline) {
        if (this.multipleSelection.length != 0) {
          this.multipleSelection.forEach(async (item) => {
            // robotSet.push(item.id)

            let identifier = item.identifier; //目前选中机器id

            const USERINFO =
              "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";
            let { companyId } = store.state[USERINFO].userInfo || {};
            try {
              let param = {};
              param.robotIdentifier = identifier;
              param.type = 1;
              param.robotCompanyId = companyId;
              const res = await syncData(this.$qs.stringify(param));

              if (res.code == 1) {
                this.$Message.success(item.name+"一键同步成功");
              } else {
                this.$Message.error(item.name+res.msg);
              }
            } catch (err) {
              this.$Message.error(item.name+"一键同步失敗");
            }
          });
        } else {
          this.$Message.error("请选择在线机器");
        }
      } else {
        this.$Message.error("选择的机器中包含不在线机器,请选择在线机器");
      }
    },
    initRules() {
      this.rules = {
        name: [
          {
            required: true,
            message: this.$t("robots.add.plzIptName"),
            trigger: "blur",
          },
        ],
        identifier: [
          {
            required: true,
            message: this.$t("robots.add.plzIptSN"),
            trigger: "blur",
          },
        ],
      };
      this.rulesPsw = {
        psw: [
          {
            required: true,
            message: this.$t("robots.edit.check"),
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[0-9]{4}$/,
            message: this.$t("robots.edit.check"),
            trigger: "blur",
          },
        ],
      };
    },
    online(yes) {
      return yes == 1 ? this.$t("robots.list.yes") : this.$t("robots.list.no");
    },
    getRobotType(type) {
      //1.solaris;2.ego;3.smarteye;4.iknow;5.Alpha
      if (type == 1) {
        return "Solaris";
      }
      if (type == 2) {
        return "Ego";
      }
      if (type == 3) {
        return "Smarteye";
      }
      if (type == 4) {
        return "Iknow";
      }
      if (type == 5) {
        return "Alpha";
      }
      if (type == 6) {
        return "Tianbo";
      }
      if (type == 7) {
        return "平板";
      }
    },
    getSpaceName(space) {
      let spaceList = [];
      space.forEach((item) => {
        if (item) {
          spaceList.push(item.name);
        }
      });
      return spaceList.toString();
    },
    getAvator(picture) {
      return `${process.env.BASE_API}${picture}`;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryRobotsInfo();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleModifyPswInBatch() {
      this.showPswDialogVisible = true;
      this.isUpdDoorpsw = true;
      this.formOnline.psw=""
      // let _this = this
      // this.$toast({
      //   title: `批量修改开门密码`,
      //   content: `<input placeholder='请输入开门密码 ' class='openDoorPsw'></input>`,
      //   onOkText: _this.$t('common.confirm'),
      //   onConcelText: _this.$t('common.cancel'),
      //   onOk() {
      //     let robotSet = []
      //     _this.multipleSelection.forEach(item => {
      //       robotSet.push(item.id)
      //     })
      //     _this.handleModifyInBatch(robotSet)
      //   },
      // })
    },
    handleModifyPswADMInBatch() {
      this.showPswDialogVisible = true;
      this.isUpdDoorpsw = false;
       this.formOnline.psw=""
    },

    handleDeleteInBatch() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("personnel.stranger.list.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          let robotIdSet = [];
          _this.multipleSelection.forEach((item) => {
           
              _this.deleteRobots(item.identifier,item.name);
            
          });
        
        },
      });
    },
    search() {
      console.log(this.spaceName);
      this.currentPage = 1;
      this.queryRobotsInfo();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    addRoom() {
      this.$router.push({
        path: "/main/robots/add",
        query: {
          ...this.$route.query,
        },
      });
    },
    handleShowEdit(row) {
      // this.centerDialogVisible = true;
      let { id } = row;
      if (id) {
        // this.queryOneRobotsInfo(id);
        this.$router.push({
        path: "/main/robots/edit",
        query: {
          "robotId":id
        },
      });
      }
    },
    record(row){
       let { identifier } = row;
         window.location.href ="http://47.106.237.51:8080/inOut?sn="+identifier
    },
    handleSynchro(row) {
      let { identifier, name } = row;

      this.$router.push({
        name: "synchro",
        path: "/main/synchro",
        params: {
          name: name,
          id: identifier,
        },
      });
    },
    handleEditRobot(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateRobotsInfo();
        }
      });
    },
    handleUpdateRobotOpenDoorPsw(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let robotSet = [];
          let { psw } = this.formOnline;
          this.multipleSelection.forEach((item) => {
            robotSet.push(item.identifier);
          });
          if (this.isUpdDoorpsw) {
            this.handleModifyInBatch(robotSet, psw);
          } else {
            this.handleModifyADMInBatch(robotSet, psw);
          }
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { name, identifier } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")} ${name}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteRobots(identifier);
        },
      });
    },
    handleReset(row) {
      let { identifier, name } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.resetHint") + `${name}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.resetRobotPsw(identifier);
        },
      });
    },
    async resetRobotPsw(identifier) {
      try {
        const res = await resetRobotPsw({
          deviceSn: identifier,
        });
        console.log(res);
        if (res.code == 1) {
          this.$Message.success(this.$t("common.operateSuccess"));
        } else {
          this.$Message.error(this.$t("common.operateError") + " : " + res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async updateRobotsInfo() {
      let { id, name, identifier } = this.formInline;
      try {
        let formData = new FormData();
        formData.append("robotId", id);
        formData.append("identifier", identifier);
        formData.append("name", name);
        const res = await updateRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res);
        if (res.code == 1) {
          this.centerDialogVisible = false;
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.saveFailure"));
      } finally {
        this.currentPage = 1;
        this.queryRobotsInfo();
      }
    },
    async queryOneRobotsInfo(robotId) {
      try {
        let formData = new FormData();
        formData.append("robotId", robotId);
        const res = await queryOneRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res);
        if (res.code == 1) {
          let { name, identifier, id } = res.data;
          Object.assign(this.formInline, {
            name,
            identifier,
            id,
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          Object.assign(this.formInline, {
            name: "",
            identifier: "",
            id: "",
          });
        }
      } catch (err) {
        Object.assign(this.formInline, {
          name: "",
          identifier: "",
          id: "",
        });
        this.$Message.error(err.toString());
      }
    },
    async deleteRobots(robotId,name) {
      try {
       
        let formData = new FormData();
         formData.append("name", "null");
        formData.append("identifier",robotId);
        formData.append("robotRemark","null");
        formData.append("companyId","null");
        const res = await updateRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        //  let formData = new FormData();
        // formData.append("robotId", robotId);
        // const res = await deleteRobots(formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        if (res.code == 1) {
          this.queryRobotsInfo();
        
          let msg=name?`${name} ${this.$t("common.deleteSuccess")}`:this.$t("common.deleteSuccess")
          this.$Message.success(msg);
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async handleModifyInBatch(robotSet, password) {
    
      try {
        let { extraToken } = this.getAgencyInfo || {};
        const res = await handleModifyInBatch(
          [
            ...robotSet.map((sn) => {
              return {
                deviceSn: sn,
                password,
              };
            }),
          ],
          extraToken
        );
        if (res.code == 1) {
          
          this.showPswDialogVisible = false;
          this.$Message.success(this.$t("common.operateSuccess"));
        } else {
          this.$Message.error(this.$t("common.operateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async handleModifyADMInBatch(robotSet, password) {
      try {
        let { extraToken } = this.getAgencyInfo || {};
        const USERINFO = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-USERINFO";
        let { agencyId, companyId, propertyId, agencyType, token } =
          store.state[USERINFO].userInfo || {};
        

        const res = await passwordBatch(
          [
            ...robotSet.map((sn) => {
              return {
                deviceSn: sn,
                password,
                companyId,
                propertyId,
              };
            }),
          ],
          extraToken
        );
        if (res.code == 1) {
          this.showPswDialogVisible = false;
          this.$Message.success(this.$t("common.operateSuccess"));
        } else {
          this.$Message.error(this.$t("common.operateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
      }
    },

    async queryRobotsInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.spaceName);

        formData.append("page", this.currentPage);
        const res = await queryRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count || 0;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    heartBeat() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (this.disabled && this.$route.path.includes("/main/robots/list")) {
          this.queryRobotsInfo();
        }
      }, this.delay || 10 * 1000);
    },
  },
  created() {
    this.initRules();
  },
  beforeRouteLeave(to, from, next) {
    next((vm) => {
      if (vm.timer) {
        clearInterval(vm.timer);
        vm.timer = null;
      }
    });
  },
  mounted() {
    this.queryRobotsInfo();
    // this.heartBeat()
    this.$ebus.$on("/main/robots/list", () => {
      this.queryRobotsInfo();
    });
    this.$ebus.$on("changeLang", this.initRules);
  },
  beforeDestroy() {
    this.$ebus.$off("/main/robots/list");
    this.$ebus.$off("changeLang");
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="less" scoped>
.online {
  color: #5cbb55;
  font-weight: bold;
}
.offline {
  color: #909399;
}
.syncall {
  border-radius: 18px;
}
.operate {
  > div {
    &:nth-child(1) {
      flex: 2;
    }
    &:nth-child(2) {
      flex: 9;
    }
    &:nth-child(3) {
      flex: 1;
    }
  }
}
.haadPath {
  display: inline-block;
  width: 120px;
  height: 80px;
  object-fit: cover;
}
.operates {
  width: calc(100% - 20px);
  height: 100%;
  display: flex;
  justify-content: end;
  button {
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}
.container-robots-list {
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
        font-size: 16px;
        margin-left: 20px;
      }
    }

    &.operate {
      justify-content: flex-start;
      height: 40px;
      .item {
        // width: 50%;
        justify-content: flex-start;
      }
      .input-with-select {
        width: 192px;
        margin-left: 20px;
      }
    }
    &.content {
      height: calc(100% - 120px - 68px);
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