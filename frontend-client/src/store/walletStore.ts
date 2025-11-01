import { defineStore } from 'pinia'
import { apiService } from '@/services/apiService'
import { ref } from 'vue'
import type {
  CreateUserDto,
  CheckBalanceDto,
  RechargeWalletDto,
  InitiatePaymentDto,
  ConfirmPaymentDto,
} from '@/services/apiService'

export const useWalletStore = defineStore('wallet', () => {
  // Estado reactivo
  const document = ref<string>('')
  const cellphone = ref<string>('')
  const balance = ref<number | null>(null)
  const sessionId = ref<string | null>(null)

  // Acciones
  async function register(payload: CreateUserDto) {
    await apiService.register(payload)
    document.value = payload.document
    cellphone.value = payload.cellphone
    balance.value = 0
  }

  async function checkBalance(payload: CheckBalanceDto) {
    const response = await apiService.getBalance(payload)
    balance.value = Number(response.data.data.balance)
    document.value = payload.document
    cellphone.value = payload.cellphone
  }

  async function recharge(payload: RechargeWalletDto) {
    const response = await apiService.recharge(payload)
    balance.value = Number(response.data.data.newBalance)
  }

  async function initiatePayment(payload: InitiatePaymentDto) {
    const response = await apiService.initiatePayment(payload)
    sessionId.value = response.data.data.sessionId
  }

  async function confirmPayment(payload: ConfirmPaymentDto) {
    await apiService.confirmPayment(payload)
    sessionId.value = null
    if (document.value && cellphone.value) {
      await checkBalance({ document: document.value, cellphone: cellphone.value })
    }
  }

  return {
    document,
    cellphone,
    balance,
    sessionId,
    register,
    checkBalance,
    recharge,
    initiatePayment,
    confirmPayment,
  }
})
