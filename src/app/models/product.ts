import { ProductImage } from "./product.image";
import { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    price: number;
    thumbnail : string;
    description: string;
    category_id: number;
    product_image : ProductImage;
    category : Category;
    url: string;
    product_images : ProductImage[];
}