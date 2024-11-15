<template>
    <div class="search-bar">
      <b-form-input
        v-model="searchQuery"
        placeholder="Search by task's title"
        class="mb-3"
        @input="emitSearch"
        v-focus
      />
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const vFocus = {
    mounted: (el) => {
      el.style.borderColor = 'red';
      el.style.border = '3px solid green'
      el.focus();

    }
  };

  const emit = defineEmits(['search']);
  
  const searchQuery = ref('');
  
  const emitSearch = () => {
    emit('search', searchQuery.value);
  };
  </script>
  
  <style scoped>
  .search-bar {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .b-form-input {
    width: 100%;
  }
  </style>
  