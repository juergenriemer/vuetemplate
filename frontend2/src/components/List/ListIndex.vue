<template>
  <div>
    <list-grid></list-grid>
    <list-add></list-add>
  </div>
</template>

<script>
import ListAdd from "@/components/List/ListAdd";
import ListGrid from "@/components/List/ListGrid";
export default {
  name: "ListIndex",
  components: { ListAdd, ListGrid },
};
</script>
