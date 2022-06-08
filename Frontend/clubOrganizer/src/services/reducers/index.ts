import { combineReducers } from "@reduxjs/toolkit";
import {user} from "./security";
import { formBuilderReducer } from '../../utils/form-builder';
import { users } from "./users";

const rootReducer = combineReducers({
    user,
    users,
    formBuilder: formBuilderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
