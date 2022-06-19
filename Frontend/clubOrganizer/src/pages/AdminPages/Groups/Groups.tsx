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
import "./Groups.css";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../services/reducers";
import { IconConverter } from "../../../utils/icon-converter";
import {
  fetchUsersAction,
  fetchUsersActions,
} from "../../../services/actions/users";
import { fetchUsers } from "../../../services/rest/users";
import {
  fetchAddGroupAction,
  fetchOwnedAction,
  fetchOwnedActions,
} from "../../../services/actions/club";
import { fetchOwnedClub } from "../../../services/rest/club";

const Groups: React.FC<RouteComponentProps> = ({ history }) => {
  const { owned, isLoading, errorMessage } = useSelector(
    (s: RootState) => s.clubs
  );
  const token = useSelector(
    (s: RootState) => s.user.authenticationInformation!.token || ""
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOwnedAction());

    fetchOwnedClub(token)
      .then((usr) => dispatch(fetchOwnedActions.success(usr)))
      .catch((err) => dispatch(fetchOwnedActions.failure(err)));
  }, []);

  const NoValuesInfo = () =>
    !isLoading && owned?.groups.length == 0 ? (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>No Groups found...</IonCardTitle>
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
  };

  const ListGroups = () => {
    if (owned) {
      const items = owned?.groups!.map((value) => {
        return (
          <IonCard
            className="userCard"
            key={value.id}
            onClick={() => history.push("/groups/edit/" + value.id)}
          >
            <IonCardHeader>
              <IonCardTitle>Gruppe: {value.name}</IonCardTitle>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {" "}
                    <IonCol>Beschreibung:</IonCol>{" "}
                    <IonCol>{value.description}</IonCol>
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
            <IonButton onClick={() => history.push("/groups/add")}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
          <IonTitle>Gruppen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {isLoading ? (
          <IonItem>
            <IonSpinner />
            Loading Groups...
          </IonItem>
        ) : (
          <ListGroups />
        )}
        <IonToast
          isOpen={errorMessage ? errorMessage.length > 0 : false}
          onDidDismiss={() => false}
          message={errorMessage}
          duration={5000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Groups;
