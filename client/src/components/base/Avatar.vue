<template>
  <ion-avatar id="avatar" :class="size" :style="{ background: color(userId) }">
    <div v-if="userId" v-html="initials"></div>
    <div v-if="listTitle" v-html="jdIcon"></div>
    <ion-icon
      v-if="role == 'owner' || role == 'admin'"
      :class="role"
      :icon="star"
    ></ion-icon>
  </ion-avatar>
</template>
<script>
import { IonAvatar, IonIcon } from "@ionic/vue";
import { toSvg } from "jdenticon";
import { star, build } from "ionicons/icons";

export default {
  props: ["size", "role", "userId", "listTitle"],
  components: {
    IonAvatar,
    IonIcon,
  },
  data() {
    return { star, build };
  },
  computed: {
    initials() {
      let user = this.$store.getters.getMember(this.userId);
      return user && user.short ? user.short : "";
    },
    jdIcon() {
      console.log(this.listTitle);
      return toSvg(this.listTitle, 40);
    },
  },
  methods: {
    color() {
      if (this.initials) return this.avatarColor(this.userId);
      else "#c0c0c0";
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
