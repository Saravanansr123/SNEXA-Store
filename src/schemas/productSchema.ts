import { z } from "zod";

/* ================= SIZE ================= */

export const sizeSchema = z.object({
  size: z.string(),
  stock: z.number().min(0),
});

/* ================= VARIANT ================= */

export const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  hex: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
  sizes: z.array(sizeSchema).min(1, "At least one size required"),
});

/* ================= PRODUCT ================= */

export const productSchema = z.object({
  name: z.string().min(3, "Product name too short"),
  description: z.string().min(10, "Description too short"),
  collection: z.string().min(1),
  subCollection: z.string().min(1),

  mrp: z.number().positive(),
  salePrice: z.number().positive(),
  discount: z.number().min(0).max(100),

  images: z.array(z.string()).min(1).max(5),
  variants: z.array(variantSchema).min(1),

  status: z.enum(["active", "draft"]),
});

/* ================= TYPE EXPORT ================= */

export type ProductFormType = z.infer<typeof productSchema>;
