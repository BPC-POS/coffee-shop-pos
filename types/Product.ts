export interface Attribute {
    attribute_id: number;
    value: string;
}

export interface VariantAttribute {
    attribute_id: number;
    value: string;
}

export interface VariantFormState {
    id?: number;
    sku: string;
    price: string;
    stock_quantity: string;
    status: ProductStatus;
    attributes: { id?: number; attribute_id: string; value: string }[];
}

export interface FormState {
    name: string;
    description: string;
    price: string;
    stock_quantity: string;
    sku: string;
    status: ProductStatus;
    meta: object;
    categories: string[];
    attributes: { attribute_id: string; value: string }[];
    variants: VariantFormState[];
    image: string;
}

export interface Size {
    name: string;
    price: number;
    isDefault?: boolean;
}

export const SizeValues: Size[] = [
    { name: 'S', price: 0, isDefault: true },
    { name: 'M', price: 0 },
    { name: 'L', price: 0 }
];

export interface Topping {
    id: number; 
    name: string;
    price: number;
}

export interface ProductMeta {
    image_url?: string;
    image_id?: string;
    extension?: string;
    recipes?: {
        ingredients: string;
        instructions: string;
    };
    [key: string]: unknown;
}

export interface Product {
    [x: string]: any;
    category: string;
    sku: string;
    stock_quantity: number;
    meta: ProductMeta; 
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    categories: number[]; 
    description: string;
    status: ProductStatus;
    toppings?: Topping[];
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    attributes: Attribute[]; 
    variants: Variant[];   
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
}

export interface ProductCategory {
    id: number | string;
    name: string;
    description?: string;
    label?: string;    
    status?: number;  
    isActive?: boolean;
    parent_id?: number | null; 
    image_url?: string;
    meta?: ProductMeta;       
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
    ACTIVE = 1,
    INACTIVE = 0,
    SOLD_OUT = 2, 
    SEASONAL = 3,
    NEW = 4,
    BEST_SELLER = 5
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

export interface ProductAttribute {
    id?: string | number;
    attribute_id: string | number;
    value: string;
  }
  export interface ProductVariant {
    id: number; 
    sku: string;
    price: string;
    stock_quantity: number; 
    status: number; 
    attributes: VariantAttribute[]; 
}

export interface Variant extends ProductVariant {}