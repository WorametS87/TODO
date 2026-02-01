import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Box, Typography, Button, TextField, IconButton,
    Paper, Pagination, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Alert, Table, TableHead,
    TableBody, TableRow, TableCell, TableContainer
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { categoryController } from './controller';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';

export const CategoryView = observer(() => {
    const [formOpen, setFormOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<CategoryDto | null>(null);
    const [name, setName] = useState('');

    useEffect(() => {
        categoryController.fetchCategories().catch(err => {
            console.error('Failed to load categories:', err);
        });
    }, []);

    const handleCreate = () => {
        setEditCategory(null);
        setName('');
        setFormOpen(true);
    };

    const handleEdit = (category: CategoryDto) => {
        setEditCategory(category);
        setName(category.name);
        setFormOpen(true);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Category name is required');
            return;
        }

        const data: CreateCategoryDto | UpdateCategoryDto = { name: name.trim() };

        try {
            if (editCategory) {
                await categoryController.updateCategory(editCategory.id, data);
            } else {
                await categoryController.createCategory(data as CreateCategoryDto);
            }
            setFormOpen(false);
            setName('');
        } catch (error) {
            console.error('Failed to submit category:', error);
        }
    };

    const handlePageChange = (_: unknown, page: number) => {
        categoryController.setPageOptions({ page });
        categoryController.fetchCategories();
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Categories</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
                    Add Category
                </Button>
            </Box>

            {categoryController.error && (
                <Alert severity="error" sx={{ mb: 2 }}>{categoryController.error}</Alert>
            )}

            {categoryController.isLoading && categoryController.categories.length === 0 ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
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
                                {categoryController.categories && categoryController.categories.length > 0 ? (
                                    categoryController.categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.id}</TableCell>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleEdit(category)}><Edit /></IconButton>
                                                <IconButton onClick={() => categoryController.deleteCategory(category.id)}><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No categories found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {categoryController.meta.pageCount > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={categoryController.meta.pageCount}
                                page={categoryController.meta.page}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </>
            )}

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{editCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!name}>
                        {editCategory ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});