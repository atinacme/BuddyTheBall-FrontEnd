import { AUTH_PAGE_ITEM } from "./Types";

export const AuthPageAction = (id, email, roles, auth_data, access_token) => {
    return {
        type: AUTH_PAGE_ITEM, id, email, roles, auth_data, access_token
    };
};