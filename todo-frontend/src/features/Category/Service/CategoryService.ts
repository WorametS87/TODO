import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryPageDto,
  CategoryPageOptionsDto,
} from '@shared/category';
import { apiClient } from 'src/services/apiClient';

export class CategoryService {
  static async getAll(options?: CategoryPageOptionsDto): Promise<CategoryPageDto> {
    const res = await apiClient.get<CategoryDto[]>('/category', { params: options });
    const data = Array.isArray(res.data) ? res.data : [];
    return {
      data,
      meta: {
        page: options?.page ?? 1,
        take: options?.take ?? 10,
        itemCount: data.length,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }

  static create(data: CreateCategoryDto) {
    return apiClient.post<CategoryDto>('/category', data).then(r => r.data);
  }

  static update(id: number, data: UpdateCategoryDto) {
    return apiClient.patch<CategoryDto>(`/category/${id}`, data).then(r => r.data);
  }

  static delete(id: number) {
    return apiClient.delete(`/category/${id}`);
  }
}
