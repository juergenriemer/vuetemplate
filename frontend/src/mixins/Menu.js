import { bus } from "@/main";
export default {
  data: () => ({}),
  created() {
    bus.$on("mouseup", evt => {
      this.hideAllPanels();
    });
    bus.$on("keydown", evt => {
      if (evt.key == "Escape") this.hideAllPanels();
    });
  },
  mounted() {
    this.$el.addEventListener("click", evt => {
      if (evt.target.closest(".menu")) this.toggleMenuPanel(evt);
    });
  },
  updated() {
    /*
    console.log("start");
    const menus = this.$el.querySelectorAll(".menu");
    menus.forEach(menu => {
      console.log(menu);
      const toggle = menu.querySelector("i");
      const panel = menu.querySelector("ul");
      panel.classList.add("hide", "menu-panel", "left-direction");
      toggle.addEventListener("click", evt => {
        //        this.toggleMenuPanel(evt);
      });
    });
  */
  },
  methods: {
    hideAllPanels() {
      document
        .querySelectorAll(".menu > ul")
        .forEach(node => (node.style.display = "none"));
    },
    toggleMenuPanel(evt) {
      const toggle = evt.target;
      const panel = toggle.closest(".menu").querySelector("ul");
      panel.style.display = "block";
    }
  }
};
