import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  useIonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  RefresherEventDetail,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { isOfType } from "typesafe-actions";
import {
  fetchUserAction,
  fetchUserActions,
  fetchUserByEmailAction,
  UserResult,
} from "../../services/actions/users";
import { RootState } from "../../services/reducers";
import { Club, User, UserList } from "../../types/types";
import { BuildForm, FormDescription } from "../../utils/form-builder";
import { Storage } from "@capacitor/storage";
import {
  fetchMembersFromClub,
  fetchUser,
  fetchUserByEmail,
} from "../../services/rest/users";
import { addMemberToClub, fetchOwnedClub } from "../../services/rest/club";
import { fetchOwnedActions } from "../../services/actions/club";
import { add } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

const { loading } = BuildForm({} as FormDescription<{ search: string }>);

const Members: React.FC<RouteComponentProps> = ({ history }) => {
  const { user, authenticationInformation } = useSelector(
    (state: RootState) => state.user
  );

  const { owned, isLoading, errorMessage } = useSelector((s:RootState) => s.clubs);
  const [members, setMembers] = useState([] as User[]);
  const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
  const thunkDispatch: ThunkDispatch<RootState, null, UserResult> =
    useDispatch();
  const dispatch = useDispatch();


  useEffect(() => {
    if (authenticationInformation && owned) {
      fetchOwnedClub(token)
        .then(club => dispatch(fetchOwnedActions.success(club)))
        .then(data => getUsersFromAPI(data.payload.memberIDs))
        .catch(err => dispatch(fetchOwnedActions.failure(err)))
    }
  }, []);

  const getUsersFromAPI = (listOfUserIDs:string[])=>{
    let newUserList = [] as User[]
    listOfUserIDs.forEach((user)=>{
        fetchUser(token, user)
        .then(usr => {newUserList.push(usr); console.log(newUserList);
        })
        .catch(err => dispatch(fetchUserActions.success(err)))
    })
    setMembers(newUserList)
  }


  const NoValuesInfo = () => !isLoading && owned?.memberIDs.length == 0 ?
        (<IonCard>
            <IonCardHeader>
                <IonCardTitle>No Members found...</IonCardTitle>
            </IonCardHeader>
        </IonCard>) : (<></>)

const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log('Begin async operation on Value List');
    fetchOwnedClub(token)
        .then(usr => dispatch(fetchOwnedActions.success(usr)))
        .then(() => event.detail.complete())
        .catch(err => dispatch(fetchOwnedActions.failure(err)))
}

    const ListMembers = () => {

        if (members){
            const items = members.map(value => {
              const activeState = value.active? "Aktiv" : "Inaktiv"
              const userGroups = value.groups.length > 0 ? value.groups : "Noch in keinen Gruppen!"
                return (
                            <IonCard className='userCard' key={value.id} /* onClick={() => history.push('/groups/edit/' +value.id)} */>
                                <IonCardHeader>
                                    <IonCardTitle>Name: {value.firstname + ' ' + value.lastname}</IonCardTitle>
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow> <IonCol>Email:</IonCol> <IonCol>{value.email}</IonCol></IonRow>
                                            <IonRow> <IonCol>Username:</IonCol> <IonCol>{value.userName}</IonCol></IonRow>
                                            <IonRow> <IonCol>Active:</IonCol> <IonCol>{activeState}</IonCol></IonRow>
                                            <IonRow> <IonCol>Gruppen:</IonCol> <IonCol>{userGroups}</IonCol></IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCardHeader>
                            </IonCard>  
                );
            });
            return items.length > 0 ? <IonGrid><IonRow>{items}</IonRow></IonGrid> : <NoValuesInfo />;
        }
        else {
            return <NoValuesInfo/>;
        }

        
    };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/members/add')}>
                            <IonIcon slot="icon-only" icon={add}/>
                        </IonButton>
                    </IonButtons>
          <IonTitle>Clubmitglieder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
      <ListMembers/>
      </IonContent>
    </IonPage>
  );
};

export default Members;
