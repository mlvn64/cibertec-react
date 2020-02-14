// definir las interfaces generales del proyecto

export interface IProduct {
    productId: number;
    productName: string;
    unitPrice: number;
}

export interface ICategory {
    categoryId: number;
    categoryName: string;
    description: string;
    picture: string;
}

/**
 * Esta interface servira para definir las props base de cada página de nuestro app
 */
export interface IPageBaseProps {
    path?: string;
}