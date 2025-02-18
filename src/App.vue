<template>
  <div id="app" class="flex flex-col h-screen">
    <router-view />
    <footer class="mt-auto">
      <Footer />
    </footer>
  </div>
</template>

<script setup lang="ts">
import Footer from './components/footer.vue';
</script>