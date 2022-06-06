import { combineReducers } from "@reduxjs/toolkit";
import {user} from "./security";
import { formBuilderReducer } from '../../utils/form-builder';

const rootReducer = combineReducers({
    user,
    formBuilder: formBuilderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
