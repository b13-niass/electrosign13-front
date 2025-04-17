import ApiService from '@/services/ApiService'
import { ApiResponseFormat, SignatureRequest } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

export interface DocumentDownloadDto{
    id: number
    nom: string
    url: string
    contentType: string
    isCloudDocument: boolean
}
class DocumentServices{
    async getSignedDocumentsForDownload(idDemande: string){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<DocumentDownloadDto[]>>({
            url: endpointConfig.getSignedDocumentsForDownload.replace(':demandeId', idDemande),
            method: 'get',
        });
    }
    async downloadDocument(documentId: string){
        return ApiService.fetchDataWithAxios<ApiResponseFormat<unknown>>({
            url: endpointConfig.downloadDocument.replace(':documentId', documentId),
            method: 'get',
        });
    }
}

const documentServices = new DocumentServices();

export default documentServices;