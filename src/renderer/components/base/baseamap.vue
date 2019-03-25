<template>
  <div id="container">
    <slot></slot>
  </div>
</template>

<script>
import { amapKey } from "@/config/config";
import remoteLoad from "@/utils/remoteLoad";
export default {
  data() {
    return {
      AMapUI: null,
      AMap: null,
      map: null
    };
  },
  provide() {
    return {
      getAMap: this.getAMap
    };
  },
  methods: {
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      this.map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
      });
      this.$emit("getAMap", {
        AMap,
        AMapUI,
        map: this.map
      });
    },
    getAMap(found) {
      var vm = this;
      function checkForMap() {
        if (vm.AMap) {
          found({
            AMap: vm.AMap,
            AMapUI: vm.AMapUI,
            map: this.map
          });
        } else {
          setTimeout(checkForMap, 100);
        }
      }
      checkForMap();
    }
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`https://webapi.amap.com/maps?v=1.4.13&key=${amapKey}`);
      await remoteLoad("https://webapi.amap.com/ui/1.0/main.js");
      this.initMap();
    }
  }
};
</script>

<style lang = 'scss' scoped >
#container {
  height: calc(100vh);
  width: 100%;
}
</style>