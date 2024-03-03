<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>供應商群組管理</span>
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
          <cover-input v-model="form.groupCode" :disabled="isEdit" :rules="[required]" />
        </form-item>
        <form-item label="群組名稱" labelRequired>
          <cover-input v-model="form.groupName" :rules="[required]" />
        </form-item>
        <form-item label="供應商">
          <ApiSearch
            v-model="form.suppliers"
            :searchFun="searchSupplier"
            defaultSearch
            multiple
            chip
            @changeReturnObj="suppliers = $event"
          />
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
// TODO post /v1/group “suppliers”參數應該只需要“id數組”而不是整個供應商“對象數組”
import { cloneDeep } from 'lodash-es';
import * as formRule from '@/utils/form-rule.js';
import { SupplierGroupApi, SupplierApi } from '@/api/index.js';
import ApiSearch from '@/components/ApiSearch.vue';
let formTemp = function () {
  return {
    status: 'C',
  };
};

export default {
  components: { ApiSearch },
  data() {
    return {
      show: false,
      form: formTemp(),
      suppliers: [],
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
          let { suppliers, ..._item } = cloneDeep(item);
          this.$set(this, 'form', {
            ...this.form,
            ..._item,
            suppliers: suppliers.map((it) => it.id),
          });
          this._alreadySuppliers = suppliers;
        }
        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async searchSupplier(evnet, currentItems) {
      const { content } = await SupplierApi.search({
        page: 0,
        size: 50,
        sort: '',
        obj: { supName: evnet },
      });
      if (this._alreadySuppliers && currentItems.length === 0)
        content.unshift(...this._alreadySuppliers);
      return content.map((item) => {
        return {
          ...item,
          text: `${item.supChnSn ?? '--'}（${item.supPorSn ?? '--'}）`,
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

        let obj = cloneDeep(this.form);
        obj.suppliers = this.suppliers;
        obj.supplierIds = this.suppliers.map((item) => item.id);

        if (obj.id) {
          await SupplierGroupApi.update(obj);
          this.$success(this.$t('Common.message.editSuccess'));
          this.$emit('success', { type: 'edit' });
        } else {
          await SupplierGroupApi.create(obj);
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
