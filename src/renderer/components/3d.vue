<template>
  <div class="3dshow">
 <base3d :getViewer="getViewer"></base3d>
  </div>
</template>

<script>
import { base3d, panel } from "./base";
 
const electronLocalshortcut = require("electron-localshortcut");

export default {
  name: "",
  components: {
    base3d,
    panel
  },

  data() {
    return {
      viewer:undefined
    };
  },
   
  mounted() {
    let vm = this; 
    document.addEventListener("keydown", this.keyDown);
  },
  methods: {
    getViewer(v) {
      this.viewer=v;
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
 
 
</style>