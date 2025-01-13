export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    description: string;
    status: ProductStatus;
    size: Size[];
    toppings?: Topping[];
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
}

export interface Size {
    name: string;
    price: number;
    isDefault?: boolean;
}

export interface Topping {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SOLD_OUT = 'sold_out',
    SEASONAL = 'seasonal',
    NEW = 'new',
    BEST_SELLER = 'best_seller'
}

export interface CreateProductDTO {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    description: string;
    size: Size[];
    toppings?: number[];
    status: ProductStatus;
    isAvailable: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductFilter {
    category?: string;
    status?: ProductStatus;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
