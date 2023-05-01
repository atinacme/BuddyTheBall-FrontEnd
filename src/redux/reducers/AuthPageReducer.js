import { AUTH_PAGE_ITEM } from "../Types";

const initialState = {
    id: '',
    email: '',
    roles: '',
    auth_data: '',
    access_token: ''
};

export function AuthPageReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_PAGE_ITEM:
            return {
                ...state,
                id: action.id,
                email: action.email,
                roles: action.roles,
                auth_data: action.auth_data,
                access_token: action.access_token
            };
        default:
            return state;
    }
};