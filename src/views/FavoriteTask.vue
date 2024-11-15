<template>
    <div class="myFavoriteTask">
      <Sidebar class="sidebar" />
      <div class="main-content">
        <h1 class="my-4 text-center">My Favorite Tasks</h1>
        <div class="tasks-container">
          <!-- Display favorite tasks as cards -->
          <div class="row">
            <div class="col-12 mb-4 d-flex justify-content-center" v-for="task in favoriteTasks" :key="task.id">
              <b-card
                :title="task.title"
                class="task-card"
                header-text-variant="white"
              >
                <b-card-text>
                  <strong>Description:</strong> {{ task.description }}
                </b-card-text>
                <b-card-text>
                  <strong>Due Date:</strong> {{ formatDueDate(task.dueDate) }}
                </b-card-text>
                <b-card-text>
                  <strong>Status:</strong>&nbsp;
                  <span :class="['status-chip', getChipClass(task.status)]">{{ task.status }}</span>
                </b-card-text>
                <b-button variant="danger" @click="deleteTask(task.id)" class="mt-2">Delete</b-button>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '@/firebase/index.js'; 
  import Sidebar from '@/components/Sidebar.vue'; 
  import { BCard, BButton } from 'bootstrap-vue-3'; 
  import { format, parseISO } from 'date-fns';

  // State to hold the favorite tasks
  const favoriteTasks = ref([]);
  
  // Fetch tasks from Firestore
  const fetchFavoriteTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fav_tasks'));
      favoriteTasks.value = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching favorite tasks: ', e);
    } 
  };
  
  // Fetch favorite tasks when the component is mounted
  onMounted(() => {
    fetchFavoriteTasks();
  });
  
  // Format due date function
  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date'; // Return a placeholder if dueDate is not provided
  
    try {
      const parsedDate = parseISO(dueDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      return format(parsedDate, 'dd MMMM yyyy');
    } catch (e) {
      console.error('Error formatting date: ', e);
      return 'Invalid date';
    }
  };
  
  // Function to get chip class based on status
  const getChipClass = (status) => {
    switch (status) {
      case 'Done':
        return 'chip-done'; // Green
      case 'In Progress':
        return 'chip-in-progress'; // Yellow
      case 'To do':
        return 'chip-to-do'; // Red
      default:
        return 'chip-default'; // Default color
    }
  };
  
  // Function to delete a task=>Create an async await function
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'fav_tasks', taskId));
      favoriteTasks.value = favoriteTasks.value.filter(task => task.id !== taskId); // Remove the deleted task from the UI
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };
  </script>
  
  <style scoped>
.myFavoriteTask {
  display: flex;
  flex-wrap: nowrap;
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem; /* Adjust the font size as needed */
  font-weight: bold;
  color: transparent; /* Make the text transparent to show the gradient */
  background: linear-gradient(90deg, #FF7043, #FDD835, #8BC34A); 
  -webkit-background-clip: text; 
  background-clip: text;
  margin-bottom: 10px;
  text-align: center;
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
  z-index: 1000;
  transition: transform 0.3s ease;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 20px;
  background-color: #fff8e1;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.task-card {
  border-radius: 8px; /* Smaller border radius */
  border: 2px solid #ff5722; /* Thicker border with tropical color */
  background-color: #fff; /* Default background color for the card */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Slightly smaller shadow */
  padding: 10px; /* Smaller padding inside the card */
  max-width: 500px; /* Max width for the card */
  width: 100%; /* Ensure the card takes up full width in its column */
}

.status-chip {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px; /* Round chip */
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.chip-done {
  background-color: #4CAF50; /* Green */
}

.chip-in-progress {
  background-color: #FFC107; /* Yellow */
}

.chip-to-do {
  background-color: #F44336; /* Red */
}

@media (max-width: 1024px) {
  .sidebar {
    width: 200px; /* Reduced sidebar width on smaller screens */
  }
  
  .main-content {
    margin-left: 200px; /* Adjust margin to match the new sidebar width */
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    transform: translateX(-100%); /* Hide sidebar off-screen */
  }
  
  .main-content {
    margin-left: 0; /* Adjust margin for hidden sidebar */
  }
}

@media (max-width: 576px) {
  .task-card {
    max-width: 100%;
  }
}
</style>
  