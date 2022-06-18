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
  } from "@ionic/react";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { ThunkDispatch } from "redux-thunk";
  import { isOfType } from "typesafe-actions";
  import {
    fetchUserByEmailAction,
    UserResult,
  } from "../../services/actions/users";
  import { RootState } from "../../services/reducers";
  import { Club, User, UserList } from "../../types/types";
  import { BuildForm, FormDescription } from "../../utils/form-builder";
  import { Storage } from "@capacitor/storage";
  import {
    fetchMembersFromClub,
    fetchUserByEmail,
  } from "../../services/rest/users";
  import { addMemberToClub, fetchOwnedClub } from "../../services/rest/club";
  import { fetchOwnedActions } from "../../services/actions/club";
  
  const { loading } = BuildForm({} as FormDescription<{ search: string }>);
  
  const AddMembers: React.FC = (props) => {
    const { user, authenticationInformation } = useSelector(
      (state: RootState) => state.user
    );
  
    const [present, dismiss] = useIonToast();
    const [searchMail, setSearchMail] = useState<string>();
    const [searchResultUser, setSearchResultUser] = useState<User>();
    const [ownedClub, setOwnedClub] = useState<string>("");
    const [currentMembers, setCurrentMembers] = useState<User[]>();
    const { owned, isLoading, errorMessage } = useSelector((s:RootState) => s.clubs);
    const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
    const thunkDispatch: ThunkDispatch<RootState, null, UserResult> =
      useDispatch();
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (user) {
        setOwnedClub(user.ownedClub);
      }
    }, []);
  
    useEffect(() => {
      if (authenticationInformation && ownedClub) {
        fetchMembersFromClub(authenticationInformation?.token, ownedClub).then(
          (members) => {
            console.log("members", members);
            setCurrentMembers(members);
          }
        );
  
        fetchOwnedClub(token)
                      .then(usr => dispatch(fetchOwnedActions.success(usr)))
                      .catch(err => dispatch(fetchOwnedActions.failure(err)))
      }
    }, [ownedClub]);
  
    const onClickSearch = () => {
      dispatch(loading(true));
      if (authenticationInformation && searchMail)
        fetchUserByEmail(authenticationInformation?.token, searchMail)
          .then((user) => {
            setSearchResultUser(user);
          })
          .catch((err) => present("Leider kein User gefunden", 3000))
          .finally(() => dispatch(loading(false)));
    };
  
    const onClickAddUser = () => {
      if (
        authenticationInformation &&
        searchResultUser?.id &&
        ownedClub &&
        searchMail
      ) {
        addMemberToClub(
          authenticationInformation?.token,
          ownedClub,
          searchResultUser.id
        ).then((data) => {
          Storage.set({
            key: "ownedClub",
            value: JSON.stringify(data && typeof data === "object" ? data : {}),
          });
  
          fetchOwnedClub(token)
                      .then(usr => dispatch(fetchOwnedActions.success(usr)))
                      .catch(err => dispatch(fetchOwnedActions.failure(err)))
        });
        fetchUserByEmail(authenticationInformation?.token, searchMail)
          .then((user) => {
            setSearchResultUser(user);
          })
          .catch((err) => present("Leider kein User gefunden", 3000))
          .finally(() => dispatch(loading(false)));
      }
    };
    const isAlreadyMember =
      searchResultUser?.myClubs.includes(ownedClub) ||
      searchResultUser?.ownedClub === ownedClub;
    const RenderSearchResultUser = () => {
      return (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {searchResultUser?.firstname + " " + searchResultUser?.lastname}
            </IonCardTitle>
            <IonCardSubtitle>{searchResultUser?.email}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton
              disabled={isAlreadyMember}
              onClick={() => onClickAddUser()}
            >
              {isAlreadyMember ? "Bereits ein Mitglied" : "Mitglied hinzufügen"}
            </IonButton>
          </IonCardContent>
        </IonCard>
      );
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Clubmitglieder</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonCard>
            <IonItem>
              <IonLabel position="floating">
                Email von gwünschten Mitglied hier eingeben
              </IonLabel>
              <IonInput
                value={searchMail}
                onIonChange={(e) => setSearchMail(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>
            <IonCardContent>
              <IonButton onClick={() => onClickSearch()} disabled={!searchMail}>
                Suchen
              </IonButton>
            </IonCardContent>
          </IonCard>
  
          {searchResultUser && <RenderSearchResultUser />}
          {currentMembers && currentMembers?.length > 0?currentMembers.forEach((usr) => {
              return (
                <IonCard key={usr.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {usr?.firstname + " " + usr?.lastname}
                    </IonCardTitle>
                    <IonCardSubtitle>{usr?.email}</IonCardSubtitle>
                  </IonCardHeader>
                </IonCard>
              );
            }) : <></>}
        </IonContent>
      </IonPage>
    );
  };
  
  export default AddMembers;
  