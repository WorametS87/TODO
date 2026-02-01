import { apiClient } from '../../services';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto, CategoryPageDto, CategoryPageOptionsDto } from './dto';

export class CategoryService {
    static async getAll(options?: CategoryPageOptionsDto): Promise<CategoryPageDto> {
        const response = await apiClient.get<CategoryDto[]>('/category', { params: options });
        
        // Backend returns array directly, so we need to convert to paginated format
        const data = Array.isArray(response.data) ? response.data : [];
        
        return {
            data,
            meta: {
                page: options?.page || 1,
                take: options?.take || 10,
                itemCount: data.length,
                pageCount: 1,
                hasPreviousPage: false,
                hasNextPage: false,
            },
        };
    }

    static async getById(id: number): Promise<CategoryDto> {
        const response = await apiClient.get<CategoryDto>(`/category/${id}`);
        return response.data;
    }

    static async create(data: CreateCategoryDto): Promise<CategoryDto> {
        const response = await apiClient.post<CategoryDto>('/category', data);
        return response.data;
    }

    static async update(id: number, data: UpdateCategoryDto): Promise<CategoryDto> {
        const response = await apiClient.patch<CategoryDto>(`/category/${id}`, data);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await apiClient.delete(`/category/${id}`);
    }
}