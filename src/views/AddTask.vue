<template>
  <div class="add-task-page">
    <Sidebar class="sidebar" />
    <div class="container">
      <h1 class="my-4 text-center text-papaya-orange">Add Task</h1>
      <b-form @submit.prevent="handleSubmit" class="form-custom">
        
        <b-form-group
          id="fieldset-title"
          label="Title"
          label-for="title"
          :valid-feedback="titleValidFeedback"
          :invalid-feedback="titleInvalidFeedback"
          :state="titleState"
        >
          <b-form-input
            id="title"
            v-model="task.title"
            type="text"
            placeholder="Enter task title"
            :state="titleState"
            trim
          />
        </b-form-group>

        <b-form-group
          id="fieldset-description"
          label="Description"
          label-for="description"
          :valid-feedback="descriptionValidFeedback"
          :invalid-feedback="descriptionInvalidFeedback"
          :state="descriptionState"
        >
          <b-form-textarea
            id="description"
            v-model="task.description"
            placeholder="Enter task description"
            rows="3"
            :state="descriptionState"
            trim
          />
        </b-form-group>

        <b-form-group
          id="fieldset-dueDate"
          label="Due Date"
          label-for="dueDate"
          :valid-feedback="dueDateValidFeedback"
          :invalid-feedback="dueDateInvalidFeedback"
          :state="dueDateState"
        >
          <input
            id="dueDate"
            type="date"
            v-model="dueDateInput"
            :state="dueDateState"
            class="form-control-custom"
          />
        </b-form-group>

        <b-form-group
          id="fieldset-status"
          label="Status"
          label-for="status"
          :valid-feedback="statusValidFeedback"
          :invalid-feedback="statusInvalidFeedback"
          :state="statusState"
        >
          <b-form-select
            id="status"
            v-model="task.status"
            :options="statusOptions"
            :state="statusState"
          />
        </b-form-group>

        <b-form-group>
          <b-button type="submit" variant="primary" class="btn-custom">Add Task</b-button>
        </b-form-group>
      </b-form>
    </div>
  </div>
</template>




<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect, BButton } from 'bootstrap-vue-3'
import Sidebar from '@/components/Sidebar.vue'
import { format, parseISO, formatISO, parse } from 'date-fns'

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js"; // Adjust the import path as necessary


const router = useRouter() 

const task = ref({
  title: '',
  description: '',
  status: '',
  dueDate: '' 
})

const statusOptions = [
  { value: '', text: 'Select status' },
  { value: 'In Progress', text: 'In Progress' },
  { value: 'Done', text: 'Done' },
  { value: 'To do', text: 'To Do' }
]

// Validation states and feedback messages
const titleState = ref(null)
const titleInvalidFeedback = ref('')
const titleValidFeedback = computed(() => 'Thank you!')

const descriptionState = ref(null)
const descriptionInvalidFeedback = ref('')
const descriptionValidFeedback = computed(() => 'Thank you!')

const dueDateState = ref(null)
const dueDateInvalidFeedback = ref('')
const dueDateValidFeedback = computed(() => 'Thank you!')

const statusState = ref(null)
const statusInvalidFeedback = ref('')
const statusValidFeedback = computed(() => 'Thank you!')


const dueDateInput = computed({
  get: () => task.value.dueDate ? format(parseISO(task.value.dueDate), 'yyyy-MM-dd') : '',
  set: (newValue) => {
    task.value.dueDate = newValue ? formatISO(parse(newValue, 'yyyy-MM-dd', new Date())) : ''
  }
})


// const updateDueDate = (event) => {
//   task.value.dueDate = event.target.value ? formatISO(parse(event.target.value, 'yyyy-MM-dd', new Date())) : ''
// }

const validateTitle = () => {
  if (!task.value.title.trim()) {
    titleInvalidFeedback.value = 'Title cannot be empty.';
    titleState.value = false;
  } else if (task.value.title.length <= 4) {
    titleInvalidFeedback.value = 'Title must be more than 4 characters.';
    titleState.value = false;
  } else {
    titleInvalidFeedback.value = '';
    titleState.value = true;
  }
}

