<template>
  <form @submit="onSubmit" class="space-y-4">
    <p class="text-sm text-center text-muted-foreground">
      Revisa tu correo e ingresa el token de 6 dígitos.
    </p>

    <FormField v-slot="{ componentField }" name="token">
      <FormItem>
        <FormLabel>Token de Confirmación</FormLabel>
        <FormControl>
          <Input type="text" placeholder="123456" v-bind="componentField" maxlength="6" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="loading || !isFormValid" class="w-full">
      {{ loading ? 'Confirmando...' : 'Confirmar Pago' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { confirmPaymentSchema } from '@/lib/validators'
import { useWalletStore } from '@/store/walletStore'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const emit = defineEmits<{
  done: []
}>()

const walletStore = useWalletStore()
const loading = ref(false)

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(confirmPaymentSchema),
})

const isFormValid = computed(() => meta.value.valid)
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await walletStore.confirmPayment({
      sessionId: walletStore.sessionId!,
      token: values.token,
    })
    toast.success('¡Pago Confirmado!', {
      description: 'Tu compra fue exitosa y tu saldo ha sido actualizado.',
    })
    resetForm()
    emit('done')
  } catch (e: any) {
    toast.error('Error de Confirmación', { description: e.message })
  } finally {
    loading.value = false
  }
})
</script>
