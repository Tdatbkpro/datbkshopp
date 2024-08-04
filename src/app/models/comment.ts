import { UserResponse } from "../responses/user/user.response";
import { Product } from "./product";

export interface Comment {
    id : number;
    product: Product;
    user: UserResponse;
    content : string;
}