<template>
    <div id="app">
      <b-container fluid>
        <b-row>
          <b-col cols="12" md="3" class="sidebar-container">
            <Sidebar />
          </b-col>
          <b-col cols="12" md="9" class="main-content">
            <h1 v-rainbow>My Plan</h1>
            <div class="task-container">
              <b-card
                v-for="task in tasks"
                :key="task.id"
                class="task-card"
                header-bg-variant="danger"
                header-text-variant="white"
              >
                <template #header>
                  <h4><em>{{ task.title }}</em></h4>
                </template>
                <b-card-subtitle class="mb-2 text-muted">
                  <strong>Due Date:</strong> {{ task.dueDate }}
                </b-card-subtitle>
                <strong>Description:</strong>
                <b-card-text class="text-danger">
                  {{ task.description }}
                </b-card-text>
                <strong>Category:</strong>
                <b-card-text class="text-primary">
                 {{ task.category }}
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import Sidebar from '@/components/Sidebar.vue';
  
    
  const vRainbow = {
    mounted(el) {
    const colors = [
      '#4CAF50', // Green
      '#FFC107', // Yellow
      '#F44336', // Red
      '#2196F3'  // Blue
    ];

    const changeColor = () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.color = randomColor;
    };

    // Change color every 1000 milliseconds (1 second)
    const intervalId = setInterval(changeColor, 1000);

    // Cleanup when the component is unmounted
    el._colorInterval = intervalId;
  },
  unmounted(el) {
    // Clear the interval when the directive is unmounted
    clearInterval(el._colorInterval);
  }
};

  const tasks = ref([]);
  
  // Fetch tasks from the "plan" collection
  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'plan'));
      tasks.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching tasks from My Plan:', error);
    }
  };
  
  // Lifecycle hook
  onMounted(fetchTasks);
  </script>
  
  <style scoped>
  #app {
    display: flex;
    height: 100vh;
    flex-direction: column;
  }
  
  .sidebar-container {
    display: flex;
    flex-direction: column;
    background-color: #fff8e1;
    height: 100vh;
    position: sticky;
    top: 0;
    transition: transform 0.3s ease;
  }
  
  .main-content {
    background-color: #fff8e1;
    padding: 16px;
  }
  
  @media (max-width: 991px) {
    .sidebar-container {
      transform: translateX(-100%);
    }
  }
  
  .task-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .task-card {
    max-width: 100%;
    width: 100%;
  }
  
  @media (min-width: 992px) {
    .task-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
  }
  
  /* Adjust <h1> positioning */
  h1 {
    margin-left: 16px; /* Adjust this value as needed */
  }
  </style>
  