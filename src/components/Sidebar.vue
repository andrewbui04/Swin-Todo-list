<template>
    <div id="sidebar" v-if="isLoggedIn">
      <div id="sidebar-header" class="text-center mb-4">
        <img :src="avatarUrl" alt="Avatar" id="avatar" />
        <p class="mt-2">Welcome back, {{ userEmail }}</p>
      </div>
      <router-link to="/" class="btn btn-link">Home</router-link>
      <router-link to="/my_task" class="btn btn-link">My Task</router-link>
      <router-link to="/add_task" class="btn btn-link">Add Task</router-link>
      <router-link to="/favorite_task" class="btn btn-link">My Favorite Task</router-link>
      <router-link to="/recommend_task" class="btn btn-link">Recommended Task</router-link>
      <router-link to="/my_plan" class="btn btn-link">My Future Plan</router-link>
      <button @click="logout" class="btn btn-danger mt-auto">Logout</button>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  import avatarImage from '@/assets/avatar.jpg' // Import the avatar image
  
  export default {
    setup() {
      const store = useStore()
      const isLoggedIn = computed(() => store.state.user)
      const userEmail = computed(() => store.state.user ? store.state.user.email : 'Guest')
  
      // Use the imported image URL
      const avatarUrl = computed(() => avatarImage)
  
      const logout = () => {
        store.dispatch('logout')
      }
  
      return { isLoggedIn, userEmail, avatarUrl, logout }
    }
  }
  </script>
  
  <style scoped>
  #sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100%;
    background-color:whitesmoke;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #sidebar-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  #avatar {
    width: 100px; 
    height: 100px; 
    border-radius: 50%;
  }
  
  #sidebar-header p {
    margin: 0;
    font-weight: bold;
    color:brown;
  }
  
  #sidebar a {
    display: block;
    padding: 10px 0;
    font-weight: bold;
    color: #333;
    text-decoration: none; 
  }
  
  #sidebar a.router-link-exact-active {
    color: #42b983;
  }
  
  .btn-link {
    color: #333;
    font-weight: bold;
  }
  
  .btn-link:hover {
    color: #42b983;
  }
  
  .btn-primary {
    width: 100%; /* Ensure button spans full width */
  }
  
  .mt-auto {
    margin-top: auto; /* Pushes the Logout button to the bottom */
  }
  </style>
  