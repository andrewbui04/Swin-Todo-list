<template>
  <div class="filter-dropdown">
    <b-form-group label="Filter by status:" class="mb-3">
      <b-form-checkbox-group v-model="selectedStatuses" :options="statusOptions" @change="emitFilter">
        <!-- The v-model will automatically handle checked states based on selectedStatuses array -->
      </b-form-checkbox-group>
    </b-form-group>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['filter']);

const statusOptions = [
  { text: 'Done', value: 'Done' },
  { text: 'In Progress', value: 'In Progress' },
  { text: 'To Do', value: 'To do' }
];

const selectedStatuses = ref([]);

const emitFilter = () => {
  emit('filter', selectedStatuses.value);
};
</script>

<style scoped>
.filter-dropdown {
  max-width: 300px;
  margin: 0 auto;
}

.b-form-group {
  width: 100%;
}

.b-form-checkbox-group {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .filter-dropdown {
    max-width: 100%;
    margin: 10px 0;
  }
}
</style>
