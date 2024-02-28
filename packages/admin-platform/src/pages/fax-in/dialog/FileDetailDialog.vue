<template>
  <v-dialog v-model="show" width="900" persistent>
    <v-card>
      <v-card-title>
        <div class="text-h6 font-weight-bold">
          <span>收件記錄詳情</span>
        </div>
        <v-spacer />
        <v-icon style="font-size: 24px; cursor: pointer" @click="onDialogClose">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="editDialogForm" class="card__content">
        <v-card class="py-2 px-4" outlined>
          <div class="text-h5 font-weight-bold primary--text">基本資料</div>
          <v-row class="mt-4" no-gutters>
            <v-col cols="4" class="des font-weight-bold">
              <span>收件記錄編號：</span>
              <span>{{ recordInfo.recordCode }}</span>
            </v-col>
            <v-col cols="8" />
            <v-col cols="4" class="des">
              <span>標書編號：</span>
              <span>{{ recordInfo.tenderBox?.cstNbr }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>傳真號碼：</span>
              <span>{{ recordInfo.fax }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>標書名稱：</span>
              <span>{{ recordInfo.tenderBox?.cstDsc }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>接收日期：</span>
              <span>{{ filterDateTime(recordInfo.receivedDateTime) }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>供應商編號：</span>
              <span>{{ recordInfo.supplier?.supCode }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>供應商名稱：</span>
              <span>{{ recordInfo.supplier?.supChnFn }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>接收終端：</span>
              <span>{{ recordInfo.receivedTerminal }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>當前投標箱：</span>
              <span>{{ recordInfo.tenderBox?.cstDsc }}</span>
            </v-col>
            <v-col cols="4" class="des">
              <span>投標箱加密：</span>
              <span>{{ recordInfo.tenderBox?.encrypted ? '是' : '否' }}</span>
            </v-col>
          </v-row>
        </v-card>
        <v-card v-if="fileInfo.id" class="py-2 px-4 mt-4" outlined>
          <div class="text-h5 font-weight-bold primary--text">附件資料</div>
          <v-row class="mt-4" no-gutters>
            <v-col cols="4" class="file" @click="onPreviewClick">
              <v-icon color="primary">mdi-file-document</v-icon>
              <p class="file-info">
                <span>檔案名稱：</span>
                <span>{{ fileInfo.filename }}</span>
              </p>
              <p class="file-info">
                <span>檔案板數：</span>
                <span>{{ fileInfo.page }}</span>
              </p>
              <p class="file-info">
                <span>檔案大小：</span>
                <span>{{ fileInfo._fileSize }}</span>
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
      <v-card-actions class="d-flex align-center justify-center">
        <v-btn depressed @click="onDialogClose">關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { FaxInRecordApi } from '@/api/index.js';
import * as dateFilter from '@/utils/date-filter.js';
import * as formRule from '@/utils/form-rule.js';

export default {
  data() {
    return {
      show: false,
      recordInfo: {},
      fileInfo: {},
    };
  },
  computed: {},
  created() {},
  methods: {
    ...formRule,
    ...dateFilter,
    //
    async setDialog({ show = true, item = {} } = {}) {
      try {
        this.$showDelayLoading();

        if (item.id) {
          let data = await FaxInRecordApi.detail({ id: item.id });
          this.recordInfo = data;
          if (data.recordDocument)
            this.fileInfo = {
              id: data.recordDocument.id,
              page: data.page,
              ...data.recordDocument.file,
              _fileSize: (data.recordDocument.file.fileSize / 1024 / 1024).toFixed(2) + 'MB',
            };
        }
        this.show = show;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onPreviewClick() {
      this.$openRelevance({
        name: 'filePreview',
        query: { recordId: this.recordInfo.id, fileName: this.fileInfo.filename },
      });
    },
    //
    onDialogClose() {
      this.resetDialog();
    },
    //
    resetDialog() {
      this.show = false;

      this.$nextTick(() => {
        this.recordInfo = {};
        this.fileInfo = {};
        this.$refs['editDialogForm'].resetValidation();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.des {
  font-size: 14px;
  padding-bottom: 8px !important;
}
.file {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 8px !important;
  cursor: pointer;
  .v-icon {
    font-size: 100px;
  }
  .file-info {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 0;
    font-size: 12px;
    span:first-child {
      flex-shrink: 0;
    }
    span:last-child {
      text-align: right;
    }
  }
}
</style>
