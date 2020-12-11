<template>
  <div class="edit">
    <div class="title">组名</div>
    <el-input v-model="input" placeholder="请输入组名"  :disabled="disable"></el-input>
    <div class="item permissions">
      <div class="title">设备权限</div>

      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedPers" @change="handleCheckedPerChange">
        <el-checkbox
          v-for="robot in robotsList"
          :label="robot.identifier"
          :key="robot.identifier"
        >{{robot.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button type="primary" @click="oper()">确认</el-button>
  </div>
</template>

<script>
import { editgroup,updateGroupMan } from "@/api/group";
export default {
  data() {
    return {
      input: "",
      checkAll: false,
      isIndeterminate: true,
      disable:false,
      checkedPers: [],
      robotsList: [],
      robotids: [],
    };
  },
  methods: {
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
    async oper() {
      var macList = [];
      if (this.checkAll) {
        macList = this.robotids;
      } else {
        macList = this.checkedPers;
      }

      //   let formData = new FormData();
      //   formData.append("groupIds",id);
      //   formData.append("macList", macList);
      let id = [];
      id.push(this.$route.params.row.id);
      let pa = { groupIds: id, macList: macList, updType: 1 };
      ///修改组名称
         let formData = new FormData();
          formData.append("id", this.$route.params.row.id);
            formData.append("name", this.input);
              formData.append("type", 2);
          formData.append("sort", 1);
         try {
            const res = await updateGroupMan(formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.code == 1||res.code == 3) {
              this.$message({
                type: "success",
                message: "修改分组名称成功",
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
        
          } catch (error) {
            this.$Message.error(error);
          }

      try {
        const res = await editgroup(pa);
         if (res.code == 1) {
         this.$message({
                type: "success",
                message: "修改分组权限成功",
              });
        } else {
         this.$message({
                type: "error",
                message: res.msg,
              });
        }
      } catch (error) {
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
  },
  created() {},
  mounted() {
    this.robotsList = this.$route.params.robotsList;//所有的機器info
    this.robotids = this.robotsList.map((item) => {//所有的機器id數組  為了配合全選按鈕
      return item.identifier;
    });

    this.input = this.$route.params.row.name;
     this.disable=this.$route.params.row.name==="默认分组"?true:false
  
  
//this.$route.params.row.permissions  11,11,11,
    this.checkedPers = this.$route.params.row.permissions//此分組所擁有的機器權限
      .split(",")
      .filter((item) => {
        if (item != "" && this.robotids.indexOf(item) != -1) {//除去空 和在robotsList不存在的 不然髒數據導致全選出問題 
          return item;
        }
      });  
    if (this.checkedPers.length == this.robotids.length) {
      this.checkAll = true;
      this.isIndeterminate = false;
    }
  },
};
</script>
<style scoped lang='less'>
/* @import url(); 引入css类 */
.title {
  font-size: 16px;
  margin: 20px 0px;
  font-weight: bold;
}
.el-input {
  width: 50%;
}
.edit {
  width: 50%;
  margin-left: 25%;
}
.el-button {
  margin-top: 40px;
}
.el-checkbox-group {
  font-size: 20px;
  width: 60%;
}
</style>