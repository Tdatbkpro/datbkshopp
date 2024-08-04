import { UserResponse } from "../user/user.response";

export interface CommentResponse {
    id: number;
    content : string;
    user : UserResponse;
    updated_at : Date;
}