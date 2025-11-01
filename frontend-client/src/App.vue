<template>
  <div class="bg-background text-foreground min-h-screen">
    <router-view />
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import Toaster from '@/components/ui/sonner/Sonner.vue'
import 'vue-sonner/style.css'
</script>
