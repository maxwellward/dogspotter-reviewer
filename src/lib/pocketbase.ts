import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	document.cookie = pb.authStore.exportToCookie();
});

export default pb;
