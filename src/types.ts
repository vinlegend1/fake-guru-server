export interface ResponseMessage {
    msgBody: string;
    error: boolean;
}

// export type PostCategory = "post" | "proof" | "disproof";

export enum PostCategory {
    post = "post",
    proof = "proof",
    disproof = "disproof"
}

export enum LikeType {
    post = "post",
    comment = "comment",
    reply = "reply"
}

// export interface UserType extends User {
//     User_id: number;
//     User_username: string;
//     User_email: string;
//     password?: string;
// }