import { combineReducers } from "redux";
import { AuthPageReducer } from "./AuthPageReducer";

const rootReducer = combineReducers({
    authPage: AuthPageReducer,
});

export default rootReducer;
