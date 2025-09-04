import { z } from 'zod';
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
});
export const idParamSchema = z.object({
    id: z.coerce.number().int().positive()
});
export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(255),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    specifications: z.record(z.string(), z.any()).optional(),
    isActive: z.boolean().default(true)
});
export const updateProductSchema = createProductSchema.partial();
export const createOrderSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().optional(),
    shippingAddress: z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(1, 'ZIP code is required'),
        country: z.string().min(1, 'Country is required')
    }),
    items: z.array(z.object({
        productId: z.number().int().positive('Product ID must be positive'),
        quantity: z.number().int().positive('Quantity must be positive')
    })).min(1, 'At least one item is required'),
    paymentMethod: z.enum(['credit_card', 'installment_loan', 'bank_transfer']),
    installmentMonths: z.number().int().positive().optional(),
    notes: z.string().optional()
});
export const updateOrderSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
    trackingNumber: z.string().optional(),
    notes: z.string().optional()
});
export const addToCartSchema = z.object({
    productId: z.number().int().positive('Product ID must be positive'),
    quantity: z.number().int().positive('Quantity must be positive')
});
export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive('Quantity must be positive')
});
export const productSearchSchema = z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    inStock: z.coerce.boolean().optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
});
export const adminAuthSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});
export const errorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        message: z.string(),
        code: z.string().optional(),
        details: z.any().optional()
    })
});
export const successResponseSchema = z.object({
    success: z.literal(true),
    data: z.any(),
    message: z.string().optional()
});
export const apiResponseSchema = z.union([successResponseSchema, errorResponseSchema]);
//# sourceMappingURL=validation.js.map