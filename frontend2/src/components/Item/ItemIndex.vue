<template>
  <div>
    <item-list-menu></item-list-menu>
    <item-grid></item-grid>
    <item-add></item-add>
  </div>
</template>
<script>
import ItemAdd from "@/components/Item/ItemAdd";
import ItemGrid from "@/components/Item/ItemGrid";
import ItemListMenu from "@/components/Item/ItemListMenu";
export default {
  name: "ItemIndex",
  components: { ItemListMenu, ItemGrid, ItemAdd },
};
</script>
