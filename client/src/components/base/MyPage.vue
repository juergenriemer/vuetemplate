<template>
  <slot :id="id"/>
</template>
<script>
export default {
  props: [ "id"]
};
</script>
