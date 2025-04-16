import ApiService from '@/services/ApiService'
import { ApiResponseFormat, DocumentBase64, SignatureRequest } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'
import { format } from 'date-fns'


export type DemandeCredentials = {
    file: File,
    signataires: UserDemande[],
    approbateurs: UserDemande[],
    ampliateurs: UserDemande[],
    priority: "FAIBLE" | "MOYENNE" | "URGENTE",
    dateLimite: Date| string,
    description: string,
    titre: string,
    fileAttachment: File[],
}
export type DemandeResponse = {
    id: string
}

export type UserDemande = {
    id: string
    action: string
    ordre: string
}

export type SignerDemande = {
    demandeId: string,
    file: File,
    signature?: string,
}

class DemandeServices {
    async create(data: DemandeCredentials) {
        const formData = new FormData();

        formData.append("titre", data.titre);
        formData.append("description", data.description);
        formData.append("dateLimite", format(data.dateLimite, "dd-MM-yyyy"));
        formData.append("priority", data.priority);
        formData.append("file", data.file);

        data.fileAttachment.forEach((file) => {
            formData.append("fileAttachment", file);
        });

        data.signataires.forEach((signataire, index) => {
            formData.append(`signataires[${index}].id`, signataire.id);
            formData.append(`signataires[${index}].action`, signataire.action);
            formData.append(`signataires[${index}].ordre`, signataire.ordre);
        });

        data.approbateurs.forEach((approbateur, index) => {
            formData.append(`approbateurs[${index}].id`, approbateur.id);
            formData.append(`approbateurs[${index}].action`, approbateur.action);
            formData.append(`approbateurs[${index}].ordre`, approbateur.ordre);

        });

        data.ampliateurs.forEach((ampliateur, index) => {
            formData.append(`ampliateurs[${index}].id`, ampliateur.id);
            formData.append(`ampliateurs[${index}].action`, ampliateur.action);
            formData.append(`ampliateurs[${index}].ordre`, ampliateur.ordre);
        });

        console.log("FormData entries:");
        formData.forEach((value, key) => console.log(key, value));

        return ApiService.fetchDataWithAxios<ApiResponseFormat<DemandeResponse>>({
            url: endpointConfig.createDemande,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData as unknown as Record<string, unknown>,
        });
    }

    async getDemandesEnvoyees(){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest[]>>({
            url: endpointConfig.getDemandesEnvoyees,
            method: 'get',
        });
    }
    async getDemandesRecues(){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest[]>>({
            url: endpointConfig.getDemandesRecues,
            method: 'get',
        });
    }

    async getDemandeById(idDemande: string){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest>>({
            url: endpointConfig.getDemandeById.replace(':idDemande', idDemande),
            method: 'get',
        });
    }

    async getDocumentByDemandeId(idDemande: string, type?: string){
        let url = endpointConfig.getDocumentByDemandeId.replace(':idDemande', idDemande);
        if(type){
            url += `?type=${type}`;
        }
        return ApiService.fetchDataWithAxios<ApiResponseFormat<DocumentBase64>>({
            url: url,
            method: 'get',
        });
    }
    async getDashboardData(){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<undefined>>({
            url: endpointConfig.getDashboardData,
            method: 'get',
        });
    }

    async signerDemande(data: SignerDemande){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest>>({
            url: endpointConfig.signerDemande,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data
        });
    }

    async approuverDemande(idDemande: string){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest>>({
            url: endpointConfig.approuverDemande.replace(':idDemande', idDemande),
            method: 'get',
        });
    }
    async rejeterDemande(idDemande: string){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<SignatureRequest>>({
            url: endpointConfig.rejeterDemande.replace(':idDemande', idDemande),
            method: 'get',
        });
    }
}

const demandeServices = new DemandeServices();
export default demandeServices;