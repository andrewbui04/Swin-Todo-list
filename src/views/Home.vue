<template>
  <div class="home-page">
    <Sidebar class="sidebar" />
    <div class="content">
      <h1 class="main-title">COS30043: Interface Design and Development</h1>
      <h2 class="sub-title">Custom Program: Swin Todo List</h2>
      <div class="info">
        <p>Name: Bui Thai Anh</p>
        <p>Student ID: 104 221 643</p>
        <p>Technologies: Firebase Auth, Firestore, Vue.js, Vuex, Bootstrap, Bootstrap Vue</p>
      </div>
      <b-button class="get-started-btn">
        <router-link to="/add_task" class="get-started-link">Get started with Swin Todo List</router-link>
      </b-button>

      
    </div>
    <div class="bubbles"></div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
</script>

<style scoped>
.home-page {
  display: flex;
  position: relative; /* Required for the bubble effect positioning */
  background-color:#fff8e1;
}

.sidebar {
  width: 250px; /* Default width of the sidebar */
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

.content {
  padding: 20px;
  background-color:#ffcc80; 
  border-radius: 8px;
  border: 2px solid #ffcc80; /* Tropical fruit border color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px; /* Fixed max-width for the content */
  width: calc(100% - 250px); /* Adjust width based on sidebar width */
  box-sizing: border-box;
  margin: 14rem auto; /* Center horizontally */
  margin-left: 35rem;
  position: relative; /* Required for the bubble effect positioning */
  overflow: hidden; /* Ensures bubbles are contained within the content */
}

.main-title {
  color:darkblue; 
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.sub-title {
  color: red;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.info {
  color:black; 
  font-size: 1rem;
  margin-bottom: 2rem;
}

.get-started-btn {
  background-color: black; 
  border: none;
  color: orange;
}

.get-started-link {
  color: orange; 
  text-decoration: none; 
  font-weight: bold; 
}

/* Bubble effect styles */
.bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
  overflow: hidden;
  z-index: 0; 
}

.bubbles::before,
.bubbles::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 223, 186, 0.5); 
  animation: bubble-animation 15s infinite;
}

.bubbles::before {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation: bubble-animation 15s infinite;
}

.bubbles::after {
  width: 150px;
  height: 150px;
  bottom: 10%;
  right: 10%;
  animation: bubble-animation 20s infinite;
}

@keyframes bubble-animation {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  30% {
    transform: translateY(-30vh) scale(1.5);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-50vh) scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px; 
  }

  .content {
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

  .content {
    margin-left: 0; 
    width: 100%; 
  }
}
</style>
