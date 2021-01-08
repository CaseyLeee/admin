<template>
  <div class="container-visitor-edit">
    <div class="panel center">
      <div class="panel">
        <el-form
          ref="form"
          :model="formInline"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="姓名" prop="visitorName">
            <el-input v-model.trim="formInline.visitorName" />
          </el-form-item>
          <el-form-item
            :label="getfieldName(item.fieldName)"
            v-for="(item, index) in formInline.fieldsMap"
            :key="`room-type-${index}`"
            :rules="fieldOjbectRules.fieldOjbectRule"
            :prop="'fieldsMap.' + index + '.fieldValue'"
          >
            <el-input v-model="item.fieldValue" />
          </el-form-item>
          <el-form-item label="分组" prop="groupId">
            <el-select v-model="formInline.groupId" placeholder="选择分组">
              <el-option
                v-for="item in groupsList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="addGroup" @click="addGroup()"></span>
          </el-form-item>
          <el-form-item label="有效期" prop="visitorDueTime" ref="datecheck">
            <el-date-picker
              v-model="formInline.visitorDueTime"
              type="date"
              placeholder="选择结束日期"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <el-radio-group v-model="radio" @change="changeradio">
              <el-radio :label="1">永久</el-radio>
              <el-radio :label="2">一年</el-radio>
              <el-radio :label="3">半年</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传头像">
            <!-- <el-upload
              :file-list="fileList"
              class="avatar-uploader"
              :action="uploadUrl"
              :on-success="onSuccess"
              :before-upload="beforeupload"
              multiple
              list-type="picture-card"
            >
              <img
                v-if="formInline.headPath"
                :src="getAvator(formInline.headPath)"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->

            <!-- start -->
            <div class="uploaddiv">
              <el-upload
                action="#"
                ref="upload"
                list-type="picture-card"
                :on-remove="deletePicture"
                :file-list="fileList"
                :http-request="updateVisitor"
              >
                <i slot="default" class="el-icon-plus"></i>
              </el-upload>
            </div>

            <!-- end -->
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submit('form')"
              style="width: 100%"
              >修改</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { queryGroupInfoByType } from "@/api/personnel";
