import { createRouter, createWebHistory } from 'vue-router'
import Review from './views/Review.vue'
import Login from './views/Login.vue'
import pb from './lib/pocketbase'
import { useAuthStore } from './store/authStore'

const routes = [
	{
		path: '/',
		name: 'Review',
		component: Review,
		meta: { requiresAuth: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

// @ts-ignore
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();

	authStore.setIsAuthenticated(pb.authStore.isValid);

	if (authStore.isAuthenticated) {
		await pb.collection('users').authRefresh();
	}

	const isReviewer = pb.authStore.record?.roles.includes('reviewer');

	if (to.meta.requiresAuth && (!authStore.isAuthenticated || !isReviewer)) {
		next('/login');
	} else {
		next();
	}
});


export default router
