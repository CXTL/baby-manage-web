<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日收入: ￥{{homeReportData.incomeToday}}</div>
            <div class="total-title">昨日收入: ￥{{homeReportData.incomeYesterday}}</div>
            <div class="total-title">同比昨日:  {{homeReportData.rateIncome}}%</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日支出: ￥{{homeReportData.expenditureToday}}</div>
            <div class="total-title">昨日支出: ￥{{homeReportData.expenditureYesterday}}</div>
            <div class="total-title">同比昨日: {{homeReportData.rateExpenditure}}%</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">今日利润: ￥{{homeReportData.profitToday}}</div>
            <div class="total-title">昨日利润: ￥{{homeReportData.profitYesterday}}</div>
            <div class="total-title">同比昨日: {{homeReportData.rateProfit}}%</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日资产: ￥{{homeReportData.assetToday}}</div>
            <div class="total-title">昨日资产: ￥{{homeReportData.assetYesterday}}</div>
            <div class="total-title">同比昨日: +{{homeReportData.rateAsset}}%</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">科目新增</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理投资人</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">10月三号收房租</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">资产统计</div>
      <el-row>
        <el-col>
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
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
  </div>
</template>

<script>
  import {getFirstTimestamp, getLastTimestamp} from '@/utils/date';
  import img_home_order from '@/assets/img/home_order.png';
  import img_home_today_amount from '@/assets/img/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/img/home_yesterday_amount.png';
  import { fetchHomeReportData, fetchHomeChartReportData} from '@/api/home';

 const defaultListQuery ={
    accountCode: null,
    endTime:'',
    startTime: ''
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
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:false,
          axisSite: { right: ['totalAsset']},
        labelMap: {'totalIncome': '总收入', 'totalExpenditure': '总支出', 'totalAsset': '总资产' ,'totalProfit': '总利润'}},
        chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    created(){
      this.getHomeReportData();
      this.initOrderCountDate();
      this.getData();
    },
    methods:{
      handleDateChange(){
        this.getData();
      },
      initOrderCountDate(){
        let start = new Date();
        start.setFullYear(start.getFullYear());
        start.setMonth(start.getMonth());
        start.setDate(start.getDay());
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];
      },

      //获取表头数据
      getHomeReportData(){
        fetchHomeReportData(this.query).then(res => {
          this.homeReportData = res.data;
        });
      },

      getData(){
        setTimeout(() => {
          this.query.startTime = getFirstTimestamp(this.orderCountDate[0]);
          this.query.endTime = getLastTimestamp(this.orderCountDate[1]);
          fetchHomeChartReportData(this.query).then(res => {
            this.chartData = {
              columns: ['date', 'totalIncome','totalExpenditure','totalAsset','totalProfit'],
              rows: []
            };
            this.chartData.rows = res.data
          });

          this.dataEmpty = false;
          this.loading = false
        }, 500)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
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
</style>
