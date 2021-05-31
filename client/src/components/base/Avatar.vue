<template>
  <div class="avatar-wrapper">
    <ion-avatar id="avatar" :class="size" :style="{ background: color() }">
      <div v-html="content()"></div>
      <ion-icon
        v-if="role == 'owner' || role == 'admin'"
        :class="role"
        :icon="star"
      ></ion-icon>
    </ion-avatar>
    <IonBadge v-if="updates" color="danger">{{updates}}</IonBadge>
  </div>
</template>
<script>
import { IonAvatar, IonIcon, IonBadge } from "@ionic/vue";
import { toSvg } from "jdenticon";
import { star, build } from "ionicons/icons";

export default {
  // types: list-title, initials, logo
  props: ["size", "role", "initials", "listTitle", "logo", "updates"],
  components: {
    IonAvatar,
    IonIcon,
    IonBadge,
  },
  data() {
    return { star, build };
  },
  methods: {
    content(){
      if( this.listTitle) return toSvg(this.listTitle, 40);
      else if( this.initials) return this.initials
      else if( this.logo) return "Li"
    },
    color() {
      if( this.listTitle) return "whitesmoke"
      else if( this.initials) return this.avatarColor(this.initials);
      else if( this.logo) return "crimson"
    },
    avatarColor(str) {
      if (!str) str = "XXX";
      const s = 30;
      const l = 80;
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var h = hash % 360;
      var textColor = l > 70 ? "#555" : "#fff";
      let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
      return color;
    },
  },
};
</script>
<style>
#avatar {
  position: relative;
  display: flex;
  xbox-shadow: 6px 6px 10px #666 inset;
-webkit-box-shadow: 4px 4px 10px -6px #000000; 
box-shadow: 4px 4px 10px -6px #000000;
}
#avatar div {
  color: #444;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar-wrapper {
  position:relative;
}

.avatar-wrapper ion-badge {
  position: absolute;
  top:0px;
  right:0px;
  margin-top:-5px;
  margin-right:-5px;
  z-index: 1;
}

#avatar.large {
  width: 45px;
  height: 45px;
}
#avatar.large div {
  font-size: 140%;
}
#avatar.medium {
  width: 35px;
  height: 35px;
}
#avatar.medium div {
  font-size: 100%;
}
#avatar svg {
  width: 180px;
  height: 180px;
}

#avatar .admin,
#avatar .owner {
  position: absolute;
  color: goldenrod;
  width: 100%;
  top: -8px;
}
#avatar .admin {
  color: green;
}
</style>
