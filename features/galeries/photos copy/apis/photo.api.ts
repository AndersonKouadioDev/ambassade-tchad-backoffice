import { api } from "@/lib/api";
import { PhotoDTO } from "../schemas/photo.schema";
    
export const photoAPI = {	        
    getAll: async () => {
        const response = await api.get("/photos");
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/photos/${id}`);
        return response.data;
    },
    create: async (photo: PhotoDTO) => {
        const response = await api.post("/photos", photo);
        return response.data;
    },
    update: async (id: string, photo: PhotoDTO) => {
        const response = await api.put(`/photos/${id}`, photo);
        return response.data;
    },
};

