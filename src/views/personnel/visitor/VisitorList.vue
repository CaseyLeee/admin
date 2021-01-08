<template>
  <div class="container-visitor-list">
    <!-- <div class="header center">
      <div class="title">
        <div
          v-for="(item, index) in buttons"
          :class="['center' ,'pickers' ,  {active:currentIndex == index}]"
          :key="item.i18n"
          @click="handleIndexChange(index)"
        >{{$t(item.i18n)}}</div>
      </div>
    </div> -->
    <template v-if="currentIndex == 0 ">
      <div class="operate center">
        <div class="item">
        
          <!-- <div class="groups center" v-if="getAgencyType == 3">
            <span style="margin-right:20px;word-wrap:nowrap">{{$t("room.authorize.company")}}</span>
            <el-select
              v-model="companyId"
              filterable
              :clearable="true"
              :placeholder="$t('statistics.staff.selectCompany')"
              style="border:none"
              @visible-change="getCompanyList"
              @change="handleCompanyChange"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="margin:0px 20px;word-wrap:nowrap">{{$t('statistics.staff.status')}}</span>
            <el-select
              v-model="operateType"
              filterable
              :placeholder="$t('common.select')"
              style="border:none;margin-right:15px;"
              @change="handleTypeChange"
            >
              <el-option
                v-for="item in operates"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div> -->
          <!-- <div class="groups center" v-if="getAgencyType == 2">
            <span style="margin-right:20px;word-wrap:nowrap">{{$t('statistics.staff.group')}}</span>
            <el-select
              v-model="groupId"
              filterable
              :placeholder="$t('statistics.staff.selectGroup')"
              style="border:none"
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
            <span style="margin:0px 20px;word-wrap:nowrap">{{$t('statistics.staff.status')}}</span>

            <el-select
              v-model="operateType"
              filterable
              :placeholder="$t('common.select')"
              style="border:none;margin-right:15px;"
              @change="handleTypeChange"
            >
              <el-option
                v-for="item in operates"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div> -->
          <!-- <div class="groups center" style="display: flex;">
            <div
              v-for="(item, index) in timepickers"
              :class="['center' , 'pickers', {active:current_index == index}]"
              :key="item.label"
              @click="handleTimePickerChange(index)"
            >{{$t(item.label)}}</div>
          </div> -->
          <!-- <div class="groups center">
            <el-date-picker
              v-model="visitor_list_startTime"
           
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :placeholder="$t('excel.export.startTime')"
              :picker-options="pickerOptions2"
              @change="handleTimeChangeRegistered"
            ></el-date-picker>
            <span class="center" style="margin:0px 2px"></span>
            <el-date-picker
              v-model="visitor_list_endTime"
              :clearable="false"
            
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :placeholder="$t('excel.export.endTime')"
              :picker-options="pickerOptions3"
              @change="handleTimeChangeRegistered"
            ></el-date-picker>
          </div> -->
          <div class="groups center">
            <el-input
              :placeholder="$t('common.search')"
              v-model.trim="visitorName"
              class="input-with-select"
              @keydown.enter.native="search"
               size="mini"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"  size="mini"></el-button>
            </el-input>
          </div>

          <template v-if="operateType == 1">
            <div class="groups center">
              <span style="margin-right:20px">{{$t('personnel.visitor.export')}}</span>
              <el-select v-model="isPic" style="border:none"  size="mini">
                <el-option
                  v-for="item in downPicList"
                  :key="`${item.label}`"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
                 <el-button 
                  size="mini"
              type="primary"
              style="margin-left:10px"
              class="center"
              @click="handleExportVisitorList"
              :disabled="!tableData.length || exportListDisable"
              :title="exportListDisable ? (this.isPic === 1?this.$t('personnel.staff.maxlimit'):this.$t('personnel.staff.limit') ):''"
            >{{$t('common.export')}}</el-button>
            </div>
         
          </template>
            <el-button
            type="error"
            style="margin-right:10px"
            class="center"
            :disabled="disabled"
            @click="handleDeleteInbatch"
            size="mini"
          >{{$t('common.dltInbatch')}}</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          id="staffTable"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="visitorId"
          @selection-change="handleSelectionChange"
          @sort-change="changeSort"
          
        >
          <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="picturePath" :label="$t('personnel.staff.picture')" width="120">
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
          <el-table-column  sortable="custom"  prop="visitorName" :label="$t('personnel.staff.name')" width="160"></el-table-column>
          <el-table-column :label="$t('personnel.staff.group')" sortable="custom" v-if="getAgencyType == 2" prop="visitorGroupName">
            <template slot-scope="scope">{{formateGroup( scope.row.visitorGroupName )}}</template>
          </el-table-column>
          <el-table-column :label="$t('room.authorize.company')" v-if="getAgencyType == 3">
            <template slot-scope="scope">{{formateGroup( scope.row.visitorCompanyName )}}</template>
          </el-table-column>
          <el-table-column :label="$t('personnel.staff.$register')">
            <template slot-scope="scope">{{formateTime( scope.row.visitorCreateTime )}}</template>
          </el-table-column>
        
          <el-table-column  :label="$t('personnel.staff.deadLine')" prop="visitorDueTime">
            <template
              slot-scope="scope"
              show-overflow-tooltip
            >{{ formateTime( scope.row.visitorDueTime) }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t('common.operate')"
            width="160"
            v-if="operateType == 1"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                size="small"
              >{{$t('common.edit')}}</el-button>
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                size="small"
                style="color:#ff5b5b;"
              >{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="$t('common.operate')" v-if="operateType == 3">
            <template slot-scope="scope">
              <el-button
                @click="handleAgree(scope.row)"
                type="text"
                size="small"
              >{{$t('common.agree')}}</el-button>
              <el-button
                @click="handleReject(scope.row)"
                type="text"
                size="small"
                style="color:#ff5b5b;"
              >{{$t('common.reject')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </template>
    <template v-if="currentIndex == 1">
      <div class="operate center">
        <div class="item">
          <div class="groups center" v-if="getAgencyType == 3">
            <span style="margin-right:20px;word-wrap:nowrap">{{$t("room.authorize.company")}}</span>
            <el-select
              v-model="companyId"
              filterable
              :clearable="true"
              :placeholder="$t('statistics.staff.selectCompany')"
              style="border:none"
              @visible-change="getCompanyList"
              @change="handleCompanyChange"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="groups center" v-if="getAgencyType == 2">
            <span style="margin-right:20px;word-wrap:nowrap">{{$t("statistics.staff.group")}}</span>
            <el-select
              v-model="groupId"
              filterable
              :placeholder="$t('statistics.staff.selectGroup')"
              style="border:none"
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
            <el-date-picker
              v-model="startTime"
           
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :picker-options="pickerOptions"
              :placeholder="$t('excel.export.startTime')"
              @change="handleTimeChange"
            ></el-date-picker>
            <span class="center" style="margin:0px 5px">-</span>
            <el-date-picker
              v-model="endTime"
              :clearable="false"
            
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :picker-options="pickerOptions1"
              :placeholder="$t('excel.export.endTime')"
              @change="handleTimeChange"
            ></el-date-picker>
            <el-input
              :placeholder="$t('common.search')"
              v-model.trim="visitorRecordName"
              class="input-with-select"
              @keydown.enter.native="search"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <div class="groups center">
            <span style="margin-right:20px">{{$t('personnel.visitor.export')}}</span>
            <el-select v-model="isPicture" style="width:80px;height:28px;border:none">
              <el-option
                v-for="item in downPicList"
                :key="`${item.label}`"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
            <Button
              type="primary"
             
              class="center"
              @click="handleExportVisitorRecord"
              :disabled="!recordList.length || exportRecordDisable"
              :title="exportRecordDisable ? (this.isPicture === 1?this.$t('personnel.staff.maxlimit'):this.$t('personnel.staff.limit') ):''"
            >{{$t('common.export')}}</Button>
          </div>
        </div>
      </div>
      <div class="content" id="staff-list-record" ref="table">
        <el-table :data="recordList" tooltip-effect="dark" style="width: 100%">
          <el-table-column width="55"></el-table-column>
          <el-table-column :label="$t('personnel.staff.picture')" width="160">
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
          <el-table-column prop="visitorName" :label="$t('personnel.staff.name')">
            <template slot-scope="scope">
              <span>{{scope.row.visitorName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('personnel.staff.group')" v-if="getAgencyType == 2">
            <template slot-scope="scope">{{formateGroup( scope.row.groupName )}}</template>
          </el-table-column>
          <el-table-column :label="$t('room.authorize.company')" v-if="getAgencyType == 3">
            <template slot-scope="scope">{{formateGroup( scope.row.companyName )}}</template>
          </el-table-column>
          <el-table-column :label="$t('agency.list.name')">
            <template slot-scope="scope">
              <span>{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="robotName" :label="$t('personnel.stranger.list.robotName')">
            <template slot-scope="scope" show-overflow-tooltip>
              <span>{{scope.row.robotName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" :label="$t('personnel.stranger.list.time')" fixed="right">
            <template slot-scope="scope">
              <span>{{scope.row.time}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recordTotal"
        ></el-pagination>
      </div>
    </template>
    <template v-if="currentIndex == 2">
      <div class="panel">
        <Register :uesrType="uesrType"></Register>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Register from '@/components/RegisterInBatch'
import { getTodayDate, getWeekStartAndEnd, getMonthStartAndEnd } from '@/utils/tools'
import {
  queryVisitorInfo,
  queryVisitorRecord,
  queryGroupInfoByType,
  deleteVisitor,
  reportVisitor,
  reportVisitorRecord,
  updateVisitorNoticeInfo,
} from '@/api/personnel'
import { getCompanyList } from '@/api/room'

const LANG = 'IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE'

export default {
  name: 'staff-list',
  data() {
    return {
      prop:"",
      order:"",
      isPicture: 1,
      isPic: 1,
      downPicList: [
        {
          label: 'agency.add.yes',
          value: 0,
        },
        {
          label: 'agency.add.no',
          value: 1,
        },
      ],
      operateType: 1, // 1已同意；3未授权
      companyId: '',
      groupId: '',
      uesrType: '2',
      startTime: moment(new Date() - 30 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD 00:00:00'),
      endTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
      visitor_list_startTime: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
      visitor_list_endTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
      currentIndex: 0,
      current_index: 0,
      disabled: false,
      visitorName: '',
      visitorRecordName: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      recordTotal: 0,
      tableData: [],
      recordList: [],
      group: [],
      groupsList: [],
      companyList: [],
      operates: [
        {
          value: 1,
          label: 'statistics.visitor.approve',
        },
        {
          value: 3,
          label: 'statistics.visitor.pedding',
        },
      ],
      multipleSelection: [],
      buttons: [
        {
          i18n: 'personnel.visitor.list',
          router: '',
        },
        {
          i18n: 'personnel.staff.record',
          router: '',
        },
        {
          i18n: 'personnel.staff.register',
          router: '',
        },
        {
          i18n: "personnel.staff.registersingle",
          router: "",
        },
      ],
      timepickers: [
        {
          label: '今日',
          value: '1',
        },
        {
          label: '本周',
          value: '2',
        },
        {
          label: '本月',
          value: '3',
        },
      ],
    }
  },
  watch: {
    multipleSelection: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      },
    },
  },
  computed: {
    
    ...mapGetters(['getAgencyInfo', 'getAgencyType']),
    exportListDisable() {
      if (this.isPic === 1) {
        return this.total > 1000 ? true : false
      }
      return this.total > 1000 ? true : false
    },
    exportRecordDisable() {
      if (this.isPicture === 1) {
        return this.recordTotal > 1000 ? true : false
      } else {
        return this.recordTotal > 1000 ? true : false
      }
    },
    pickerOptions() {
      const endTimestamp = +new Date(this.endTime)
      return {
        disabledDate(startTime) {
          const timestamp = startTime.getTime()
          if (timestamp <= endTimestamp) {
            return false
          }
          return true
        },
      }
    },
    pickerOptions1() {
      const startTimestamp = +new Date(this.startTime)
      return {
        disabledDate(endTime) {
          const timestamp = endTime.getTime()
          if (timestamp > startTimestamp) {
            return false
          }
          return true
        },
      }
    },
    pickerOptions2() {
      const endTimestamp = +new Date(this.visitor_list_endTime)
      return {
        disabledDate(startTime) {
          const timestamp = startTime.getTime()
          if (timestamp <= endTimestamp) {
            return false
          }
          return true
        },
      }
    },
    pickerOptions3() {
      const startTimestamp = +new Date(this.visitor_list_startTime)
      return {
        disabledDate(endTime) {
          const timestamp = endTime.getTime()
          if (timestamp > startTimestamp) {
            return false
          }
          return true
        },
      }
    },
  },
  components: {
    Register,
  },
  methods: {
      //排序的方法	每次排序会触发
changeSort(val){
  
  console.log(val) 
  this.prop=val.prop
  this.order=val.order
  this.queryVisitorInfo(this.prop,this.order)
},
    checkSelectable(row) {
      // let { visitorPermitVisior } = row || {}
      // if (this.getAgencyType == 2) return true
      // if (this.getAgencyType == 3) {
      //   return visitorPermitVisior == 1 ? true : false
      // }
      return true
    },
    handleAgree(row) {
      let { visitorId, noticeId } = row
      let _this = this
      this.$toast({
        title: _this.$t('common.confirm'),
        content: `${_this.$t('room.authorize.agree')}?`,
        onOkText: _this.$t('common.confirm'),
        onConcelText: _this.$t('common.cancel'),
        onOk() {
          _this.updateVisitorNoticeInfo(noticeId, visitorId, 1)
        },
      })
    },
    handleReject(row) {
      console.log(row)
      let { visitorId, noticeId } = row
      let _this = this
      this.$toast({
        title: _this.$t('common.confirm'),
        content: `${_this.$t('room.authorize.reject')}?`,
        onOkText: _this.$t('common.confirm'),
        onConcelText: _this.$t('common.cancel'),
        onOk() {
          _this.updateVisitorNoticeInfo(noticeId, visitorId, 2)
        },
      })
    },
    handleTypeChange() {
      this.total = 0
      this.tableData = []
      this.currentPage = 1
      this.queryVisitorInfo()
    },
    handleExportVisitorList() {
      this.reportVisitor()
    },
    handleExportVisitorRecord() {
      this.reportVisitorRecord()
    },
    download(url, fileName) {
      let link = document.createElement('a')
      link.download = fileName
      link.href = `${process.env.VUE_APP_BASE_API}${url}`
      link.click()
    },
    handleTimeChange() {
      this.currentPage = 1
      this.queryVisitorRecord()
    },
    handleTimeChangeRegistered() {
      this.currentPage = 1
      this.queryVisitorInfo()
    },
    handleCompanyChange() {
      this.currentPage = 1
      if (this.currentIndex == 0) {
        this.queryVisitorInfo()
      }
      if (this.currentIndex == 1) {
        this.queryVisitorRecord()
      }
    },
    handleGroupChange() {
      this.currentPage = 1
      if (this.currentIndex == 0) {
        this.queryVisitorInfo()
      }
      if (this.currentIndex == 1) {
        this.queryVisitorRecord()
      }
    },
    handleTimePickerChange(index) {
      this.current_index = index
      this.currentPage = 1
      if (index === 0) {
        this.visitor_list_startTime = moment().format('YYYY-MM-DD 00:00:00')
        this.visitor_list_endTime = moment().format('YYYY-MM-DD 23:59:59')
      }
      if (index === 1) {
        let [startTime, endTime] = getWeekStartAndEnd()
        this.visitor_list_startTime = moment(new Date(startTime)).format('YYYY-MM-DD 00:00:00')
        this.visitor_list_endTime = moment(new Date(endTime)).format('YYYY-MM-DD 23:59:59')
      }
      if (index === 2) {
        let [startTime, endTime] = getMonthStartAndEnd()
        this.visitor_list_startTime = moment(new Date(startTime)).format('YYYY-MM-DD 00:00:00')
        this.visitor_list_endTime = moment(new Date(endTime)).format('YYYY-MM-DD 23:59:59')
      }
      this.queryVisitorInfo()
    },
    handleIndexChange(index) {
      this.tableData = []
      this.total = 0
      this.groupId = this.companyId = ''
      this.currentIndex = index
      this.currentPage = 1
      this.$router.push({
        query: {
          ...this.$route.query,
          currentIndex: index,
        },
      })
      if (index == 0) {
        this.queryVisitorInfo()
      }
      if (index == 1) {
        this.queryVisitorRecord()
      }
       if (index == 3) {
        //直接去单人注册的界面 20200826  DIF
        this.$router.push({
          path: "/main/visitor/add",
          query: {
            role: 2
          }
        });
      }
    },
    formateGroup(groupName) {
      return groupName && groupName.includes('默认') ? this.$t('common.default') : groupName
    },
    formateTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    getType(type) {
      console.log(type, '?')
      if (type == 1) {
        return this.$t('personnel.staff.in')
      }
      if (type == 2) {
        return this.$t('personnel.staff.out')
      }
      return '-'
    },
    getAvator(row) {
      let { visitorPicture, loadError, picture } = row || {}
      if (loadError || !(visitorPicture || picture)) {
        return require('@/assets/svg/stranger.svg')
      } else {
        return `${process.env.VUE_APP_BASE_API}${visitorPicture || picture}`
      }
    },
    preview(row) {
      let { visitorPicture, picture, loadError } = row || {}
      if (!loadError && (visitorPicture || picture)) {
        this.$previewImg({
          src: `${process.env.VUE_APP_BASE_API}${visitorPicture || picture}`,
          style: {
            width: 500,
            height: 400,
            objectFit: 'contain',
          },
        })
      }
    },
    handleLoadError(row) {
      row.loadError = true
      this.tableData = [...this.tableData]
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.$refs.table && (this.$refs.table.scrollTop = 0)
      this.$refs.multipleTableWrapper && (this.$refs.multipleTableWrapper.scrollTop = 0)
      if (this.currentIndex == 0) {
        this.queryVisitorInfo()
      }
      if (this.currentIndex == 1) {
        this.queryVisitorRecord()
      }
    },
    search() {
      this.currentPage = 1
      if (this.currentIndex == 0) {
        this.queryVisitorInfo()
      }
      if (this.currentIndex == 1) {
        this.queryVisitorRecord()
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    handleEdit(row) {
      console.log(row)
      let { visitorId, visitorName } = row
      this.$router.push({
        path: '/main/visitor/edit',
        query: {
          ...this.$route.query,
          visitorId,
          visitorName,
        },
      })
    },
    handleDelete(row) {
      console.log(row)
      let { visitorName, visitorId } = row
      let _this = this
      this.$toast({
        title: _this.$t('common.confirm'),
        content: `${_this.$t('common.delete')}${visitorName}?`,
        onOkText: _this.$t('common.confirm'),
        onConcelText: _this.$t('common.cancel'),
        onOk() {
          _this.deleteVisitor(visitorId)
        },
      })
    },
    handleDeleteInbatch() {
      let _this = this
      this.$toast({
        title: _this.$t('common.confirm'),
        content: `${_this.$t('personnel.stranger.list.delete')}?`,
        onOkText: _this.$t('common.confirm'),
        onConcelText: _this.$t('common.cancel'),
        onOk() {
          let visitorIdSet = []
          _this.multipleSelection.forEach(visitor => {
            visitorIdSet.push(visitor.visitorId)
          })
         
         
          if (_this.currentIndex == 0) {
          _this.deleteVisitor(visitorIdSet.toString())
          }

        
           
         
        },
      })
    },
    async getCompanyList(show) {
      if (!show) return
      let { propertyId } = this.getAgencyInfo || {}
      try {
        let formData = new FormData()
        formData.append('page', 1)
        formData.append('pageSize', 500)
        formData.append('propertyId', propertyId)
        const res = await getCompanyList(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          console.log(res)
          this.companyList = res.data.map(item => {
            if (item) {
              return {
                label: item.name,
                value: item.id,
                permit: item.permit,
              }
            }
          })
        } else {
          this.$Message.error(this.$t('common.searchError'))
          this.companyList = []
        }
      } catch (err) {
        console.log(err)
        this.$Message.error(this.$t('common.searchError'))
      }
    },
    async updateVisitorNoticeInfo(noticeId, visitorId, auth = 1) {
      try {
        let formData = new FormData()
        formData.append('noticeId', noticeId)
        formData.append('visitorId', visitorId)
        formData.append('auth', auth)
        const res = await updateVisitorNoticeInfo(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1) {
          console.log(res)
          this.$Message.success(this.$t('common.operateSuccess'))
          this.queryVisitorInfo()
        } else {
          this.$Message.error(res.msg)
        }
      } catch (err) {
        this.$Message.error(this.$t('common.operateError'))
      }
    },
    async reportVisitorRecord() {
      try {
        let formData = new FormData()
        let language = window.localStorage.getItem(LANG) || 'zh'
        formData.append('searchName', this.visitorRecordName)
        formData.append('groupId', this.groupId)
        formData.append('recordId', this.recordId || '')
        formData.append('startTime', this.startTime)
        formData.append('endTime', this.endTime)
        formData.append('companyId', this.companyId)
        formData.append('isPic', this.isPicture)
        formData.append('language', language)
        const res = await reportVisitorRecord(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          console.log(res)
          let { url } = res.data
          url && this.download(url, 'visitor-list-excel')
        } else {
          this.$Message.error(this.$t('common.searchError'))
        }
      } catch (err) {
        this.$Message.error(this.$t('common.searchError'))
      }
    },
    async reportVisitor() {
      try {
        let formData = new FormData()
        let language = window.localStorage.getItem(LANG) || 'zh'
        formData.append('searchName', this.visitorName)
        formData.append('groupId', this.groupId)
        formData.append('recordId', this.recordId || '')
        // formData.append('startTime', this.visitor_list_startTime)
        // formData.append('endTime', this.visitor_list_endTime)
        formData.append('operateType', this.operateType)
        formData.append('isPic', this.isPic)
        formData.append('companyId', this.companyId)
        formData.append('language', language)
        const res = await reportVisitor(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          let { url } = res.data
          url && this.download(url, 'visitorList')
        } else {
          this.$Message.error(this.$t('common.searchError'))
        }
      } catch (err) {
        let msg = this.$t('excel.export.exceed')
        this.$Message.error(msg)
      }
    },
    async deleteVisitor(visitorId) {
       
      try {
        let formData = new FormData()
        formData.append('visitorId', visitorId)
        const res = await deleteVisitor(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1) {
          console.log(res)
          this.$Message.success(this.$t('common.deleteSuccess'))
         let num=visitorId.split(',').length
         let page=Math.ceil((this.total-num)/this.pageSize)
         let pageori=Math.ceil((this.total)/this.pageSize)
        if(page!=pageori){
          this.currentPage= this.currentPage==1?1: this.currentPage-1
        }
         
       
          this.queryVisitorInfo()
        } else {
          this.$Message.error(this.$t('common.deleteFailure'))
        }
      } catch (err) {
        this.$Message.error(this.$t('common.deleteFailure'))
      }
    },
    async queryVisitorRecord() {
      try {
        let formData = new FormData()
        formData.append('companyId', this.companyId)
        formData.append('groupId', this.groupId)
        formData.append('searchName', this.visitorRecordName)
        formData.append('startTime', this.startTime)
        formData.append('endTime', this.endTime)
        formData.append('page', this.currentPage)
        const res = await queryVisitorRecord(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          console.log(res)
          this.recordList = res.data
          this.recordTotal = res.count
        } else {
          this.$Message.error(this.$t('common.searchError'))
          this.recordList = []
        }
      } catch (err) {
        console.log(err)
        this.$Message.error(this.$t('common.searchError'))
      }
    },
   
    async queryGroupInfoByType(show) {
      if (!show) return
      try {
        let formData = new FormData()
        if (this.getAgencyType == 2) {
          formData.append('groupType', '2')
        }
        const res = await queryGroupInfoByType(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          console.log(res)
          this.groupsList = res.data.map(item => {
            if (item) {
              return {
                value: item.id,
                label: item.name == '默认分组' ? 'common.default' : item.name,
              }
            }
          })
          this.groupsList.unshift({
            value: '',
            label: 'statistics.staff.all',
          })
        } else {
          this.$Message.error(this.$t('common.searchError'))
        }
      } catch (err) {
        this.$Message.error(this.$t('common.searchError'))
      }
    },
    async queryVisitorInfo(prop,order) {
      prop=this.prop
      order=this.order
      // console.log("this.prop",this.prop)
      //  console.log("this.order",this.order)
      try {
        let formData = new FormData()
         var orderitem=order!=="ascending"?"desc":"asc"
        if(prop==="visitorName"&&this.order!=null){
          formData.append('sortName', orderitem)
        }
        if(prop==="visitorGroupName"&&this.order!=null){
          formData.append('sortGroupName', orderitem)
        }
        formData.append('searchName', this.visitorName)
        formData.append('page', this.currentPage)
        formData.append('companyId', this.companyId)
        formData.append('groupId', this.groupId)
        formData.append('operateType', this.operateType)
        // formData.append('startTime', this.visitor_list_startTime)
        // formData.append('endTime', this.visitor_list_endTime)
        const res = await queryVisitorInfo(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.code == 1 && res.data) {
          console.log(res)
          this.tableData = res.data
          this.total = res.count
         console.log("1",this.total)
        } else {
          this.$Message.error(this.$t('common.searchError'))
          this.tableData = []
        }
      } catch (err) {
        this.$Message.error(this.$t('common.searchError'))
      }
    },
    init() {
      this.currentIndex = this.$route.query.currentIndex || 0
      if (this.currentIndex == 0) {
        this.queryVisitorInfo()
      }
      if (this.currentIndex == 1) {
        this.queryVisitorRecord()
      }
      
    },
  },
  mounted() {
    this.init()
    this.$ebus.$on('/main/visitor/list', () => {
      this.init()
    })
  },
  beforeDestroy() {
    this.$ebus.$off('/main/visitor/list')
  },
}
</script>

<style lang="less" scoped>
span {
  white-space: nowrap;
}
.picturePath {
  display: inline-block;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
div.pickers {
  width: auto;
  min-width: 48px;
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
.container-visitor-list {
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
      }
    }
    &.operate {
      justify-content: space-between;
      // height: 70px;
      .item {
        width: auto;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        flex-wrap: wrap;
        .time {
          display: flex;
        }
        > div {
          margin-top: 3px;
        }
        .groups {
          margin-right: 20px;
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