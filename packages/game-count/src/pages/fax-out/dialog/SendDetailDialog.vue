<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div>
          <span>發送記錄詳情</span>
        </div>
        <v-spacer />
        <v-icon @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider />
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="發送記錄編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="標書編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="發送者名稱" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="供應商" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="傳真編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="采購單編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="發送狀態" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="發送日期" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="文件類型" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" readonly />
        </form-item>
        <form-item label="附件資料" labelRequired>
          <cover-file v-model="form.file1" :rules="[required]" open-download @download="false" />
        </form-item>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">{{ $t('Common.action.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as formRule from '@/utils/form-rule.js';
let formTemp = function () {
  return {};
};

export default {
  data() {
    return {
      show: false,
      form: formTemp(),
    };
  },
  computed: {
    isEdit() {
      return !!this.form.id;
    },
  },
  created() {
    // this.setDialog();
  },
  methods: {
    ...formRule,
    //
    async setDialog({ show = true } = {}) {
      try {
        this.$showDelayLoading();

        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    async onDialogConfirm() {
      if (!this.$refs.editDialogForm.validate()) return;
      try {
        this.$showDelayLoading();

        this.resetDialog();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.$set(this, 'form', formTemp());
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
