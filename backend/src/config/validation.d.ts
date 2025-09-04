import { z } from 'zod';
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    sortOrder: "asc" | "desc";
    limit: number;
    search?: string | undefined;
    sortBy?: string | undefined;
}, {
    search?: string | undefined;
    page?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    limit?: number | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodString;
    stock: z.ZodNumber;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    specifications: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    isActive: boolean;
    images?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
}, {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    stock: z.ZodOptional<z.ZodNumber>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    specifications: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    stock?: number | undefined;
    category?: string | undefined;
    images?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    stock?: number | undefined;
    category?: string | undefined;
    images?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
    isActive?: boolean | undefined;
}>;
export declare const createOrderSchema: z.ZodObject<{
    customerName: z.ZodString;
    customerEmail: z.ZodString;
    customerPhone: z.ZodOptional<z.ZodString>;
    shippingAddress: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        zipCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }, {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: number;
        quantity: number;
    }, {
        productId: number;
        quantity: number;
    }>, "many">;
    paymentMethod: z.ZodEnum<["credit_card", "installment_loan", "bank_transfer"]>;
    installmentMonths: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    customerEmail: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: "credit_card" | "installment_loan" | "bank_transfer";
    items: {
        productId: number;
        quantity: number;
    }[];
    customerPhone?: string | undefined;
    installmentMonths?: number | undefined;
    notes?: string | undefined;
}, {
    customerName: string;
    customerEmail: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: "credit_card" | "installment_loan" | "bank_transfer";
    items: {
        productId: number;
        quantity: number;
    }[];
    customerPhone?: string | undefined;
    installmentMonths?: number | undefined;
    notes?: string | undefined;
}>;
export declare const updateOrderSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "shipped", "delivered", "cancelled"]>>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | undefined;
    trackingNumber?: string | undefined;
    notes?: string | undefined;
}, {
    status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | undefined;
    trackingNumber?: string | undefined;
    notes?: string | undefined;
}>;
export declare const addToCartSchema: z.ZodObject<{
    productId: z.ZodNumber;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: number;
    quantity: number;
}, {
    productId: number;
    quantity: number;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export declare const productSearchSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    sortBy: z.ZodDefault<z.ZodEnum<["name", "price", "createdAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    sortBy: "createdAt" | "name" | "price";
    sortOrder: "asc" | "desc";
    limit: number;
    category?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    query?: string | undefined;
    inStock?: boolean | undefined;
}, {
    category?: string | undefined;
    page?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    sortBy?: "createdAt" | "name" | "price" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    limit?: number | undefined;
    query?: string | undefined;
    inStock?: boolean | undefined;
}>;
export declare const adminAuthSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const errorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        message: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code?: string | undefined;
        details?: any;
    }, {
        message: string;
        code?: string | undefined;
        details?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
        code?: string | undefined;
        details?: any;
    };
    success: false;
}, {
    error: {
        message: string;
        code?: string | undefined;
        details?: any;
    };
    success: false;
}>;
export declare const successResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodAny;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data?: any;
    message?: string | undefined;
}, {
    success: true;
    data?: any;
    message?: string | undefined;
}>;
export declare const apiResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodAny;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data?: any;
    message?: string | undefined;
}, {
    success: true;
    data?: any;
    message?: string | undefined;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        message: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code?: string | undefined;
        details?: any;
    }, {
        message: string;
        code?: string | undefined;
        details?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
        code?: string | undefined;
        details?: any;
    };
    success: false;
}, {
    error: {
        message: string;
        code?: string | undefined;
        details?: any;
    };
    success: false;
}>]>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type AddToCart = z.infer<typeof addToCartSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type ProductSearch = z.infer<typeof productSearchSchema>;
export type AdminAuth = z.infer<typeof adminAuthSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
//# sourceMappingURL=validation.d.ts.map