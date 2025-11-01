import axios, { AxiosError } from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const apiError = error.response.data as { message: string }
      const message = apiError.message || 'Error del servidor'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(new Error(error.message))
  },
)

// Exportar las interfaces para uso en el store y otros componentes
export interface CreateUserDto {
  document: string
  names: string
  email: string
  cellphone: string
}

export interface RechargeWalletDto {
  document: string
  cellphone: string
  value: number
}

export interface CheckBalanceDto {
  document: string
  cellphone: string
}

export interface InitiatePaymentDto {
  document: string
  cellphone: string
  amount: number
}

export interface ConfirmPaymentDto {
  sessionId: string
  token: string
}

export const apiService = {
  register(data: CreateUserDto) {
    return apiClient.post('/register', data)
  },

  recharge(data: RechargeWalletDto) {
    return apiClient.post('/recharge', data)
  },

  getBalance(data: CheckBalanceDto) {
    return apiClient.post('/balance', data)
  },

  initiatePayment(data: InitiatePaymentDto) {
    return apiClient.post('/payments/initiate', data)
  },

  confirmPayment(data: ConfirmPaymentDto) {
    return apiClient.post('/payments/confirm', data)
  },
}
