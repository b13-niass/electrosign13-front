import ApiService from '@/services/ApiService'
import { ApiResponseFormat } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

export type DemandeCredentials = {
    file: File,
    signataires: string[],
    approbateurs: string[],
    priorite: "faible" | "moyenne" | "urgente",
    dateLimite: Date,
}
export type DemandeResponse = {
    id: string
}

class DemandeServices {
    async create(data: DemandeCredentials) {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<DemandeResponse>>({
            url: endpointConfig.signIn,
            method: 'post',
            data,
        })
    }
}

const demandeServices = new DemandeServices();
export default demandeServices;