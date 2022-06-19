import React from "react";
import * as Validator from "../../helpers/validators";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonPage,
  IonCard,
  IonRow,
  IonCol,
} from "@ionic/react";
import { FormDescription, BuildForm } from "../../utils/form-builder";
import { RouteComponentProps } from "react-router";
import { login } from "../../services/rest/security";
import { executeDelayed } from "../../helpers/async-helpers";
import { LoginData } from "../../types/types";
import { loggedIn, loggedOut } from "../../services/actions/security";
import { useDispatch } from "react-redux";
import store, { AppDispatch } from "../../services/store";
import "./Login.css";

type formData = Readonly<LoginData>;

const formDescription: FormDescription<formData> = {
  name: "login",
  fields: [
    {
      name: "username",
      label: "Email",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      position: "floating",
      color: "primary",
      validators: [Validator.required],
    },
  ],
  submitLabel: "Login",
};

const { Form, loading, error } = BuildForm(formDescription);

export const Login: React.FunctionComponent<RouteComponentProps<any>> = (
  props
) => {
  const dispatch = useDispatch();

  const submit = (loginData: LoginData) => {
    dispatch(loading(true));
    login(loginData)
      .then((loginInfo) => {
        /* if(loginInfo.user?.active){ */
        const authresponse = loggedIn(loginInfo);
        dispatch(authresponse);
        executeDelayed(200, () => props.history.replace("/club"));
        /*  }
                else{ 
                    dispatch(loggedOut())
                    dispatch(error('Your Account is currently Inactive!'));
                }   */
      })
      .catch((err: Error) => {
        dispatch(error("Error while logging in: " + err.message));
      })
      .finally(() => dispatch(loading(false)));
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="centered">
        <div className="place_center">
          <IonCard className="login_form_card">
            <Form handleSubmit={submit} />
            <IonRow>
              <IonCol>Noch Kein Konto ? Hier </IonCol>{" "}
              <IonCol>
                {" "}
                <IonButtons>
                  <IonButton routerLink="/register">Registrieren</IonButton>
                </IonButtons>
              </IonCol>
            </IonRow>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
