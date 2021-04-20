<template>
  <ion-avatar id="avatar" :class="size" :style="{ background: color() }">
    <div v-if="listTitle" class="avatar-jd" v-html="jdIcon"></div>
    <div v-else v-html="initials"></div>
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
  props: ["size", "role", "short", "userId", "listTitle", "logo"],
  components: {
    IonAvatar,
    IonIcon,
  },
  data() {
    return { star, build };
  },
  computed: {
    initials() {
      if (this.logo) return "LL";
      if (this.short) return this.short;
      let user = this.$store.getters.getMember(this.userId);
      return user && user.short ? user.short : "";
    },
    jdIcon() {
      return toSvg(this.listTitle, 40);
    },
  },
  methods: {
    color() {
      if (this.logo) return "crimson";
      else if (this.initials) return this.avatarColor(this.initials);
      return "whitesmoke";
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
  box-shadow: 6px 6px 10px #666 inset;
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

#avatar .avatar-jd {
  position: absolute;
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
