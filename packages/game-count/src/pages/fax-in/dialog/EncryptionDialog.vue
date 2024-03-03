<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱：加密設置</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="是否加密" labelRequired>
          <cover-radio-group v-model="form.encrypted" row>
            <v-radio
              v-for="(item, index) in trueFalse"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </cover-radio-group>
        </form-item>
        <form-item v-if="isEncrypted" label="舊密碼" labelRequired>
          <cover-input v-model="form._oldPassword" :rules="[required]" type="password" />
        </form-item>
        <form-item v-if="form.encrypted" label="新密碼" labelRequired>
          <cover-input v-model="form._newPassword" :rules="[required]" type="password" />
        </form-item>
        <form-item v-if="form.encrypted" label="再次輸入新密碼" labelRequired>
          <cover-input v-model="form._againPassword" :rules="[required]" type="password" />
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
import * as formRule from '@/utils/form-rule.js';
import { FaxTenderBoxApi } from '@/api/index.js';
import { trueFalse } from '@/utils/stock.js';
let formTemp = function () {
  return {};
};

export default {
  data() {
    return {
      show: false,
      form: formTemp(),
      isEncrypted: false, // 編輯前的加密狀態
      trueFalse,
    };
  },
  computed: {},
  methods: {
    ...formRule,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        if (item.id) {
          this.form = { ...item };
          this.isEncrypted = item.encrypted;
          this.show = show;
        }
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

        let { id, _oldPassword, _newPassword, _againPassword, encrypted } = this.form;
        if (_newPassword !== _againPassword) {
          throw '兩次輸入的密碼不一致';
        }

        await FaxTenderBoxApi.editPassword({
          id,
          encrypted,
          oldPassword: _oldPassword,
          password: _newPassword,
        });
        this.$success('修改密碼成功');
        this.$emit('success', { type: 'edit', encrypted });

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
