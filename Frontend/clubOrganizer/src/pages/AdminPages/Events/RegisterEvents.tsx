import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonContent,
  IonPage,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonItem,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonToast,
} from "@ionic/react";
import { Group, User, Event } from "../../../types/types";
import * as Validator from "../../../helpers/validators";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { executeDelayed } from "../../../helpers/async-helpers";
import {
  BuildForm,
  FieldDescriptionType,
  FormDescription,
} from "../../../utils/form-builder";
import { register } from "../../../services/rest/users";
import { RootState } from "../../../services/reducers";

import { fetchUserAction } from "../../../services/actions/users";
import {
  addEventToClub,
  addGroupToClub,
  fetchOwnedClub,
} from "../../../services/rest/club";
import {
  fetchOwnedAction,
  fetchOwnedActions,
} from "../../../services/actions/club";

const form = (mode: string): FormDescription<Event> => ({
  name: "registrationGroups",
  fields: [
    {
      name: "name",
      label: "Event Name",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "description",
      label: "Event Beschreibung",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "startDateTime",
      label: "Start Zeitpunkt",
      type: "date",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "endDateTime",
      label: "Ende Zeitpunkt",
      type: "date",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "active",
      label: "Ist Aktiv?",
      type: "select",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
      options: [
        { key: true, value: "Active" },
        { key: false, value: "Inactive" },
      ],
    },
  ],
  submitLabel: mode === "add" ? "Save" : "Update",
});

export default (
    mode: "add" | "edit"
  ): React.FC<RouteComponentProps<{ id: string }>> =>
  ({ history, match }) => {
    const dispatch = useDispatch();
    const token = useSelector(
      (s: RootState) => s.user.authenticationInformation!.token || ""
    );
    const { owned, isLoading, errorMessage } = useSelector(
      (s: RootState) => s.clubs
    );
    const [selectedEvent, setSelectedEvent] = useState({} as Event | undefined);

    const { Form, loading, error } = BuildForm(form(mode));

    useEffect(() => {
      if (
        mode == "edit" &&
        (!owned || owned.events.find((x) => x.id == match.params.id) != null)
      ) {
        dispatch(fetchOwnedAction());

        if (
          owned != null &&
          typeof owned.events.find((x) => x.id == match.params.id) !=
            typeof undefined
        ) {
          const e = owned.events.find((x) => x.id == match.params.id);
          setSelectedEvent(e);
          console.log(selectedEvent);
        }
      }
    });

    const submit = (event: Event) => {
      dispatch(loading(true));
      if (owned != null) {
        addEventToClub(token, owned.id, event)
          .then((result: {}) => {
            fetchOwnedClub(token)
              .then((usr) => dispatch(fetchOwnedActions.success(usr)))
              .catch((err) => dispatch(fetchOwnedActions.failure(err)));
            executeDelayed(100, () => history.replace("/events"));
          })
          .catch((err: Error) => {
            dispatch(error(err.message));
          })
          .finally(() => dispatch(loading(false)));
      }
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/login" />
            </IonButtons>
            <IonTitle>
              {mode === "add" ? "New" : "Edit"} Group{" "}
              {mode === "edit" ? selectedEvent?.name : ""}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {isLoading ? (
            <IonItem>
              <IonSpinner />
              Loading User...
            </IonItem>
          ) : mode === "edit" ? (
            <Form handleSubmit={submit} initialState={selectedEvent!} />
          ) : (
            <Form handleSubmit={submit} />
          )}
        </IonContent>
      </IonPage>
    );
  };
