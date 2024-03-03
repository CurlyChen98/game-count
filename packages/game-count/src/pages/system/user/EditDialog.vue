<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>用戶管理</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <!-- 賬號 中文名稱 偏好語言 錯誤驗證次數 所在群組 角色 狀態-->
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="賬號" labelRequired>
          <cover-input v-model="form.username" :rules="[required]" :disabled="isEdit" />
        </form-item>
        <form-item label="中文名稱" labelRequired>
          <cover-input v-model="form.nameCn" :rules="[required]" />
        </form-item>
        <form-item label="外文名稱">
          <cover-input v-model="form.nameEn" />
        </form-item>
        <form-item label="用戶編號">
          <cover-input v-model="form.employeeNo" />
        </form-item>
        <form-item label="設定群組">
          <cover-autocomplete
            v-model="form.departmentList"
            :items="groups"
            :clickClear="false"
            multiple
          />
        </form-item>
        <form-item label="設定角色">
          <ApiSearch v-model="form.roles" :searchFun="searchRole" defaultSearch multiple chip />
        </form-item>
        <form-item label="用戶類型">
          <cover-select v-model="form.type" :items="userTypes" :clickClear="false" />
        </form-item>
        <form-item label="偏好語言">
          <cover-select
            v-model="form.preferredLanguage"
            :items="preferredLanguages"
            :clickClear="false"
          />
        </form-item>
        <form-item label="備注">
          <cover-input v-model="form.description" />
        </form-item>
        <form-item label="狀態" labelRequired>
          <cover-switch
            v-model="form.enabled"
            :switchLabel="form.enabled ? $t('Common.enum.status1') : $t('Common.enum.status2')"
          />
        </form-item>
        <template v-if="!isEdit">
          <form-item label="是否需要修改密碼" labelRequired>
            <cover-switch
              v-model="form.changePassword"
              :switchLabel="form.changePassword ? '需要' : '不需要'"
            />
          </form-item>
          <form-item label="登錄密碼" labelRequired>
            <cover-input v-model="form.password" :rules="[required]" />
          </form-item>
        </template>
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
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash-es';
import * as formRule from '@/utils/form-rule.js';
import { UsersApi, UsersGroupApi } from '@/api/index.js';
import ApiSearch from '@/components/ApiSearch.vue';
import { preferredLanguages, userTypes, handleGroups } from '@/utils/stock.js';
let formTemp = function () {
  return {
    preferredLanguage: preferredLanguages[0].value,
    type: 'USER',
    enabled: true,
    changePassword: false,
    password: 123456,
  };
};

export default {
  components: { ApiSearch },
  data() {
    return {
      show: false,
      form: formTemp(),
      preferredLanguages,
      userTypes: [],
      groups: [],
    };
  },
  computed: {
    ...mapState('profile', ['cType']),
    isDev() {
      return ['dev'].includes(process.env.VUE_APP_ENV);
    },
    isEdit() {
      return !!this.form.id;
    },
  },
  created() {
    if (['ADMIN'].includes(this.cType))
      this.userTypes = userTypes.filter((item) => ['USER', 'ADMIN'].includes(item.value));
    if (['IT'].includes(this.cType)) this.userTypes = userTypes;
  },
  methods: {
    ...formRule,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        this.groups = await handleGroups();

        if (item.id) {
          let _item = await UsersApi.detail({ id: item.id });
          Reflect.deleteProperty(_item, 'departmentDes');
          Reflect.deleteProperty(_item, 'createdBy');
          Reflect.deleteProperty(_item, 'createdTime');
          Reflect.deleteProperty(_item, 'modifiedBy');
          Reflect.deleteProperty(_item, 'modifiedTime');
          let { departmentList, groups: roles, ...other } = item;
          this.$set(this, 'form', {
            ...this.form,
            ...other,
            departmentList: departmentList.map((it) => it.id),
            roles: roles.map((it) => it.id),
          });
          this._alreadyRoles = roles;
        }
        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async searchRole(evnet, currentItems) {
      const { content } = await UsersGroupApi.search({
        page: 0,
        size: 50,
        sort: 'modifiedTime:desc',
        obj: { name: evnet },
      });
      if (this._alreadyRoles && currentItems.length === 0) content.unshift(...this._alreadyRoles);
      return content.map((item) => {
        return {
          ...item,
          text: item.name,
          value: item.id,
        };
      });
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

        let { changePassword, password, roles, departmentList, ...other } = this.form;
        other.departmentList = departmentList.map((item) => {
          return { id: item };
        });

        if (this.isEdit) {
          let user = await UsersApi.update({ id: other.id, ...other });
          await this.setRole(user.id, this._alreadyRoles ?? [], roles ?? []);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          let formdata = new FormData();
          other.index = 0;
          other.displayName = other.username;
          formdata.append('user', new Blob([JSON.stringify(other)], { type: 'application/json' }));
          let passwordRelated = { changePassword, password };
          formdata.append(
            'password',
            new Blob([JSON.stringify(passwordRelated)], { type: 'application/json' })
          );
          let user = await UsersApi.create(formdata);
          await this.setRole(user.id, [], roles ?? []);
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
    async setRole(userId, oldRoles, newRoles) {
      let _oldRoles = cloneDeep(oldRoles);
      let _newRoles = cloneDeep(newRoles);
      _newRoles = _newRoles.filter((item) => {
        let findIndex = _oldRoles.findIndex((it) => item.id === it.id);
        if (findIndex > -1) {
          _oldRoles.splice(findIndex, 1);
          return false;
        } else {
          return true;
        }
      });
      if (_oldRoles.length > 0)
        await UsersApi.deleteGroups({
          userId: userId,
          groupIds: _oldRoles.map((item) => item.id),
        });
      if (_newRoles.length > 0) await UsersApi.addGroups({ userId: userId, groupIds: _newRoles });
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
