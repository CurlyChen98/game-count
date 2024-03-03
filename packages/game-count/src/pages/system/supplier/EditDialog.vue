<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>供應商管理</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <!-- 賬號 中文名稱 偏好語言 錯誤驗證次數 所在群組 角色 狀態-->
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="供應商編號" labelRequired>
          <cover-input v-model="form.supCode" :disabled="isEdit" :rules="[required]" />
        </form-item>
        <form-item label="供應商中文全名稱" labelRequired>
          <cover-input v-model="form.supChnFn" :rules="[required]" />
        </form-item>
        <form-item label="供應商中文簡稱" labelRequired>
          <cover-input v-model="form.supChnSn" :rules="[required]" />
        </form-item>
        <form-item label="供應商葡文簡稱">
          <cover-input v-model="form.supPorSn" />
        </form-item>
        <form-item label="供應商電話1" labelRequired>
          <cover-input v-model="form.supTlFn1" :rules="[required]" />
        </form-item>
        <form-item label="供應商電話2">
          <cover-input v-model="form.supTlFn2" />
        </form-item>
        <form-item label="供應商電話3">
          <cover-input v-model="form.supTlFn3" />
        </form-item>
        <form-item label="供應商傳真機">
          <cover-input v-model="form.supFaxNo" />
        </form-item>
        <form-item label="供應商地址1" labelRequired>
          <cover-input v-model="form.supeAddr1" :rules="[required]" />
        </form-item>
        <form-item label="供應商地址2">
          <cover-input v-model="form.supeAddr2" />
        </form-item>
        <form-item label="狀態">
          <cover-switch
            v-model="form.status"
            :switchLabel="
              form.status === 'A' ? $t('Common.enum.status1') : $t('Common.enum.status2')
            "
            true-value="A"
            false-value="C"
          />
        </form-item>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">{{ $t('Common.action.cancel') }}</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm">
          {{ $t('Common.action.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import * as formRule from '@/utils/form-rule.js';
import { SupplierApi } from '@/api/index.js';
let formTemp = function () {
  return {
    status: 'C',
  };
};

export default {
  components: {},
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
  created() {},
  methods: {
    ...formRule,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        if (item.id) {
          this.$set(this, 'form', {
            ...this.form,
            ...item,
          });
        }
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

        let obj = cloneDeep(this.form);

        if (obj.id) {
          await SupplierApi.update(obj);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          await SupplierApi.create(obj);
          this.$success(this.$t('Common.message.addSuccess'));
          this.$emit('success', { type: 'add' });
        }
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
