<template>
  <div class="pa-4">
    <v-btn>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="secondary">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="primary">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="accent">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="error">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="info">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="success">{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="warning">{{ $t('Common.action.confirm') }}</v-btn>
    <br />
    <v-btn text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="secondary" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="primary" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="accent" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="error" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="info" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="success" text>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="warning" text>{{ $t('Common.action.confirm') }}</v-btn>
    <br />
    <v-btn outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="secondary" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="primary" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="accent" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="error" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="info" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="success" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <v-btn color="warning" outlined>{{ $t('Common.action.confirm') }}</v-btn>
    <!--  -->
    <v-card class="tab-card mt-4" style="box-shadow: none">
      <v-card-title>
        <div class="text-subtitle-1 font-weight-bold">
          <span>test</span>
        </div>
        <v-spacer />
      </v-card-title>
      <v-divider />
      <div class="py-4 pl-4">
        <TableFilter notHidden notButton>
          <TableFilterItem label="all" allCol="6">
            <cover-date
              v-model="formTest.a1"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
            />
          </TableFilterItem>
          <TableFilterItem label="all" allCol="6">
            <cover-date
              v-model="formTest.a2"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
            />
          </TableFilterItem>
          <TableFilterItem label="onlyDate" allCol="6">
            <cover-date
              v-model="formTest.b1"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyDate
            />
          </TableFilterItem>
          <TableFilterItem label="onlyDate" allCol="6">
            <cover-date
              v-model="formTest.b2"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyDate
            />
          </TableFilterItem>
          <TableFilterItem label="onlyTime" allCol="6">
            <cover-date
              v-model="formTest.c1"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyTime
            />
          </TableFilterItem>
          <TableFilterItem label="onlyTime" allCol="6">
            <cover-date
              v-model="formTest.c2"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyTime
            />
          </TableFilterItem>
          <TableFilterItem label="onlyMonth" allCol="6">
            <cover-date
              v-model="formTest.e1"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyMonth
            />
          </TableFilterItem>
          <TableFilterItem label="onlyMonth" allCol="6">
            <cover-date
              v-model="formTest.e2"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
              onlyMonth
            />
          </TableFilterItem>
          <TableFilterItem label="range-onlyMonth" allCol="6">
            <cover-date-range
              v-model="formTest.d1"
              :placeholder="$t('Common.label.plsSelect')"
              onlyMonth
              hide-details
            />
          </TableFilterItem>
          <TableFilterItem label="range" allCol="6">
            <cover-date-range
              v-model="formTest.d2"
              :placeholder="$t('Common.label.plsSelect')"
              hide-details
            />
          </TableFilterItem>
        </TableFilter>
      </div>
    </v-card>
    <!--  -->
    <v-card class="tab-card mt-4" style="box-shadow: none">
      <v-card-title>
        <div class="text-subtitle-1 font-weight-bold">
          <span>test</span>
        </div>
        <v-spacer />
      </v-card-title>
      <v-divider />
      <div class="py-4 pl-4">
        <TableFilter notHidden notButton>
          <TableFilterItem label="all" allCol="6">
            <ApiSearch
              v-model="filterOptions.a1"
              :searchFun="searchBox"
              hide-details
              default-search
            />
          </TableFilterItem>
          <TableFilterItem label="all" allCol="6">
            <ApiSearch
              v-model="filterOptions.a2"
              :searchFun="searchBox"
              hide-details
              default-search
              chip
            />
          </TableFilterItem>
          <TableFilterItem label="all" allCol="6">
            <ApiSearch
              v-model="filterOptions.a3"
              :searchFun="searchBox"
              hide-details
              default-search
              multiple
            />
          </TableFilterItem>
          <TableFilterItem label="all" allCol="6">
            <ApiSearch
              v-model="filterOptions.a4"
              :searchFun="searchBox"
              hide-details
              default-search
              chip
              multiple
            />
          </TableFilterItem>
        </TableFilter>
      </div>
    </v-card>
    <!--  -->
  </div>
</template>

<script>
import { FaxTenderBoxApi } from '@/api/index.js';
import ApiSearch from '@/components/ApiSearch';

export default {
  components: { ApiSearch },
  data() {
    return {
      formTest: {},
      filterOptions: {},
    };
  },
  created() {
    setTimeout(() => {
      this.$set(this.formTest, 'a2', '2020-02-02 10:10');
      this.$set(this.formTest, 'b2', '2020-02-02');
      this.$set(this.formTest, 'c2', '10:10');
      this.$set(this.formTest, 'e2', '2020-02');
    }, 2000);

    setTimeout(() => {
      this.$set(this.formTest, 'a2', '2023-03-03 13:13');
      this.$set(this.formTest, 'b2', '2023-03-03');
      this.$set(this.formTest, 'c2', '13:13');
      this.$set(this.formTest, 'e2', '2020-08');
    }, 4000);
  },
  methods: {
    //
    async searchBox(evnet, currentItems) {
      let find = currentItems.find(
        (item) => this.filterOptions.tenderBoxId === item.id && evnet === item.text
      );
      if (find) return currentItems;

      const { content } = await FaxTenderBoxApi.search({
        page: 0,
        size: 50,
        sort: '',
        obj: { cstDsc: evnet },
      });
      return content.map((item) => {
        return {
          ...item,
          text: item.cstDsc,
          value: item.id,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-btn {
  width: 70px;
}
</style>
