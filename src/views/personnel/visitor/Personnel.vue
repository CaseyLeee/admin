<template>
  <div class="container-staff-list">
    <template>
      <!-- <div class="header center">
        <div class="h-title">{{ $t("mng.bigdata.tempList") }}</div>
      
      </div> -->
      <div class="operate center">
        <div class="item">
          <div class="groups center">
            <span style="margin-right: 10px"> 设备: </span>
            <el-select
              v-model="identifier"
              filterable
              :placeholder="$t('personnel.stranger.list.robotName')"
              style="width: 150px; height: 28px; border: none"
              @visible-change="queryRobotsInfo"
              @change="handleRobotChange"
              size="mini"
            >
              <el-option
                v-for="item in robotsList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
                size="mini"
              ></el-option>
            </el-select>
          </div>
          <div class="search groups center">
            <span style="width: 40px">搜索:</span>
            <el-input
              :placeholder="$t('common.search')"
              v-model.trim="searchName"
              class="input-with-select"
              @keydown.enter.native="search"
              size="mini"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
                size="mini"
              ></el-button>
            </el-input>
          </div>

          <!-- <div class="groups center">
            <span style="margin-right: 20px">{{
              $t("mng.personnel.captemp")
            }}</span>
            <el-select
              v-model="normal"
              filterable
              :placeholder="$t('mng.personnel.captemp')"
              style="width: 120px; height: 28px; border: none"
              @change="handleTemperatureChange"
            >
              <el-option
                v-for="item in temperatureList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div> -->
          <!-- <div class="groups center">
            <span style="margin-right: 20px">{{
              $t("mng.bigdata.state")
            }}</span>
            <el-select
              v-model.trim="handled"
              filterable
              :placeholder="$t('mng.personnel.captemp')"
              style="width: 120px; height: 28px; border: none"
              @change="handleStatusChange"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div> -->
          <div class="groups center">
            <!-- <span style="margin-right: 20px">{{
              $t("personnel.stranger.list.time")
            }}</span> -->
            <div class="time">
              <el-date-picker
                v-model="startTime"
                style="width: 200px; height: 28px"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :placeholder="$t('excel.export.startTime')"
                :picker-options="pickerOptions"
                @change="handleTimeChange"
                size="mini"
              ></el-date-picker>
              <span class="center" style="margin: 0px 5px">-</span>
              <el-date-picker
                v-model="endTime"
                :clearable="false"
                style="width: 200px; height: 28px"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :placeholder="$t('excel.export.endTime')"
                :picker-options="pickerOptions1"
                @change="handleTimeChange"
                size="mini"
              ></el-date-picker>
            </div>
            <el-button
              type="primary"
              style="margin-left: 20px"
              @click="search"
              size="mini"
              >{{ $t("common.find") }}</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 20px"
              @click="picfind"
              size="mini"
              >以图搜图</el-button
            >

            <!-- <div class="groups center">
              <span style="margin-right: 20px">{{
                $t("personnel.visitor.export")
              }}</span>
              <el-select
                v-model="isPic"
                style="width: 100px; height: 28px; border: none"
              >
                <el-option
                  v-for="item in downPicList"
                  :key="`${item.label}`"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div> -->
            <!-- <Button
              :disabled="!recordList.length || exportDisable"
              type="primary"
              style="height: 28px; padding: 0px 20px; margin-left: 20px"
              class="center"
              :title="
                exportDisable
                  ? this.isPic === 1
                    ? this.$t('personnel.staff.maxlimit')
                    : this.$t('personnel.staff.limit')
                  : ''
              "
              @click="exportStrangerRecord"
              >{{ $t("common.export") }}</Button -->
            <!-- > -->
          </div>
        </div>
      </div>
      <div class="content" id="staff-list-record" ref="table">
        <el-table :data="recordList" tooltip-effect="dark" style="width: 100%">
          <el-table-column width="55"></el-table-column>
          <el-table-column :label="$t('personnel.staff.picture')" width="160">
            <template slot-scope="scope">
              <img
                :src="getAvator(scope.row.picturePath)"
                @click="preview(scope.row.picturePath)"
                alt
                class="haadPath"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('personnel.staff.name')">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="temperature"
            :label="$t('mng.personnel.temprature')"
          >
            <template slot-scope="scope">
              <span :class="scope.row.alarmType == 2 ? 'fever' : 'normal'">{{
                getTemprature(scope.row.temperature)
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('mng.personnel.capture')" width="160">
            <template slot-scope="scope">
              <img
                :src="getAvator(scope.row.picturePath)"
                @click="preview(scope.row.picturePath)"
                alt
                class="haadPath"
              />
            </template>
          </el-table-column> -->
          <el-table-column
            prop="robotName"
            :label="$t('personnel.stranger.list.robotName')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.robotName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            show-overflow-tooltip
            :label="$t('personnel.stranger.list.time')"
          >
            <template slot-scope="scope">
              <span>{{ formateTime(scope.row.time) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="apiStatus" label="api发送状态">
            <template slot-scope="scope">
              <span @click="open1(scope.row.apiStatus)">{{
                formateApiStatus(scope.row.apiStatus)
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="remark" :label="$t('room.edit.remark')">
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            fixed="right"
            :label="$t('common.operate')"
            width="260"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                style="color: #0084ca"
                type="text"
                size="small"
                v-if="scope.row.name != 'stranger'"
                >{{ $t("mng.bigdata.detail") }}</el-button
              >

              <template v-if="scope.row.name === 'stranger'">
                <el-button
                  @click="add(scope.row)"
                  type="text"
                  size="small"
                  style="color: #0084ca; border: none !important"
                  >添加人员</el-button
                >
              </template>
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
          :total="recordTotal"
        ></el-pagination>
      </div>
    </template>
    <template>
      <el-dialog
        :title="'详情'"
        :visible.sync="centerDialogVisible"
        v-if="centerDialogVisible"
        center
        width="400px"
        class="dailog-contianer detail_dialog"
      >
        <div slot="title" class="head">详情</div>
        <div class="dialog_container_item">
          <img
            class="dialog_img"
            :src="getAvator(formInline.picturePath)"
            @click="preview(formInline.picturePath)"
            alt
          />
          <div class="item_info">
            <div>姓名:&nbsp;&nbsp;{{ formInline.name }}</div>
            <div>所在分组:&nbsp;&nbsp;{{ formInline.groupName }}</div>
            <div style="white-space: nowrap">
              有效期至:&nbsp;&nbsp;{{ formInline.dueTime }}
            </div>
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import Register from "@/components/RegisterInBatch";
import {
  queryStaffInfo,
  queryStaffRecord,
  queryGroupInfoByType,
  deleteStaff,
  reportStaffRecord,
  reportStaff,
} from "@/api/personnel";
import {
  getRecentAccess,
  exportStrangerRecord,
  handleEpidemic,
} from "@/api/dashboard";
import { queryRobotsInfo } from "@/api/robots";
import { queryUser } from "@/api/room";

const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "staff-list",
  data() {
    return {
      isPic: 1,
      downPicList: [
        {
          label: "agency.add.yes",
          value: 0,
        },
        {
          label: "agency.add.no",
          value: 1,
        },
      ],
      timer: null,
      timer2: null,
      throtle: 37.3,
      strangerIcon: require("@/assets/svg/stranger.svg"),
      searchName: "",
      normal: "",
      identifier: "",
      handled: "",
      centerDialogVisible: false,
      handleDialogVisible: false,
      rules: {},
      formInline: {},
      page: 1,
      pageSize: 20,
      companyId: "",
      groupId: "",
      userType: "1",
      startTime: moment(new Date() - 0 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
      currentIndex: 0,
      disabled: false,
      staffName: "",
      currentPage: 1,
      total: 0,
      recordTotal: 0,
      tableData: [],
      recordList: [],
      group: [],
      groupsList: [],
      companyList: [],
      temperatureList: [
        {
          label: "statistics.staff.all",
          value: "",
        },
        {
          label: "mng.bigdata.normal",
          value: "1",
        },
        {
          label: "mng.bigdata.notice1",
          value: "2",
        },
      ],
      statusList: [
        {
          label: "statistics.staff.all",
          value: "",
        },
        {
          label: "mng.bigdata.handle1",
          value: 0,
        },
        {
          label: "mng.bigdata.handled1",
          value: 1,
        },
        {
          label: "mng.bigdata.noNeed",
          value: 2,
        },
      ],
      robotsList: [
        {
          label: "statistics.staff.all",
          value: "",
        },
      ],
      multipleSelection: [],
      buttons: [
        {
          i18n: "personnel.staff.list",
          router: "",
        },
        {
          i18n: "personnel.staff.record",
          router: "",
        },
        {
          i18n: "personnel.staff.register",
          router: "",
        },
      ],
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
    ...mapGetters(["getAgencyInfo", "getAgencyType"]),
    title() {
      let { handled, temperature, alarmType } = this.formInline;
      // log(alarmType, handled, temperature)
      if (handled == 1 && alarmType == 2) {
        return this.$t("mng.bigdata.handled1");
      }
      if (alarmType == 2 && handled != 1) {
        return this.$t("mng.bigdata.notice");
      }
      return this.$t("mng.bigdata.normal");
    },
    exportDisable() {
      if (this.isPic === 1) {
        return this.recordTotal > 50000 ? true : false;
      } else {
        return this.recordTotal > 1000 ? true : false;
      }
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
    picfind(){
          window.location.href ="http://47.106.237.51:8080/"
    },
    open1(msg) {
      const h = this.$createElement;

      this.$notify({
        title: "msg",
        message: h(
          "div",
          { style: "color: teal;word-break: break-all;" },
          msg.toString().split("#").length > 2
            ? msg.toString().split("#")[2]
            : msg.toString().split("#")[0]
        ),
        duration: 0,
      });
    },
    add(row) {
      console.log("row");
      console.log(row);
      this.$router.push({
        path: "/main/visitor/add",
        query: {
          picurl: row.picturePath,
          role: 2,
        },
      });
    },
    handleHideDialog() {
      this.centerDialogVisible = false;
      this.handleDialogVisible = false;
      this.formInline = Object.assign({}, this.formInline, {
        remark: "",
      });
    },
    isFever(item) {
      return item.alarmType == 2 ? true : false;
      // return parseFloat(item.temperature || 0) > this.throtle ? true : false;
    },
    getTemprature(degree) {
      return degree ? `${Number(degree).toFixed(1)}℃` : "-";
    },
    check() {
      if (!this.formInline.startTime) {
        this.$Message.error(this.$t("excel.export.startTime"));
        return false;
      }
      if (!this.formInline.endTime) {
        this.$Message.error(this.$t("excel.export.endTime"));
        return false;
      }
      return true;
    },
    formateGroup(groupName) {
      return groupName && groupName.includes("默认")
        ? this.$t("common.default")
        : groupName;
    },
    handleExportStaffList() {
      this.reportStaff();
    },
    handleExportStaffRecord() {
      this.reportStaffRecord();
    },
    download(url, fileName) {
      url = url.replace(/\.xls/gi, "");
      log(url);
      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${process.env.VUE_APP_BASE_API}${url}.xls`;
      link.click();
    },
    handleTimeChange() {
      this.currentPage = 1;
      this.getRecentAccess();
    },
    handleRobotChange() {
      this.currentPage = 1;
      this.getRecentAccess();
    },
    handleTemperatureChange(val) {
      console.log(val);

      if (val === "" || val == 1) {
        this.handled = "";
      }
      if (val === 2) {
        this.handled = 1;
      }
      this.currentPage = 1;
      this.getRecentAccess();
    },
    handleStatusChange(val) {
      if (val === "") {
        this.normal = "";
      }
      if (val === 0) {
        this.normal = "2";
      }
      if (val === 1) {
        this.normal = "";
      }
      if (val === 2) {
        this.normal = "1";
      }
      this.currentPage = 1;
      this.getRecentAccess();
    },
    handleGroupChange() {
      this.currentPage = 1;
      if (this.currentIndex == 0) {
        this.queryStaffInfo();
      }
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      }
    },
    handleIndexChange(index) {
      this.tableData = [];
      this.total = 0;
      this.groupId = this.companyId = "";
      this.currentIndex = index;
      this.currentPage = 1;
      if (index == 0) {
        this.queryStaffInfo();
      }
      if (index == 1) {
        console.log("获取活动记录");
        this.queryStaffRecord();
      }
    },
    formateTime(time) {
      return moment(new Date(time.replace(/\//g, ":"))).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    formateApiStatus(apiStatus) {
      let apiStatuscode = apiStatus.toString().split("#")[0];

      return apiStatuscode == "200"
        ? "成功"
        : apiStatuscode == ""
        ? "未发送"
        : apiStatuscode;
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
    getAvator(picture) {
      return picture
        ? `${process.env.VUE_APP_BASE_API}${picture}`
        : this.strangerIcon;
    },
    preview(picture) {
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${picture}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain",
        },
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$refs.table && (this.$refs.table.scrollTop = 0);
      this.getRecentAccess();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    search() {
      this.currentPage = 1;
      this.getRecentAccess();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleViewRecord(row) {
      console.log(row, "查看详情");
    },
    async handleEdit(row) {
      //通过id查询到此user的详情

      if (row.userType !== 0) {
        //3

        await this.queryUser(row.useId, row);
        // this.queryUser("2faa921b74e64bc9914e5ed1e6912211", row);
      } else {
        this.formInline = Object.assign({}, this.formInline, row);
      }
      this.centerDialogVisible = true;
    },
    async queryUser(visitorId, row) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await queryUser(formData);

        if (res && res.code == 1) {
          let result = res.data;
          let { regPath } = row;

          let { name, dueTime } = result.visitor;
          let { groupName } = result;

          this.formInline = Object.assign(
            {},
            { name: name },
            { dueTime: dueTime },
            { groupName: groupName },
            { picturePath: regPath }
          );
        } else {
          this.$Message.error("查询详情失败");
        }
      } catch (err) {
        this.$Message.error(err);
      }
    },
    handleRecoveryInbatch() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("personnel.stranger.list.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          let visitorIdSet = [];
          _this.multipleSelection.forEach((visitor) => {
            visitorIdSet.push(visitor.visitorId);
          });
          if (_this.currentIndex == 0) {
            _this.deleteStaff(visitorIdSet.toString());
          }
        },
      });
    },
    handleRecovery(row) {
      let { name } = row;
      this.handleDialogVisible = true;
      this.formInline = Object.assign({}, this.formInline, row);
      // let _this = this;
      // this.$toast({
      //   title: _this.$t("common.confirm"),
      //   content: `<p>${_this.$t("mng.bigdata.todo")} : ${name}?</p>`,
      //   onOkText: _this.$t("common.confirm"),
      //   onConcelText: _this.$t("common.cancel"),
      //   onOk() {
      //     _this.handleEpidemic(row);
      //   }
      // });
    },
    async handleEpidemic(userInfo) {
      let { id, name, userType, remark, useId } = userInfo || {};
      try {
        const res = await handleEpidemic({
          currentId: id,
          userId: useId,
          useType: userType,
          handle: 1,
          remark,
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.operateSuccess"));
          this.getRecentAccess();
          this.centerDialogVisible = false;
          this.handleDialogVisible = false;
        } else {
          this.$Message.error(this.$t("common.operateError"));
        }
      } catch (err) {
        log(err);
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async queryRobotsInfo(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        formData.append("searchName", "");
        formData.append("page", 1);
        formData.append("pageSize", 100);
        const res = await queryRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.robotsList = [];
          this.robotsList = res.data.map((item) => {
            if (item) {
              return {
                label: item.name,
                value: item.identifier,
              };
            }
          });
          this.robotsList.unshift({
            label: "statistics.staff.all",
            value: "",
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.robotsList = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async reportStaffRecord() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";

        formData.append("searchName", this.staffName);
        formData.append("groupId", this.groupId);
        formData.append("recordId", this.recordId || "");
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);
        const res = await reportStaffRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          let { url } = res.data;
          url && this.download(url, "staff-list-excel");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async reportStaff() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";
        formData.append("searchName", this.staffName);
        formData.append("groupId", this.groupId);
        formData.append("recordId", this.recordId || "");
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);

        const res = await reportStaff(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          let { url } = res.data;
          url && this.download(url, "staffList");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async deleteStaff(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await deleteStaff(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.deleteSuccess"));
          this.queryStaffInfo();
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryStaffRecord() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        formData.append("searchName", this.staffName);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("page", this.currentPage);
        const res = await queryStaffRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.recordList = res.data;
          this.recordTotal = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.recordList = [];
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryCompanyList(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        formData.append("groupType", "");
        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.companyList = res.data.map((item) => {
            if (item) {
              return {
                value: item.id,
                label: item.name,
              };
            }
          });
          this.companyList.unshift({
            value: "",
            label: "statistics.staff.all",
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.companyList = [];
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryGroupInfoByType(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        if (this.getAgencyType == 2) {
          formData.append("groupType", "1");
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
          this.groupsList.unshift({
            value: "",
            label: "statistics.staff.all",
          });
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
        formData.append("searchName", this.staffName);
        formData.append("page", this.currentPage);
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        const res = await queryStaffInfo(formData, {
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
    async getRecentAccess(hide = false) {
      try {
        const res = await getRecentAccess({
          name: this.searchName,
          identifier: this.identifier,
          normal: this.normal || 0,
          handled: this.handled === "" ? -1 : this.handled,
          startTime: this.startTime,
          endTime: this.endTime,
          page: this.currentPage,
          pageSize: this.pageSize,
          isPic: this.isPic || 1,
          hide,
        });
        if (res && res.code == 1) {
          console.log(res);
          this.recordList = res.data.dataList;
          this.recordTotal = res.data.count;
        } else {
          this.recordList = [];
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      } finally {
        !hide && this.$refs.table && this.$refs.table.scrollTo(0, 0);
        if (this.timer2) {
          clearTimeout(this.timer2);
          this.timer2 = null;
        }
        this.timer2 = setTimeout(() => {
          this.getRecentAccess(true);
        }, 2000);
      }
    },
    async exportStrangerRecord() {
      try {
        let language = window.localStorage.getItem(LANG) || "zh";
        let { companyId = "", propertyId = "" } = this.getAgencyInfo || {};
        let link = document.createElement("a");
        let params = `name=${this.searchName}&identifier=${
          this.identifier
        }&normal=${this.normal || -1}&handled=${
          this.handled || -1
        }&companyId=${companyId}&propertyId=${propertyId}&startTime=${
          this.startTime
        }&endTime=${this.endTime}&title=${this.$t(
          "mng.bigdata.tempList"
        )}&page=${this.currentPage}&pageSize=${
          this.recordTotal
        }&language=${language}&isPic=${this.isPic}`;
        link.download = this.$t("mng.bigdata.tempList");
        link.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/export/stranger?${params}`;
        link.click();
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("excel.export.error"));
      }
    },
    init() {
      this.getRecentAccess();
    },
    heartBeat() {
      this.timer = setInterval(() => {
        if (this.$route.path.includes("/main/management/personnel")) {
          this.getRecentAccess(true);
        }
      }, this.delay || 2000);
    },
  },
  mounted() {
    this.init();
    this.heartBeat();
    this.$ebus.$on("/main/management/personnel", this.init);
    this.$ebus.$on("/main/staff/list", () => {
      this.init();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/staff/list");
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timer2) {
      clearTimeout(this.timer2);
      this.timer2 = null;
    }
  },
};
</script>

<style lang="less" scoped>
.haadPath {
  display: inline-block;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
.danger {
  color: #eb2f2f;
}
.dialog-picture {
  height: 90px;
  margin-top: 25px;
  margin-left: -80px;
  img {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-right: 15px;
    object-fit: cover;
  }
}
.dialog-header {
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  color: #fff;
  background: #3198ff;
  font-family: PingFang-SC-Regular, PingFang-SC;
  &.danger {
    background: #eb2f2f;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    height: 35px;
    line-height: 35px;
    &:hover {
      cursor: pointer;
    }
    &.handled {
      background: #f1f1f3;
      color: #999;
    }
    &.cancel {
      background: #e4f0ff;
      color: #3198ff;
      margin-left: 30px;
    }
    &.confirm {
      margin-left: 40px;
      background: #3198ff;
      color: #fff;
    }
  }
}
span {
  &.fever {
    color: #eb2f2f;
  }
}
.container-staff-list {
  width: 100%;
  height: 100%;
  > div {
    padding-left: 20px;
    &.header {
      padding-left: 0;
      height: 60px;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
      .h-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-left: 20px;
        font-family: PingFang-SC-Medium, PingFang-SC;
      }
      .search {
        margin-right: 120px;
      }
      .input-with-select {
        width: 192px;
        margin-right: 60px;
      }
    }
    &.operate {
      justify-content: space-between;
      height: 70px;
      .item {
        width: auto;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        height: 100%;
        > div {
          margin-top: 3px;
        }
        .time {
          display: flex;
        }
        .groups {
          margin-left: 20px;
        }
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
      height: calc(100% - 120px);
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
.dialog_img {
  width: 80px;
  height: 80px;
  object-fit: fill;
}
</style>
<style  lang="less">
.detail_dialog {
  .head {
    font-weight: 800;
  }
  .el-dialog__body {
    padding: 50px 50px 50px;
  }
  .el-dialog__header {
    background-color: #f0f2f5;
    border-radius: 10px;
  }
  .el-dialog__headerbtn {
    line-height: 100%;
  }
  .el-dialog--center {
    margin-top: calc((100vh - 350px) / 2) !important;
    border-radius: 10px;
  }
  .dialog_container_item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    img {
      margin-right: 20px;
      border-radius: 7px;
    }
    .item_info {
      > div {
        margin-top: 10px;
        font-weight: 500;
        color: #666666;
        span {
          color: #666666;
        }
      }
      > div:nth-child(1) {
        margin-top: 0px;
      }
    }
  }
}
</style>