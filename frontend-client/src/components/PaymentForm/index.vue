<template>
  <Card>
    <CardHeader>
      <CardTitle>3. Realizar un Pago</CardTitle>
      <CardDescription>Descuenta fondos de tu billetera para una compra.</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Paso 1 -->
      <InitiatePaymentForm v-if="step === 1" @done="step = 2" />
      <!-- Paso 2 -->
      <ConfirmPaymentForm v-if="step === 2" @done="step = 1" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InitiatePaymentForm from './InitiatePaymentForm.vue'
import ConfirmPaymentForm from './ConfirmPaymentForm.vue'

const step = ref(1)
</script>
