<template>
    <b-card class="p-4" :title="task.title">
      <b-form @submit.prevent="saveChanges">
        <b-form-group label="Title:" label-for="title">
          <b-form-input
            id="title"
            v-model="task.title"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description:" label-for="description">
          <b-form-textarea
            id="description"
            v-model="task.description"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Due Date:" label-for="due-date">
          <b-form-input
            id="due-date"
            type="date"
            v-model="task.dueDate"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Status:" label-for="status">
          <b-form-select
            id="status"
            v-model="task.status"
            :options="statusOptions"
            required
          ></b-form-select>
        </b-form-group>
        <b-button type="submit" variant="success" class="mr-2">Save Changes</b-button>&nbsp;
        <b-button @click="deleteTask" variant="danger">Delete</b-button>
      </b-form>
    </b-card>
  </template>
  
  <script setup>
  import { ref, defineProps, watch } from 'vue';
  import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { db } from '@/firebase/index.js'; // Adjust the import path as necessary
  import { BCard, BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect, BButton } from 'bootstrap-vue-3';
  
  const props = defineProps({
    task: Object,
    onClose: Function,
  });
  
  const task = ref({ ...props.task }); // Initialize task with props
  
  // Watch for changes in the task prop and update local task state
  watch(() => props.task, (newTask) => {
    task.value = { ...newTask };
  });
  
  const statusOptions = [
    { value: 'To do', text: 'To do' },
    { value: 'In Progress', text: 'In Progress' },
    { value: 'Done', text: 'Done' },
  ];
  
  const saveChanges = async () => {
    try {
      const taskRef = doc(db, 'tasks', task.value.id);
      await updateDoc(taskRef, { ...task.value });
      props.onClose();
    } catch (e) {
      console.error('Error updating task: ', e);
    }
  };
  
  const deleteTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', task.value.id);
      await deleteDoc(taskRef);
      props.onClose();
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };
  </script>
  
  <style scoped>
  .edit-task-form {
    max-width: 600px;
    margin: auto;
  }
  </style>
  