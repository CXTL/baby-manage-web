<template>
  <div class="app-container">
    <div class="statistics-layout">
      <div class="layout-title">收支统计</div>
      <el-row>
        <el-col>
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
                    style="float: left;z-index: 1"
                    size="small"
                    v-model="queryDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDateChange"
                    :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                      :data="chartData"
                      :legend-visible="false"
                      :loading="loading"
                      :data-empty="dataEmpty"
                      :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>



    <div class="statistics-layout">
      <div class="layout-title">收支详情 <el-button
              type="primary"
              icon="el-icon-download"
              class="handle-del mr10"
              @click="exceldownload"
      >导出</el-button></div>

      <el-table
              :data="tableData"
              border
              class="table"
              header-cell-class-name="table-header"
      >

        <el-table-column prop="assetDate" label="收支日期" align="center"></el-table-column>
        <el-table-column prop="totalIncome" label="总收入"  align="center"></el-table-column>
        <el-table-column prop="totalExpenditure"  label="总支出" align="center"></el-table-column>

      </el-table>


      <div class="pagination">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                layout="total, sizes,prev, pager, next,jumper"
                :current-page="query.page"
                :page-size="query.size"
                :page-sizes="[5,10,15]"
                :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getFirstTimestamp, getLastTimestamp} from '@/utils/date';

  import {  fetchInOutChartReportData, fetchInOutAssetData} from '@/api/report/inOutAsset.js';
  import { exportAsset} from '@/api/report/assetReport';

  const defaultListQuery ={
    accountCode: null,
    endTime:'',
    startTime: '',
    page: 1,
    size: 10
  };

  const homeReportData ={
    incomeToday:0,
    incomeYesterday:0,
    rateIncome:0,

    expenditureToday:0,
    expenditureYesterday:0,
    rateExpenditure:0,

    profitToday:0,
    profitYesterday:0,
    rateProfit:0,


    assetToday:0,
    assetYesterday:0,
    rateAsset:0
  }

  export default {
    name: 'home',
    data() {
      return {

        homeReportData: Object.assign({}, homeReportData),
        query: Object.assign({},defaultListQuery),

        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(start.getFullYear());
              start.setMonth(start.getMonth());
              start.setDate(start.getDay());
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(start.getFullYear());
              start.setMonth(start.getMonth());
              start.setDate(start.getDay());
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        total: 0,
        queryDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:false,
          axisSite: { right: ['totalAsset']},
          labelMap: {'totalIncome': '总收入', 'totalExpenditure': '总支出'}},
        chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        tableData:[],
        dataEmpty: false,
        idx: -1,
        id: -1
      }
    },

    methods:{
      handleDateChange(){
        this.getAssetChartData();
      },
      initOrderCountDate(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.queryDate=[start,end];
        console.log(this.queryDate)
      },

      //获取列表详情数据
      getHomeReportData(){
        this.listLoading=true;
        this.query.startTime = getFirstTimestamp(this.queryDate[0]);
        this.query.endTime = getLastTimestamp(this.queryDate[1]);
        fetchInOutAssetData(this.query).then(res => {
          this.listLoading=false;
          this.tableData = res.data.list;
          this.total = res.data.total || 50;
        });
      },
      // 分页导航
      handlePageChange(val) {
        this.query.page = val;
        this.getHomeReportData();
      },
      // 分页导航
      handleSizeChange(val) {
        this.query.page = 1;
        this.query.size = val;
        this.getHomeReportData();
      },
      //获取报表数据
      getAssetChartData(){
        setTimeout(() => {
          this.query.startTime = getFirstTimestamp(this.queryDate[0]);
          this.query.endTime = getLastTimestamp(this.queryDate[1]);
          fetchInOutChartReportData(this.query).then(res => {
            this.chartData = {
              columns: ['date', 'totalIncome','totalExpenditure'],
              rows: []
            };
            this.chartData.rows = res.data
          });

          this.dataEmpty = false;
          this.loading = false
        }, 500)
      },
      exceldownload() {
        // api格式的统一请求配置，本文最后会展示，根据实际情况修改，可以改成axios请求，下面的内容基本不需要修改
        exportAsset(this.query).then(res => {
          //将文件流转成blob形式
          console.log(1)
          const blob = res //new Blob([res],{type: 'application/vnd.ms-excel'});
          console.log(blob)
          let filename ='asset.xls';
          //创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const elink = document.createElement('a');
          elink.download = filename;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }).catch(error => {
          console.log(error)
        })
      },
    },
    created(){
      this.initOrderCountDate();
      this.getHomeReportData();
      this.getAssetChartData();
    },
  }
</script>

<style scoped>
  .app-container {
    margin-top: 20px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 50px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
  .chart_layout{
    height: 1000px;
  }
</style>
