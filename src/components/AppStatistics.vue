<template>
  <div class="map_textBlock">
    <div>Всего комплексов:{{ total }}</div>
    <div>Выключено комплексов: {{ countOffline }}</div>
    <div>Комплексов в работе: {{ countOnline }}</div>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  features: {
    type: Array,
    default: () => [],
  },
});
const total = computed(() => props.features.length);
const countOnline = computed(
  () => props.features.filter((feature) => feature.properties.online).length
);
const countOffline = computed(
  () => props.features.filter((feature) => !feature.properties.online).length
);
</script>
<style lang="css">
.map_textBlock {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;
}
</style>
