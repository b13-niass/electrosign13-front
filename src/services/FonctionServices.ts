import ApiService from '@/services/ApiService'
import { ApiResponseFormat, Fonction, User } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

class FonctionServices{
    async getAll() {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<Fonction[]>>({
            url: endpointConfig.getAllFonction,
            method: 'get',
        })
    }
}

const fonctionServices = new FonctionServices()

export default fonctionServices