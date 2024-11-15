<template>
  <div class="myTask">
    <Sidebar class="sidebar" />
    <div class="main-content">
      <h1 class="my-4 text-center" v-rainbow>My Tasks</h1>
      <div class="filters-container">
        <SearchBar @search="handleSearch" />
        <FilterDropdown @filter="handleFilter" />
      </div>
      <div class="tasks-container">
        <!-- Display tasks as cards -->
        <div class="row">
          <div class="col-12 mb-4 d-flex justify-content-center" v-for="task in paginatedTasks" :key="task.id">
            <b-button @click="addToFavorites(task)">Add to Favorites</b-button>
            <b-card
              :title="task.title"
              class="task-card"
              header-text-variant="white"
              @click="openEditForm(task)"
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
            </b-card>
          </div>
        </div>
        <!-- Pagination Controls -->
        <div class="pagination-container d-flex justify-content-center">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalTasks"
            :per-page="tasksPerPage"
            align="center"
            class="my-4"
          ></b-pagination>
        </div>
      </div>
    </div>
    <!-- Edit Task Form Modal -->
    <b-modal
      v-model="showEditForm"
      title="Edit Task"
      size="lg"
    >
      <EditTaskForm :task="selectedTask" @close="closeEditForm" />
    </b-modal>

    <!-- Toast Notification -->
    <transition name="fade" @after-leave="resetToast">
      <div v-if="showToast" class="toast-notification">
        Successfully added to favorites!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/index.js'; 
import Sidebar from '@/components/Sidebar.vue';
import { BCard, BPagination, BModal, BButton } from 'bootstrap-vue-3'; 
import { format, parseISO } from 'date-fns';
import SearchBar from '@/components/SearchBar.vue'; 
import FilterDropdown from '@/components/FilterDropdown.vue'; 
import EditTaskForm from '@/components/EditTaskForm.vue'; 

//Using custom directive to change color of h1 tag
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
// State to hold the tasks, filtered tasks, and selected statuses
const tasks = ref([]);
const filteredTasks = ref([]);
const selectedStatuses = ref([]);
const searchQuery = ref('');
const currentPage = ref(1); // Current page
const tasksPerPage = ref(2); // Number of tasks per page

// State for editing task
const showEditForm = ref(false);
const selectedTask = ref(null);

// State for toast notification
const showToast = ref(false);

// Computed property for paginated tasks
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * tasksPerPage.value;
  const end = start + tasksPerPage.value;
  return filteredTasks.value.slice(start, end);
});

// Total number of tasks
const totalTasks = computed(() => filteredTasks.value.length);

// Function to fetch tasks from Firestore
const fetchTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    tasks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    applyFilters(); // Initialize filtered tasks with all tasks
  } catch (e) {
    console.error('Error fetching tasks: ', e);
  }
};

// Fetch tasks when the component is mounted
onMounted(() => {
  fetchTasks();
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

// Handle search input
const handleSearch = (query) => {
  searchQuery.value = query;
  applyFilters(); // Apply both search and filter
};

// Handle filter input
const handleFilter = (statuses) => {
  selectedStatuses.value = statuses;
  applyFilters(); // Apply both search and filter 
};

// Apply filters based on search query and selected statuses
const applyFilters = () => {
  filteredTasks.value = tasks.value.filter(task => {
    const matchesTitle = task.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatuses.value.length ? selectedStatuses.value.includes(task.status) : true;
    return matchesTitle && matchesStatus;
  });
  currentPage.value = 1; // Reset to first page when filters change
};

// Watch for changes in tasks to reset filtered tasks
watch(() => tasks.value, () => {
  applyFilters();
});

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

// Open edit form
const openEditForm = (task) => {
  selectedTask.value = { ...task }; // Clone the task object
  showEditForm.value = true;
};

// Close edit form
const closeEditForm = () => {
  showEditForm.value = false;
  fetchTasks(); // Refresh tasks after closing the form
};

// Add task to favorites
const addToFavorites = async (task) => {
  try {
    // Copy task to the "fav_tasks" collection
    const favTaskRef = doc(db, 'fav_tasks', task.id);
    await setDoc(favTaskRef, task); // Use setDoc to add a new document or overwrite if it already exists

    // Optionally, update the original task's "favorite" field
    const taskDocRef = doc(db, 'tasks', task.id);
    await updateDoc(taskDocRef, { favorite: true });

    console.log('Task added to favorites and copied to "fav_tasks":', task.id);

    // Show the success toast
    showToast.value = true;
    setTimeout(() => showToast.value = false, 2000); // Hide after 2 seconds
  } catch (e) {
    console.error('Error adding task to favorites: ', e);
  }
};

// Reset toast visibility
const resetToast = () => {
  showToast.value = false;
};

</script>

<style scoped>
.myTask {
  display: flex;
  flex-wrap: nowrap;
  min-height: 100vh;
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

.filters-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters-container > * {
  margin-right: 10px;
}

.filters-container > *:last-child {
  margin-right: 0;
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

.toast-notification {
  position: fixed;
  top: 10px;
  left: 60rem;
  transform: translateX(-50%);
  background-color: #4CAF50; /* Green background for success */
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  width: 50%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
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
