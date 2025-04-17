import ApiService from '@/services/ApiService'
import { ApiResponseFormat, SignatureRequest } from '@/@types'
import endpointConfig from '@/configs/endpoint.config'

export interface ArchiveResult {
    totalDocuments: number
    successfullyArchived: string[]
    failedToArchive: string[]
}

export interface ArchiveStats {
    signedDocuments: number
    archivedDocuments: number
}

class ArchiveService{
    async archiveDocuments(){

        // const totalDocuments = 5
        // const successfullyArchived = ["doc1.pdf", "doc2.pdf", "doc3.pdf"]
        // const failedToArchive = ["doc4.pdf", "doc5.pdf"]

        return ApiService.fetchDataWithAxios<ApiResponseFormat<ArchiveResult>>({
            url: endpointConfig.archiveDocuments,
            method: 'POST',
        });
    }

    async getArchiveStats() {
        return ApiService.fetchDataWithAxios<ApiResponseFormat<ArchiveStats>>({
            url: endpointConfig.getArchiveStats,
            method: 'GET',
        });
    }
}

const archiveService = new ArchiveService();

export default archiveService;