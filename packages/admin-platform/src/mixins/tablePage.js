import DataTable from '@/components/DataTable';
import BoxHead from '@/components/BoxHead';

export default {
  components: { BoxHead, DataTable },
  mixins: [],
  data() {
    return {
      tableOptions: {
        itemsPerPage: 20,
      },
      tableSelected: [],
      tableItems: [],
      itemsCount: -1,
    };
  },
  computed: {
    initOver() {
      return this.itemsCount >= 0;
    },
    hasSelected() {
      return this.tableSelected.length > 0;
    },
  },
  methods: {
    // 當表格配置變化
    onOptionsChange(to) {
      this.tableOptions = to;
      if (this.initOver && this.load) this.load();
    },
    // 當表格配置變化
    onTableReset() {
      if (this.initOver && this.init) this.reload();
    },
    //
    onRowClick(event1, event2, event3) {
      let find = [...(event3.target?.classList ?? [])].find((item) => {
        return ['header-fixed', 'item-fixed'].includes(item);
      });
      if (find) return;
      find = [...(event3.target?.parentElement?.classList ?? [])].find((item) => {
        return ['header-fixed', 'item-fixed'].includes(item);
      });
      if (find) return;

      this.$set(this.tableItems[event2.index], 'spread', !this.tableItems[event2.index].spread);
    },
    //
    reload() {
      this.tableSelected = [];
      this.tableOptions.page = 1;
      this.load();
    },
    // 表格清空
    tableClear() {
      this.tableSelected = [];
      this.tableItems = [];
      this.itemsCount = -1;
      if (this.filterOptions) this.filterOptions = {};
    },
    // 獲取排序信息
    getSort(options, map = {}) {
      const { sortBy = [], sortDesc = [] } = options || {};
      return sortBy.length > 0
        ? sortBy
            .map((ele, i) => `${map[ele] ? map[ele] : ele}:${sortDesc[i] ? 'desc' : 'asc'}`)
            .join(',')
        : null;
    },
    //
    getPagination(options) {
      const page = options.page - 1 || 0;
      const size = options.itemsPerPage;
      return {
        page,
        size,
      };
    },
  },
};
