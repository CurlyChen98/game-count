<template>
  <div class="page">
    <!--  -->
    <page-breadcrumbs />
    <!--  -->
    <v-card class="search-card pb-4">
      <v-row no-gutters>
        <v-col cols="6" class="pb-4">
          <span class="text-h5 font-weight-bold primary--text">投標箱信息</span>
        </v-col>
        <v-col cols="6" class="d-flex justify-end pr-4">
          <template v-if="isUnfied"></template>
          <template v-else-if="boxInfo.id && boxInfo.deleted">
            <v-btn
              v-if="$checkPermission(['TENDER_SUP_BOX_EDIT_UNG'])"
              color="error"
              :disabled="isUnbind"
              @click="onUnbindClick"
              >{{ isUnbind ? '已解除綁定' : '解除標書綁定' }}</v-btn
            >
            <v-btn
              v-if="$checkPermission(['TENDER_SUP_BOX_BACK_EDIT']) && !isUnbind"
              color="primary"
              @click="$refs['setStatusDialog'].setDialog({ item: boxInfo })"
              >復原</v-btn
            >
          </template>
          <template
            v-else-if="boxInfo.id && $checkPermission(['TENDER_BOX_EDIT', 'TENDER_SUP_BOX_EDIT'])"
          >
            <v-btn :disabled="!canBasicEdit" color="error" @click="onDeleteClick">投標箱刪除</v-btn>
            <v-btn :disabled="!canBasicEdit" color="primary" @click="onEditClick">編輯</v-btn>
          </template>
        </v-col>
        <v-col cols="3" class="des">
          <span>標書編號：</span>
          <span>{{ $filterBoxNumber(boxInfo.cstNbr) }}</span>
        </v-col>
        <v-col cols="3" class="des">
          <span>標書名稱：</span>
          <span>{{ boxInfo.cstDsc }}</span>
        </v-col>
        <v-col cols="3" class="des">
          <span>展開時間：</span>
          <span>{{ boxInfo._openDateTime }}</span>
        </v-col>
        <v-col cols="3" class="des">
          <span>截標時間：</span>
          <span>{{ boxInfo._deadDateTime }}</span>
        </v-col>
        <v-col cols="3" class="des">
          <span>是否加密：</span>
          <span v-if="!isUnfied && canBasicEdit" class="text--click" @click="onEncryptionClick">{{
            boxInfo._encrypted
          }}</span>
          <span v-else>{{ boxInfo._encrypted }}</span>
        </v-col>
        <v-col cols="3" class="des">
          <span>狀態：</span>
          <span>{{ boxInfo._tenderStatus }}</span>
        </v-col>
      </v-row>
    </v-card>
    <!--  -->
    <v-card class="table-card">
      <div class="table-control">
        <div>
          <span class="text-h5 font-weight-bold primary--text">文件資料</span>
        </div>
        <div>
          <template v-if="boxInfo.id && $checkPermission(['TENDER_RECORD_MOVE'])">
            <v-btn :disabled="!hasSelected" color="primary" @click="onFileMoveClick">
              收件移動
            </v-btn>
          </template>
        </div>
      </div>
      <DataTable
        v-model="tableSelected"
        :headers="tableHeaders"
        :items="tableItems"
        :options="tableOptions"
        :server-items-length="itemsCount"
        :show-select="$checkPermission(['TENDER_RECORD_MOVE'])"
        not-footer
        @update:options="onOptionsChange"
        @click:row="onRowClick"
      >
        <template v-slot:[`item.recordCode`]="{ item }">
          <span class="text--click" @click="onFileDetaillick(item)">{{ item.recordCode }}</span>
        </template>
        <template v-slot:[`item.deadTimeDes`]="{ item }">
          <span class="red--text">{{ item.deadTimeDes }}</span>
        </template>
        <template v-slot:[`item.receivedDateTime`]="{ item }">
          <span>{{ filterDateTime(item.receivedDateTime) }}</span>
        </template>
      </DataTable>
    </v-card>
    <v-card class="d-flex justify-center py-2 px-4 mt-4">
      <template v-if="boxInfo.id">
        <v-btn
          v-if="['END_TENDER', 'ALREADY_DOWNLOAD'].includes(boxInfo.tenderStatus)"
          @click="onReportClick"
          >下載投標箱資料</v-btn
        >
        <v-btn v-if="!isUnfied" @click="onLogClick">活動記錄</v-btn>
        <v-btn
          v-if="!isUnfied && ['NOT_STARTED'].includes(boxInfo.tenderStatus)"
          @click="onStartClick"
          >開標</v-btn
        >
        <v-btn v-if="!isUnfied && ['PROCEED'].includes(boxInfo.tenderStatus)" @click="onEndClick"
          >截標</v-btn
        >
      </template>
      <template>
        <v-btn @click="onCloseClick">關閉</v-btn>
      </template>
    </v-card>
    <!--  -->
    <v-dialog v-model="passwordDiglog.show" width="600" persistent>
      <v-card>
        <v-card-title>
          <div class="text-h6 font-weight-bold">
            <span>此投標箱已加密</span>
          </div>
          <v-spacer />
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="editDialogForm" class="card__content" @submit.prevent="init">
          <form-item label="請輸入密碼" labelRequired>
            <cover-input v-model="passwordDiglog.password" type="password" />
          </form-item>
        </v-form>
        <v-card-actions class="d-flex align-center justify-center">
          <v-btn depressed @click="onCloseClick">{{ $t('Common.action.cancel') }}</v-btn>
          <v-btn color="primary" depressed @click="init">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <EditDialog ref="editDialog" :password="passwordDiglog.password" @success="init" />
    <EncryptionDialog ref="encryptionDialog" @success="onPasswordChange" />
    <BidBoxLogDialog ref="bidBoxLogDialog" />
    <FileMoveDialog ref="fileMoveDialog" @success="init" />
    <FileDetailDialog ref="fileDetailDialog" />
    <SetStatusDialog ref="setStatusDialog" @success="init" />
    <!--  -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tablePageMixin from '@/mixins/tablePage.js';
