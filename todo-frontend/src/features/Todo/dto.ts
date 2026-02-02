import { CategoryDto } from '../Category/dto';

export enum TodoStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface TodoDto {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  category?: CategoryDto | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  categoryId?: number;
  status?: TodoStatus;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  categoryId?: number;
  status?: TodoStatus;
}

export interface TodoPageOptionsDto {
  page?: number;
  take?: number;
  order?: 'ASC' | 'DESC';
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
