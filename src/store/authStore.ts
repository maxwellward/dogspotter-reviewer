// stores/counter.js
import { defineStore } from 'pinia'
import pb from '../lib/pocketbase';
import { VueCookieNext } from 'vue-cookie-next'
import router from '../router';

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			isAuthenticated: false,
		}
	},
	actions: {
		setIsAuthenticated(value: boolean) {
			this.isAuthenticated = value;
		},
		async signIn(email: string, password: string) {
			await pb.collection('users').authWithPassword(email, password);
			if (!pb.authStore.record?.roles.includes('reviewer')) {
				this.signOut();
				return;
			}
			VueCookieNext.setCookie('authSession', pb.authStore.exportToCookie());
		},
		async signOut() {
			await pb.authStore.clear();
			this.setIsAuthenticated(false)
			VueCookieNext.removeCookie('authSession');
			router.push('/login');
		},
	},
})