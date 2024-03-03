<template>
  <v-dialog v-model="show" width="600" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>投標箱：文件移動</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form v-if="form.ids" ref="editDialogForm" class="card__content">
        <form-item label="投標箱" labelRequired>
          <cover-select
            v-model="form.tenderBoxId"
            :items="tenderBoxs"
            :clickClear="false"
            @input="onBoxChange"
          />
        </form-item>
        <template v-if="isLock">
          <div class="mb-4 text-body-2 error--text">該標箱已加密，請輸入密碼。</div>
          <form-item label="密碼" labelRequired>
            <cover-input v-model="form.password" :rules="[required]" type="password" />
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
import { cloneDeep } from 'lodash-es';
import { FaxTenderBoxApi } from '@/api/index.js';
import * as formRule from '@/utils/form-rule.js';
let formTemp = function () {
  return {};
};

export default {
  data() {
    return {
      show: false,
      form: formTemp(),
      tenderBoxs: [],
      isLock: false,
    };
  },
  methods: {
    ...formRule,
    //
    async setDialog({ show = true, items = [] } = {}) {
      try {
        this.$showDelayLoading();

        if (items.length > 0) {
          let [{ content: unfied }, { content: tenderBoxs }] = await Promise.all([
            FaxTenderBoxApi.search({
              page: 0,
              size: 1,
              sort: '',
              obj: {
                cstNbr: 'Unfied',
              },
            }),
            FaxTenderBoxApi.search({
              page: 0,
              size: 999999,
              sort: '',
              obj: {
                statusList: ['PROCEED'],
              },
            }),
          ]);
          if (unfied.length > 0) {
            tenderBoxs.unshift(unfied[0]);
            this.$set(this.form, 'tenderBoxId', unfied[0].id);
          }
          this.tenderBoxs = tenderBoxs.map((item) => {
            return {
              ...item,
              text: `${item.cstNbr} - ${item.cstDsc}`,
              value: item.id,
            };
          });

          this.form.ids = items.map((item) => item.id);
          this.show = show;
        }
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onBoxChange(event) {
      let find = this.tenderBoxs.find((item) => event === item.id);
      if (find.encrypted) this.isLock = true;
      else this.isLock = false;
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
        await FaxTenderBoxApi.recordMove(obj);
        this.$success('移動成功');
        this.$emit('success', { type: 'move' });

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
        this.isLock = false;
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
