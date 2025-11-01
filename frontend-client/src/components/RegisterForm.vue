<template>
  <Card>
    <CardHeader>
      <CardTitle>1. Registrar Nuevo Cliente</CardTitle>
      <CardDescription>Crea una nueva billetera para un cliente.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="names">
          <FormItem>
            <FormLabel>Nombres</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Juan Perez" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="document">
          <FormItem>
            <FormLabel>Documento</FormLabel>
            <FormControl>
              <Input type="text" placeholder="10203040" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="juan.perez@email.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="cellphone">
          <FormItem>
            <FormLabel>Celular</FormLabel>
            <FormControl>
              <Input type="text" placeholder="3001234567" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button @click="onSubmit" :disabled="!isFormValid || loading" class="w-full mt-4">
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useWalletStore } from '@/store/walletStore'
import { toast } from 'vue-sonner'
import { registerSchema } from '@/lib/validators'

// Componentes Shadcn
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const walletStore = useWalletStore()
const loading = ref(false)

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(registerSchema),
  validateOnMount: false,
})

// Computada para deshabilitar el botón si el formulario no es válido.
const isFormValid = computed(() => meta.value.valid)
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await walletStore.register(values)
    toast.success('Éxito', {
      description: `Cliente ${values.names} registrado. Consultando saldo...`,
    })

    resetForm()
  } catch (error: any) {
    toast.error('Error de Registro', {
      description: error.message,
    })
  } finally {
    loading.value = false
  }
})
</script>
