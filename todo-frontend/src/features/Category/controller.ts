import { makeAutoObservable, runInAction } from 'mobx';
import { CategoryService } from './service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto, CategoryPageOptionsDto } from './dto';

class CategoryController {
    categories: CategoryDto[] = [];
    categoryList: CategoryDto[] = [];
    isLoading = false;
    error: string | null = null;
    meta = { page: 1, pageCount: 1, itemCount: 0, take: 10, hasPreviousPage: false, hasNextPage: false };
    pageOptions: CategoryPageOptionsDto = { page: 1, take: 10, order: 'ASC' };

    constructor() {
        makeAutoObservable(this);
    }

    setPageOptions(options: Partial<CategoryPageOptionsDto>) {
        this.pageOptions = { ...this.pageOptions, ...options };
    }

    async fetchCategories() {
        this.isLoading = true;
        this.error = null;
        try {
            const result = await CategoryService.getAll(this.pageOptions);
            runInAction(() => {
                this.categories = result.data;
                this.meta = result.meta;
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to fetch categories';
                this.isLoading = false;
            });
        }
    }

    async fetchCategoryList() {
        try {
            // Fetch all categories with high limit for dropdown selection
            const result = await CategoryService.getAll({ page: 1, take: 100 });
            runInAction(() => {
                this.categoryList = result.data;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to fetch category list';
            });
        }
    }

    async createCategory(data: CreateCategoryDto) {
        this.isLoading = true;
        try {
            const newCategory = await CategoryService.create(data);
            runInAction(() => {
                this.categories.unshift(newCategory);
                this.categoryList.push(newCategory);
                this.isLoading = false;
            });
            return newCategory;
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to create category';
                this.isLoading = false;
            });
            throw err;
        }
    }

    async updateCategory(id: number, data: UpdateCategoryDto) {
        this.isLoading = true;
        try {
            const updated = await CategoryService.update(id, data);
            runInAction(() => {
                const index = this.categories.findIndex((c) => c.id === id);
                if (index !== -1) this.categories[index] = updated;
                const listIndex = this.categoryList.findIndex((c) => c.id === id);
                if (listIndex !== -1) this.categoryList[listIndex] = updated;
                this.isLoading = false;
            });
            return updated;
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to update category';
                this.isLoading = false;
            });
            throw err;
        }
    }

    async deleteCategory(id: number) {
        this.isLoading = true;
        try {
            await CategoryService.delete(id);
            runInAction(() => {
                this.categories = this.categories.filter((c) => c.id !== id);
                this.categoryList = this.categoryList.filter((c) => c.id !== id);
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to delete category';
                this.isLoading = false;
            });
        }
    }
}

export const categoryController = new CategoryController();