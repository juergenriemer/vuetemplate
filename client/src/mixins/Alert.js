import { alertController } from "@ionic/core";
export default {
  methods: {
    async confirm(action, cb) {
      alertController
        .create({
          header: `Are you sure?`,
          message: `You are about ${action}!`,
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => cb(),
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
