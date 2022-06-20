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
  IonAccordion,
  IonLabel,
  IonAccordionGroup,
} from "@ionic/react";
import { add, information, skull } from "ionicons/icons";
import "./Termine.css";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/reducers";
import { IconConverter } from "../../utils/icon-converter";
import {
  fetchUsersAction,
  fetchUsersActions,
} from "../../services/actions/users";
import { fetchUsers } from "../../services/rest/users";
import {
  fetchAddGroupAction,
  fetchOwnedAction,
  fetchOwnedActions,
} from "../../services/actions/club";
import { fetchClub } from "../../services/rest/club";
import { Club } from "../../types/types";
import { acceptEvent, cancleEvent } from "../../services/rest/event";

const Termine: React.FC<RouteComponentProps> = ({ history }) => {
  const { activeClubID } = useSelector((s: RootState) => s.activeCl);
  const [selectedClub, setSelectedClub] = useState({} as Club);
  const token = useSelector(
    (s: RootState) => s.user.authenticationInformation!.token || ""
  );
  const userId = useSelector((s: RootState) => s.user.user?.id || "")
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOwnedAction());

    fetchClub(token, activeClubID).then((data) => {
      setSelectedClub(data);
    });
  }, []);

  const NoValuesInfo = () =>
    selectedClub?.events?.length == 0 ? (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>No Events found...</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    ) : (
      <></>
    );

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchClub(token, activeClubID)
      .then((data) => setSelectedClub(data))
      .then(() => event.detail.complete())
      .catch((err) => dispatch(fetchOwnedActions.failure(err)));
  };

  const onUserAcceptEvent = (eventId: string) => {
    acceptEvent(token,eventId,activeClubID,userId)
    .then((data) => setSelectedClub(data))
    .catch((err) => dispatch(fetchOwnedActions.failure(err)));
   }

   const onUserCancleEvent = (eventId: string) => {
    cancleEvent(token,eventId,activeClubID,userId)
    .then((data) => setSelectedClub(data))
    .catch((err) => dispatch(fetchOwnedActions.failure(err)));
   }
  const ListAvailableEvents = () => {
    if (selectedClub) {
      const items = selectedClub?.events?.map((value) => {
        const startDate = new Date(value.startDateTime).toLocaleDateString();
        const startTime = new Date(value.startDateTime).toLocaleTimeString();
        const endDate = new Date(value.endDateTime).toLocaleDateString();
        const endTime = new Date(value.endDateTime).toLocaleTimeString();
        const zusagen =
          value.acceptUsers.length > 0
            ? value.acceptUsers.length
            : "keine Zusagen noch!";
        const absagen =
          value.cancelUsers.length > 0
            ? value.cancelUsers.length
            : "keine Absagen noch!";
        return (
          <IonCard
            className="userCard"
            key={
              value.id
            }
          >
            <IonCardHeader>
              <IonCardTitle>Event: {value.name}</IonCardTitle>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {" "}
                    <IonCol>Beschreibung:</IonCol>{" "}
                    <IonCol>{value.description}</IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>Start:</IonCol>{" "}
                    <IonCol>{"am " + startDate + " um " + startTime}</IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>Ende:</IonCol>{" "}
                    <IonCol>{"am " + endDate + " um " + endTime}</IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>Aktiv:</IonCol>{" "}
                    <IonCol>{value.active ? "JA!" : "Nope"}</IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>
                      <IonAccordionGroup><IonAccordion value="zusagen">
                        <IonItem slot="header">
                          <IonLabel>Zusagen: {zusagen}</IonLabel>
                        </IonItem>
                        <IonList slot="content">
                          {value.acceptUsers.map((acu,index) => {return (
                            <IonItem key={(value.id ?? "") + (acu?.id ?? "") + index}>
                              <IonLabel>{acu.firstname + ' ' + acu.lastname}</IonLabel>
                            </IonItem>
                          )})}
                        </IonList>
                      </IonAccordion></IonAccordionGroup>{" "}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>
                      <IonAccordionGroup>
                      <IonAccordion value="absagen">
                        <IonItem slot="header">
                          <IonLabel>Absagen: {absagen}</IonLabel>
                        </IonItem>
                        <IonList slot="content">
                          {value.cancelUsers.map((ccu, index) => {return (
                            <IonItem key={(value.id ?? "") + (ccu?.id ?? "") + index}>
                              <IonLabel>{ccu.firstname + ' ' + ccu.lastname}</IonLabel>
                            </IonItem>
                          )})}
                        </IonList>
                      </IonAccordion>
                      </IonAccordionGroup>{" "}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButton disabled={value.acceptUsers.filter(u => u.id === userId).length > 0} color="success" onClick={() => onUserAcceptEvent(value?.id ?? "")}>Zusage</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton disabled={value.cancelUsers.filter(u => u.id === userId).length > 0} color="danger"  onClick={() => onUserCancleEvent(value?.id ?? "")}>Absage</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCardHeader>
          </IonCard>
        );
      });
      return items?.length > 0 ? (
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
          <IonTitle>Termine</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <ListAvailableEvents />
      </IonContent>
    </IonPage>
  );
};

export default Termine;
