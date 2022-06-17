import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import {
  fetchClubsAction,
  fetchClubsActions,
  fetchOwnedAction,
  fetchOwnedActions,
  OwnedResult,
} from "../../services/actions/club";
import { loggedIn } from "../../services/actions/security";
import { RootState } from "../../services/reducers";
import { fetchClubs, fetchOwnedClub, setActiveClub } from "../../services/rest/club";
import { loadUserData } from "../../services/rest/security";
import { Club } from "../../types/types";
import "./Club.css";

const ClubPage: React.FC = (props) => {
  const { owned, myclubs } = useSelector((state: RootState) => state.clubs);
  const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
  const [ownedClub, setOwnedClub] = useState<any | null>(null);
  const [userclubs, setUserClubs] = useState<any | null>(null);
  const [selectedClub, setSelectedClub] = useState<string>();
  const thunkDispatch: ThunkDispatch<RootState, null, OwnedResult> =
    useDispatch();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!ownedClub) {
      thunkDispatch(fetchOwnedAction()).then(() => {
        setOwnedClub(owned);
      });
    }
    if (!userclubs) {
      thunkDispatch(fetchClubsAction()).then(() => {
        setUserClubs(myclubs);
      });
    }
  }, [owned, myclubs]);

  const onSetClubActive = (clubId: string) => {
    setSelectedClub(clubId);
    setActiveClub(clubId)
  }

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log('Begin async operation on Value List');
    fetchOwnedClub(token)
        .then(usr => dispatch(fetchOwnedActions.success(usr)))
        .then(() => event.detail.complete())
        .catch(err => dispatch(fetchOwnedActions.failure(err)))
  
    fetchClubs(token)
    .then(usr => dispatch(fetchClubsActions.success(usr)))
        .then(() => event.detail.complete())
        .catch(err => dispatch(fetchClubsActions.failure(err)))
  }


  const RenderListOfClubs = (props: {clubs: Club[]}) => {
    if (props.clubs && props.clubs.length > 0) {
      const list = props.clubs.map((club) => {
        return (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{club.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>Mitgliederanzahl: {club.memberIDs.length}</IonItem>
              
              <IonButton onClick={() => onSetClubActive(club.id)} disabled={selectedClub === club.id}>
                { selectedClub !== club.id ? "Select Club" : "Selected" }
              </IonButton>
            </IonCardContent>
          </IonCard>
        );
      });
      return <>{list}</>
    }
    return null;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Meine Clubs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Club</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          {owned != null && (
            <>
              <IonNote>Owned</IonNote>
              <RenderListOfClubs clubs={[owned]} />
            </>
          )}

          {myclubs != null && myclubs.length > 0 && (
            <>
              <IonNote>Meine Clubs</IonNote>
              <RenderListOfClubs clubs={myclubs} />
            </>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
