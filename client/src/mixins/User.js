export default {
  methods: {
    myId() {
      return this.$store.getters.userId;
    },
    userById(userId) {
      const member = this.$store.getters.getMember(userId);
      return member;
    },
    userName(userId) {
      const user = this.userById(userId);
      return user ? user.name : "";
    },
    userColor(userId) {
      return "#555";
      const user = this.userById(userId);
      const str = user ? user.name : "Listle";
      if (!str || !str.length) {
        str = "gescheissen";
      }
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
