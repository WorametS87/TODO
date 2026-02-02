export interface TodoDto {
    id: number;
    title: string;
    description?: string;
    status: 'PENDING' | 'DONE';
    category?: {
        id: number;
        name: string;
    };
}

export interface CreateTodoDto {
    title: string;
    description?: string;
    categoryId?: number;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
    categoryId?: number;
}
export interface TodoPageOptionsDto {
    page?: number;
    take?: number;
    order?: 'ASC' | 'DESC';
    search?: string;
    status?: 'PENDING' | 'DONE';
    categoryId?: number;
}

export interface TodoPageDto {
    data: TodoDto[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}
