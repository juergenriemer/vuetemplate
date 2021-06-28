<template>
  <div id="SocialMenu">
    <div class="or">or</div>
    <ion-buttons>
      <ion-button @click="social('google')">
        <ion-icon slot='icon-only' :icon='logoGoogle' />
      </ion-button>
      <ion-button @click="social('facebook')">
        <ion-icon slot='icon-only' :icon='logoFacebook' />
      </ion-button>
      <ion-button @click="social('apple')">
        <ion-icon slot='icon-only' :icon='logoApple' />
      </ion-button>
    </ion-buttons>
  </div>
</template>
<style>
#SocialMenu {
  text-align:center;
}
#SocialMenu .or {
  color:#c0c0c0;
  padding-top:20px;
  padding-bottom:10px;
  text-transform:uppercase;
  font-size:0.9em;
  letter-spacing:2px;
}
#SocialMenu ion-buttons {
  display:flex;
  justify-content:center;
}
#SocialMenu ion-icon {
  color:#444;
}
</style>
<script>
import { IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { logoGoogle, logoFacebook, logoApple } from "ionicons/icons";
export default {
  props: [],
  components: {
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return { logoGoogle, logoFacebook, logoApple }
  },
  methods: {
    social( provider ){
      const backend = process.env.VUE_APP_BACKEND;
      const url = `${backend}/users/social/${provider}/auth`;
      self.location.href = url;
    },
  }
};
</script>
