<template>
  <!--  -->
  <div v-if="pageModel === 'prepare'" class="prepare pa-4">
    <div class="chips">
      <v-chip
        v-for="(item, index) in defaults"
        :key="index"
        :color="item.action ? 'primary' : 'white'"
        large
        @click="item.action = !item.action"
      >
        {{ item.text }}
      </v-chip>
    </div>
    <v-btn class="go mt-4" color="primary" block @click="onGoClick">出发</v-btn>
  </div>
  <!--  -->
  <div v-else-if="pageModel === 'run'" class="pa-4">
    <!--  -->
    <v-card class="plays" elevation="1">
      <v-card-title class="">玩家</v-card-title>
      <div class="card-content">
        <draggable v-model="plays" class="draggable" group="plays">
          <div v-for="item in plays" :key="item.value" class="move-tag">{{ item.text }}</div>
        </draggable>
      </div>
    </v-card>
    <!--  -->
    <div class="result">
      <v-card class="wins" elevation="1">
        <v-card-title>胜者</v-card-title>
        <div class="card-content">
          <draggable v-model="wins" class="draggable" group="plays">
            <div v-for="item in wins" :key="item.value" class="move-tag">{{ item.text }}</div>
          </draggable>
        </div>
      </v-card>
      <v-card class="draws" elevation="1">
        <v-card-title>平者</v-card-title>
        <div class="card-content">
          <draggable v-model="draws" class="draggable" group="plays">
            <div v-for="item in draws" :key="item.value" class="move-tag">{{ item.text }}</div>
          </draggable>
        </div>
      </v-card>
    </div>
    <!--  -->
    <div class="double-button">
      <v-btn @click="onCountClick('normal')">常规关卡</v-btn>
      <v-btn @click="onCountClick('survival')">生存关卡</v-btn>
    </div>
    <!--  -->
    <div class="grades">
      <div class="grade" v-for="item in grades" :key="item.value">
        <div class="name">{{ item.text }}</div>
        <div
          :style="{
            '--progress': `${item.progress}%`,
            '--progress-color': `var(${item.progressColor})`,
          }"
          class="progress-count"
        >
          <div class="progress">
            <div class="count">{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
  </div>
  <!--  -->
</template>

<script>
import { cloneDeep } from 'lodash-es';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      pageModel: 'prepare', // prepare run
      //
      defaults: [
        { text: '皮', action: true },
        { text: '淮', action: false },
        { text: '添', action: false },
        { text: '朱', action: false },
        { text: '宝', action: false },
        { text: '朗', action: false },
        { text: '卢', action: false },
        { text: '才', action: false },
        { text: '森', action: false },
        { text: 'P1', action: false },
        { text: 'P2', action: false },
      ],
      //
      plays: [],
      wins: [],
      draws: [],
      grades: [],
    };
  },
  watch: {},
  created() {},
  methods: {
    //
    onGoClick() {
      this.pageModel = 'run';

      let temp = this.defaults
        .filter((item) => item.action)
        .map((item, index) => {
          return {
            ...item,
            value: `play${index}`,
            count: 0,
          };
        });
      // let temp = [
      //   { text: '玩家1', value: 'p1', count: 0 },
      //   { text: '玩家2', value: 'p2', count: 0 },
      //   { text: '玩家3', value: 'p3', count: 0 },
      //   { text: '玩家4', value: 'p4', count: 0 },
      //   { text: '玩家5', value: 'p5', count: 0 },
      //   { text: '玩家6', value: 'p6', count: 0 },
      //   { text: '玩家7', value: 'p7', count: 0 },
      //   { text: '玩家8', value: 'p8', count: 0 },
      //   { text: '玩家9', value: 'p9', count: 0 },
      // ];

      this._temp = cloneDeep(temp);
      this.grades = cloneDeep(temp);
      this.setProgress();
      this.plays = cloneDeep(temp);
    },
    //
    setProgress() {
      this.grades = this.grades.map((item) => {
        let progress = ((Math.abs(item.count) / 30) * 100).toFixed(2);
        return {
          ...item,
          progress,
          progressColor: item.count > 0 ? '--v-success-base' : '--v-error-base',
        };
      });
    },
    //
    onCountClick(model) {
      try {
        if (this.wins.length === 0) throw '没有赢的？';

        if (model === 'normal') {
          if (this.wins.length * 2 + this.draws.length - this.grades.length !== 0)
            throw '胜负平数量不正确';

          // wins
          this.wins.forEach((win) => {
            let index = this.grades.findIndex((play) => win.value == play.value);
            ++this.grades[index].count;
          });
          // loses
          this.grades.filter((play, pIndex) => {
            let index1 = this.wins.findIndex((win) => play.value == win.value);
            if (index1 > -1) return;
            let index2 = this.draws.findIndex((draw) => play.value == draw.value);
            if (index2 > -1) return;

            --this.grades[pIndex].count;
          });
          this.setProgress();
        } else if (model === 'survival') {
          if (this.wins.length > 1) throw '胜负平数量不正确';

          this.grades.filter((play, pIndex) => {
            let index = this.wins.findIndex((win) => play.value == win.value);
            if (index > -1) {
              this.grades[pIndex].count = this.grades[pIndex].count + this.grades.length - 1;
            } else {
              --this.grades[pIndex].count;
            }
          });
          this.setProgress();
        }

        this.plays = cloneDeep(this._temp);
        this.wins = [];
        this.draws = [];
      } catch (error) {
        this.$error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.prepare {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .v-chip {
    margin-right: 8px;
    margin-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .go {
    flex-grow: 0;
  }
}
//
.v-card {
  display: flex;
  flex-direction: column;
  min-height: 180px;
  .v-card__title {
    background-color: rgba(193, 193, 193, 0.4);
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .draggable {
    flex-grow: 1;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: 16px 8px 8px 16px;
  }
  .move-tag {
    margin-left: 0;
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 8px 24px;
    background-color: var(--v-primary-base);
    color: #ffffff;
    border-radius: 4px;
  }
}
.plays {
}
.result {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  & > div {
    width: 48%;
  }
}
.wins {
  .move-tag {
    background-color: var(--v-success-base);
  }
}
.draws {
  .move-tag {
    background-color: var(--v-success-lighten1);
  }
}
.double-button {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  .v-btn {
    width: 48%;
  }
}
.grades {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  .grade {
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 20px;
    margin-bottom: 4px;
    box-sizing: border-box;
    .name {
      flex-shrink: 0;
      margin-right: 8px;
    }
    .progress-count {
      --progress: 0%;
      --progress-color: red;
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      .progress {
        position: relative;
        display: flex;
        align-items: center;
        width: var(--progress);
        height: 10px;
        margin: auto 0;
        border-radius: 6px;
        background-color: var(--progress-color);
      }
      .count {
        position: absolute;
        left: 102%;
        flex-shrink: 0;
        font-weight: bold;
      }
    }
  }
}
</style>
