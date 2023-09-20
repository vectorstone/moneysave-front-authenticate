<template>
  <!--<div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button type="success" @click="initTestData" style="margin-left: 10px" round>click me,surprise!</el-button>
    <div id="monthCost" style="width: 1200px;height: 600px"></div>
    <div id="dayCost" style="width: 1200px;height: 600px;margin-left: 100px;margin-top: 5px"></div>
  </div>-->
  <div>
    <div style="margin-top: 10px">
      <!--<el-date-picker
        v-model="start"
        type="date"
        placeholder="Pick a start month"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM">
      </el-date-picker>
      -
      <el-date-picker
        v-model="end"
        type="date"
        placeholder="Pick a end month"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM">
      </el-date-picker>-->
      <div class="block" style="display: inline;margin-left: 10px">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="start"
          type="month"
          placeholder="Pick a start month" value-format="yyyy-MM">
        </el-date-picker>
      </div>
      -
      <div class="block" style="display: inline">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="end"
          type="month"
          placeholder="Pick a end month" value-format="yyyy-MM">
        </el-date-picker>
      </div>
      <el-button type="success" icon="el-icon-check" circle @click="fetchData" style="margin-left: 10px"></el-button>
      <el-button type="success" @click="initTestData" style="margin-left: 10px" round>click me,surprise!</el-button>
      <!--<el-button type="success" round>Success</el-button>-->
    </div>
    <div>
      <el-row style="margin-top: 20px">
        <el-col :span="12"></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-dialog
        title="Tips"
        :visible.sync="dialogVisibleCharts"
        width="93%" top="10px">
        <!--<span>This is a message</span>-->
        <span slot="footer" class="dialog-footer" >
          <div id="dayCost" style="width: 1200px;height: 600px;margin-left: 100px;margin-top: 5px" ></div>
          <!--style="width: 1000px;height: 600px"-->
          <!--<el-button @click="dialogVisibleCharts = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisibleCharts = false">Confirm</el-button>-->
        </span>
      </el-dialog>

      <div id="monthCost" style="width: 1200px;height: 600px"></div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api/system/accountBook'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      month: [],
      money: [],
      start: '',
      end: '',
      dialogVisibleCharts: false
    }
  },
  created(){
    this.setDateAndTime()
    // 这里面可以不用调用
    // this.initData('monthCost',this.loginDate,this.loginCounts,'Monthly Expense')
    // this.initData('registry',this.registDates,this.registCounts,'注册日活')
    // console.log(this)
    // this.initTestData()
  },
  methods:{
    //这个方法的效果是: 一进入图表展示的页面,就显示近半年来每个月的消费支出情况
    setDateAndTime(){
      //获取当前时间
      var nowdate = new Date();
      //获取当前时间的毫秒数
      var nowDateTime = nowdate.getTime();
      //半年时间毫秒数
      var halfYear = 365 / 2 * 24 * 3600 * 1000
      //获取基于此时半年前的时间毫秒数
      var halfYearTime = nowDateTime - halfYear
      //根据毫秒数转换成日期
      var halfYearDate = new Date(halfYearTime);
      //将当前的时间和半年前的时间转换为 2023-07这样的格式
      //当前时间
      let nowMonth = nowdate.getMonth()+''
      this.end = nowdate.getFullYear()+'-'+(nowMonth.length === 1 ? ('0' + nowMonth) : nowMonth) //为什么月份要加1
      //半年前时间
      let agoMonth = halfYearDate.getMonth()+''
      this.start = halfYearDate.getFullYear()+'-'+(agoMonth.length === 1 ? ('0' + agoMonth) : agoMonth) //为什么月份要加1
      // console.log(this.start)
      // console.log(this.end)
      //调用方法获取数据
      this.fetchData()
    },

    fetchData(){
      // console.log(this.start);
      // console.log(this.end);
      api.getMonthCost(this.start,this.end).then(res=>{
        this.month = res.data.items.month
        this.money = res.data.items.money
        // console.log(this.month)
        // console.log(this.money)
        this.initData('monthCost',this.month,this.money,'Monthly Expense')
        // this.initData('registry',this.registDates,this.registCounts,'注册日活')
      })
    }
    ,
    initData(elementId,xdata,ydata,title){
      //查找页面中的容器
      var chartDom = document.getElementById(elementId);
      //echarts绑定容器
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: title,
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: ydata,
            type: 'line',
            smooth: true
          }
        ]
      };
      //echarts使用上面的配置渲染
      option && myChart.setOption(option);
    },
    //这个是所有的数据的统计图
    initTestData(){
      this.dialogVisibleCharts = true
      var chartDom = document.getElementById('dayCost');
      var myChart = echarts.init(chartDom);
      var option;

      let base = +new Date(1968, 9, 3);
      let oneDay = 24 * 3600 * 1000;
      let date = [];
      // let data = [Math.random() * 300];
      let data = [];
      /* for (let i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      } */
      //查询获取数据
      api.getDayCost().then(res=>{
        date = res.data.items.day
        data = res.data.items.money

        console.log(date);
        console.log(data);
        option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: 'Daily Expense'
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10
            },
            {
              start: 0,
              end: 10
            }
          ],
          series: [
            {
              name: 'expense',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                  }
                ])
              },
              data: data
            }
          ]
        };

        option && myChart.setOption(option);


      })

    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .testDiagram {
    display: flex;
    align-items: center;
  }
}
</style>
