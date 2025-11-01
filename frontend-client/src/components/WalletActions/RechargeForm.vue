<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField v-slot="{ componentField }" name="rechargeValue">
      <FormItem>
        <FormLabel>Valor a Recargar</FormLabel>
        <FormControl>
          <Input type="number" placeholder="50000" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      type="submit"
      :disabled="loading || walletStore.balance === null || !isFormValid"
      class="w-full"
    >
      {{ loading ? 'Recargando...' : 'Recargar' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { rechargeSchema } from '@/lib/validators'
import { useWalletStore } from '@/store/walletStore'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { computed, ref } from 'vue'

const walletStore = useWalletStore()
const loading = ref(false)

const { handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(rechargeSchema),
})

const isFormValid = computed(() => meta.value.valid)
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    if (!walletStore.document || !walletStore.cellphone) {
      throw new Error('Primero debes consultar el saldo para identificar la billetera a recargar.')
    }
    const rechargePayload = {
      document: walletStore.document,
      cellphone: walletStore.cellphone,
      value: values.rechargeValue,
    }
    await walletStore.recharge(rechargePayload)
    toast.success('Recarga Exitosa', {
      description: `Nuevo saldo: $${walletStore.balance?.toLocaleString('es-CO')}`,
    })
  } catch (error: any) {
    toast.error('Error en la Recarga', {
      description: error.message,
    })
  } finally {
    loading.value = false
  }
})
</script>
