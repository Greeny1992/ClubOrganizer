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
import { action, isOfType } from "typesafe-actions";
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
import {
  addMemberToClub,
  fetchOwnedClub,
  removeMemberFromClub,
} from "../../services/rest/club";
import { fetchOwnedActions } from "../../services/actions/club";
import { add } from "ionicons/icons";
import { RouteComponentProps } from "react-router";
import { executeDelayed } from "../../helpers/async-helpers";
import { log } from "console";
import { exec } from "child_process";

const { loading } = BuildForm({} as FormDescription<{ search: string }>);

const Members: React.FC<RouteComponentProps> = ({ history }) => {
  const { user, authenticationInformation } = useSelector(
    (state: RootState) => state.user
  );

  const { owned, isLoading, errorMessage } = useSelector(
    (s: RootState) => s.clubs
  );
  const [members, setMembers] = useState([] as User[]);
  const token = useSelector(
    (s: RootState) => s.user.authenticationInformation!.token || ""
  );
  const thunkDispatch: ThunkDispatch<RootState, null, UserResult> =
    useDispatch();
  const dispatch = useDispatch();
  console.log(members);

  useEffect(() => {
    if (authenticationInformation && owned) {
      console.log("imin");

      fetchOwnedClub(token)
        .then((club) => dispatch(fetchOwnedActions.success(club)))
        .catch((err) => dispatch(fetchOwnedActions.failure(err)));
    }
  }, []);

  useEffect(() => {
    getUsersFromAPI(owned!.memberIDs);
  }, [owned]);

  const getUsersFromAPI = async (listOfUserIDs: string[]) => {
    console.log("WTF", listOfUserIDs);

    let newUserList = [] as User[];
    listOfUserIDs.forEach(async (user) => {
      await fetchUser(token, user)
        .then((x) => dispatch(fetchUserActions.success(x)))
        .then((usr) => {
          newUserList.push(usr.payload);
          console.log(newUserList);
        })
        .catch((err) => dispatch(fetchUserActions.failure(err)));
    });
    executeDelayed(100, () => setMembers(newUserList));
  };

  const NoValuesInfo = () =>
    !isLoading && owned?.memberIDs.length == 0 ? (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>No Members found...</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    ) : (
      <></>
    );

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log("Begin async operation on Value List");
    fetchOwnedClub(token)
      .then((usr) => dispatch(fetchOwnedActions.success(usr)))
      .then(() => event.detail.complete())
      .catch((err) => dispatch(fetchOwnedActions.failure(err)));

    getUsersFromAPI(owned!.memberIDs).then((x) => console.log(x));
  };

  const removeFromClub = (id: string) => {
    if (owned && id !== "none") {
      removeMemberFromClub(token, owned?.id, id);

      executeDelayed(100, () =>
        fetchOwnedClub(token)
          .then((usr) => dispatch(fetchOwnedActions.success(usr)))
          .catch((err) => dispatch(fetchOwnedActions.failure(err)))
      );
    }
  };

  const ListMembers = () => {
    if (members) {
      const items = members.map((value) => {
        const activeState = value.active ? "Aktiv" : "Inaktiv";
        const userGroups =
          value.groups.length > 0 ? value.groups : "Noch in keinen Gruppen!";
        return (
          <IonCard
            className="userCard"
            key={
              value.id
            } /* onClick={() => history.push('/groups/edit/' +value.id)} */
          >
            <IonCardHeader>
              <IonRow>
                <IonCol>
                  <IonCardTitle>
                    Name: {value.firstname + " " + value.lastname}
                  </IonCardTitle>
                </IonCol>
                <IonCol>
                  {value.id ? (
                    <IonButtons>
                      <IonButton
                        onClick={() =>
                          removeFromClub(value.id ? value.id : "none")
                        }
                        className="deleteButton"
                      >
                        Remove
                      </IonButton>
                    </IonButtons>
                  ) : (
                    <></>
                  )}
                </IonCol>
              </IonRow>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  {" "}
                  <IonCol>Email:</IonCol> <IonCol>{value.email}</IonCol>
                </IonRow>
                <IonRow>
                  {" "}
                  <IonCol>Username:</IonCol> <IonCol>{value.userName}</IonCol>
                </IonRow>
                <IonRow>
                  {" "}
                  <IonCol>Active:</IonCol> <IonCol>{activeState}</IonCol>
                </IonRow>
                <IonRow>
                  {" "}
                  <IonCol>Gruppen:</IonCol>{" "}
                  <IonCol>
                    {value.groups.length > 0 ? (
                      owned?.groups
                        .filter((grp) => value.groups.includes(grp?.id ?? ""))
                        .map((value) => {
                          return <IonRow key={value.name}>{value.name}</IonRow>;
                        })
                    ) : (
                      <IonRow>Noch in keiner Gruppe!</IonRow>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        );
      });
      return items.length > 0 ? (
        <IonGrid>
          <IonRow>{items}</IonRow>
        </IonGrid>
      ) : (
        <NoValuesInfo />
      );
    } else {
      return <NoValuesInfo />;
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
            <IonButton onClick={() => history.push("/members/add")}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
          <IonTitle>Clubmitglieder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <ListMembers />
      </IonContent>
    </IonPage>
  );
};

export default Members;
