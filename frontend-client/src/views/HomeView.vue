<template>
  <div class="container mx-auto p-4 md:p-8">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold tracking-tight text-primary">Billetera Virtual Epayco</h1>
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <RegisterForm class="lg:col-span-1" />
      <WalletActions class="lg:col-span-1" />
      <PaymentForm class="lg:col-span-1" />
    </main>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue'
import WalletActions from '@/components/WalletActions/index.vue'
import PaymentForm from '@/components/PaymentForm/index.vue'
</script>
