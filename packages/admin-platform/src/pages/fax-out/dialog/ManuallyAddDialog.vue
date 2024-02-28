<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div>
          <span>新增發件記錄</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider />
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="供應商編號" labelRequired>
          <cover-input v-model="form.test1" :rules="[required]" />
        </form-item>
        <form-item label="供應商名稱" labelRequired>
          <cover-input v-model="form.test2" :rules="[required]" />
        </form-item>
        <form-item label="發送人名稱" labelRequired>
          <cover-input v-model="form.test3" :rules="[required]" />
        </form-item>
        <form-item label="傳真號碼" labelRequired>
          <cover-input v-model="form.test4" :rules="[required]" />
        </form-item>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">{{ $t('Common.action.cancel') }}</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { SupplierApi } from '@/api/index.js';
import * as formRule from '@/utils/form-rule.js';
let formTemp = function () {
  return {};
};

/**
 * @description 手動添加不在數據庫二點供應商
 */
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
      // if (!this.$refs.editDialogForm.validate()) return;

      try {
        this.$showDelayLoading();

        // let {} = this.form;
        // let { content } = await SupplierApi.search({
        //   obj: { supCode: 1, supName: 2 },
        // });
        // if (content.length > 0) throw '輸入的供應商已存在系統';

        this.$emit('confirm', this.form);
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
