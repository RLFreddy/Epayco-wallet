<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField v-slot="{ componentField }" name="document">
      <FormItem>
        <FormLabel>Documento</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Documento para consultar" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="cellphone">
      <FormItem>
        <FormLabel>Celular</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Celular para consultar" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="!isFormValid || loading" class="w-full">
      {{ loading ? 'Consultando...' : 'Consultar Saldo' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { credentialsSchema } from '@/lib/validators'
import { useWalletStore } from '@/store/walletStore'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { computed, ref, watch } from 'vue'

const walletStore = useWalletStore()
const loading = ref(false)

const { handleSubmit, setFieldValue, meta } = useForm({
  validationSchema: toTypedSchema(credentialsSchema),
})

// Cada vez que el store cambie, **forzamos** el valor en el formulario
watch(
  () => walletStore.document,
  (v) => setFieldValue('document', v ?? ''),
)
watch(
  () => walletStore.cellphone,
  (v) => setFieldValue('cellphone', v ?? ''),
)

const isFormValid = computed(() => meta.value.valid)
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await walletStore.checkBalance({
      document: values.document,
      cellphone: values.cellphone,
    })
    toast.success('Consulta Exitosa', {
      description: `Se ha cargado el saldo para el documento.`,
    })
  } catch (error: any) {
    toast.error('Error al Consultar', {
      description: error.message,
    })
  } finally {
    loading.value = false
  }
})
</script>
