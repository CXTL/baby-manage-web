<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button
                style="float:right"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch()"
                size="small">
          搜索
        </el-button>
        <el-button
                style="float:right;margin-right: 15px"
                @click="handleResetSearch()"
                size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <!--                    <el-form-item label="帐套名称：">-->
          <!--                        <el-input v-model="query.accountCode" class="input-width" placeholder="帐套名称"></el-input>-->
          <!--                    </el-form-item>-->

          <el-form-item label="帐套名称：">
            <el-select v-model="query.accountCode" placeholder="全部" clearable class="input-width">
              <el-option
                      v-for="item in accountData"
                      :key="item.id"
                      :label="item.accountName"
                      :value="item.accountCode">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间：" >
            <el-date-picker
                    style="float: right;z-index: 1"
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
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日收入: ￥{{homeReportData.incomeToday}}</div>
            <div class="total-title">昨日收入: ￥{{homeReportData.incomeYesterday}}</div>
            <div class="total-title">同比昨日:  {{homeReportData.rateIncome}}%</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日支出: ￥{{homeReportData.expenditureToday}}</div>
            <div class="total-title">昨日支出: ￥{{homeReportData.expenditureYesterday}}</div>
            <div class="total-title">同比昨日: {{homeReportData.rateExpenditure}}%</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">今日资产: ￥{{homeReportData.assetToday}}</div>
            <div class="total-title">昨日资产: ￥{{homeReportData.assetYesterday}}</div>
            <div class="total-title">同比昨日: +{{homeReportData.rateAsset}}%</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">资产统计</div>
      <el-row>
        <el-col>
          <div style="padding: 10px;border-left:1px solid #DCDFE6">

            <div>
              <ve-line
                      height="700px"
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
  import { fetchHomeReportData, fetchHomeChartReportData} from '@/api/report/home';
  import {listAccountData } from '@/api/index';
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

    // profitToday:0,
    // profitYesterday:0,
    // rateProfit:0,


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
        accountData:[],
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
        queryDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:false,
          axisSite: { right: ['totalAsset']},
        labelMap: {'totalIncome': '总收入', 'totalExpenditure': '总支出', 'totalAsset': '总资产'}},
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
      this.initOrderCountDate();
      this.getHomeReportData();
      this.getData();
      this.getAccountData();
    },
    methods:{
      // 获取帐套列表
      getAccountData() {
        listAccountData().then(res=>{
          this.accountData = res.data
        })
      },
      // 触发搜索按钮
      handleSearch() {
        this.$set(this.query, 'page', 1);
        this.getData();
      },
      handleResetSearch() {
        this.query = Object.assign({}, defaultListQuery);
      },
      handleDateChange(){
        this.getData();
      },
      initOrderCountDate(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.queryDate=[start,end];
        console.log(this.queryDate)
      },

      //获取表头数据
      getHomeReportData(){
        fetchHomeReportData(this.query).then(res => {
          this.homeReportData = res.data;
        });
      },

      getData(){
        setTimeout(() => {
          this.query.startTime = getFirstTimestamp(this.queryDate[0]);
          this.query.endTime = getLastTimestamp(this.queryDate[1]);
          fetchHomeChartReportData(this.query).then(res => {
            this.chartData = {
              columns: ['date', 'totalIncome','totalExpenditure','totalAsset'],
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
  .chart_layout{
    height: 1000px;
  }
</style>
