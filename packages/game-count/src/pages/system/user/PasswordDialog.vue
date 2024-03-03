<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>用戶管理</span>
          <span>：{{ $t('User.action.changePassword') }}</span>
        </div>
        <v-spacer />
        <div v-if="!['force'].includes(type)">
          <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <!-- -->
      <v-form ref="editDialogForm" class="card__content py-4 px-6">
        <form-item
          v-if="['myself', 'force'].includes(type)"
          :label="$t('User.label.oldPassword')"
          labelRequired
        >
          <cover-input v-model="form.oldPassword" :rules="[required]" type="password" />
        </form-item>
        <form-item :label="$t('User.label.newPassword')" labelRequired>
          <!-- passwordCheck -->
          <cover-input v-model="form.password" :rules="[required]" type="password" />
        </form-item>
        <form-item :label="$t('User.label.passwordConfirm')" labelRequired>
          <cover-input v-model="form.passwordConfirm" :rules="[required]" type="password" />
        </form-item>
        <form-item
          v-if="['admin'].includes(type)"
          :label="$t('User.label.changeForce')"
          labelRequired
        >
          <cover-autocomplete v-model="form.changeForce" :items="trueFalse" :clickClear="false">
          </cover-autocomplete>
        </form-item>
      </v-form>
      <!-- -->
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn v-if="!['force'].includes(type)" depressed @click="onDialogClose">{{
          $t('Common.action.cancel')
        }}</v-btn>
        <v-btn color="primary" depressed @click="onDialogConfirm">
          {{ $t('Common.action.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import { UsersApi, PublicUserApi } from '@/api/index.js';
import { trueFalse, objFindValue } from '@/utils/stock.js';
import * as formRule from '@/utils/form-rule.js';
let formTemp = () => {
  return {
    changeForce: false,
  };
};

export default {
  data() {
    return {
      show: false,
      type: null,
      item: {},
      items: [],
      form: formTemp(),
      trueFalse,
    };
  },
  computed: {
    ...mapState('profile', ['profile']),
  },
  methods: {
    ...formRule,
    objFindValue,
    //
    async setDialog({ show = true, type, item = {}, items = [] } = {}) {
      try {
        this.$showDelayLoading();
        this.type = type;

        if (item.id) {
          this.item = item;
        } else if (items.length > 0) {
          this.items = items;
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
      try {
        if (!this.$refs.editDialogForm.validate()) return;
        this.$showDelayLoading();

        let { password, passwordConfirm, ...obj } = cloneDeep(this.form);
        if (password !== passwordConfirm) throw this.$t('User.message.passwordError');

        if (this.item.id) {
          let result = await PublicUserApi.changePassword({
            oldPassword: obj.oldPassword,
            newPassword: password,
          });
          if (!result) throw '修改密碼失敗';
        } else if (this.items.length > 0) {
          for (const i in this.items) {
            await UsersApi.setPassword({
              userId: this.items[i].id,
              changePassword: obj.changeForce,
              password,
            });
          }
        }

        this.$success(this.$t('User.message.passwordSuccess'));
        this.$emit('success', { type: 'changePassword' });
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
