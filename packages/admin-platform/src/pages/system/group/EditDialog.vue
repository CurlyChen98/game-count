<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>群組管理</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <!-- 賬號 中文名稱 偏好語言 錯誤驗證次數 所在群組 角色 狀態-->
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="群組編號" labelRequired>
          <cover-input v-model="form.code" :disabled="isEdit" :rules="[required]" />
        </form-item>
        <form-item label="群組名稱" labelRequired>
          <cover-input v-model="form.nameTc" :rules="[required]" />
        </form-item>
        <form-item label="狀態" labelRequired>
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
import { DepartmentApi } from '@/api/index.js';
import * as formRule from '@/utils/form-rule.js';
let formTemp = function () {
  return {
    status: 'A',
  };
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
          await DepartmentApi.create(obj);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          await DepartmentApi.create(obj);
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