const validateDescription = () => {
  if (!task.value.description.trim()) {
    descriptionInvalidFeedback.value = 'Description cannot be empty.'
    descriptionState.value = false
  } else {
    descriptionInvalidFeedback.value = ''
    descriptionState.value = true
  }
}

const validateDueDate = () => {
  if (!task.value.dueDate) {
    dueDateInvalidFeedback.value = 'Due Date cannot be empty.'
    dueDateState.value = false
  } else {
    dueDateInvalidFeedback.value = ''
    dueDateState.value = true
  }
}

const validateStatus = () => {
  if (!task.value.status) {
    statusInvalidFeedback.value = 'Status cannot be empty.'
    statusState.value = false
  } else {
    statusInvalidFeedback.value = ''
    statusState.value = true
  }
}

const validateForm = () => {
  validateTitle()
  validateDescription()
  validateDueDate()
  validateStatus()
  return titleState.value && descriptionState.value && dueDateState.value && statusState.value
}

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, "tasks"), {
        title: task.value.title,
        description: task.value.description,
        status: task.value.status,
        dueDate: task.value.dueDate,
        // Add any other fields you need
      });

      alert('Task added successfully!');
      console.log(task.value);
      router.push('/my_task'); // Redirect to MyTask page
    } catch (e) {
      console.error("Error adding task: ", e);
      alert('Failed to add task. Please try again.');
    }
  }
};


// Watchers to update validation states in real-time, execute callback function if changes in data prop
watch(() => task.value.title, validateTitle)
watch(() => task.value.description, validateDescription)
watch(() => task.value.dueDate, validateDueDate)
watch(() => task.value.status, validateStatus)

</script>

<style scoped>
.add-task-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff8e1;
}

.container {
  padding: 20px;
  background-color:#ffb74d; /* Light tropical background color */
  border-radius: 8px;
  border: 5px solid black; /* Tropical fruit border color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px; /* Fixed max-width for the form */
  width: calc(100% - 250px); /* Adjust width based on sidebar width */
  box-sizing: border-box;
  margin: 20px auto; /* Center horizontally */
  transition: margin-left 0.3s ease, width 0.3s ease;
}

h1 {
  color: #ff5722; /* Tropical fruit color for header */
}

.form-custom {
  background-color: #fff3e0; /* Light tropical fruit background for the form */
  padding: 20px;
  border-radius: 18px;
}

.form-group-custom {
  margin-bottom: 1.5rem;
}

.form-label-custom {
  margin-bottom: 0.5rem; /* Space between label and input */
  display: block;
  text-align: left;
  color: #ff6f61; /* Tropical fruit color for labels */
}

.form-control-custom {
  border: 1px solid #ffb74d; /* Tropical fruit border color */
  border-radius: 4px;
  padding: 10px; /* Add padding inside the input field */
  font-size: 16px; /* Adjust font size for better readability */
  width: 100%; /* Make input field take the full width of its container */
}

.form-control-custom:focus {
  border-color: #ff9800; /* Highlight border color on focus */
  box-shadow: 0 0 0 0.2rem rgba(255, 152, 0, 0.25); /* Highlight shadow on focus */
}

.btn-custom {
  background-color: #ff9800; /* Tropical fruit button color */
  border-color: #ff9800;
}

.btn-custom:hover {
  background-color: #fb8c00; /* Darker button color on hover */
  border-color: #f57c00;
}

.sidebar {
  width: 250px; 
  background-color: #fff;
  border-right: 1px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease, width 0.3s ease;
  z-index: 1000;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px; 
  }

  .container {
    margin-left: 200px;
    width: calc(100% - 200px); 
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%); 
    width: 0;
    position: absolute; 
  }

  .container {
    margin-left: 0; 
    width: 100%; 
  }
}
</style>
