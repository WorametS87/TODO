// src/api/todo.ts
import { api } from './client';

export function getTodos() {
    return api('/todo');
}

export function createTodo(data: {
    title: string;
    description?: string;
    categoryId?: number;
}) {
    return api('/todo', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
