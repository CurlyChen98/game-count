<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱：復原</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content">
        <form-item label="狀態" labelRequired>
          <cover-select
            v-model="form.tenderStatus"
            :items="bidBoxStatuses"
            :rules="[required]"
            :click-clear="false"
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
import { FaxTenderBoxApi } from '@/api/index.js';
import * as formRule from '@/utils/form-rule.js';
import { bidBoxStatuses } from '@/utils/stock.js';
let formTemp = function () {
  return {};
};

export default {
  data() {
    return {
      show: false,
      form: formTemp(),
      bidBoxStatuses: [],
    };
  },
  methods: {
    ...formRule,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        if (item.id) {
          this.bidBoxStatuses = bidBoxStatuses.filter((item) => !['DELETE'].includes(item.value));

          this.form = {
            id: item.id,
          };

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

        let { id, tenderStatus } = cloneDeep(this.form);
        await FaxTenderBoxApi.undelete({ id });
        await FaxTenderBoxApi.editStatus({
          id: id,
          password: null,
          tenderStatus,
        });

        this.$success('復原成功');
        this.$emit('success');
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
