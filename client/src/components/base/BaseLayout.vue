<template>
  <page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            @click="nav(pageDefaultBackLink)"
            :default-href="pageDefaultBackLink"
          ></ion-back-button>
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
    <ion-content>
      <slot name="content" />
    </ion-content>
    <IonFooter v-if="$slots.footer">
      <IonToolbar>
        <slot name="footer" />
      </IonToolbar>
    </IonFooter>
  </page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";
import WebPage from "./MyPage.vue";
// REf: get viewMode or make caseinsensivtive regex
const viewMode = /^\/web\//.test(self.location.pathname);
const Page = viewMode ? WebPage : IonPage;
export default {
  props: ["pageTitle", "pageDefaultBackLink"],
  components: {
    Page,
    IonHeader,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
  },
};
</script>
