import { makeAutoObservable, runInAction } from 'mobx';
import { TodoService } from './Service/TodoService';
import { TodoDto, CreateTodoDto, UpdateTodoDto, TodoPageOptionsDto } from './dto';
import { TodoStatus } from '../../constants';

class TodoController {
    todos: TodoDto[] = [];
    selectedTodo: TodoDto | null = null;
    isLoading = false;
    error: string | null = null;
    meta = { page: 1, pageCount: 1, itemCount: 0, take: 10, hasPreviousPage: false, hasNextPage: false };
    pageOptions: TodoPageOptionsDto = { page: 1, take: 10, order: 'DESC' };

    constructor() {
        makeAutoObservable(this);
    }

    setPageOptions(options: Partial<TodoPageOptionsDto>) {
        this.pageOptions = { ...this.pageOptions, ...options };
    }

    async fetchTodos() {
        this.isLoading = true;
        this.error = null;
        try {
            const result = await TodoService.getAll(this.pageOptions);
            runInAction(() => {
                this.todos = result.data;
                this.meta = result.meta;
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to fetch todos';
                this.isLoading = false;
            });
        }
    }

    async createTodo(data: CreateTodoDto) {
        this.isLoading = true;
        try {
            const newTodo = await TodoService.create(data);
            runInAction(() => {
                this.todos.unshift(newTodo);
                this.isLoading = false;
            });
            return newTodo;
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to create todo';
                this.isLoading = false;
            });
            throw err;
        }
    }

    async updateTodo(id: number, data: UpdateTodoDto) {
        this.isLoading = true;
        try {
            const updated = await TodoService.update(id, data);
            runInAction(() => {
                const index = this.todos.findIndex((t) => t.id === id);
                if (index !== -1) this.todos[index] = updated;
                this.isLoading = false;
            });
            return updated;
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to update todo';
                this.isLoading = false;
            });
            throw err;
        }
    }

    async deleteTodo(id: number) {
        this.isLoading = true;
        try {
            await TodoService.delete(id);
            runInAction(() => {
                this.todos = this.todos.filter((t) => t.id !== id);
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to delete todo';
                this.isLoading = false;
            });
        }
    }

    async toggleStatus(id: number) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) return;
        try {
            const updated = todo.status === TodoStatus.DONE
                ? await TodoService.markAsPending(id)
                : await TodoService.markAsDone(id);
            runInAction(() => {
                const index = this.todos.findIndex((t) => t.id === id);
                if (index !== -1) this.todos[index] = updated;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to toggle status';
            });
        }
    }
}

export const todoController = new TodoController();