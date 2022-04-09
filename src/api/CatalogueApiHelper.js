import { axiosObject } from './axiosWrapper';

export class CatalogueApiHelper {
    static async getAllMenuItems(query) {
        const params = {
            short: true,
        };
        if (query?.name) {
            params.name_like = query.name;
        }
        if (query?.menu_category_id) {
            params.menu_category_id = query.menu_category_id;
        }
        return axiosObject.get('/productCatalogue', { params: params })
            .then((res) => res.data);
    }

    static async getMenuItemById(id) {
        return axiosObject.get('/productCatalogue', { params: { id: id } }).then((res) => res.data);
    }

    static async getMenuItemByCategory(menu_category_id) {
        return axiosObject
            .get('/productCatalogue', { params: { menu_category_id: menu_category_id } })
            .then((res) => res.data);
    }

    static async updateMenuItem(menuItem) {
        let image = typeof menuItem.image === 'object' ? menuItem.image.fileList[0].thumbUrl : menuItem.image;
        return axiosObject
            .put('/productCatalogue', {
                id: menuItem.id,
                name: menuItem.name,
                description: menuItem.description,
                image: image,
                menu_category_id: menuItem.menu_category_id,
                product_id: menuItem.product_id,
            })
            .then((res) => res.data);
    }

    static async createNewMenu(menuItem) {
        return axiosObject
            .post('/productCatalogue', {
                name: menuItem.name,
                description: menuItem.description,
                image: menuItem.image.fileList[0].thumbUrl,
                menu_category_id: menuItem.category_id,
                product_id: menuItem.product_id,
            })
            .then((res) => res.data);
    }

    static async deleteMenuItem(id) {
        return axiosObject.delete('/productCatalogue', { params: { id: id } }).then((res) => res.data);
    }

    static async getAllCategory() {
        return axiosObject.get('/productCatalogue/all_menu_category').then((res) => res.data);
    }

    static async getMenuCategoryById(id) {
        return axiosObject.get('/productCatalogue/all_menu_category', { params: { id: id } }).then((res) => res.data);
    }

    static async createNewCategory(value) {
        return axiosObject
            .post('/productCatalogue/menu_category', {
                name: value.name,
            })
            .then((res) => res.data);
    }

    static async deleteCategory(id) {
        return axiosObject.delete('/productCatalogue/menu_category', { params: { id: id } }).then((res) => res.data);
    }
}
