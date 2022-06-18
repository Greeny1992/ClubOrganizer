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

const Termine: React.FC<RouteComponentProps> = ({ history }) => {
  const { activeClubID } = useSelector((s: RootState) => s.activeCl);
  const [selectedClub, setSelectedClub] = useState({
    name: "",
    ownerID: "",
    adminIDs: [""],
    memberIDs: [""],
    groups: [],
    events: [],
    id: "",
  } as Club);
  const token = useSelector(
    (s: RootState) => s.user.authenticationInformation!.token || ""
  );
  const dispatch = useDispatch();
  console.log(selectedClub);
  console.log(activeClubID);

  useEffect(() => {
    dispatch(fetchOwnedAction());

    fetchClub(token, activeClubID).then((data) => {
      setSelectedClub(data);
      console.log(data);
    });
  }, []);

  const NoValuesInfo = () =>
    selectedClub?.events.length == 0 ? (
      <IonCard>
        <IonIcon icon={information}></IonIcon>
        <IonCardHeader>
          <IonCardTitle>No Events found...</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    ) : (
      <></>
    );

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log("Begin async operation on Value List");
    fetchClub(token, activeClubID)
      .then((data) => setSelectedClub(data))
      .then(() => event.detail.complete())
      .catch((err) => dispatch(fetchOwnedActions.failure(err)));
  };

  const ListAvailableEvents = () => {
    if (selectedClub) {
      const items = selectedClub.events.map((value) => {
        const startDate = new Date(value.startDateTime).toLocaleDateString();
        const startTime = new Date(value.startDateTime).toLocaleTimeString();
        const endDate = new Date(value.endDateTime).toLocaleDateString();
        const endTime = new Date(value.endDateTime).toLocaleTimeString();
        const zusagen =
          value.acceptUsers.length > 0
            ? value.acceptUsers.map((x) => x.userName + ", ")
            : "keine Zusagen noch!";
        const absagen =
          value.cancelUsers.length > 0
            ? value.cancelUsers.map((x) => x.userName + ", ")
            : "keine Absagen noch!";
        return (
          <IonCard
            className="userCard"
            key={
              value.id
            } /* onClick={() => history.push('/events/edit/' +value.id)} */
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
                    <IonCol>Zusagen:</IonCol> <IonCol>{zusagen}</IonCol>
                  </IonRow>
                  <IonRow>
                    {" "}
                    <IonCol>Absagen:</IonCol> <IonCol>{absagen}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButton>Zusagen</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton>Absagen</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCardHeader>
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
            <IonButton onClick={() => history.push("/events/add")}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
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
