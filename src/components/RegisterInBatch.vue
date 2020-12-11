<template>
  <div class="container-register-in-batch">
    <div class="top">
      <div class="hints">
      

        <div style="margin-bottom: 10px;">
          <span class="title_bla">1.照片要求</span
          ><span class="title_ora"
            >正面近照，光线正常，曝光适度，脸部无遮挡，露出眉毛、额头、耳朵</span
          >
        </div>
        <div style="margin-bottom: 10px;">
          <span class="title_bla">2.扩展字段填写说明：</span
          ><span class="title_ora">不支持特殊符号录入（支持符号_,-,）</span>
        </div>
        <p class="center">
          <img :src="requireIcon" alt />
        </p>
          <button
          data-v-6e93d28c=""
          type="button"
          class="el-button el-button--primary"
          style="background-color: rgb(49, 115, 236)"
          @click="download"
        >
          <i class="el-icon-download"></i><span> 下载模板</span>
        </button>
      </div>
      <div class="upload center">
        <el-upload
          class="upload-demo"
          drag
          accept="application/*"
          :limit="1"
          :action="uploadUrl"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :on-error="onError"
          :on-success="onSuccess"
          :file-list="fileList"
          ref="upload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("personnel.register.drag") }}
            <em>{{ $t("personnel.register.click") }}</em>
          </div>
          <div class="el-upload__tip center" slot="tip">
            {{ $t("personnel.register.hint") }}
          </div>
        </el-upload>
        <div class="submit center">
          <el-button
            @click="handleSubmit"
            type="primary"
            size="small"
            style="
              width: 50%;
              border-radius: 0px;
              font-size: 16px;
              background: linear-gradient(90deg, #3172ff 0%, #419aee 100%);
            "
            >{{ $t("common.submit") }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="feedback">
        <div class="failed">
          <div class="title center">
            {{ $t("personnel.register.faildTitle") }}
          </div>
          <el-table
            :data="failedList"
            style="width: 100%; height: 100%; overflow-y: auto"
          >
            <el-table-column
              type="index"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="name"
              :label="$t('personnel.register.name')"
            ></el-table-column>
            <el-table-column
              prop="rowName"
              :label="$t('personnel.register.location')"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="msg"
              :label="$t('personnel.register.msg')"
              width="400"
            ></el-table-column>
          </el-table>
        </div>
        <div class="success">
          <div class="title center">
            {{ $t("personnel.register.successTitle") }}
          </div>
          <el-table
            :data="successList"
            style="width: 100%; height: 100%; overflow-y: auto"
          >
            <el-table-column
              type="index"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="name"
              :label="$t('personnel.register.name')"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="msg"
              :label="$t('personnel.register.notice')"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  registerStaffInBatchByCompany,
  registerVisitorInBatchByCompany,
  registerStaffInBatchByProperty,
  registerVisitorInBatchByProperty,
  registerSchedule,
} from "@/api/personnel";

const LOOP_TIME = 1000;
export default {
  name: "RegisterInBatch",
  data() {
    return {
      fileObject: null,
      timer: null,
      fileUrl: "",
      fileList: [],
      failedList: [],
      successList: [],
    };
  },
  props: {
    uesrType: {
      type: String | Number,
      require: true,
    },
  },
  computed: {
    ...mapGetters(["getAgencyInfo"]),
    requireIcon() {
      return require("@/assets/img/template.png");
    },
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/compress/upload`;
    },
  },
  methods: {
    getAgencyType() {
      let { agencyType } = this.getAgencyInfo || {}; //公司 2  | 物业 3
      return agencyType == 3 ? 3 : 2;
    },
    download() {
      let a = document.createElement("a");
      if (this.uesrType == 1 && this.getAgencyType() == 2) {
        a.download = "cstaff.zip";
        a.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/asset/batch/staff/company`;
      }
      if (this.uesrType == 2 && this.getAgencyType() == 2) {
        a.download = "cvisitor.zip";
        a.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/asset/batch/visitor/company`;
      }
      if (this.uesrType == 1 && this.getAgencyType() == 3) {
        a.download = "staff.zip";
        a.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/asset/batch/staff`;
      }
      if (this.uesrType == 2 && this.getAgencyType() == 3) {
        a.download = "visitor.zip";
        a.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/asset/batch/visitor`;
      }
      if (this.uesrType == 5) {
        a.download = "company.zip";
        a.href = `${process.env.VUE_APP_BASE_UPLOAD_API}/app/2.1.0/asset/batch/company`;
      }
      a.click();
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSubmit() {
    
      if (!this.fileUrl) {
        this.$Message.error(this.$t("personnel.register.plzSelectZip"));
        return;
      }
      try {
        if (this.uesrType == 1 && this.getAgencyType() == 2) {
          this.registerStaffInBatchByCompany(this.fileUrl);
        }
        if (this.uesrType == 2 && this.getAgencyType() == 2) {
          this.registerVisitorInBatchByCompany(this.fileUrl);
        }
        if (this.uesrType == 1 && this.getAgencyType() == 3) {
          this.registerStaffInBatchByProperty(this.fileUrl);
        }
        if (this.uesrType == 2 && this.getAgencyType() == 3) {
          this.registerVisitorInBatchByProperty(this.fileUrl);
        }
      } catch (err) {
      } finally {
        this.$refs.upload.clearFiles();
        this.fileUrl = null;
      }
    },
    getRegisterSchedule(batchId, batchNum) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.registerSchedule(batchId, batchNum);
      }, LOOP_TIME);
    },
    async registerStaffInBatchByCompany(url) {
      if (!this.getAgencyInfo) return;
      try {
        let { agencyId } = this.getAgencyInfo;
        const res = await registerStaffInBatchByCompany({
          companyId: agencyId,
          url,
        });
        if (res && res.code == 1) {
          let { batchId, batchNum } = res.data;
          if (batchNum == 0) {
            this.$Message.error(this.$t("personnel.register.registerError"));
            return false;
          } else {
            this.getRegisterSchedule(batchId, batchNum);
          }
        } else {
          this.$Message.error(this.$t("common.templateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("personnel.register.registerError"));
      }
    },
    async registerVisitorInBatchByCompany(url) {
    
      if (!this.getAgencyInfo) return;
      try {
        let { agencyId } = this.getAgencyInfo;
        const res = await registerVisitorInBatchByCompany({
          companyId: agencyId,
          url,
        });
        if (res && res.code == 1) {
          let { batchId, batchNum } = res.data;
          if (batchNum == 0) {
            this.$Message.error(this.$t("personnel.register.registerError"));
            return false;
          } else {
             
            this.getRegisterSchedule(batchId, batchNum);
          }
        } else {
          this.$Message.error(this.$t("common.templateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("personnel.register.registerError"));
      }
    },
    async registerStaffInBatchByProperty(url) {
      if (!this.getAgencyInfo) return;
      try {
        let { agencyId } = this.getAgencyInfo;
        const res = await registerStaffInBatchByProperty({
          propertyId: agencyId,
          url,
        });
        if (res && res.code == 1) {
          let { batchId, batchNum } = res.data;
          if (batchNum == 0) {
            this.$Message.error(this.$t("personnel.register.registerError"));
            return false;
          } else {
            this.getRegisterSchedule(batchId, batchNum);
          }
        } else {
          this.$Message.error(this.$t("common.templateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("personnel.register.registerError"));
      }
    },
    async registerVisitorInBatchByProperty(url) {
      if (!this.getAgencyInfo) return;
      try {
        let { agencyId } = this.getAgencyInfo;
        const res = await registerVisitorInBatchByProperty({
          propertyId: agencyId,
          url,
        });
        if (res && res.code == 1) {
          let { batchId, batchNum } = res.data;
          if (batchNum == 0) {
            this.$Message.error(this.$t("personnel.register.registerError"));
            return false;
          } else {
            this.getRegisterSchedule(batchId, batchNum);
          }
        } else {
          this.$Message.error(this.$t("common.templateError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("personnel.register.registerError"));
      }
    },
    async registerSchedule(batchId, batchNum) {
      try {
        const res = await registerSchedule({
          batchId,
          batchNum,
        });
        if (res && res.code == 1 && res.data) {
          let { succeeNum, failNum, failList, succeeList } = res.data;
          this.failedList = failList;
          this.successList = succeeList;
          if (succeeNum + failNum == batchNum) {
            this.timer && clearInterval(this.timer);
          }
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("personnel.register.regBatchError"));
      }
    },
    beforeUpload(files) {
      this.fileUrl = "";
      this.failedList = this.successList = [];
      let { type, size, name } = files;
      this.fileObject = files;
      let maxSize = 1024 * 1024 * 200; //最大200M;
      if (size > maxSize) {
        this.$Message.error("文件大小不能超过200M!");
        return false;
      }
      console.log(size);
      let zipSets = ["application/x-zip-compressed", "application/zip"];
      if (!zipSets.includes(type)) {
        this.$Message.error(this.$t("personnel.register.plzSelectZip"));
        return false;
      }
      return true;
    },
    onError() {
      this.fileUrl = "";
      this.$Message.error(this.$t("personnel.register.registerError"));
      this.$refs.upload.clearFiles();
      this.fileObject = null;
    },
    onProgress(response, file, fileList) {
      console.log(response, file, fileList);
    },
    onSuccess(res) {
      if (res.code == 1) {
        this.fileUrl = res.data.url;
      }
    },
    onExceed() {
      this.$Message.error(this.$t("personnel.register.exceed"));
    },
  },
};
</script>

<style scoped lang='less'>
.title_bla {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #363739;
}
.title_ora {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #fd4a04;
}
.container-register-in-batch {
  width: 100%;
  height: 100%;
  font-size: 14px;
  > div {
    &.top {
      height: 60%;
      display: flex;
      > div {
        width: 50%;
        height: 100%;
        &.hints {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 15px;
          padding-left: 0px;
          .download {
            width: 80px;
            height: 28px;
            background: #0084ca;
            color: #fff;
            padding: 0px 10px;
            &:hover {
              cursor: pointer;
            }
          }
          .title {
            font-size: 16px;
            color: #000;
            font-weight: bold;
          }
          p {
            width: 100%;
            margin: 10px 0;
            img {
              display: inline-block;
              width: 300px;
              height: 200px;
            }
          }
        }
        &.upload {
          flex-wrap: wrap;
          padding: 50px 0px;
          .submit {
            width: 100%;
            margin-top: 20px;
          }
        }
      }
    }
    &.bottom {
      height: 40%;
      padding: 20px 0;
      > .feedback {
        width: 100%;
        height: 100%;
        display: flex;
        > div {
          width: 50%;
          height: 100%;
          padding: 15px;
          .title {
            height: 28px;
            font-size: 16px;
            color: #000;
            font-weight: bold;
          }
          &.failed {
            border-right: 1px solid #333;
          }
          &.success {
          }
        }
      }
    }
  }
}
</style>