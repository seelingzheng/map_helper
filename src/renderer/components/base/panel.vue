<template>
  <div class="info-box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "panel",

  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang = 'scss' scoped >
.info-box {
  text-align: center;
  padding: 5px;
  user-select: none;
  z-index: 1000;
  position: absolute;
  border: 1px solid black;
  border-radius: 5px;
  background: rgba(125, 125, 125, 0.8);
}
</style>