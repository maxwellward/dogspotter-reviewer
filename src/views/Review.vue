<template>
	<div class="flex flex-col items-center justify-center h-full">
		<div v-if="totalSubmissions == 0" class="text-center">
			<h1 class="text-2xl">No submissions remaining</h1>
			<p>Take a break, maybe go outside.</p>
		</div>
		<h2 v-if="totalSubmissions > 0" class="text-xl mb-3">Submissions remaining: {{ totalSubmissions }}</h2>
		<Image v-if="currentSubmission" :submission="currentSubmission" @updated="updateSubmission" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import pb from '../lib/pocketbase';
import Image from '../components/image.vue';

const totalSubmissions = ref(0);
// TODO: Type as array
const submissions = ref<any[]>([]);
const submissionIndex = ref(0);
// TODO: type as single
const currentSubmission = ref();
const submissionsRemainingOnPage = ref();

onMounted(async () => {
	getSubmissions();
});

const getSubmissions = async () => {
	await pb.collection('submissions').getList(1, 20, {
		filter: 'reviewed = false',
		expand: 'userId'
	}).then((response) => {
		submissions.value = response.items;
		currentSubmission.value = submissions.value[submissionIndex.value];
		totalSubmissions.value = response.totalItems;
		submissionsRemainingOnPage.value = response.perPage;
	});
}

const updateSubmission = () => {
	submissionIndex.value++;
	currentSubmission.value = submissions.value[submissionIndex.value];
	totalSubmissions.value--;
	submissionsRemainingOnPage.value--;

	if (submissionsRemainingOnPage.value == 0) {
		submissionIndex.value = 0;
		getSubmissions();
	}
}
</script>