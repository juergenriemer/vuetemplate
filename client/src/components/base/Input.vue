<template>
  <div id="input">
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
</template>
<script>
export default {
  emits: ["input"],
  props: [
    "expandTo",
    "placeholder",
    "value",
    "autofocus",
    "maxlength",
    "background",
  ],
  mounted() {
    this.input = this.$el.querySelector(".content");
    this.init();
  },
  data() {
    return {
      input: null,
    };
  },

  methods: {
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
          console.log("??");
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
        console.log(this.input);
        // this.input.focus();
      }, 500);
    },
  },
};
</script>
<style scoped>
#input {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}
#input div {
  background: #fff;
  color: #444;
  overflow: auto;
}
#input div:focus {
  outline: none;
}
#input .placeholder {
  color: #c0c0c0;
}

#input div::-webkit-scrollbar {
  width: 8px;
}
#input div::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}
#input div::-webkit-scrollbar-track {
  background: #e0e0e0;
}
</style>

