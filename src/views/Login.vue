<template>
	<p>Please login with your Dogspotter credentials</p>
	<input v-model="email" type="text" placeholder="Email" />
	<input v-model="password" type="password" placeholder="Password" />
	<button @click="login">Login</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import { useAuthStore } from '../store/authStore';
const authStore = useAuthStore();

const email = ref();
const password = ref();

const login = async () => {
	await authStore.signIn(email.value, password.value);
	router.push('/');
}
</script>