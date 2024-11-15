<template>
	<main class="d-flex align-items-center justify-content-center min-vh-100 bg-sky-blue">
	  <section class="w-100 d-flex justify-content-center">
		<form @submit.prevent="login" class="bg-mango-yellow p-5 rounded shadow-lg border border-passion-purple" style="max-width: 800px;">
		  <h2 class="text-center mb-4 text-passion-purple">Login</h2>
		  <div class="mb-4">
			<label for="email" class="form-label text-passion-purple">Email address</label>
			<input 
			  id="email" 
			  type="email" 
			  class="form-control border-passion-purple" 
			  placeholder="Email address"
			  v-model="login_form.email" />
		  </div>
		  <div class="mb-4">
			<label for="password" class="form-label text-passion-purple">Password</label>
			<input 
			  id="password" 
			  type="password" 
			  class="form-control border-passion-purple" 
			  placeholder="Password" 
			  v-model="login_form.password" />
		  </div>
		  <button type="submit" class="btn btn-papaya-orange w-100 mb-3">Login</button>
		  <p class="text-center">Do not have an account? <router-link to="/register" class="link-kiwi-green">Register</router-link></p>
		</form>
	  </section>
	</main>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
	setup () {
	  const login_form = ref({});
	  const store = useStore();
  
	  const login = () => {
		store.dispatch('login', login_form.value);
	  }
  
	  return {
		login_form,
		login
	  }
	}
  }
  </script>
  
  <style scoped>
  .bg-sky-blue {
	background-color: #87ceeb; 
  }
  
  .bg-mango-yellow {
	background-color: #ffcc00; 
  }
  
  .border-passion-purple {
	border-color: #6a0dad; 
  }
  
  .text-passion-purple {
	color: #6a0dad; 
  }
  
  .btn-papaya-orange {
	background-color: #ff6f61; 
	color: #ffffff; 
  }
  
  .link-kiwi-green {
	color: #8db600; 
  }
  
  .btn-papaya-orange:hover {
	background-color: #e65c50; 
  }
  
  form {
	max-width: 800px; 
	padding: 5rem; 
	border: 3px solid #6a0dad; 
  }
  
  input.form-control {
	font-size: 1.25rem; 
	padding: 0.75rem; 
  }
  
  h2 {
	font-size: 2.5rem; 
  }
  .form-label {
  text-align: left;
  display: block;
  margin-bottom: 0.5rem; 
}
  </style>
  