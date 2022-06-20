import React, { useEffect } from "react";
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
import { CreateClub, User } from "../../types/types";
import * as Validator from "../../helpers/validators";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { executeDelayed } from "../../helpers/async-helpers";
import {
  BuildForm,
  FieldDescriptionType,
  FormDescription,
} from "../../utils/form-builder";
import { fetchUser, register } from "../../services/rest/users";
import { RootState } from "../../services/reducers";

import { fetchUserAction, fetchUserActions } from "../../services/actions/users";
import { createClub } from "../../services/rest/club";

const form = (mode: string): FormDescription<CreateClub> => ({
  name: "createClub",
  fields: [
    {
      name: "name",
      label: "Club Name",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
  ],
  submitLabel: mode === "add" ? "Save" : "Update",
});

export default (
    mode: "add" | "edit"
  ): React.FC<RouteComponentProps<{ id: string }>> =>
  ({ history, match }) => {
    const dispatch = useDispatch();
    const { owned, isLoading, errorMessage } = useSelector(
      (s: RootState) => s.clubs
    );
    const token = useSelector(
      (s: RootState) => s.user.authenticationInformation!.token || ""
    );
    const user = useSelector(
      (s: RootState) => s.user.user
    )
    const { Form, loading, error } = BuildForm(form(mode));

    useEffect(() => {});

    const submit = (cl: CreateClub) => {
      dispatch(loading(true));
      createClub(token, cl)
        .then((result: {}) => {
          if(user?.id) {
            fetchUser(token, user.id).then(usr => dispatch(fetchUserActions.success(usr))).catch(err => fetchUserActions.failure(err))
          }
          executeDelayed(100, () => history.replace("/club"));
        })
        .catch((err: Error) => {
          dispatch(error(err.message));
        })
        .finally(() => dispatch(loading(false)));
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/login" />
            </IonButtons>
            <IonTitle>{mode === "add" ? "Register" : ""}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Form handleSubmit={submit} />
        </IonContent>
      </IonPage>
    );
  };
