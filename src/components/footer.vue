<template>
	<div class="w-full bg-gray-500 text-white p-4 text-center">
		<p>&copy; {{ new Date().getFullYear() }} Dogspotter</p>
		<p class="text-sm text-gray-300">To be used by authorized Dogspotter staff only</p>
		<button v-if="isLoggedIn" @click="logout" class="text-sm hover:cursor-pointer hover:underline">Logout</button>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();

const isLoggedIn = ref(authStore.isAuthenticated);

watch(() => authStore.isAuthenticated, (val) => {
	isLoggedIn.value = val;
});

const logout = () => {
	authStore.signOut();
}
</script>