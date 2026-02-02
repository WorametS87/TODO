// View/TodoView.tsx
import {
  Box, Typography, Button, TextField, IconButton, Checkbox,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TodoDto, CreateTodoDto, CategoryDto, TodoStatus } from '../Service/TodoService';
import { useState } from 'react';

interface Props {
  todos: TodoDto[];
  loading: boolean;
  error: string | null;
  form: UseFormReturn<CreateTodoDto>;
  dialogOpen: boolean;
  editingTodo: TodoDto | null;
  onOpenCreate: () => void;
  onOpenEdit: (todo: TodoDto) => void;
  onCloseDialog: () => void;
  onSubmit: (data: CreateTodoDto) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: TodoDto) => void;
  onSearch: (value: string) => void;
  onFilterStatus: (status?: TodoStatus) => void;
  onFilterCategory: (categoryId?: number) => void;
  selectedIds: number[];
  onSelect: (id: number) => void;
  onBulkDelete: () => void;
  onBulkMark: (status: TodoStatus) => void;
  todosByCategory: Record<string, TodoDto[]>;
  categories: CategoryDto[];

  // ✅ inline category change flow
  onRequestChangeCategory: (todo: TodoDto, categoryId?: number) => void;
  onConfirmChangeCategory: () => void;
  onCancelChangeCategory: () => void;
  pendingCategoryChange: {
    todo: TodoDto;
    categoryId?: number;
  } | null;
}

export function TodoView({
  todos: _todos,
  loading,
  error,
  form,
  dialogOpen,
  editingTodo,
  onOpenCreate,
  onOpenEdit,
  onCloseDialog,
  onSubmit,
  onDelete,
  onSearch,
  onFilterStatus,
  onFilterCategory,
  selectedIds,
  onSelect,
  onBulkDelete,
  onBulkMark,
  todosByCategory,
  categories = [],
  onRequestChangeCategory,
  onConfirmChangeCategory,
  onCancelChangeCategory,
  pendingCategoryChange,
}: Props) {
  const { register, handleSubmit, formState: { errors } } = form;
  const [pendingDelete, setPendingDelete] = useState<TodoDto | null>(null);


  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Todos</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onOpenCreate}>
          Add Todo
        </Button>
      </Box>

      {/* BULK ACTION */}
      {selectedIds.length > 0 && (
        <Box display="flex" gap={1} mb={2}>
          <Button color="error" onClick={onBulkDelete}>
            Delete selected
          </Button>
          <Button onClick={() => onBulkMark(TodoStatus.DONE)}>
            Mark Done
          </Button>
          <Button onClick={() => onBulkMark(TodoStatus.PENDING)}>
            Mark Pending
          </Button>
        </Box>
      )}

      {/* SEARCH */}
      <TextField
        placeholder="Search todo..."
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* STATUS FILTER */}
      <Box display="flex" gap={1} mb={3}>
        <Button onClick={() => onFilterStatus(undefined)}>All</Button>
        <Button onClick={() => onFilterStatus(TodoStatus.PENDING)}>Pending</Button>
        <Button onClick={() => onFilterStatus(TodoStatus.DONE)}>Done</Button>
      </Box>

      {/* CATEGORY FILTER */}
      <Box mb={3}>
        <Select
          fullWidth
          displayEmpty
          onChange={(e) =>
            onFilterCategory(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          defaultValue=""
        >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>

          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* LIST */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        Object.entries(todosByCategory)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([categoryName, todos]) => (

            <Box key={categoryName} mb={4}>
              {/* CATEGORY TITLE */}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                {categoryName}
              </Typography>

              {/* TODOS IN CATEGORY */}
              {todos.map((todo) => (
                <Paper
                  key={todo.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    display: 'flex',
                    gap: 2,
                    backgroundColor:
                      todo.status === 'DONE' ? 'rgba(76, 175, 80, 0.08)' : 'white',
                    borderLeft:
                      todo.status === 'DONE' ? '4px solid #4caf50' : '4px solid transparent',
                  }}
                >

                  <Checkbox
                    checked={selectedIds.includes(todo.id)}
                    onChange={() => onSelect(todo.id)}
                  />

                  <Box flex={1}>
                    <Typography
                      sx={{
                        textDecoration:
                          todo.status === 'DONE' ? 'line-through' : 'none',
                        color:
                          todo.status === 'DONE' ? 'text.secondary' : 'text.primary',
                        fontWeight: todo.status === 'DONE' ? 400 : 500,
                      }}
                    >

                      {todo.title}
                    </Typography>

                    {todo.description && (
                      <Typography variant="body2">
                        {todo.description}
                      </Typography>
                    )}

                    {/* ✅ FIX: this dropdown is NOT react-hook-form. It's per-todo, controlled by todo.category */}
                    <TextField
                      select
                      label="Category"
                      fullWidth
                      margin="normal"
                      value={todo.category?.id ?? ''}
                      onChange={(e) =>
                        onRequestChangeCategory(
                          todo,
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <MenuItem value="">No category</MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <IconButton onClick={() => onOpenEdit(todo)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setPendingDelete(todo)}>
                    <Delete />
                  </IconButton>

                </Paper>
              ))}
            </Box>
          ))
      )}

      {/* ✅ CONFIRM DIALOG for inline category change */}
      <Dialog
        open={!!pendingCategoryChange}
        onClose={onCancelChangeCategory}
      >
        <DialogTitle>Change category?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change this todo’s category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelChangeCategory}>Cancel</Button>
          <Button variant="contained" onClick={onConfirmChangeCategory}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete todo?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete
            <strong> {pendingDelete?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (pendingDelete) {
                onDelete(pendingDelete.id);
                setPendingDelete(null);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      {/* DIALOG (create/edit) */}
      <Dialog open={dialogOpen} onClose={onCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingTodo ? 'Edit Todo' : 'Create Todo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            {...register('description')}
          />
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="">
                  <em>No category</em>
                </MenuItem>

                {categories?.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            {editingTodo ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
