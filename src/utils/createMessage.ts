import { User } from "../entities/User";
import { ResponseMessage } from "../types";


export const createMessage = (message: string, err: boolean): ResponseMessage => ({
    msgBody: message,
    error: err
});

export const createIsAuthMessage = (isAuthenticated: boolean, user?: User) => ({
    isAuthenticated,
    user: {
        username: user?.username,
        email: user?.email,
        id: user?.id
    }
})