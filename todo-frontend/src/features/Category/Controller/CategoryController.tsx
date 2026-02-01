// features/Category/Controller/CategoryController.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryService } from '../Service/CategoryService';
import { CategoryView } from '../View/CategoryView';

import {
    CategoryDto,
    CreateCategoryDto,
    CategoryPageOptionsDto,
} from '@shared/category';

export default function CategoryController() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryDto | null>(null);

    const [pageOptions, setPageOptions] = useState<CategoryPageOptionsDto>({
        page: 1,
        take: 10,
        order: 'ASC',
    });

    const form = useForm<CreateCategoryDto>({
        defaultValues: { name: '' },
    });

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await CategoryService.getAll(pageOptions);
            setCategories(res.data);
        } catch {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [pageOptions]);

    const openCreate = () => {
        setEditing(null);
        form.reset({ name: '' });
        setDialogOpen(true);
    };

    const openEdit = (c: CategoryDto) => {
        setEditing(c);
        form.reset({ name: c.name });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setEditing(null);
        form.reset({ name: '' });
        setDialogOpen(false);
    };

    const onSubmit = async (data: CreateCategoryDto) => {
        if (editing) {
            await CategoryService.update(editing.id, data);
        } else {
            await CategoryService.create(data);
        }
        closeDialog();
        fetchCategories();
    };

    const onDelete = async (id: number) => {
        await CategoryService.delete(id);
        fetchCategories();
    };

    return (
        <CategoryView
            categories={categories}
            loading={loading}
            error={error}
            page={pageOptions.page ?? 1}
            dialogOpen={dialogOpen}
            editing={editing}
            form={form}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            onCloseDialog={closeDialog}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onPageChange={(p) => setPageOptions(o => ({ ...o, page: p }))
            }
        />
    );
}
