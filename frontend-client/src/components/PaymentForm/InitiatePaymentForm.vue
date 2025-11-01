<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField v-slot="{ componentField }" name="document">
      <FormItem>
        <FormLabel>Documento</FormLabel>
        <FormControl>
          <Input
            type="text"
            v-bind="componentField"
            placeholder="Documento para realizar el pago"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="cellphone">
      <FormItem>
        <FormLabel>Celular</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" placeholder="Celular para realizar el pago" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="amount">
      <FormItem>
        <FormLabel>Monto del Pago</FormLabel>
        <FormControl>
          <Input type="number" placeholder="15000" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="loading || !isFormValid" class="w-full">
      {{ loading ? 'Iniciando...' : 'Iniciar Pago' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { initiatePaymentSchema } from '@/lib/validators'
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

const { handleSubmit, setFieldValue, meta } = useForm({
  validationSchema: toTypedSchema(initiatePaymentSchema),
  initialValues: {
    document: walletStore.document ?? '',
    cellphone: walletStore.cellphone ?? '',
  },
})

watch(
  () => walletStore.document,
  (v) => setFieldValue('document', v ?? ''),
  { immediate: true },
)
watch(
  () => walletStore.cellphone,
  (v) => setFieldValue('cellphone', v ?? ''),
  { immediate: true },
)

const isFormValid = computed(() => meta.value.valid)
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await walletStore.initiatePayment(values)
    toast.success('Revisa tu correo', {
      description: 'Hemos enviado un token de confirmación.',
    })
    emit('done')
  } catch (e: any) {
    toast.error('Error', { description: e.message })
  } finally {
    loading.value = false
  }
})
</script>
