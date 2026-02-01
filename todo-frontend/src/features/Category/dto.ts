export interface CategoryDto {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
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
    search?: string;
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