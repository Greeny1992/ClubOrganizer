import {AuthenticationInformation, AuthenticationResponse,User, UserList} from "../../types/types";
import {createAction, createAsyncAction} from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchUser, fetchUsers} from "../rest/users";


export const fetchUsersActions = createAsyncAction(
    'FETCH_USERS_REQUEST',
    'FETCH_USERS_SUCCESS',
    'FETCH_USERS_FAILURE')<void, UserList, Error>();

export const fetchUserActions = createAsyncAction(
    'FETCH_USER_REQUEST',
    'FETCH_USER_SUCCESS',
    'FETCH_USER_FAILURE')<void, User, Error>();


export type UserResult = ReturnType<typeof fetchUserActions.success> | ReturnType<typeof fetchUserActions.failure>;
export type UsersResult = ReturnType<typeof fetchUsersActions.success> | ReturnType<typeof fetchUsersActions.failure>;


export const fetchUsersAction = ():ThunkAction<Promise<UsersResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchUsersActions.request());
        return fetchUsers(getState().user.authenticationInformation!.token || '')
            .then(
                Value =>dispatch(fetchUsersActions.success(Value))
            )
            .catch(
                err => dispatch(fetchUsersActions.failure(err))
            )
    };



export const fetchUserAction = (id: string):ThunkAction<Promise<UserResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchUserActions.request());
        return fetchUser(getState().user.authenticationInformation!.token || '',id)
            .then(
                Value =>dispatch(fetchUserActions.success(Value))
            )
            .catch(
                err => dispatch(fetchUserActions.failure(err))
            )
    };