import * as dateFilter from '@/utils/date-filter.js';
import { FaxTenderBoxApi, FaxInRecordApi } from '@/api/index.js';
import { bidBoxStatuses, trueFalse, objFindValue, objFindColor } from '@/utils/stock.js';
import { downloadFile } from '@/utils/file.js';
import EditDialog from './dialog/EditDialog';
import EncryptionDialog from './dialog/EncryptionDialog';
import BidBoxLogDialog from './dialog/BidBoxLogDialog.vue';
import FileMoveDialog from './dialog/FileMoveDialog.vue';
import FileDetailDialog from './dialog/FileDetailDialog';
import SetStatusDialog from './dialog/SetStatusDialog';

export default {
  mixins: [tablePageMixin],
  components: {
    EditDialog,
    EncryptionDialog,
    BidBoxLogDialog,
    FileMoveDialog,
    FileDetailDialog,
    SetStatusDialog,
  },
  data() {
    return {
      boxId: this.$route.query.boxId,
      isEncryption: this.$route.query.encrypted === 'y',
      boxInfo: {},
      filterOptions: {},
      tableOptions: {
        sortBy: ['receivedDateTime'],
        sortDesc: [true],
        itemsPerPage: -1,
      },
      tableHeaders: [
        { value: 'recordCode', text: '收件記錄編號', width: 160 },
        { value: 'qrCodeText', text: '傳真識別資料', width: 160 },
        { value: 'tenderBox.cstNbr', text: '標書編號', width: 160 },
        { value: 'fax', text: '傳真號碼', width: 160 },
        { value: 'supplier.supCode', text: '供應商編號', width: 160 },
        { value: 'supplier.supChnFn', text: '供應商名稱', width: 280 },
        { value: 'page', text: '標書版數', width: 160 },
        { value: 'deadTimeDes', text: '逾期收件', width: 180 },
        { value: 'tenderBox.cstDsc', text: '所在投標箱', width: 200 },
        { value: 'receivedDateTime', text: '接收時間', width: 160 },
      ],
      bidBoxStatuses,
      trueFalse,
      passwordDiglog: {
        show: false,
        password: '',
      },
      isUnfied: false,
      isUnbind: false,
    };
  },
  computed: {
    ...mapState('profile', ['cPermissions']),
    canBasicEdit() {
      if (this.$checkPermission(['TENDER_SUP_BOX_EDIT'])) return true;
      if (
        this.$checkPermission(['TENDER_BOX_EDIT']) &&
        ['NOT_STARTED'].includes(this.boxInfo.tenderStatus)
      )
        return true;
      else return false;
    },
  },
  created() {
    if (this.isEncryption) {
      this.passwordDiglog.show = true;
    } else {
      this.init();
    }
  },
  methods: {
    ...dateFilter,
    objFindValue,
    objFindColor,
    // 頁面初始化
    async init() {
      await this.detail(this.passwordDiglog.password);
      if (this.boxInfo.id) {
        this.load();
        this.passwordDiglog.show = false;
      }
    },
    //
    async detail(password) {
      try {
        this.$showDelayLoading();

        let boxInfo = await FaxTenderBoxApi.detail({
          id: this.boxId,
          password,
        });

        boxInfo._encrypted = boxInfo.encrypted ? '是' : '否';
        boxInfo._openDateTime = this.filterDateTime(boxInfo.openDateTime);
        boxInfo._deadDateTime = this.filterDateTime(boxInfo.deadDateTime);
        boxInfo._tenderStatus = this.objFindValue({
          list: bidBoxStatuses,
          value: boxInfo.deleted ? 'DELETE' : boxInfo.tenderStatus,
        });
        this.boxInfo = boxInfo;

        if (['Unfied', 'unfied'].includes(boxInfo.cstNbr)) this.isUnfied = true;
        if (/^Unfied--/.test(boxInfo.cstNbr)) this.isUnbind = true;
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async load() {
      try {
        this.$showDelayLoading();

        let fileRecords = await FaxInRecordApi.searchByBoxId({
          tenderBoxId: this.boxId,
        });
        this.tableItems = fileRecords.map((item) => {
          return {
            ...item,
          };
        });
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onUnbindClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認解除綁定標書編號',
        });

        this.$showDelayLoading();
        await FaxTenderBoxApi.unbind({ tenderBoxId: this.boxId });

        this.$success('解除成功');
        this.init();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onReportClick() {
      try {
        let { cstNbr, tenderStatus } = this.boxInfo;

        if (!['END_TENDER', 'ALREADY_DOWNLOAD'].includes(tenderStatus))
          throw '已截標的投標箱才可以使用總結報告';

        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認總結投標箱',
        });

        if (['END_TENDER'].includes(tenderStatus))
          await FaxTenderBoxApi.editStatus({
            id: this.boxId,
            password: null,
            tenderStatus: 'ALREADY_DOWNLOAD',
          });

        this.$showDelayLoading();
        let reault = await FaxTenderBoxApi.report({
          tenderBoxId: this.boxId,
        });

        this.$hideLoading();
        this.$message('整理資源中，請稍後。');
        downloadFile({ file: reault, fileName: cstNbr });
        this.init();
      } catch (error) {
        this.$hideLoading();
        this.$error(error);
      }
    },
    //
    onEditClick() {
      this.$refs['editDialog'].setDialog({ item: this.boxInfo });
    },
    //
    onEncryptionClick() {
      this.$refs['encryptionDialog'].setDialog({ item: this.boxInfo });
    },
    //
    onLogClick() {
      this.$refs['bidBoxLogDialog'].setDialog({ item: this.boxInfo });
    },
    //
    async onStartClick() {
      try {
        let { tenderStatus } = this.boxInfo;

        if (!['NOT_STARTED'].includes(tenderStatus)) throw '未開始的投標箱才設置開標';

        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認將投標箱設為開標',
        });

        this.$showDelayLoading();

        await FaxTenderBoxApi.editStatus({
          id: this.boxId,
          password: null,
          tenderStatus: 'PROCEED',
        });

        this.$success('設置成功');
        this.init();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onEndClick() {
      try {
        let { tenderStatus } = this.boxInfo;

        if (!['PROCEED'].includes(tenderStatus)) throw '進行中的投標箱才設置截標';

        await this.$confirmDialog({
          showCancel: true,
          text: '是否確認將投標箱設為截標',
        });

        this.$showDelayLoading();

        await FaxTenderBoxApi.editStatus({
          id: this.boxId,
          password: null,
          tenderStatus: 'END_TENDER',
        });

        this.$success('設置成功');
        this.init();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    async onDeleteClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: '是否刪除當前投標箱',
        });

        this.$showDelayLoading();

        await FaxTenderBoxApi.delete({ id: this.boxId });

        this.$success('刪除成功');
        this.init();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onFileMoveClick() {
      this.$refs['fileMoveDialog'].setDialog({ items: this.tableSelected });
    },
    //
    onFileDetaillick(item) {
      this.$refs['fileDetailDialog'].setDialog({ item });
    },
    //
    async onFileDeleteClick() {
      try {
        await this.$confirmDialog({
          showCancel: true,
          text: '是否刪除選中的收件',
        });

        this.$showDelayLoading();

        this.$success(this.$t('Common.message.deleteSuccess'));
        this.reload();
      } catch (error) {
        this.$error(error);
      } finally {
        this.$hideLoading();
      }
    },
    //
    onCloseClick() {
      window.close();
    },
    //
    onPasswordChange(event) {
      this.$router.replace({
        name: 'bidBoxDetail',
        query: { boxId: this.boxId, encrypted: event.encrypted ? 'y' : 'n' },
      });
      this.$router.go(0);
      // window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.des {
  font-size: 14px;
}
</style>
