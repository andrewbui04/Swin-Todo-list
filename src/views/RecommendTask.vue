<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col cols="12" md="3" class="sidebar-container">
          <Sidebar />
        </b-col>
        <b-col cols="12" md="9" class="main-content">
          <b-form-group label="Filter by Category:" label-for="category-select">
            <b-form-select
              id="category-select"
              v-model="selectedCategory"
              :options="categoriesOptions"
              class="mb-3"
            />
          </b-form-group>
          
          <div v-for="category in filteredCategories" :key="category">
            <div class="task-container">
              <b-card
                v-for="task in categorizedTasks[category]"
                :key="task.id"
                class="task-card"
                header-bg-variant="danger"
                header-text-variant="white"
              >
                <template #header>
                  <h4><em>{{ task.title }}</em></h4>
                </template>
                <b-card-subtitle class="mb-2 text-muted"><strong>Due Date:</strong> {{ task.dueDate }}</b-card-subtitle>
                <strong>Description:</strong> 
                <b-card-text class="text-danger">
                  {{ task.description }}
                </b-card-text>
                <template #footer>
                  <b-button variant="success" @click="addToMyPlan(task)">
                    Add to My Plan
                  </b-button>
                </template>
              </b-card>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchRecommendedTasks } from '@/services/taskService';
import Sidebar from '@/components/Sidebar.vue';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const tasks = ref([]);
const categorizedTasks = ref({});
const categories = ref([]);
const selectedCategory = ref('work');

const categoriesOptions = computed(() => [
  { value: 'work', text: 'Work' },
  { value: 'study', text: 'Study' },
  { value: 'entertain', text: 'Entertainment' },
]);

const filteredCategories = computed(() => {
  return [selectedCategory.value];
});

const fetchTasks = async () => {
  try {
    const data = await fetchRecommendedTasks();
    if (Array.isArray(data)) {
      tasks.value = data;

      //categorizedTasks.value = {
      //   'Work': [/* array of work tasks */],
      //   'Personal': [/* array of personal tasks */],
      // };
      const categorized = {};
      tasks.value.forEach(task => {
        if (!categorized[task.category]) {
          categorized[task.category] = [];
          if (!categories.value.includes(task.category)) {
            categories.value.push(task.category);
          }
        }
        categorized[task.category].push(task);
      });
      categorizedTasks.value = categorized;
    } else {
      console.error('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

onMounted(fetchTasks);

const addToMyPlan = async (task) => {
  try {
    const taskRef = doc(db, 'plan', task.id.toString());
    await setDoc(taskRef, {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      category: task.category
    });
    console.log(`Task added to My Plan: ${task.title}`);
  } catch (error) {
    console.error('Error adding task to My Plan:', error);
  }
};
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
  max-width: 300px;
  width: 100%;
}

@media (min-width: 992px) {
  .task-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}
</style>
