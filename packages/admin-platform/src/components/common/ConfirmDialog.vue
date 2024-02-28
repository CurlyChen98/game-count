<template>
  <v-dialog v-model="dialog.show" content-class="confirm-dialog" width="500" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold grey lighten-2">
        <span>{{ dialog.title }}</span>
      </v-card-title>
      <div class="card__content">
        <v-card-text class="py-0" style="white-space: pre-line">
          {{ dialog.text }}
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="dialog.showCancel" text @click="onCloseClick('cancel')">
          {{ dialog.cancelText }}
        </v-btn>
        <v-btn class="ml-0" color="primary" text @click="onCloseClick('confirm')">
          {{ dialog.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';

export default {
  components: {},
  data() {
    return {
      dialog: this.dialogTemp(),
    };
  },
  computed: {},
  mounted() {
    this.set();
  },
  methods: {
    //
    dialogTemp() {
      return {
        show: false,
        title: this.$t('Common.title.tip'),
        text: null,
        showCancel: false,
        cancelText: this.$t('Common.action.cancel'),
        confirmText: this.$t('Common.action.confirm'),
      };
    },
    //
    set() {
      /**
       * @description 確認彈窗
       * @param {String} title 標題
       * @param {String} text 內容文本
       * @param {String} showCancel 是否顯示取消按鈕（默認：false）
       * @param {String} cancelText 取消文本（默認：取消）
       * @param {string} confirmText 確認文本（默認：確認）
       * @return {Funtion} promise
       */
      Vue.prototype.$confirmDialog = (event) => {
        return new Promise((resolve, reject) => {
          this.dialog = {
            ...this.dialogTemp(),
            ...event,
            show: true,
            resolve,
            reject,
          };
        });
      };
    },
    //
    onCloseClick(type) {
      if (type === 'confirm') {
        this.dialog.resolve('confirm');
      } else if (type === 'cancel') {
        this.dialog.reject('cancel');
      }

      this.$set(this.dialog, 'show', false);
    },
  },
};
</script>

<style lang="scss">
.confirm-dialog {
}
</style>
