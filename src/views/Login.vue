<template>
	<div class="flex flex-col justify-center items-center h-screen mx-12">
		<h1 class="text-3xl font-mono tracking-widest mb-2 uppercase text-center">Dogspotter Reviewer Panel</h1>
		<p class="font-mono text-center">Please login with your Dogspotter credentials</p>
		<div class="flex flex-col gap-3 w-[80%] sm:w-[60%] md:w-96 mt-6">
			<div class="bg-gray-200 py-2 px-3 rounded-md w-full">
				<p class="text-sm font-semibold text-gray-500 mb-0.5 w-full">Email</p>
				<input v-model="email" type="text" class="w-full" />
			</div>
			<div class="bg-gray-200 py-2 px-3 rounded-md w-full">
				<p class="text-sm font-semibold text-gray-500 mb-0.5 w-full">Password</p>
				<input v-model="password" type="password" class="w-full" />
			</div>
		</div>

		<button @click="login"
			class="bg-gray-800 px-3 py-2 rounded-lg hover:cursor-cell mt-6 w-[80%] sm:w-[60%] md:w-96">
			<p class="text-white font-semibold">Please oh great Dogspotter lords, please let me in so I can commit the
				holy act of
				reviewing canine
				imagery to provide users with internet points for imaginary clout</p>
		</button>
	</div>
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