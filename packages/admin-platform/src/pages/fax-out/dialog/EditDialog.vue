<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div>
          <span>文件記錄</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider />
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="文件編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" />
        </form-item>
        <form-item label="文件類型" labelRequired>
          <cover-select
            v-model="form.test2"
            :rules="[required]"
            :items="[...tenderTypes, ...purchaseTypes]"
          />
        </form-item>
        <form-item label="文件檔案" labelRequired>
          <cover-file v-model="form.file1" :rules="[required]" open-download @download="false" />
        </form-item>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">{{ $t('Common.action.cancel') }}</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm('close')">儲存並關閉</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm('next')">儲存並下一步</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as formRule from '@/utils/form-rule.js';
import { tenderTypes, purchaseTypes } from '@/utils/stock.js';
let formTemp = function () {
  return {};
};

export default {
  data() {
    return {
      show: false,
      form: formTemp(),
      tenderTypes,
      purchaseTypes,
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
    async onDialogConfirm(and) {
      // if (!this.$refs.editDialogForm.validate()) return;

      this.resetDialog();
      if (and === 'close') {
        1;
      } else if (and === 'next') {
        this.$parent.$refs['setRecordDialog'].setDialog();
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
