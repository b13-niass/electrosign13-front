import ApiService from '@/services/ApiService'
import { AddUser, ApiResponseFormat, User } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

class UserService{
    async getAll(role?: string, status?: string) {
        const query = role == null ?`?status=${status}`: `?role=${role}&status=${status}`
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User>>({
            url: endpointConfig.getAllUser+query,
            method: 'get',
        })
    }
    async getUsers() {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User[]>>({
            url: endpointConfig.getUsers,
            method: 'GET',
        })
    }
    async desactiverUser(id: string) {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User[]>>({
            url: endpointConfig.desactiverUser.replace(':idUser', id),
            method: 'GET',
        })
    }
    async activerUser(id: string) {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User[]>>({
            url: endpointConfig.activerUser.replace(':idUser', id),
            method: 'GET',
        })
    }
    async createUser(data: AddUser) {
        // Create a FormData object
        const formData = new FormData();

        // Add all the scalar fields
        formData.append('prenom', data.prenom);
        formData.append('nom', data.nom);
        formData.append('email', data.email);
        formData.append('password', data.password);

        if (data.telephone) formData.append('telephone', data.telephone);
        if (data.cni) formData.append('cni', data.cni);

        formData.append('fonctionId', data.fonctionId.toString());

        if (data.fonctionNom) formData.append('fonctionNom', data.fonctionNom);
        if (data.active !== undefined) formData.append('active', data.active.toString());

        // Handle the photo file if it exists
        if (data.photo instanceof File) {
            formData.append('photo', data.photo);
        } else if (typeof data.photo === 'string') {
            formData.append('photo', data.photo);
        }

        // Add roles as individual elements with array-like naming
        data.roles.forEach((role, index) => {
            formData.append(`roles[${index}]`, role);
        });
        console.log(formData.entries())
        return ApiService.fetchDataWithAxios<ApiResponseFormat<User>>({
            url: endpointConfig.user,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData as unknown as Record<string, unknown>
        });
    }
}

const userService = new UserService();
export default userService;