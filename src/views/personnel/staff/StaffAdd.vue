<template>
  <div
    class="app-container"
    style="width: 600px; margin-left: calc(50% - 280px)"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>

      <!-- <el-form-item label="自定义" prop="name">
        <div class="vip-base-info">
          <div class="item">
            <div class="title hobby center"></div>
            <el-form ref="ruleForm5" label-width="120px" class="demo-ruleForm">
              <template v-if="hobbyList.length">
                <el-form-item
                  v-for="(love, index) in hobbyList"
                  :label="love.label"
                  :key="`room-type-${index}`"
                >
                  <el-input
                    v-model.trim="love.value"
                    :clearable="true"
                    :disabled="!isEdit"
                    :autofocus="true"
                    placeholder="请输入值"
                    style="width: 200px"
                    maxlength="20"
                  ></el-input>
                  <span
                    class="minus"
                    v-if="isEdit"
                    @click="handleMinusFavorOrTaboo('favor', index)"
                    >-</span
                  >
                </el-form-item>
              </template>
              <template v-else>
                <div class="center nodata feature" v-if="!isEdit">无数据</div>
              </template>
              <template v-if="isEdit">
                <el-form-item>
                  <el-input
                    v-model.trim="form.hobbyListAdditon"
                    style="width: 150px; margin-left: -70px"
                    maxlength="10"
                    :clearable="true"
                    :disabled="!isEdit"
                    placeholder="请输入项目名称"
                    @keydown.enter.native="handleAddFavorOrTaboo('favor')"
                  ></el-input>
                  <span class="addItem" @click="handleAddFavorOrTaboo('favor')"
                    >+</span
                  >
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
      </el-form-item> -->

      <el-form-item label="分组" prop="groupId">
        <el-select v-model="form.groupId" placeholder="选择分组">
          <el-option
            v-for="item in groupsList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="addGroup" @click="addGroup()"></span>
      </el-form-item>
      <el-form-item label="有效期" prop="deadLineTime">
        <el-date-picker
          v-model="form.deadLineTime"
          type="datetime"
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
      <el-form-item label="上传头像" prop="file" ref="file">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="getFile"
          :auto-upload="false"
          
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="tips">照片要求正面近照，光线正常，曝光适度，脸部无遮挡，露出眉毛、额头、耳朵</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" style="width: 100%"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { userregsig, addgroup } from "@/api/group";
import { queryGroupInfoByType } from "@/api/personnel";
export default {
  data() {
    return {
      isEdit: true,
      hobbyList: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
        ],
        groupId: [
          {
            required: true,
            message: "请选择分组",
            trigger: "change",
          },
        ],
       file: [
          {
            required: true,
            validator:  (rule, value, callback)=>{
              if(  this.form.headPath ===""){
                  callback(new Error("请上传图片"));
              }
              else{
                  callback()
               }
            },
            trigger: "change",
          },
        ],
        deadLineTime: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "blur",
          }
        ]
      
      },
      radio: 0,
      form: {
        name: "",
        groupId: "",
        deadLineTime: "",
        headPath: "",
        registerType: "1",
        userType: 0,
        code: "",
      },
      groupsList: [],
      imageUrl: "",
      role: 1,
    };
  },
  mounted() {
    // const { role } = { ...this.$route.query };
    const { picurl } = { ...this.$route.query };
    if (picurl != null) {
      //loading
      //  this.imageUrl= `${process.env.VUE_APP_BASE_API}${picurl}`
      //  this.form.headPath= this.toBase64(this.imageUrl) //网络图片转base64 跨域问题？
      //
    }
    this.role = 2;
    this.queryGroupInfoByType(this.role);
  },
  methods: {
   
    fill_FieldsMap_Hobby_And_Taboo() {
      let hobbyObj = {};
      let hobbyList = [];
      console.log("this.hobbyList");
      console.log(this.hobbyList);
      hobbyList = this.hobbyList
        .reduce((cur, next) => {
          hobbyObj[next.label]
            ? ""
            : (hobbyObj[next.label] = true && cur.push(next));
          return cur;
        }, [])
        .map((item) => {
          if (item) {
            return {
              fieldName: item.label,
              fieldType: 9,
              fieldValue: item.value,
              fieldId: 999,
            };
          }
        });

      this.form.fields = JSON.stringify(hobbyList);
    },

    handleMinusFavorOrTaboo(type, index) {
      if (type == "favor") {
        this.hobbyList.splice(index, 1);
      }
    },
    handleAddFavorOrTaboo(type) {
      let { hobbyListAdditon } = this.form;
      if (type == "favor") {
        if (hobbyListAdditon) {
          this.hobbyList.push({
            label: hobbyListAdditon,
            value: "",
          });
          this.form.hobbyListAdditon = "";
        }
      }
    },
    changeradio(value) {
      if (value === 1) {
        this.form.deadLineTime = moment()
          .subtract(-500, "years")
          .format("YYYY-MM-DD hh:mm:ss");
      }
      if (value === 2) {
        this.form.deadLineTime = moment()
          .subtract(-1, "years")
          .format("YYYY-MM-DD hh:mm:ss");
      }
      if (value === 3) {
        this.form.deadLineTime = moment()
          .subtract(-6, "months")
          .format("YYYY-MM-DD hh:mm:ss");
      }
    },

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
                message: "新增分组成功",
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
    handleAvatarSuccess(res, file) {},
    async queryGroupInfoByType(role) {
      try {
        let formData = new FormData();
        if (role == 1) {
          //查员工分组
          formData.append("groupType", "1");
          this.form.userType = 1;
        }
        if (role == 2) {
          //查访客分组
          formData.append("groupType", "2");
          this.form.userType = 2;
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
    getFile(file, fileList) {
     console.log(file.raw.type)
      if ((file.raw.type.indexOf("png")<0)&&(file.raw.type.indexOf("jpg")<0)&&(file.raw.type.indexOf("jpeg")<0)) {
      
        this.$Message.error("请上传png/jpg/jpeg格式图片");
       
        return false;
      }
    this.imageUrl = URL.createObjectURL(file.raw);


      let reader = new FileReader();
      let imgResult = "";
      reader.readAsDataURL(file.raw);
      reader.onload = function () {
        imgResult = reader.result;
      };
      reader.onerror = function (error) {};
      reader.onloadend = () => {
      
        this.form.headPath = imgResult.split(",")[1]; //注意this指向
        this.$refs.file.clearValidate()
      };
    },
    toBase64(url) {
      // 一定要设置为let，不然图片不显示
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = 100;
      canvas.height = 100;
      let img = new Image();
      //设置图片跨域访问
      img.crossOrigin = "anonymous";
      //加时间戳解决跨域问题
      img.src = url + "?timeStamp=" + new Date();

      img.onload = function () {
        ctx.drawImage(this, 0, 0, 100, 100);
        let base64 = canvas.toDataURL("image/jpg", 1);
        alert(base64);
      };
    },
    async onSubmit(formName) {
       this.$refs[formName].validate(async (valid) => {
      
          if (valid) {
            
                try {
       
        let array = [];
        let json = {
          fieldName: "code",
          fieldType: 9,
          fieldValue: this.form.code,
          fieldId: 999,
        };
        array.push(json);
        this.form.fields = JSON.stringify(array);
     
    
        console.log(this.form)
        const res = await userregsig(this.form);

        if (res.code == 1) {
          this.$message("注册成功!");
          if (this.role == 1) {
            this.$router.push({
              path: "/main/staff/list",
            });
          } else {
            this.$router.push({
              path: "/main/visitor/list",
            });
          }
        } else {
          if (res.message == "Image is empty" && res.message == "图片为空") {
            this.$message("注册失败(图片)!");
          } else if (res.message.length > 0) {
            this.$message(res.message);
          } else {
            this.$message("注册失败");
          }
        }
      } catch (error) {
        this.$message(error);
      }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
    
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
  },
};
</script>

<style scoped lang="less">
.tips{
     font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #fd4a04;
    white-space: nowrap;
}
.vip-base-info {
  display: flex;
  flex-wrap: nowrap;
  > .item {
    width: 400px;
  }
}

span {
  &.minus,
  &.addItem {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ffd2d4;
    color: #ff1d1d;
    text-align: center;
    line-height: 20px;
    margin-left: 12px;
    font-weight: bold;
    &:hover {
      cursor: pointer;
      background-color: #e0868a;
    }
  }
  &.addItem {
    background-color: #c8d9ff;
    color: #1869ff;
    &:hover {
      background-color: #89a7ea;
    }
  }
}
.line {
  text-align: center;
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
.avatar-uploader .el-upload {
  /*选择器 不起作用  */
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

