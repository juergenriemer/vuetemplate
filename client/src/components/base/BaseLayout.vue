<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="back(link)" v-if="link">
            <ion-icon slot="icon-only" :icon="icon" size="large"></ion-icon>
          </ion-button>
          <slot name="title"></slot>
        </ion-buttons>
        <ion-title>
          {{ pageTitle }}
        </ion-title>
        <ion-buttons slot="end">
          <slot name="actions-end"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content
      id="content-area"
      class="scroller"
      style="--offset-bottom: 58px"
    >
      <slot class="scroller" name="content" />
    </ion-content>
    <IonFooter v-if="$slots.footer">
      <slot name="footer" />
    </IonFooter>
  </ion-page>
</template>

<script>
import { close, arrowBack } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import WebPage from "./MyPage.vue";
const Page = window.isWeb ? WebPage : IonPage;

export default {
  props: ["pageTitle", "link", "pageDefaultBackLink"],
  components: {
    IonPage,
    Page,
    IonHeader,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return { close, arrowBack };
  },
  computed: {
    icon() {
      return self.isWeb ? this.close : this.arrowBack;
    },
  },
  methods: {
    back(path) {
      let link = path || `/app/list`;
      if (self.isWeb) {
        const listId = this.$route.params.id;
        if (listId) link = `/app/items/${listId}`;
      }
      this.nav(link);
    },
  },
};
</script>
