<template>
	<div class="flex flex-col justify-center">
		<img :src="`${pbUrl}/api/files/submissions/${submission.id}/${submission.image}`" class="rounded-lg h-[400px]">
		<p class="justify-center flex my-2">Submitter: {{ submission.expand.userId.username }}</p>
		<div class="flex justify-center gap-12 w-full">
			<button @click="denyImage()" class="bg-red-400 py-2 w-24 rounded-lg hover:cursor-pointer">Deny</button>
			<button @click="checkImagePoints()"
				class="bg-green-400 py-2 w-24 rounded-lg hover:cursor-pointer">Approve</button>
		</div>
		<div class="flex justify-center mt-4">
			<div class="bg-gray-200 py-1.5 px-3 rounded-md w-36">
				<p class="text-sm font-semibold text-gray-500 mb-0.5 w-36">Email</p>
				<input @blur="checkNumber()" type="number" min="1" v-model="pointsToAssign" placeholder="Points"
					class="w-full">
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import pb from '../lib/pocketbase';

const props = defineProps<{
	// TODO: Change this type
	submission: any;
}>();

const emit = defineEmits<{
	(event: 'updated'): void
}>();

const pointsToAssign = ref(1);
const pbUrl = ref(import.meta.env.VITE_POCKETBASE_URL);

const denyImage = async () => {
	const data = {
		"score": 0,
		"reviewed": true
	};

	await pb.collection('submissions').update(props.submission.id, data);

	pointsToAssign.value = 1;
	emit('updated');
}

const checkImagePoints = () => {
	if (pointsToAssign.value >= 5) {
		if (window.confirm('You\'ve entered ' + pointsToAssign.value + ' points for this submission, which seems high. Is this correct?')) {
			approveImage();
		}
	} else {
		approveImage();
	}
}

const approveImage = async () => {
	const data = {
		"score": pointsToAssign.value,
		"reviewed": true,
		"reviewer": pb.authStore.record?.id
	};

	await pb.collection('submissions').update(props.submission.id, data);

	pointsToAssign.value = 1;
	emit('updated');
}

const checkNumber = () => {
	if (pointsToAssign.value < 1) {
		pointsToAssign.value = 1;
	}
}
</script>