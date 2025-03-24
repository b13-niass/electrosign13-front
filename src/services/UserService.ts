import ApiService from '@/services/ApiService'
import { ApiResponseFormat, User } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

class UserService{

    async getAll(role?: string, status?: string) {
        const query = role == null ?`?status=${status}`: `?role=${role}&status=${status}`
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User>>({
            url: endpointConfig.getAllUser+query,
            method: 'get',
        })
    }

}

const userService = new UserService();
export default userService;