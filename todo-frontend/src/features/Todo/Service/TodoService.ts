import { apiClient } from '../../../services';
import { TodoDto, CreateTodoDto, UpdateTodoDto, TodoPageDto, TodoPageOptionsDto } from '../dto';
import { TodoStatus } from '../../../constants';

export class TodoService {
    static async getAll(options?: TodoPageOptionsDto): Promise<TodoPageDto> {
        const response = await apiClient.get<TodoDto[]>('/todo', { params: options });

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

    static async getById(id: number): Promise<TodoDto> {
        const response = await apiClient.get<TodoDto>(`/todo/${id}`);
        return response.data;
    }

    static async create(data: CreateTodoDto): Promise<TodoDto> {
        const response = await apiClient.post<TodoDto>('/todo', data);
        return response.data;
    }

    static async update(id: number, data: UpdateTodoDto): Promise<TodoDto> {
        const response = await apiClient.patch<TodoDto>(`/todo/${id}`, data);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await apiClient.delete(`/todo/${id}`);
    }

    static async markAsDone(id: number): Promise<TodoDto> {
        return this.update(id, { status: TodoStatus.DONE });
    }

    static async markAsPending(id: number): Promise<TodoDto> {
        return this.update(id, { status: TodoStatus.PENDING });
    }
}