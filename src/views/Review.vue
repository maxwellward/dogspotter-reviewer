<template>
	<div class="flex flex-col items-center justify-center h-full">
		<div v-if="totalSubmissions === 0" class="text-center font-mono">
			<h1 class="text-2xl">No submissions remaining</h1>
			<p class="mt-2">Take a break, maybe go outside.</p>
			<p class="text-xs" v-if="phrase">({{ phrase }})</p>
		</div>
		<h2 v-if="totalSubmissions > 0" class="text-xl mb-3 font-mono">Submissions in queue: {{ totalSubmissions }}</h2>
		<Image v-if="currentSubmission && totalSubmissions > 0" :submission="currentSubmission"
			@updated="updateSubmission" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import pb from '../lib/pocketbase';
import Image from '../components/image.vue';
import axios from 'axios';

const totalSubmissions = ref(0);
// TODO: Type as array
const submissions = ref<any[]>([]);
const submissionIndex = ref(0);
// TODO: type as single
const currentSubmission = ref();
const submissionsRemainingOnPage = ref();

onMounted(async () => {
	getSubmissions();
	getWeather();
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

const temperature = ref(0);
const phrase = ref('');
const getWeather = async () => {
	try {
		const { ip } = (await axios.get('https://api.ipify.org?format=json')).data;
		const { lat, lon, countryCode } = (await axios.get(`http://ip-api.com/json/${ip}`)).data;
		const { temperature_2m } = (await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`)).data.current;

		if (countryCode === 'US') {
			temperature.value = parseInt((temperature_2m * 9 / 5 + 32).toFixed(0));
		} else {
			temperature.value = temperature_2m.toFixed(0);
		}

		switch (true) {
			case (temperature_2m.toFixed(0) < 0):
				phrase.value = `Actually maybe not, it's ${temperature.value}° outside`;
				break;
			case (temperature_2m.toFixed(0) < 4):
				phrase.value = `I know it's ${temperature.value} outside, you'll survive`;
				break;
			case (temperature_2m.toFixed(0) < 15):
				phrase.value = `It\'s ${temperature.value}° out, that's t-shirt weather in Canada`;
				break;
			case (temperature_2m.toFixed(0) < 26):
				phrase.value = `It's the perfect temperature, ${temperature.value}°`;
				break;
			default:
				phrase.value = `It's ${temperature.value}°, go boil`;
		}
	} catch (error) {

	}
}
</script>