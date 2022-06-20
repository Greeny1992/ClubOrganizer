import {AnyAction} from "redux";
import {fetchUserActions, fetchUsersActions} from "../actions/users";
import { createReducer} from "typesafe-actions";
import { User, UserList } from "../../types/types";


const init : UsersState =
{
    isLoading : false,
    errorMessage :"",
    userDetail: null,
    userlist: []
}


export interface UsersState {
    isLoading: boolean;
    errorMessage: string;
    userDetail : User | null;
    userlist : UserList | null;
}

export const users = createReducer<UsersState, AnyAction>(init)
.handleAction(fetchUsersActions.request,  (state, action) =>
    ({ ...state, isLoading: true, errorMessage: '' }))
.handleAction(fetchUsersActions.failure, (state, action) =>
    ({ ...state, isLoading: false, errorMessage: action.payload.message }))
.handleAction(fetchUsersActions.success, (state, action) =>
    ({ ...state, isLoading: false, userlist : action.payload }))
.handleAction(fetchUserActions.request,  (state, action) =>
    ({ ...state, isLoading: true,  errorMessage: '' }))
.handleAction(fetchUserActions.failure, (state, action) =>
    ({ ...state, isLoading: false,  errorMessage: action.payload.message }))
.handleAction(fetchUserActions.success, (state, action) =>
    ({ ...state, isLoading: false,  userDetail: action.payload}))
