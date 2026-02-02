import { apiClient } from '../../../services/apiClient';

// Types from backend
export interface CategoryDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

export interface CategoryPageOptionsDto {
  page?: number;
  take?: number;
  order?: 'ASC' | 'DESC';
}

export interface CategoryPageDto {
  data: CategoryDto[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

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
