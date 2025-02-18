import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { VueCookieNext } from 'vue-cookie-next'
import pb from './lib/pocketbase'

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(VueCookieNext).mount('#app');

VueCookieNext.config({ expire: '7d' })

pb.authStore.loadFromCookie(VueCookieNext.getCookie('authSession'));

