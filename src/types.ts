export interface ResponseMessage {
    msgBody: string;
    error: boolean;
}

export type PostCategory = "regular" | "proof" | "disproof";

// export interface UserType extends User {
//     User_id: number;
//     User_username: string;
//     User_email: string;
//     password?: string;
// }