<template>
  <div id="envLogo" v-if="['dev', 'uat'].indexOf(VUE_APP_ENV) >= 0">
    <span v-if="VUE_APP_ENV === 'dev'" class="text-logo">DEV</span>
    <span v-else-if="VUE_APP_ENV === 'uat'" class="text-logo">UAT</span>
  </div>
</template>

<script>
export default {
  computed: {
    VUE_APP_ENV() {
      return process.env.VUE_APP_ENV;
    },
  },
};
</script>

<style lang="scss">
#envLogo {
  position: fixed;
  z-index: 90;
  right: 0;
  bottom: 0;
  width: 200px;
  height: 200px;
  pointer-events: none;
  opacity: 0.2;
  .text-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    font-size: 20px;
    width: 100%;
    padding: 4px;
    text-align: center;
    color: #ffffff;
    background: var(--v-primary-base);
    transform: rotate(-45deg) translate(-30%, -35%);
    letter-spacing: 1px;
  }
}
</style>