import { addgroup, updateuser } from "@/api/group";
import moment from "moment";
import { mapGetters } from "vuex";
import { queryRobotsInfo } from "@/api/robots";
import { addrobots } from "@/api/group";
import {
  queryOneUserInfo,
  updateStaffInfo,
  resetPassword,
} from "@/api/personnel";
import {
  uploadFile,
  deleteFile,
  modifyUser,
  queryUser,
  updateVisitor,
  deleteVisitorPicture,
  checkVisitorRegisterInfo,
} from "@/api/room";
export default {
  name: "visitor-edit",
  data() {
    return {
      fileList: [],
      groupsList: [],
      fieldOjbectRules: {
        fieldOjbectRule: [
          { required: true, message: "请输入房号", trigger: "blur" },
        ],
      },
      rules: {
        visitorName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],

        groupId: [
          {
            required: true,
            message: "请选择分组",
            trigger: "blur",
          },
        ],

        visitorDueTime: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "blur",
          },
        ],
        headPath: [{ required: true, message: "请上传图片" }],
      },
      oriheadPath: "",
      radio: 0,
      loading: null,
      inputVisible: false,
      timer: null,
      loopTimes: 10,
      deleteIcon: require("@/assets/svg/delete.svg"),
      formInline: {
        groupId: "",
        uploadIcon: require("@/assets/svg/upload.svg"),
        picFile: null,
        visitorName: "",
        visitorPicture: "",
        visitorDueTime: "",
        visitorAccount: "",
        featureList: [],
        fieldsMap: [],
        phone: 19987562264,
        threshold: 0.76,
        identity: 123456789123456,
        headPath: "",
      },
      checkAll: false,
      isIndeterminate: true,
      checkedPers: [],
      robotsList: [],
      robotids: [],
    };
  },
  computed: {
    getfieldName(o) {
      return function (o) {
        // return o==="code"?"房号":o
        return o;
      };
    },
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.0.0/register/picture`;
    },
    ...mapGetters(["getAgencyInfo"]),
    to() {
      return {
        path: "/main/visitor/list",
        query: {
          ...this.$route.query,
        },
      };
    },
    getVisitorName() {
      let { visitorName } = this.$route.query;
      return this.$t("common.edit") + (visitorName ? ` / ${visitorName}` : "");
    },
  },
  methods: {
    // onChangeFile(file, fileList) {
    //   if (
    //     file.name.split(".").pop() !== "png" &&
    //     file.name.split(".").pop() !== "jpg" &&
    //     file.name.split(".").pop() !== "jpeg"
    //   ) {
    //     // 类型有可能大写，记得要写

    //     this.$Message.error("请上传png/jpg/jpeg格式图片");

    //     this.$refs.upload.clearFiles();
    //     return false
    //   }
    // },
    changeradio(value) {
       this.$refs.datecheck.clearValidate()
      if (value === 1) {
        this.formInline.visitorDueTime = moment()
          .subtract(-500, "years")
          .format("YYYY-MM-DD hh:mm:ss");
      }
      if (value === 2) {
        this.formInline.visitorDueTime = moment()
          .subtract(-1, "years")
          .format("YYYY-MM-DD hh:mm:ss");
      }
      if (value === 3) {
        this.formInline.visitorDueTime = moment()
          .subtract(-6, "months")
          .format("YYYY-MM-DD hh:mm:ss");
      }
    },
    async queryGroupInfoByType(role) {
      try {
        let formData = new FormData();
        if (role == 1) {
          //查员工分组
          formData.append("groupType", "1");
        }
        if (role == 2) {
          //查访客分组
          formData.append("groupType", "2");
        }

        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          this.groupsList = res.data.map((item) => {
            if (item) {
              return {
                value: item.id,
                label: item.name == "默认分组" ? "common.default" : item.name,
              };
            }
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    // onSuccess(res) {
    //   if (res.code == 1) {
    //     this.formInline.headPath = res.data.url;
    //   }
    // },
    // beforeupload(files) {
    //   let { type, size, name } = files;

    //   if (
    //     type.indexOf("png") < 0 &&
    //     type.indexOf("jpg") < 0 &&
    //     type.indexOf("jpeg") < 0
    //   ) {
    //     this.$Message.error("请上传png/jpg/jpeg格式图片");

    //     return false;
    //   }
    // },
    addGroup() {
      this.$prompt("请输入分组名称", "创建分组", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          let formData = new FormData();
          formData.append("name", value);
          formData.append("type", 2);
          formData.append("sort", 1);
          if (value === null) {
            this.$message({
              type: "error",
              message: "分组名称不能为空",
            });
            return;
          }
          try {
            const res = await addgroup(formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.code == 1 || res.code == 3) {
              this.$message({
                type: "success",
                message: "新增组成功",
              });
              this.queryGroupInfoByType(2);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          } catch (error) {
            this.$Message.error(error);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },

    handleCheckAllChange(val) {
      this.checkedPers = val ? this.robotids : [];
      this.isIndeterminate = false;
    },
    handleCheckedPerChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.robotids.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.robotids.length;
    },
    handleShowDeleteIcon(item, show) {
      item.active = show;
    },
    deletePicture(item) {
      console.log(item);
      let { id } = item;
      let _this = this;
      _this.deleteVisitorPicture(id);
      // this.$toast({
      //   title: _this.$t("common.confirm"),
      //   content: `${_this.$t("common.delete")}${_this.$t(
      //     "mng.bigdata.avator"
      //   )}?`,
      //   onOkText: _this.$t("common.confirm"),
      //   onConcelText: _this.$t("common.cancel"),
      //   onOk() {

      //   },
      // });
    },
    handleShowIpt(visible) {
      this.inputVisible = visible;
    },
    getAvator(picturePath) {
      // if (picturePath.indexOf("data:image")) {
      //   return picturePath;
      // }
      // alert(picturePath)
      return `${process.env.VUE_APP_BASE_FEATURE_API}${picturePath}`;
    },
    handleZoom(row) {
      let { picturePath, loadError } = row;
      if (!loadError) {
        this.$previewImg({
          src: `${process.env.VUE_APP_BASE_API}${picturePath}`,
          style: {
            width: 500,
            height: 400,
            objectFit: "contain",
          },
        });
      }
    },
    handleLoadError(item) {
      item.loadError = true;
      this.formInline.featureList = [...this.formInline.featureList];
    },
    upload(event) {
      this.formInline.picFile = null;
      this.formInline.picFile = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.formInline.visitorPicture = e.target.result;
        this.updateVisitor();
      };
    },
    async updateVisitor(param) {
      let file = param.file;
      console.log("file.type", file.type);
      if (
        file.type.indexOf("png") < 0 &&
        file.type.indexOf("jpg") < 0 &&
        file.type.indexOf("jpeg") < 0
      ) {
        this.$Message.error("请上传png/jpg/jpeg格式图片");
        this.$refs.upload.uploadFiles.pop(); //清除掉最后一个错误的文件

        return false;
      }

      try {
        let _this = this;
        this.loading = this.$loading({
          lock: true,
          text: _this.$t("checkInfo.check"),
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let {
          visitorId,
          id,
          visitorName,
          authorize,
          threshold,
          groupId,
          groupManId,
          remarkCompany,
          voiceMessage,
          visitorDueTime,
          registerType,
          companyId,
          propertyId,
          type,
        } = this.formInline;
        let formData = new FormData();

        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {};
        reader.onloadend = async () => {
          let index = imgResult.indexOf(",");
          let baseImg = imgResult.slice(index + 1);
          formData.append("imageList", baseImg);
          formData.append("visitorId", id);
          formData.append("companyId", companyId);
          formData.append("propertyId", propertyId);
          formData.append("authorize", authorize);
          formData.append("threshold", threshold);
          formData.append("groupId", groupManId);
          formData.append("remarkCompany", remarkCompany);
          formData.append("voiceMessage", voiceMessage);
          formData.append("validPeriod", visitorDueTime);
          formData.append("registerType", registerType);
          formData.append("type", type);
          const res = await updateVisitor(formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // if (res && res.code == 1) {
          //   this.loading.close();
          //   this.$Message.success(this.$t("common.addSuccess"));
          //   this.queryUser(this.$route.query.visitorId);
          // }
          if (res && (res.code == 2 || res.code == 1)) {
            this.loopTimes = 10;
            if (this.timer) {
              clearInterval(this.timer);
              this.timer = null;
            }
            this.timer = setInterval(() => {
              if (this.loopTimes >= 0) {
                this.checkVisitorRegisterInfo(res.data.id, res.data.token);
              }
            }, 1000);
          } else {
            this.loading.close();
            this.$Message.error(this.$t("common.addFailure"));
          }

          // this.$refs.file.clearValidate()
        };
      } catch (err) {
      } finally {
        this.formInline.visitorPicture = null;
      }
    },
    async deleteVisitorPicture(imageId) {
      try {
        let formData = new FormData();
        formData.append("imageId", imageId);
        const res = await deleteVisitorPicture(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res && (res.code == 1 || res.code == 2)) {
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(res.msg);
          this.queryUser(this.$route.query.visitorId);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async checkVisitorRegisterInfo(id, token) {
      try {
        let formData = new FormData();
        formData.append("id", id);
        formData.append("token", token);
        const result = await checkVisitorRegisterInfo(formData, {});
        if (result && result.code == 1000) {
          this.loading.close();
          this.$Message.success(this.$t("common.addSuccess"));
          this.queryUser(this.$route.query.visitorId);
          clearInterval(this.timer);
          return;
        }
        if (result && result.code == 0) {
          this.loading.close();
          this.$Message.error(this.$t("common.addFailure"));
          this.queryUser(this.$route.query.visitorId);
          clearInterval(this.timer);
          return;
        }
        if (
          result &&
          result.code != 0 &&
          result.code != 2 &&
          result.code != 1000
        ) {
          this.loading.close();
          let msg = `${this.$t("common.addFailure")}: ${this.$t(
            `checkInfo.${result.code}`
          )}`;
          this.$Message.error(msg);
          this.queryUser(this.$route.query.visitorId);
          clearInterval(this.timer);
        }
      } catch (err) {
      } finally {
        this.loopTimes = this.loopTimes - 1;
        if (this.loopTimes <= 0) {
          this.loading.close();
          this.queryUser(this.$route.query.visitorId);
          this.timer && clearInterval(this.timer);
        }
      }
    },
    check() {
      console.log(this.formInline);
      let {
        picFile,
        visitorPicture,
        visitorName,
        visitorDueTime,
      } = this.formInline;
      if (this.formInline.featureList.length) {
        /**
         * 含失效特征 请删除并重新上传特征
         */
        let hasInvalid = this.formInline.featureList.filter(
          (item) => item.loadError
        );
        if (hasInvalid.length == 1) {
          this.$Message.error(this.$t("personnel.staff.notice"));
          return false;
        }
      }
      if (!picFile && !this.formInline.featureList.length) {
        this.$Message.error(this.$t("personnel.edit.plzUpload"));
        return false;
      }
      if (!visitorName) {
        this.$Message.error(this.$t("personnel.edit.plzIptName"));
        return false;
      }
      if (!visitorDueTime) {
        this.$Message.error(this.$t("personnel.edit.plzIptDeadLine"));
        return false;
      }
      return true;
    },

    submit(formName) {
      // if (!this.check()) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this;
          // this.$toast({
          //   title: _this.$t("common.confirm"),
          //   content: _this.$t("personnel.edit.submitHint"),
          //   onOkText: _this.$t("common.confirm"),
          //   onConcelText: _this.$t("common.cancel"),
          // onOk() {
          _this.updateStaffInfo();
          //  _this.updatepers();
          //   },
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.resetHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.resetPassword(_this.$route.query.visitorId);
        },
      });
    },
    async resetPassword(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await resetPassword(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res);

        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure") + " : " + res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
    async updateStaffInfo() {
      try {
        let formData = new FormData();
        console.log(this.formInline);
        let {
          visitorId,
          visitorName,
          visitorDueTime,
          id,
          fieldsMap,
          groupId,
          headPath,
        } = this.formInline;

        formData.append("visitorId", id);
        formData.append("groupId", groupId);
        formData.append("userType", 2);
        formData.append("name", visitorName);
        formData.append("deadLineTime", visitorDueTime);
        formData.append("phone", 19987562264);
        // if (headPath != this.oriheadPath) {
        //   formData.append("headPath", headPath);
        // }

        formData.append("threshold", 0.76);
        formData.append("identity", 123456789123456);

        formData.append("fields", JSON.stringify(fieldsMap));
        const res = await modifyUser(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else if (res.code == undefined) {
          this.$Message.error(res);
        } else {
          this.$Message.error(this.$t("common.saveFailure"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      } finally {
        this.formInline.picFile = null;
      }
    },
    async queryOneUserInfo(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await queryOneUserInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res);

        if (res.code == 1) {
          Object.assign(this.formInline, res.data);
        } else {
          this.$Message.error(res.message);
        }
      } catch (err) {
        this.$Message.error(err);
      }
    },
    async queryUser(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", this.$route.query.visitorId);
        const res = await queryUser(formData);
        console.log(res);
        if (res && res.code == 1) {
          let result = res.data;
          let { name, dueTime } = result.visitor;
          let { visitorFeaturePojoList } = result;

          this.formInline.headPath = result.visitor.headPath;
          this.oriheadPath = result.visitor.headPath;
          this.formInline.groupId = result.visitor.groupManId;
          //得到fileList

          this.fileList = result.visitorFeaturePojoList
            ? result.visitorFeaturePojoList.map((item) => {
                return {
                  url: `${process.env.VUE_APP_BASE_FEATURE_API}${item.picturePath}`,
                  id: item.id,
                };
              })
            : [];

          //end
          let fieldsMap = [];
          if (result.fieldsMap.length) {
            fieldsMap =
              result.fieldsMap.filter((item) => item.fieldType == 2) || {};
          }

          this.formInline.fieldsMap = fieldsMap;

          let acc = "";
          if (result.fieldsMap.length) {
            acc = result.fieldsMap.find((item) => item.fieldType == 3) || {};
          }
          Object.assign(this.formInline, {
            ...result.visitor,
            visitorName: name,
            visitorDueTime: dueTime,
            visitorAccount: acc.fieldValue || "",
            featureList: visitorFeaturePojoList
              ? visitorFeaturePojoList.map((item) => {
                  return {
                    ...item,
                    active: false,
                  };
                })
              : [],
          });
          //得到user有权限的设备
          this.checkedPers = result.permissions;
        } else {
          this.$Message.error(res.message);
        }
      } catch (err) {
        this.$Message.error(err);
      }
    },
    async queryRobotsInfo() {
      try {
        let formData = new FormData();

        // formData.append('page', this.currentPage)
        const res = await queryRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 1 && res.data) {
          res.data.map((item) => {
            // this.$set(this.robots, item.identifier, item.name); //得用set
            this.robotids.push(item.identifier);
          });
          this.robotsList = res.data;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async updatepers() {
      let macList = [];
      if (this.checkAll) {
        macList = this.robotids;
      } else {
        macList = this.checkedPers;
      }

      let id = [];
      id.push(this.$route.query.visitorId);

      // let formData = new FormData();
      // formData.append("personIdList",id);
      // formData.append("macList", macList);

      let pa = { personIdList: id, macList: macList, updType: 0 };

      try {
        const res = await addrobots(pa);
      } catch (error) {
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
  },
  mounted() {
    this.queryGroupInfoByType(2);
    this.queryUser(this.$route.query.visitorId);
    // this.queryRobotsInfo();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="less" >
.uploaddiv {
  height: 400px;
  overflow: auto;
}
.el-upload-list__item {
  transition: none !important;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.addGroup {
  display: inline-block;
  position: relative;
  height: 40px;
  width: 20px;
  vertical-align: middle;
}
.addGroup::after {
  content: "＋";
  width: 20px;
  height: 20px;
  background-color: #409eff;
  color: white;
  position: absolute;
  top: calc(50% - 10px);
  right: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  /* display: block;
  line-height: 20px;
  text-align: center; */
}
.container-visitor-edit {
  width: 600px;
  // height: 100%;
  font-size: 14px;
  color: #333;
  margin-left: calc(50% - 300px);
  // margin-top: 5%;//loading 上一层的高度？
  > .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .panel {
    height: calc(100% - 60px);
    overflow-y: auto;
    margin-top: 20px;
    .panel {
      min-width: 400px;
      max-width: 500px;
      height: 100%;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 10px;
        }
        &.upload {
          .content {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
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
            .avator {
              margin-right: 10px;
              position: relative;
              display: inline-block;
              img {
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 2px;
                object-fit: cover;
                &:hover {
                  cursor: pointer;
                }
                &.delete {
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  right: 0px;
                  top: 0px;
                  z-index: 999;
                }
              }
              p {
                &.invalid {
                  color: #f5b836;
                }
              }
            }
            .button {
              position: relative;
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              // margin-left: 20px;
              display: inline-block;
              &:hover {
                cursor: pointer;
                color: #000;
                border: 1px solid #ccc;
              }
              .btnText {
                height: 100%;
              }
              input {
                display: inline-block;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
                z-index: 999;
                position: absolute;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
        &.name,
        &.dueTime {
          input {
            display: inline-block;
            height: 42px;
            line-height: 42px;
            width: 100%;
            border-radius: 4px;
            background: none;
            outline: none;
            border: 1px solid #ccc;
            padding-left: 12px;
            &:focus {
              border: 1px solid #419aee;
            }
          }
        }
        &.account {
          .content {
            display: flex;
            .account {
              width: calc(100% - 130px);
              height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: left;
              line-height: 42px;
            }
            .button {
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              color: #ff5b5b;
              &:hover {
                cursor: pointer;
                border: 1px solid #ff5b5b;
              }
            }
          }
        }
        &.submit {
          .button {
            height: 42px;
            border-radius: 4px;
            font-size: 18px;
            letter-spacing: 5px;
            color: #fff;
            background: linear-gradient(90deg, #3172ff 0%, #419aee 100%);
            &:hover {
              cursor: pointer;
            }
            &.disable {
              background-color: #cccccc;
              cursor: not-allowed;
              pointer-events: none;
            }
          }
        }
      }
    }
  }
}
</style>