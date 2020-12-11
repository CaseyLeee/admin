<template>
  <div class="group">
    <el-button type="primary" @click="handleAdd()">新增</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="名称" min-width="10%">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" min-width="50%">
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.permissions.split(',')"
            :key="index"
          >
            <span v-if="item != ''">
              <el-tag type="info">{{ getRonm(item) }}</el-tag>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10%">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { querygroup, addgroup, deletegroup } from "@/api/group";
import { queryRobotsInfo } from "@/api/robots";
export default {
  data() {
    return {
      originid:"",
      tableData: [],
      robotsList: [],
      robotidnms: {},
    };
  },
  methods: {
    async queryList() {
      
      try {
        let formData = new FormData();
        formData.append("userType", "2");
        const res = await querygroup(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (res.code == 1) {
          this.tableData = res.data;
       
         let that=this
          //重新组织数组  permissions翻译
          //得到permissons对应的中文
          
           res.data.forEach(element => {
               
              if(element.name.indexOf("默认分组")>-1){
                      that.originid=element.id
                      console.log(that.originid)
                }
           });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (error) {
        this.$message(error);
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
            this.$set(this.robotidnms, item.identifier, item.name); //得用set
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

    handleEdit(index, row) {
     
      this.$router.push({
        name: "edit",
        path: "/main/group/edit",
        params: {
          row: row,
          robotsList: this.robotsList,
        },
      });
    },
    handleAdd() {
      //  this.$router.push({
      //      name:'add',
      //     path: "/main/group/edit",
      //     params: {
      //       operation:"add",
      //       robotsList:this.robotsList
      //     }
      //   });
      this.$prompt("请输入分组名称", "创建分组", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          let formData = new FormData();
          formData.append("name", value);
          formData.append("type", 2);
          formData.append("sort", 1);
         
          if (value === null||value.indexOf(" ")>-1) {
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
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
            this.queryList();
          } catch (error) {
            this.$Message.error(this.$t("common.saveFailure"));
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    async handleDelete(index, row) {
     var  that=this
      if(row.name==="默认分组"){
          this.$Message.error("默认分组不允许删除");
          return;
      }
      else{
           this.$confirm("你确定要删除分组吗？分组人员将会被分配到默认组", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let groupPojoList = [];

          let jsn = { groupId: row.id };
          groupPojoList.push(jsn);
alert(that.originid)
          let param = {
            toGroupId: that.originid,
            groupPojoList: groupPojoList,
            deleteType: 2,
          };
          try {
            const res = await deletegroup(param);
            if (res.code == 1) {
              this.$Message.success("删除成功");
              this.queryList();
            } else {
              this.$Message.error("删除失败");
            }
          } catch (error) {
            this.$Message.error(error);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      }
     
    },
  },
  created() {},
  mounted() {
    this.queryRobotsInfo();
    this.queryList();
  },
  computed: {
    getRonm() {
      return function (value) {
        return this.robotidnms[value] ? this.robotidnms[value] : value;
      };
    },
  },
};
</script>
<style scoped lang='less'>
/* @import url(); 引入css类 */
.el-table::before {
  height: 0px;
}
.group {
  height: calc(100vh - 70px);
}
.el-table {
  height: calc(100vh - 140px);
  overflow: auto;
}
.cell {
  > span {
    padding-left: 5px;
    padding-top: 5px;
    display: -webkit-inline-box;
  }
}
</style>