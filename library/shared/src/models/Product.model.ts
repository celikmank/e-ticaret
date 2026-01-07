export interface ProductModel {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
    categoryName: string;
    categoryUrl: string;
}

export const initialProduct: ProductModel = {
    id: '',
    name: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    categoryId: '',
    categoryName: '',
    categoryUrl: ''
};   