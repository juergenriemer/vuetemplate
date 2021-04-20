import { popoverController } from "@ionic/core";
export default {
  methods: {
    async showMenu(evt, menuData) {
      evt.preventDefault();
      evt.stopPropagation();
      let menu;
      popoverController
        .create({
          component: this.$options.components.MenuComponent,
          componentProps: {
            data: menuData,
            action: (evt) => {
              const node = evt.target.hasAttribute("data")
                ? node
                : evt.target.closest("[data]");
              if (node) {
                const action = node.getAttribute("data");
                menu.dismiss();
                this.menuAction(action);
              }
            },
          },
          //cssClass: "my-custom-class",
          event: evt,
          translucent: true,
        })
        .then((res) => {
          menu = res;
          menu.present();
        });
    },
  },
};
