<template>
  <div class="container-robot-edit">
    <div class="panel center">
      <div class="panel">
        <div class="item">
          <el-form
            style="width: 100%"
            label-position="right"
            :model="formInline"
            :rules="rules"
            ref="addForm"
            class="demo-ruleForm"
          >
            <el-form-item :label="$t('robots.add.SN')" prop="identifier">
              <el-input
                v-model.trim="formInline.identifier"
                :placeholder="$t('robots.add.plzIptSN')"
                :disabled="disabledflag"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('robots.add.name')" prop="name">
              <el-input
                v-model.trim="formInline.name"
                :placeholder="$t('robots.add.plzIptName')"
                
              ></el-input>
            </el-form-item>

            <el-form-item :label="'备注(选填)'" prop="remarks">
              <el-input v-model.trim="formInline.robotRemark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="item submit center">
          <div class="button center" @click="updateRobotsInfo">
           修改
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateRobotsInfo, queryOneRobotsInfo } from "@/api/robots";

export default {
  name: "staff-edit",
  data() {
    return {
      formInline: {
        name:"",
        robotRemark:""
      },
      disabledflag: false,

      rules: null,
    };
  },
  computed: {},
  methods: {
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
    },
    async updateRobotsInfo() {
      try {
        let formData = new FormData();
         formData.append("name", this.formInline.name);
        formData.append("identifier", this.formInline.identifier);
        formData.append("robotRemark",  this.formInline.robotRemark);
         formData.append("robotId",  this.formInline.id);
        const res = await updateRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.code == 1) {
          this.$Message.success("修改机器成功");
        } else {
          this.$Message.error(res.msg);
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async queryOneRobotsInfo(robotId) {
      try {
        let formData = new FormData();
        formData.append("robotId", robotId);
        const res = await queryOneRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.code == 1) {
          Object.assign(this.formInline, res.data);
          this.disabledflag = true;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    },
  },
  mounted() {
    this.queryOneRobotsInfo(this.$route.query.robotId);
  },
  created() {
    this.initRules();
  },
};
</script>

<style lang="less" scoped>
.container-robot-edit {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  .header {
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
    padding: 20px 0;
    .panel {
      width: 400px;
      height: 100%;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 10px;
        }
        &.upload {
          .content {
            display: flex;
            .avator {
              width: 180px;
              height: 140px;
              border-radius: 2px;
              img {
                display: inline-block;
                width: 100%;
                height: 100%;
              }
            }
            .button {
              position: relative;
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              &:hover {
                cursor: pointer;
                color: #000;
                border: 1px solid #ccc;
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
              width: 100px;
              height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
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
        &.tags {
          .hint {
            margin-bottom: 12px;
            color: #999;
            font-size: 12px;
          }
          .content {
            width: 100%;
            margin-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            text-align: justify;
            &::after {
              content: " ";
              width: 30%;
            }
            .selectable {
              color: #333;
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              border: none;
              background-color: #ededed;
              height: 35px;
              padding: 10px;
              margin-bottom: 10px;
            }
            .selected {
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              margin-bottom: 10px;
            }
            .add {
              font-size: 18px;
            }
          }
        }
        &.submit {
          .button {
            width: 100%;
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