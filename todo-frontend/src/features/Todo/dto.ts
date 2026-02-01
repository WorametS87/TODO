import { TodoStatus } from '../../constants';
import { CategoryDto } from '../Category/dto';

export interface TodoDto {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    category?: CategoryDto;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTodoDto {
    title: string;
    description?: string;
    status?: TodoStatus;
    categoryId?: number;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
    status?: TodoStatus;
    categoryId?: number;
}

export interface TodoPageOptionsDto {
    page?: number;
    take?: number;
    order?: 'ASC' | 'DESC';
    search?: string;
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