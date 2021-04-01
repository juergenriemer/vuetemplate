<template>
  <div id="wrapper">
    <div id="backdrop"><div class="logo">LL</div></div>
    <div id="app">
      <div id="box">
        <div class="left column" v-if="1 == 1">
          {{ comp }}
          <lists-page></lists-page>
        </div>
        <div class="right column" v-if="comp">
          <component class="content" :is="comp"></component>
        </div>
        <div class="middle column" v-if="1 == 1">
          <items-page v-if="listId"></items-page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListsPage from "../pages/ListsPage.vue";
import ItemsPage from "../pages/ItemsPage.vue";
import ListInfoPage from "../pages/ListInfoPage.vue";
import ListMembersPage from "../pages/ListMembersPage.vue";
import LoginPage from "../pages/LoginPage.vue";

export default {
  props: ["comp", "comp2"],
  components: {
    ListsPage,
    ItemsPage,
    ListInfoPage,
    ListMembersPage,
  },
  data() {
    return {
      infoComponent: null,
    };
  },
  methods: {},
  updated() {
    console.log(this.$route);
  },
};
</script>
<style>
#wrapper {
  border: 1px solid transparent;
}
#info {
  font-weight: bold;
  text-align: center;
  font-size: 1.3em;
  color: #fff;
  padding: 4px;
}
#backdrop {
  position: fixed;
  width: 100%;
  height: 130px;
  background: #ff5f49;
  z-index: -1;
}
#backdrop .logo {
  padding: 1em;
  font-size: 2em;
}

#box {
  display: flex;
  justify-content: flex-start;
  margin: 0;
  height: 100vh;
  box-shadow: 0 2px 2px 0 #c0c0c0, 2px 5px 5px 0 #c0c0c0;
}
/* IPAD issues */
/* 100vh doen't work in ipad */
.is-safari #box {
  height: -webkit-fill-available;
}
/* keyboard overlaps bottom input */
.is-safari #item-add:focus-within {
  margin-bottom: 40px;
  z-index: 100;
}

#single {
  min-width: 300px;
  max-width: 500px;
}
@media (min-width: 505px) {
  #single {
    margin-top: 20px !important;
    margin: 0 auto;
    height: calc(100vh - 40px);
  }
}
#box {
  xmin-width: 640px;
  xmin-width: 500px;
  xmax-width: 1200px;
}
/* min width for outer box _NOT_ for phones */
@media (min-width: 400px) {
  #box {
    min-width: 640px;
    min-width: 500px;
    max-width: 1200px;
  }

  .single.column {
    min-width: 300px;
  }
  .left.column {
    min-width: 250px;
  }
  .middle.column {
    min-width: 250px;
  }
  .right.column {
    min-width: 250px;
  }
}

@media (min-width: 1225px) {
  #box {
    margin-top: 20px !important;
    margin: 0 auto;
    height: calc(100vh - 40px);
  }
}

@media (max-width: 800px) {
  .right.column:not(.hide) ~ .middle.column {
    display: none;
  }
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  background: #fff;
}
.single.column {
  flex: 1;
}
.left.column {
  order: 1;
  flex: 3;
}
.middle.column {
  order: 2;
  flex: 8;
}
.right.column {
  order: 3;
  flex: 8;
}
</style>
