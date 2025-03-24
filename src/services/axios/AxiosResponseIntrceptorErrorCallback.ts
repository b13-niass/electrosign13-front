import { useSessionUser, useToken } from '@/store/authStore'
import axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'
import ApiService from '@/services/ApiService'
import { ApiResponseFormat } from '@/@types'
import { RefreshTokenResponse } from '@/@types/auth'
import endpointConfig from '@/configs/endpoint.config'
import AxiosBase from '@/services/axios/AxiosBase'
import appConfig from '@/configs/app.config'

const unauthorizedCode = [401, 419, 440]
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token))
    refreshSubscribers = []
}

const AxiosResponseIntrceptorErrorCallback = async (error: AxiosError, axiosInstance: AxiosInstance) => {
    const { response, config } = error
    const { setToken } = useToken()
    if ((response && unauthorizedCode.includes(response.status)) || (!response && error.code === 'ERR_NETWORK') ) {
        const refresh_token = Cookies.get("refresh_token");
        if (!refresh_token) {
            throw new Error("Refresh token missing");
        }
        console.log("here")
        if (!isRefreshing) {
            isRefreshing = true
            useSessionUser.getState().setTokenValidity(false)
            try {
                const refreshResponse: ApiResponseFormat<RefreshTokenResponse> = (await axios.post(
                    `${appConfig.apiPrefix}/public/auth/refresh-token`,
                    { refreshToken: refresh_token },
                    { headers: { "Content-Type": "application/json" } } // Ajout de l'en-tête
                )).data;
                console.log(refreshResponse)
                const newToken = refreshResponse.data.access_token
                if (newToken) {
                    setToken(newToken)
                    onRefreshed(newToken)
                    isRefreshing = false
                    useSessionUser.getState().setTokenValidity(true)
                    return axiosInstance({
                        ...config,
                        headers: { ...config!.headers, Authorization: `Bearer ${newToken}` }
                    })
                }
            } catch (err) {
                console.error('Refresh token failed:', err)
                setToken('')
                useSessionUser.getState().setUser({})
                useSessionUser.getState().setSessionSignedIn(false)
                isRefreshing = false
            }
        }

        return new Promise((resolve) => {
            refreshSubscribers.push((token: string) => {
                config!.headers.Authorization = `Bearer ${token}`
                resolve(axiosInstance(config!))
            })
        })
    }
    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback
