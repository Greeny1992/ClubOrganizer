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
import { User } from "../../types/types";
import * as Validator from "../../helpers/validators";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { executeDelayed } from "../../helpers/async-helpers";
import {
  BuildForm,
  FieldDescriptionType,
  FormDescription,
} from "../../utils/form-builder";
import { register } from "../../services/rest/users";
import { RootState } from "../../services/reducers";

import { fetchUserAction } from "../../services/actions/users";

const form = (mode: string): FormDescription<User> => ({
  name: "registration",
  fields: [
    {
      name: "userName",
      label: "Username",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "firstname",
      label: "Firstname",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "lastname",
      label: "Lastname",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "email",
      label: "E-Mail",
      type: "email",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      position: "floating",
      validators: [Validator.required, Validator.minLength(8)],
    },
  ],
  submitLabel: mode === "add" ? "Save" : "Update",
});

export default (
    mode: "add" | "edit"
  ): React.FC<RouteComponentProps<{ id: string }>> =>
  ({ history, match }) => {
    const dispatch = useDispatch();

    const { Form, loading, error } = BuildForm(form(mode));

    useEffect(() => {});

    const submit = (user: User) => {
      dispatch(loading(true));
      register(user)
        .then((result: {}) => {
          executeDelayed(100, () => history.replace("/login"));
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
