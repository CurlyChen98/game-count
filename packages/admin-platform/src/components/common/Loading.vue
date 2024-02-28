<template>
  <v-overlay :value="loading" z-index="1000" :opacity="0.1">
    <v-card light>
      <v-card-text class="pa-4 d-flex flex-column align-center" :class="{ 'pb-2': !!loadingText }">
        <v-progress-circular
          color="primary"
          indeterminate
          size="20"
          width="2"
          class="ma-4"
          :class="{ 'mb-2': !!loadingText }"
        ></v-progress-circular>
        <span v-show="loadingText" class="loading-text text-truncate">
          {{ loadingText }}
        </span>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      loading: false,
      loadingText: null,
    };
  },
  created() {
    this.setMessage();
  },
  methods: {
    //
    setMessage() {
      let loadSave = 0;
      Vue.prototype.$showLoading = (message = null) => {
        ++loadSave;
        this.loading = true;
        this.loadingText = message;
      };

      let delayTime = '';
      Vue.prototype.$showDelayLoading = (message = null, time = 300) => {
        ++loadSave;
        clearTimeout(delayTime);
        delayTime = setTimeout(() => {
          this.loading = true;
          this.loadingText = message;
        }, time);
      };

      Vue.prototype.$hideLoading = () => {
        --loadSave;
        if (loadSave > 0) return;

        clearTimeout(delayTime);
        this.loading = false;
        this.loadingText = null;
      };
    },
  },
};
</script>

<style lang="scss"></style>
