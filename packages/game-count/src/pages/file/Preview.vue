<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-row class="mt-4" justify="center" no-gutters>
      <v-col v-for="(item, index) in totalPage" :key="index" cols="4">
        <div class="pdf-box">
          <pdf
            v-if="item && showPage >= item"
            :key="index"
            :src="url"
            :page="nowPage"
            ref="pdf"
            class="pdf"
          />
        </div>
      </v-col>
    </v-row>
    <!--  -->
    <v-btn
      v-if="$checkPermission(['IN_RECORD_EDIT_DOWNLOAD'])"
      class="download-button"
      fab
      dark
      large
      color="primary"
      @click="onDownloadClick"
    >
      <v-icon dark>mdi-download</v-icon>
    </v-btn>
    <!--  -->
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import { FaxInRecordApi } from '@/api/index.js';
import { downloadFile } from '@/utils/file.js';
import * as dateFilter from '@/utils/date-filter.js';

export default {
  components: { pdf },
  data() {
    return {
      url: null,
      nowPage: 0,
      totalPage: 0,
      showPage: 0,
    };
  },
  computed: {
    recordId() {
      return this.$route.query.recordId;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...dateFilter,
    // 頁面初始化
    async init() {
      try {
        this.$showDelayLoading();

        this._fileBlob = await FaxInRecordApi.download({ id: this.recordId });
        if (this._fileBlob.size === 0) throw '文件內容為空';

        const objectURL = URL.createObjectURL(this._fileBlob);
        const loadingTask = pdf.createLoadingTask(objectURL);
        loadingTask.promise.then((pdf) => {
          this.totalPage = pdf.numPages;
          this.nowPage = 1;
          this.setPageShow(this.totalPage);
        });
        this.url = objectURL;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    setPageShow(tager) {
      ++this.showPage;
      if (this.showPage < tager)
        setTimeout(() => {
          this.setPageShow(tager);
        }, 500);
    },
    //
    onDownloadClick() {
      this.$message('整理資源中，請稍後。');
      let { fileName } = this.$route.query;
      downloadFile({ file: this._fileBlob, fileName });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  height: auto;
}
.pdf-box {
  padding: 0 16px 8px;
}
.download-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
}
</style>
