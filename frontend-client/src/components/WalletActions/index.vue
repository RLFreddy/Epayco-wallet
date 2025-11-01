<template>
  <Card>
    <CardHeader>
      <CardTitle>2. Consultar y Recargar</CardTitle>
      <CardDescription>Verifica tu saldo o añade fondos a tu billetera.</CardDescription>
    </CardHeader>
    <CardContent>
      <CheckBalanceForm />

      <!-- Solo mostramos el saldo si ya fue consultado -->
      <div v-if="walletStore.balance !== null" class="mt-6 p-4 bg-muted rounded-md text-center">
        <p class="text-sm text-muted-foreground">Saldo Actual</p>
        <p class="text-2xl font-bold">${{ walletStore.balance.toLocaleString('es-CO') }}</p>
      </div>

      <div class="mt-6 border-t pt-6">
        <RechargeForm />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWalletStore } from '@/store/walletStore'
import CheckBalanceForm from './CheckBalanceForm.vue'
import RechargeForm from './RechargeForm.vue'

const walletStore = useWalletStore()
</script>
