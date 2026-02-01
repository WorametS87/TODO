import { observer } from 'mobx-react-lite';
import { UseFormReturn } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { CategoryDto, CreateCategoryDto } from '@shared/category';

export interface CategoryViewProps {
  categories: CategoryDto[];
  loading: boolean;
  error?: string | null;
  page: number;
  dialogOpen: boolean;
  editing?: CategoryDto | null;

  // ✅ ตรงกับของจริงที่ controller ส่งมา
  form: UseFormReturn<CreateCategoryDto>;

  onOpenCreate: () => void;
  onOpenEdit: (category: CategoryDto) => void;
  onCloseDialog: () => void;
  onSubmit: (data: CreateCategoryDto) => Promise<void>;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

export const CategoryView = observer((props: CategoryViewProps) => {
  const {
    categories,
    loading,
    error,
    page,
    dialogOpen,
    editing,
    form,
    onOpenCreate,
    onOpenEdit,
    onCloseDialog,
    onSubmit,
    onDelete,
    onPageChange,
  } = props;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Categories</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={onOpenCreate}>
          Add Category
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onOpenEdit(c)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => onDelete(c.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No categories
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination page={page} count={1} onChange={(_, p) => onPageChange(p)} />

      <Dialog open={dialogOpen} onClose={onCloseDialog}>
        <DialogTitle>{editing ? 'Edit Category' : 'Create Category'}</DialogTitle>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              {...form.register('name', { required: true })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={onCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit">
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
});
