<template>
  <div id="input">
    <div class="wrapper">
      <div class="image" v-show="imageFile">
        <ion-icon
          class="remove"
          @click="imageFile = null"
          icon="close"
          size="small"
        ></ion-icon>
        <img ref="thumb" class="thumb" />
      </div>
      <div
        class="content"
        @focus="onFocus"
        @blur="onBlur"
        contenteditable="true"
        @input="expand($event)"
        @keydown="onKeydown($event)"
        @click="onClick($event)"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
<script>
import { IonButtons, IonButton, IonIcon } from "@ionic/vue";
export default {
  emits: ["input"],
  props: [
    "expandTo",
    "placeholder",
    "imageFile",
    "value",
    "autofocus",
    "maxlength",
    "background",
    "blank",
  ],
  components: {
    IonButtons,
    IonButton,
    IonIcon,
  },
  mounted() {
    this.input = this.$el.querySelector(".content");
    this.init();
  },
  data() {
    return {
      input: null,
    };
  },
  watch: {
    imageFile() {
      if (this.imageFile) {
        const url = window.URL.createObjectURL(this.imageFile);
        this.$refs.thumb.src = url;
        this.setFocus();
      }
    },
    blank() {
      this.reset();
    },
  },
  methods: {
    reset() {
      this.imageFile = null;
      this.input.textContent = "";
      this.$refs.thumb.src = "//:0";
      this.checkPlaceholder();
    },
    init() {
      if (this.expandTo) {
        this.input.style.maxHeight = `${this.expandTo}px`;
      }
      if (this.background) {
        this.$el.style.background = `${this.background}`;
        this.input.style.background = `${this.background}`;
      }
      this.checkPlaceholder();
      if (this.autofocus) {
        // REF: 1. watch itemInEditmode to set focus when
        // commenting on another item
        // 2. avoid settimeout!!
        setTimeout(() => {
          this.setCursor();
        }, 1000);
      }
    },
    expand(evt) {
      this.checkPlaceholder();
      this.$emit("input", this.userText());
    },
    checkPlaceholder() {
      if (this.placeholder) {
        if (
          this.input.textContent !== this.placeholder &&
          this.input.textContent !== ""
        )
          this.removePlaceholder();
        else this.addPlaceholder();
      }
    },
    userText() {
      return this.input.textContent.replace(this.placeholder, "");
    },
    addPlaceholder() {
      this.input.classList.add("placeholder");
      this.input.textContent = this.placeholder;
    },
    removePlaceholder() {
      if (this.input.classList.contains("placeholder")) {
        this.input.textContent = this.userText();
        this.input.classList.remove("placeholder");
      }
    },
    setCursor() {
      const pos = this.userText().length;
      var range = document.createRange();
      var sel = window.getSelection();
      range.setStart(this.input.childNodes[0], pos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      this.input.focus();
    },
    onKeydown(evt) {
      let valid = true;
      if (evt.which < 48) {
        if (
          this.input.textContent == this.placeholder ||
          this.input.textContent == ""
        ) {
          valid = false;
        }
      }
      if (this.maxlength) {
        if (this.userText().length > this.maxlength) {
          if (!(evt.key == "Backspace" || evt.key == "ArrowLeft")) {
            valid = false;
          }
        }
      }
      if (valid) this.removePlaceholder();
      else evt.preventDefault();
    },
    onClick() {
      if (this.input.classList.contains("placeholder")) {
        this.setCursor();
      }
    },
    setFocus() {
      setTimeout(() => {
        this.setCursor();
      }, 500);
    },
  },
};
</script>
<style scoped>
#input .image {
}
#input .remove {
  cursor: pointer;
}
#input {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}
#input .thumb {
  border: 1px solid #c0c0c0;
  max-width: 300px;
  border-radius: 5px;
}
#input div {
  background: #fff;
  color: #444;
}
#input div:focus {
  outline: none;
}
#input .placeholder {
  color: #c0c0c0;
}

#input .wrapper {
  overflow: auto;
}
#input .wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
#input .wrapper::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}
#input .wrapper::-webkit-scrollbar-track {
  background: #e0e0e0;
}
</style>

