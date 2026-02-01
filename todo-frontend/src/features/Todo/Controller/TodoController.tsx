// Controller/TodoController.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TodoService } from '../Service/TodoService';
import { TodoView } from '../View/TodoView';

// ✅ DTO มาจาก backend/shared เท่านั้น
import {
  TodoDto,
  CreateTodoDto,
  TodoPageOptionsDto,
} from '@shared/todo';

export default function TodoController() {
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingTodo, setEditingTodo] = useState<TodoDto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pageOptions] = useState<TodoPageOptionsDto>({
    page: 1,
    take: 10,
    order: 'DESC',
  });

  const form = useForm<CreateTodoDto>({
    defaultValues: {
      title: '',
      description: '',
      categoryId: undefined,
    },
  });

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TodoService.getAll(pageOptions);
      setTodos(res.data);
    } catch {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openCreate = () => {
    setEditingTodo(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEdit = (todo: TodoDto) => {
    setEditingTodo(todo);
    form.reset({
      title: todo.title,
      description: todo.description || '',
      categoryId: todo.category?.id,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingTodo(null);
    form.reset();
    setDialogOpen(false);
  };

  const onSubmit = async (data: CreateTodoDto) => {
    try {
      if (editingTodo) {
        await TodoService.update(editingTodo.id, data);
      } else {
        await TodoService.create(data);
      }
      closeDialog();
      fetchTodos();
    } catch {
      setError('Failed to save todo');
    }
  };

  const onDelete = async (id: number) => {
    await TodoService.delete(id);
    fetchTodos();
  };

  const onToggle = async (todo: TodoDto) => {
    if (todo.status === 'DONE') {
      await TodoService.markAsPending(todo.id);
    } else {
      await TodoService.markAsDone(todo.id);
    }
    fetchTodos();
  };

  return (
    <TodoView
      todos={todos}
      loading={loading}
      error={error}
      form={form}
      dialogOpen={dialogOpen}
      editingTodo={editingTodo}
      onOpenCreate={openCreate}
      onOpenEdit={openEdit}
      onCloseDialog={closeDialog}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}
