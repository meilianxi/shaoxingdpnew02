<template>
  <div class="forecast-chart">
    <table class="summarization" cellspacing="0" cellpadding="0" border="0">
          <tr>
        <td width="20%">
          <div class="dot">...</div>
        </td>
        <td width="30%">{{sunshiwater}}</td>
        <td class="text-gray">当前瞬时进水量(m³/h)</td>
      </tr>
      <tr>
        <td width="20%">
          <div class="dot">...</div>
        </td>
        <td width="30%">{{leijiwater}}</td>
        <td class="text-gray">今日累计进水量(m³)</td>
      </tr>
      <!-- <tr v-for="item in forecastData.summarization" :key="item.name">
        <td width="20%">	
          <div class="dot">...</div>
        </td>
        <td width="30%">{{item.value}}</td>
        <td class="text-gray">{{item.name}}({{item.unit}})</td>
      </tr> -->
    </table>
    <div ref="chart" class="chart"></div>
  </div>
</template>
<script>
import flowdata from "@/assets/js/flowdata.js";
const EChart = require("echarts");
export default {
  props: {
    forecastData: Object
  },
  data() {
    return {
      ylinedata: [],
      xdata: [],
      barbaldata: [],
      run: null,
      sunshiwater: "",
      leijiwater: 0,
      leijiwater2: 0,
      index: 0,
      flowdsq2:null
    };
  },
  mounted() {
    var that = this;
    that.sunshiwater = (Math.random() * 1000 + 8200).toFixed(2);
    var timestamp3 = Number(Date.parse(new Date())) / 1000;
    var timestamp0 =
      Number(new Date(new Date().toLocaleDateString()).getTime()) /
      1000; /* 当天零点时间戳 */
    var a = Number(timestamp3 - timestamp0) * (2.5).toFixed(2);
    that.leijiwater = a;
    that.leijiwater2 = a;
      that.flowdsq2=setInterval(function() {
      that.sunshiwater = (Math.random() * 1000 + 8200).toFixed(2);
      var hour = new Date().getHours();
      var m = Number(new Date().getMinutes());
      var s = Number(new Date().getSeconds());
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      var time = hour + ":" + m + ":" + s;
      if (String(time) == "14:07:00") {
        that.leijiwater = 0;
        that.leijiwater2 = (Number(timestamp3 - timestamp0) * 2.5).toFixed(2);
      } else {
        if (Number(that.leijiwater) == 0) {
          that.leijiwater = (
            Number(that.leijiwater2) +
            Math.random() * 2.5
          ).toFixed(2);
        } else {
          that.leijiwater = (
            Number(that.leijiwater) +
            Number(Math.random()) * 2.5
          ).toFixed(2);
        }
      }
    }, 1000);
    /* 以下是动态曲线部分 */
  /*   var aa = 30 + Math.random().toFixed(4) * 4; */
   var aa = flowdata.flowdata[1];
    for (var i = 0; i < 100; i++) {
      that.barbaldata.push(0);
      that.ylinedata.push(aa);
      that.xdata.push(i);
    }
    that.barbaldata.splice(
      that.barbaldata.length - 1,
      1,
      that.ylinedata[that.ylinedata.length - 1]
    );
    that.drawLine();
    that.run = function() {
     /*  console.log(new Date().getSeconds());
      var b = 30 + Math.random().toFixed(4) * 4;
      if (
        Number(new Date().getSeconds()) == 58 ||
        Number(new Date().getSeconds()) == 16 ||
        Number(new Date().getSeconds()) == 29 ||
        Number(new Date().getSeconds()) == 31 ||
        Number(new Date().getSeconds()) == 43
      ) {
        var b = 38 + Math.random().toFixed(4) * 20;
      } */
        if (that.index == flowdata.flowdata.length - 1) {
        that.index = 0;
      }
      var b = flowdata.flowdata[that.index];
      that.xdata.shift();
      that.ylinedata.shift();
      that.xdata.push(b);
      that.ylinedata.push(b);
      that.barbaldata.splice(that.barbaldata.length - 1, 1, b);
      var fps = 10;
      setTimeout(function() {
        window.requestAnimationFrame(that.run);
        that.drawLine();
      }, 1800 / fps);
       that.index++;
      console.log("%c的值%c", "font-size:24px;color:blue", "", that.index);
    };
    that.run();
  },
  methods: {
    drawLine() {
      let myChart = EChart.init(this.$refs.chart);
      let option = {
        /* backgroundColor: 'rgba(0,5,21,0.8)', */
        /*        backgroundColor: "#1a3b44", */
        grid: {
          height: "150",
          top: "10",
          bottom: "10",
          right: "20",
          left: "20"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xdata,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#3a3e4d",
              width: 1
            }
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            data: this.ylinedata,
            type: "line",
            animation: false,
            smooth: true,
            symbol: "none",
            markLine: {
              silent: true,
              symbol: "none",
              label: {
                formatter: function(val) {
                  return (val.value = "");
                }
              },
             data: [
                {
                  yAxis: flowdata.flowdata[0]*0.15,
                  lineStyle: {
                    normal: {
                      color: "#323f46"
                    }
                  }
                },
                {
                  yAxis: flowdata.flowdata[0]*0.3,
                  lineStyle: {
                    normal: {
                      color: "#323f46"
                    }
                  }
                },
                {
                  yAxis: flowdata.flowdata[0]*0.45,
                  lineStyle: {
                    normal: {
                      color: "#323f46"
                    }
                  }
                },
                {
                  yAxis: flowdata.flowdata[0]*0.65,
                  lineStyle: {
                    normal: {
                      color: "#323f46"
                    }
                  }
                },
                {
                  yAxis: flowdata.flowdata[0]*0.85,
                  lineStyle: {
                    normal: {
                      color: "#323f46"
                    }
                  }
                },
                {
                  yAxis: flowdata.flowdata[0]*1.05,
                  lineStyle: {
                   normal: {
                      color: "#323f46"
                    }
                  }
                }
              ]
            },
            lineStyle: {
              color: {
                type: "linear",
                colorStops: [
                  {
                    offset: 0,
                    color: "#eb3794", // 0% 处的颜色
                    transition: 2
                  },
                  {
                    offset: 0.56,
                    color: "#eb3794", // 66% 处的颜色
                    transition: 2
                  },
                  {
                    offset: 1,
                    color: "#fff", // 100% 处的颜色
                    transition: 2
                  }
                ],
                opacity: 0.4,
                globalCoord: false // 缺省为 false
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,255,255,0.3)" // 0% 处的颜色
                    },
                    /*   {
                      offset: 0.66,
                      color: "rgba(255,255,255,0.3)" 
                    }, */
                    {
                      offset: 1,
                      color: "rgba(255,255,255,0)" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          },

          {
            barWidth: 2,
            type: "bar",
            data: this.barbaldata,
            animation: false,
            itemStyle: {
              normal: {
                color: "#fff"
              }
            },
            markPoint: {
              animation: false,
              symbol: "circle",
              data: [{ type: "max" }],
              symbolSize: 10,
              itemStyle: {
                normal: {
                  color: "#020b1c",
                  borderColor: "#fff",
                  borderWidth: "2",
                  label: {
                    show: false
                  }
                }
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  watch: {
    forecastData: {
      deep: true,
      handler(val) {
        /*  this.renderChart() */
      }
    }
  },
  destroyed() {
    window.cancelAnimationFrame(this.run());
    this.run = null;
      that.flowdsq2=null;
    window.clearInterval(that.flowdsq2)
    console.log(
      "%cwindow.cancelAnimationFrame(this.run())%c %c44",
      "color:red;font-size:36px;font-weight:bold",
      "",
      window.cancelAnimationFrame(this.run())
    );
  }
};
</script>
<style lang="less" scoped>
.forecast-chart {
  .chart {
    height: 150px;
  }
  .text-gray {
    color: #747474;
  }
  .summarization {
    width: 100%;
    font-size: 12px;
    margin-left: 10px;
    tr {
      line-height: 22px;
      &:first-of-type {
        /*   background: linear-gradient(to right, #080808 , #202126); */
        background-color: rgba(37, 45, 62, 0.4);
      }
      &:first-of-type {
        /*  background: linear-gradient(to right, #080808 , #202126); */
      }
      // .dot{
      //     display: inline-block;
      //     vertical-align: super;
      // }
    }
  }
}
</style>
