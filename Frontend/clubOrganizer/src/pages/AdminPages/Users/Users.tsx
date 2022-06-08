import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    IonButton,
    RefresherEventDetail,
    IonGrid,
    IonRow,
    IonCol,
    IonCardContent,
} from '@ionic/react';
import {

    add,
    
    information,
    skull
} from 'ionicons/icons';
import './Users.css'
import React, {useEffect} from 'react';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/reducers";
import { IconConverter } from '../../../utils/icon-converter';
import {fetchUsersAction, fetchUsersActions} from "../../../services/actions/users";
import { fetchUsers } from '../../../services/rest/users';


const Users: React.FC<RouteComponentProps> = ({ history }) => {

    const { userlist, isLoading, errorMessage } = useSelector((s:RootState) => s.users);
    const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(fetchUsersAction()) }, []);

    const NoValuesInfo = () => !isLoading && userlist?.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Users found...</IonCardTitle>
            </IonCardHeader>
        </IonCard>) : (<></>)

const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log('Begin async operation on Value List');
    fetchUsers(token)
        .then(usr => dispatch(fetchUsersActions.success(usr)))
        .then(() => event.detail.complete())
        .catch(err => dispatch(fetchUsersActions.failure(err)))
}

    const ListUsers = () => {

        const items = userlist!.map(value => {
            return (
               /*  <IonItemSliding key={value.id}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(value.id) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.id} onClick={() => history.push('/users/edit/' +value.id)}>
                        <IonIcon icon={skull} />
                        {value.firstname + " (" + value.role+")"}
                    </IonItem>
                </IonItemSliding> */

                
                
                    
                        <IonCard className='userCard' key={value.id} onClick={() => history.push('/users/edit/' +value.id)}>
                            <IonCardHeader>
                                <IonCardTitle>{value.firstname + ' ' + value.lastname}</IonCardTitle>
                                <IonCardContent>
                                    <IonGrid>
                                        <IonRow> <IonCol>E-Mail:</IonCol> <IonCol>{value.email}</IonCol></IonRow>
                                        <IonRow> <IonCol>Username</IonCol> <IonCol>{value.userName}</IonCol></IonRow>
                                        <IonRow> <IonCol>Status:</IonCol> <IonCol>{value.active}</IonCol></IonRow>
                                        <IonRow> <IonCol>Rolle:</IonCol> <IonCol>{value.role}</IonCol></IonRow>
                                        <IonRow> <IonCol>Gruppen:</IonCol> <IonCol>{value.groups.length === 0? 'Noch in keiner Gruppe' : value.groups}</IonCol></IonRow>
                                    </IonGrid>
                                </IonCardContent>
                            </IonCardHeader>
                        </IonCard>
                

                    
                
            );
        });
        return items.length > 0 ? <IonGrid><IonRow>{items}</IonRow></IonGrid> : <NoValuesInfo />;
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/users/add')}>
                            <IonIcon slot="icon-only" icon={add}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>User List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
            <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                {isLoading ? <IonItem><IonSpinner />Loading Users...</IonItem> : <ListUsers />}
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                
            </IonContent>
        </IonPage>
    );
};

export default Users;