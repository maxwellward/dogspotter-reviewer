import { createRouter, createWebHistory } from 'vue-router'
import Review from './views/Review.vue'
import Login from './views/Login.vue'
import pb from './lib/pocketbase'

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
	const isAuthenticated = pb.authStore.isValid;
	if (isAuthenticated) {
		await pb.collection('users').authRefresh();
	}

	console.log(isAuthenticated);


	const isReviewer = pb.authStore.record?.roles.includes('reviewer');

	console.log(isReviewer);


	if (to.meta.requiresAuth && !isAuthenticated) {
		next('/login');
	} else {
		next();
	}
});


export default router
