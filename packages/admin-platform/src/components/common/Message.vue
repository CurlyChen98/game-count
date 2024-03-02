<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="snackbarTimeout"
    :color="snackbarColor"
    class="snackbar"
    bottom
  >
    {{ snackbarText }}
    <template v-slot:action="{ attrs }">
      <v-btn icon text v-bind="attrs" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'App',
  data() {
    return {
      snackbar: false,
      snackbarColor: null,
      snackbarText: null,
      snackbarTimeout: 3000,
    };
  },
  computed: {},
  created() {
    this.setMessage();
  },
  methods: {
    //
    setMessage() {
      Vue.prototype.$message = async (message) => {
        await this.resetSnackbar();

        this.snackbar = true;
        this.snackbarText = message;
        this.snackbarColor = null;
      };

      Vue.prototype.$success = async (message) => {
        await this.resetSnackbar();

        this.snackbar = true;
        this.snackbarText = message;
        this.snackbarColor = 'success';
      };

      Vue.prototype.$error = async (error) => {
        if (['cancel'].includes(error)) return;

        await this.resetSnackbar();

        let message = this.$t('Common.title.error');
        if (typeof error === 'string') {
          message = error;
        } else if (error?.response?.data?.code) {
          message = this.$t(`ERROR_CODE_MESSAGE.${error?.response?.data?.code}`);
          message = message.replace('ERROR_CODE_MESSAGE.', '');
        } else if (error?.response?.data?.error) {
          message = this.$t(`ERROR_CODE_MESSAGE.${error?.response?.data?.error}`);
          message = message.replace('ERROR_CODE_MESSAGE.', '');
        } else if (error?.response?.config?.responseType === 'blob') {
          let data = await this.blobToJson(error.response.data);
          message = this.$t(`ERROR_CODE_MESSAGE.${data?.code}`);
          message = message.replace('ERROR_CODE_MESSAGE.', '');
        } else {
          message = error;
        }

        this.snackbar = true;
        this.snackbarText = message;
        this.snackbarColor = 'error';
      };
    },
    //
    blobToJson(blob) {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = function () {
          let json = JSON.parse(reader.result);
          resolve(json);
        };
      });
    },
    //
    resetSnackbar() {
      this.snackbar = false;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 50);
      });
    },
  },
};
</script>

<style lang="scss">
.v-snack {
  padding-bottom: calc(16px * 8);
}
</style>
