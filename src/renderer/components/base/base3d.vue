<template>
  <div class="base3d">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Base3D",
  data() {
    return {
      viewer: null
    };
  },
  mounted() {
    //设置默认 home
    var china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70);
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china;

    let initOption = {
      animation: false, //是否创建动画小器件，左下角仪表
      baseLayerPicker: false, //是否显示图层选择器
      fullscreenButton: false, //是否显示全屏按钮
      geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      homeButton: false, //是否显示Home按钮
      infoBox: false, //是否显示信息框
      sceneModePicker: false, //是否显示3D/2D选择器
      selectionIndicator: false, //是否显示选取指示器组件
      timeline: false, //是否显示时间轴
      sceneMode: Cesium.SceneMode.SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
      navigationHelpButton: false, //是否显示右上角的帮助按钮
      scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      navigationInstructionsInitiallyVisible: false,
      showRenderLoopErrors: false
    }; 
    this.viewer = new Cesium.Viewer(this.$el,initOption);
    this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0));
    //Bing
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.BingMapsImageryProvider({
        key: "Aqp0TzgJp9to4oViQjVFs_Tfg1dndDu6IzTfZVDnM0R1TYOFYY7OFUTTwzb60pG2", //可至官网（https://www.bingmapsportal.com/）申请key
        url: "//dev.virtualearth.net"
      })
    ); 

    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.$emit("getViewer", this.viewer);
  }
};
</script>

<style lang="scss" scoped>
.base3d {
  width: 100%;
  height: calc(100vh);
}
</style>

