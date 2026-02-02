// Controller/TodoController.tsx
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TodoService, TodoDto, CreateTodoDto, TodoPageOptionsDto, CategoryDto, TodoStatus } from '../Service/TodoService';
import { TodoView } from '../View/TodoView';
import { CategoryService } from '../../Category/Service/CategoryService';

export default function TodoController() {
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingTodo, setEditingTodo] = useState<TodoDto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [pendingCategoryChange, setPendingCategoryChange] = useState<{
    todo: TodoDto;
    categoryId?: number;
  } | null>(null);

  const confirmChangeCategory = async () => {
    if (!pendingCategoryChange) return;

    const { todo, categoryId } = pendingCategoryChange;

    try {
      await TodoService.update(todo.id, {
        categoryId,
      });
      fetchTodos();
    } catch {
      setError('Failed to update category');
    } finally {
      setPendingCategoryChange(null);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAll({ page: 1, take: 100 });
      setCategories(res.data);
    } catch {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);


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


  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [filters, setFilters] = useState<{
    search?: string;
    status?: 'PENDING' | 'DONE';
    categoryId?: number;
  }>({});


  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filters.status && todo.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [todos, filters]);

  const groupedTodos = useMemo(() => {
    const map: Record<string, TodoDto[]> = {};

    filteredTodos.forEach(todo => {
      const key = todo.category?.name ?? 'Uncategorized';
      if (!map[key]) map[key] = [];
      map[key].push(todo);
    });

    // ✅ ensure UNDONE always comes first inside each category
    Object.values(map).forEach(todos => {
      todos.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'DONE' ? 1 : -1;
      });
    });

    return map;
  }, [filteredTodos]);


  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TodoService.getAll({
        ...pageOptions,
        ...filters,
      });
      setTodos(res.data);
    } catch {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (value: string) => {
    setFilters(f => ({ ...f, search: value || undefined }));
  };

  const onFilterStatus = (status?: 'PENDING' | 'DONE') => {
    setFilters(f => ({ ...f, status }));
  };

  const onFilterCategory = (categoryId?: number) => {
    setFilters(f => ({ ...f, categoryId }));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const bulkDelete = async () => {
    const backup = todos;
    setTodos(t => t.filter(todo => !selectedIds.includes(todo.id)));
    clearSelection();

    try {
      await Promise.all(selectedIds.map(id => TodoService.delete(id)));
    } catch {
      setTodos(backup); // rollback
      setError('Bulk delete failed');
    }
  };

  const bulkMark = async (status: TodoStatus) => {
    const backup = todos;
    setTodos(t =>
      t.map(todo =>
        selectedIds.includes(todo.id) ? { ...todo, status } : todo
      )
    );
    clearSelection();

    try {
      await Promise.all(
        selectedIds.map(id =>
          status === 'DONE'
            ? TodoService.markAsDone(id)
            : TodoService.markAsPending(id)
        )
      );
    } catch {
      setTodos(backup);
      setError('Bulk update failed');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters, pageOptions]);

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
      onSearch={onSearch}
      onFilterStatus={onFilterStatus}
      onFilterCategory={onFilterCategory}
      onSelect={toggleSelect}
      onBulkDelete={bulkDelete}
      onBulkMark={bulkMark}
      selectedIds={selectedIds}
      todosByCategory={groupedTodos}
      categories={categories}
      onRequestChangeCategory={(todo, categoryId) =>
        setPendingCategoryChange({ todo, categoryId })
      }
      onConfirmChangeCategory={confirmChangeCategory}
      onCancelChangeCategory={() => setPendingCategoryChange(null)}
      pendingCategoryChange={pendingCategoryChange}

    />
  );
}
