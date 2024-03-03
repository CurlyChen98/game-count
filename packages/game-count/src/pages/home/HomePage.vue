<template>
  <div class="page">
    <v-row class="flex-grow-0" no-gutters>
      <v-col cols="12" class="title">
        <!-- <v-icon color="grey darken-4" large>mdi-account</v-icon> -->
        <span class="font-weight-bold">待發送</span>
        <span class="font-weight-bold">（待發送：0）</span>
      </v-col>
      <v-col cols="12">
        <WaitSent />
      </v-col>
      <v-col cols="12" class="py-4"></v-col>
      <v-col cols="12" class="title">
        <!-- <v-icon color="grey darken-4" large>mdi-account</v-icon> -->
        <span class="font-weight-bold">投標箱</span>
      </v-col>
      <v-col cols="12">
        <BidBox />
      </v-col>
    </v-row>
    <!--  -->
  </div>
</template>

<script>
import tablePageMixin from '@/mixins/tablePage.js';
import WaitSent from './WaitSent';
import BidBox from './BidBox';

export default {
  components: { WaitSent, BidBox },
  mixins: [tablePageMixin],
};
</script>

<style lang="scss" scoped>
.page {
  height: auto;
  min-height: calc(100vh - var(--appBarHeight));
}
.title {
  border-bottom: 2px solid #333333;
}
</style>
