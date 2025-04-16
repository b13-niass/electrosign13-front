import ApiService from '@/services/ApiService'
import { ApiResponseFormat, Role, User } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

class RoleServices{
    async getAll() {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<Role[]>>({
            url: endpointConfig.getAllRole,
            method: 'get',
        })
    }
}

const roleServices = new RoleServices()

export default roleServices