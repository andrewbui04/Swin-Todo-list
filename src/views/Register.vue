<template>
	<main class="d-flex align-items-center justify-content-center min-vh-100 bg-sky-blue">
	  <section class="w-100 d-flex justify-content-center">
		<form @submit.prevent="register" class="bg-mango-yellow p-5 rounded shadow-lg border border-passion-purple" style="max-width: 800px;">
		  <h2 class="text-center mb-4 text-passion-purple">Register</h2>
		  <div class="mb-4">
			<label for="email" class="form-label text-passion-purple">Email address</label>
			<input 
			  id="email" 
			  type="email" 
			  class="form-control border-passion-purple" 
			  placeholder="Email address"
			  v-model="register_form.email" />
		  </div>
		  <div class="mb-4">
			<label for="password" class="form-label text-passion-purple">Password</label>
			<input 
			  id="password" 
			  type="password" 
			  class="form-control border-passion-purple" 
			  placeholder="Password" 
			  v-model="register_form.password" />
		  </div>
		  <div class="mb-4">
			<label for="confirm_password" class="form-label text-passion-purple">Confirm Password</label>
			<input 
			  id="confirm_password" 
			  type="password" 
			  class="form-control border-passion-purple" 
			  placeholder="Confirm Password" 
			  v-model="register_form.confirmPassword" />
			<p v-if="unMatchPassword" class="text-danger mt-2">Passwords do not match.</p>
		  </div>
		  <button type="submit" class="btn btn-papaya-orange w-100 mb-3">Register</button>
		  <p class="text-center">Already have an account? <router-link to="/login" class="link-kiwi-green">Login</router-link></p>
		</form>
	  </section>
	</main>
  </template>
  
  
  <script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup () {
    const register_form = ref({
      email: '',
      password: '',
      confirmPassword: ''
    });
    const store = useStore();
    
    const unMatchPassword = computed(() => {
      return register_form.value.password !== register_form.value.confirmPassword;
    });

    const register = () => {
      if (unMatchPassword.value) {
        return; 
      }
      store.dispatch('register', {
        email: register_form.value.email,
        password: register_form.value.password
      });
    };

    return {
      register_form,
      register,
      unMatchPassword
    };
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
  
  
  .link-kiwi-green {
	color: #8db600; 
  }
  
  .btn-papaya-orange {
  background-color: #ff6f61; 
  color: #ffffff;
  transition: background-color 0.3s, color 0.3s; 
}

.btn-papaya-orange:hover {
  background-color: #e65c50; 
  color: #000000; 
}

form {
	max-width: 800px; 
	padding: 5rem; 
}

input {
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
  