<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>角色</span>
          <span v-if="isEdit">：編輯</span>
          <span v-else>：新增</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <!-- 賬號 中文名稱 偏好語言 錯誤驗證次數 所在群組 角色 狀態-->
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="角色編號" labelRequired>
          <cover-input v-model="form.alias" :rules="[required]" :disabled="isEdit" />
        </form-item>
        <form-item label="角色名稱" labelRequired>
          <cover-input v-model="form.name" :rules="[required]" />
        </form-item>
        <form-item label="權限功能">
          <cover-autocomplete
            v-model="form.permissionIds"
            :items="permissions"
            :clickClear="false"
            multiple
            return-object
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                class="my-1"
                label
                small
                close
                @click:close="form.permissionIds.splice(index, 1)"
              >
                <span>{{ item.text }}</span>
              </v-chip>
            </template>
            <template v-slot:append-outer>
              <div style="margin-top: -6px" @click.stop>
                <v-btn color="primary" text @click="chooseAll">
                  {{ $t('Role.action.chooseAll') }}
                </v-btn>
              </div>
            </template>
          </cover-autocomplete>
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
import { UsersGroupApi } from '@/api/index.js';
import { handlePermissions } from '@/utils/stock.js';
let formTemp = function () {
  return {};
};

export default {
  components: {},
  data() {
    return {
      show: false,
      form: formTemp(),
      permissions: [],
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

        this.permissions = await handlePermissions();

        if (item.id) {
          let { permissions, ...other } = await UsersGroupApi.detail({ id: item.id });

          this.$set(this, 'form', {
            ...other,
            permissionIds: permissions.map((permission) => {
              return {
                ...permission,
                value: permission.id,
                text: permission.name,
              };
            }),
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
    chooseAll() {
      this.$set(this.form, 'permissionIds', cloneDeep(this.permissions));
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
        obj.permissionIds = obj.permissionIds ? obj.permissionIds.map((item) => item.id) : [];

        if (obj.id) {
          await UsersGroupApi.update(obj);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          await UsersGroupApi.create(obj);
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
