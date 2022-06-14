import { combineReducers } from "@reduxjs/toolkit";
import {user} from "./security";
import { formBuilderReducer } from '../../utils/form-builder';
import { users } from "./users";
import { activeCl, clubs } from "./club";

const rootReducer = combineReducers({
    user,
    users,
    clubs,
    activeCl,
    formBuilder: formBuilderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
