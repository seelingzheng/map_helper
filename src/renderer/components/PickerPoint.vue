<template>
  <div class="picker-page">
    <panel style="left:10px;top:10px">
      <el-input
        clearable
        @focus="isFocus=true"
        @blur="isFocus=false"
        type="string"
        placeholder="点选或输入经度信息"
        v-model="pValue"
      ></el-input>
      <section v-if="gdValue!=''">
        <h3>当前点位</h3>
        <div class="point-info">
          <h5 @click="doCopy($event)">高德:{{gdValue}}</h5>

          <h5 @click="doCopy($event)">GPS:{{gpsValue}}</h5>

          <h5 @click="doCopy($event)">百度:{{bdValue}}</h5>
        </div>
      </section>
    </panel>
    <panel style="right:10px;top:10px" v-if="curCity&&curCity.citycode">
      <section>
        <h1>{{curCity.province}}</h1>
        <h3>{{curCity.citycode}}</h3>
        <h2>{{curCity.city}}</h2>
        <h3>{{curCity.district}}</h3>
      </section>
      <hr>
      <section>
        <h3>当前中心点位</h3>
        <h4>{{curCenter.lng+','+curCenter.lat}}</h4>
      </section>
    </panel>
    <baseamap @getAMap="getAMap"></baseamap>
  </div>
</template>

<script>
import { baseamap, panel } from "./base";
import {
  bd09togcj02,
  gcj02tobd09,
  wgs84togcj02,
  gcj02towgs84,
  out_of_china
} from "./../utils/exchange.js";
const electronLocalshortcut = require("electron-localshortcut");

export default {
  name: "",
  components: {
    baseamap,
    panel
  },

  data() {
    return {
      isFocus: false,
      A: {
        AMap: null,
        AMapUI: null,
        map: null
      },
      curMarker: null,
      curCenter: null,
      curCity: { province: "", city: "", district: "", citycode: "" },
      pValue: "",
      gpsValue: "",
      bdValue: "",
      gdValue: ""
    };
  },
  watch: {
    pValue(val, oval) {
      if (val == "") {
        this.gpsValue = "";
        this.bdValue = "";
        this.gdValue = "";
      }
    }
  },
  mounted() {
    let vm = this;

    document.addEventListener("keydown", this.keyDown);
  },
  methods: {
    getAMap(obj) {
      let vm = this;
      vm.A = obj;

      obj.map.on("click", function(e) {
        let lnglat = e.lnglat;
        let point = [lnglat.lng, lnglat.lat];
        vm.addMarker(point);
      });
      //绑定地图移动事件
      obj.map.on("moveend", this.logMapinfo);
    },
    keyDown(e) {
      if (e.keyCode !== 13 || !this.isFocus) return;
      if (this.pValue.indexOf(",") > 0) {
        let lnglat = this.pValue.split(",");
        lnglat = lnglat.map(n => n * 1);
        this.A.map.setZoomAndCenter(13, lnglat);
        this.addMarker(lnglat);
      } else {
        this.$notify({
          title: "提示",
          position: "bottom-right",
          type: "warning",
          showClose: false,
          message: "输入的经纬度格式不对，经度纬度之间用逗号分隔。",
          duration: 3000
        });
      }
      console.log(e);
    },
    addMarker(point) {
      if (this.curMarker) this.A.map.remove(this.curMarker);
      this.curMarker = new this.A.AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: point
      });
      this.pValue = point.join(",");
      this.gpsValue = gcj02towgs84(point[0], point[1]).join(",");
      this.bdValue = gcj02tobd09(point[0], point[1]).join(",");
      this.gdValue = this.pValue;

      this.A.map.add(this.curMarker);
    },
    //获取并展示当前城市信息
    logMapinfo() {
      let vm = this;
      vm.A.map.getCity(function(info) {
        vm.curCity = info;
        vm.curCenter = vm.A.map.getCenter();
      });
    },
    doCopy(e) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", e.target.innerText.split(":").pop());
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        document.body.removeChild(input);
        this.$message("拷贝成功");
      }
    }
  },
  beforeDestroy() {
    this.A.map.off("click");
  }
};
</script>

<style lang = 'scss' scoped >
.picker-page {
  .el-input--suffix .el-input__inner {
    padding-right: 30px;
    background: transparent;
    border-width: 0px;
    border-bottom-width: 1px;
    color: white;
  }
  .point-info {
    text-align: left;
  }
}
</style>