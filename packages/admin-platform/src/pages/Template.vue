<template>
  <div class="pa-4">
    <!--  -->
    <draggable v-model="users" class="group" group="users" @start="drag = true" @end="drag = false">
      <div v-for="element in users" :key="element.value">{{ element.text }}</div>
    </draggable>
    <!--  -->
    <draggable v-model="wins" class="group" group="users" @start="drag = true" @end="drag = false">
      <div v-for="element in wins" :key="element.value">{{ element.text }}</div>
    </draggable>
    <!-- <div class="users">
      <div
        class="user"
        v-for="(item, index) in users"
        :key="index"
        draggable="true"
        @draggable="dragstart"
      >
        {{ item.text }}
      </div>
    </div> -->
    <!--  -->
    <!-- <div class="win-box" @dragover="dragover" @drop="drop">
      <div
        class="user"
        v-for="(item, index) in wins"
        :key="index"
        draggable="true"
        @draggable="dragstart"
      >
        {{ item.text }}
      </div>
    </div> -->
    <!--  -->
    <!-- <div class="dogfall-box"></div> -->
    <!--  -->
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      users: [
        { text: '玩家1', value: 1 },
        { text: '玩家2', value: 2 },
        { text: '玩家3', value: 3 },
        { text: '玩家4', value: 4 },
        { text: '玩家5', value: 5 },
        { text: '玩家6', value: 6 },
        { text: '玩家7', value: 7 },
        { text: '玩家8', value: 8 },
        { text: '玩家9', value: 9 },
      ],
      wins: [],
      dragged: null,
    };
  },
  watch: {
    users(to) {
      console.log('🔨[ users ]\n', to);
    },
    wins(to) {
      console.log('🔨[ wins ]\n', to);
    },
  },
  created() {},
  methods: {
    //
    dragstart(event) {
      this.dragged = event.target;
    },
    //
    dragover(event) {
      event.preventDefault();
    },
    //
    drop(event) {
      event.preventDefault();
      console.log('🔨[ event ]\n', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.group {
  width: 100%;
  min-height: 100px;
  background-color: sandybrown;
  margin-bottom: 16px;
}
.users {
  display: flex;
  flex-wrap: wrap;
  .user {
    padding: 8px;
    background-color: sandybrown;
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
.win-box {
  margin-top: 16px;
  width: 100%;
  height: 300px;
  border: 2px solid orange;
}
.dogfall-box {
  margin-top: 16px;
  width: 100%;
  height: 300px;
  border: 2px solid orange;
}
</style>
