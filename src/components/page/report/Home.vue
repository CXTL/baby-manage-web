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
<!--        <el-col :span="4">-->
<!--          <div style="padding: 20px">-->
<!--            <div>-->
<!--              <div style="color: #909399;font-size: 14px">本月总资产</div>-->
<!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>-->
<!--              <div>-->
<!--                <span class="color-success" style="font-size: 14px">+10%</span>-->
<!--                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div style="margin-top: 20px;">-->
<!--              <div style="color: #909399;font-size: 14px">本周总资产</div>-->
<!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>-->
<!--              <div>-->
<!--                <span class="color-danger" style="font-size: 14px">-10%</span>-->
<!--                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div style="margin-top: 20px;">-->
<!--              <div style="color: #909399;font-size: 14px">本月总利润</div>-->
<!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>-->
<!--              <div>-->
<!--                <span class="color-success" style="font-size: 14px">+10%</span>-->
<!--                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div style="margin-top: 20px;">-->
<!--              <div style="color: #909399;font-size: 14px">本周总利润</div>-->
<!--              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>-->
<!--              <div>-->
<!--                <span class="color-danger" style="font-size: 14px">-10%</span>-->
<!--                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
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
  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/img/home_order.png';
  import img_home_today_amount from '@/assets/img/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/img/home_yesterday_amount.png';
  import { fetchHomeReportData} from '@/api/home';
  const DATA_FROM_BACKEND = {
    columns: ['date', 'test', 'orderCount','orderAmount'],
    rows: [
      {date: '2018-11-01',test:1, orderCount: 1055, orderAmount: 1093},
      {date: '2018-11-02',test:1233, orderCount: 206, orderAmount: 2230},
      {date: '2018-11-03',test:14, orderCount: 3377, orderAmount: 3623},
      {date: '2018-11-04',test:155, orderCount: 508, orderAmount: 6423},
      {date: '2018-11-05',test:661, orderCount: 890, orderAmount: 8492},
      {date: '2018-11-06',test:1, orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07',test:1, orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08',test:1, orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09',test:1, orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10',test:1, orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11',test:1, orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12',test:1, orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13',test:1, orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14',test:1, orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15',test:1, orderCount: 40, orderAmount: 4293}
    ]
  };

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
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['orderAmount']},
        labelMap: {'orderCount': '收入', 'orderAmount': '支出', 'test': '测试'}},
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
        start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);
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
          this.chartData = {
            columns: ['date', 'orderCount','orderAmount','test'],
            rows: []
          };
          for(let i=0;i<DATA_FROM_BACKEND.rows.length;i++){
            let item=DATA_FROM_BACKEND.rows[i];
            let currDate=str2Date(item.date);
            let start=this.orderCountDate[0];
            let end=this.orderCountDate[1];
            if(currDate.getTime()>=start.getTime()&&currDate.getTime()<=end.getTime()){
              this.chartData.rows.push(item);
            }
          }
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
