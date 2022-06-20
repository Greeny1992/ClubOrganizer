import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  homeOutline,
  homeSharp,
  listOutline,
  listSharp,
  logInSharp,
  logInOutline,
  logOutSharp,
  logOutOutline,
  addSharp,
  addOutline,
  alarmOutline,
  alarmSharp,
  alertOutline,
  alertSharp,
  logIn,
  personAddOutline,
  personAddSharp,
  addCircleOutline,
  addCircle,
  documentOutline,
  documentSharp,
  layersOutline,
  layersSharp,
  peopleOutline,
  peopleSharp,
} from "ionicons/icons";
import "./Menu.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { loggedOut } from "../services/actions/security";
import { isNotExpired } from "../services/rest/security";
import { RootState } from "../services/reducers";
import { fetchClub, getActiveClub } from "../services/rest/club";
import { Club } from "../types/types";
import { fetchUser } from "../services/rest/users";
import { fetchUserActions } from "../services/actions/users";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [];

let secureAppPage: AppPage[] = [];

let clubAdminFunctions: AppPage[] = [];

let adminFunctions: AppPage[] = [];

function AddMenu(item: AppPage) {
  if (secureAppPage.some((e) => e.url === item.url) == false) {
    secureAppPage.push(item);
  }
}

function AddClubAdminMenu(item: AppPage) {
  if (clubAdminFunctions.some((e) => e.url === item.url) == false) {
    clubAdminFunctions.push(item);
  }
}

function AddAdminMenu(item: AppPage) {
  if (adminFunctions.some((e) => e.url === item.url) == false) {
    adminFunctions.push(item);
  }
}

const Menu: React.FC = () => {
  const location = useLocation();

  const { user, authenticationInformation } = useSelector(
    (state: RootState) => state.user
  );

  const { userDetail } = useSelector(
    (state: RootState) => state.users
  );
  const { activeClubID } = useSelector((state: RootState) => state.activeCl);
  const [selectedClub, setSCID] = useState({} as Club);
  const dispatch = useDispatch();
  var securityItem = null;

  useEffect(() => {
    if (
      authenticationInformation &&
      authenticationInformation.token !== "" &&
      activeClubID != null &&
      activeClubID != ""
    ) {
      fetchClub(authenticationInformation?.token, activeClubID).then((c) => {
        setSCID(c);
      });
    }
  }, [activeClubID]);

  useEffect(() => {
    if(userDetail === null && user?.id) {
      fetchUser(authenticationInformation!.token, user.id).then(usr => dispatch(fetchUserActions.success(usr))).catch(err => fetchUserActions.failure(err))
    }
    console.log("userDetail", userDetail)
    if (isNotExpired(authenticationInformation)) {
      if (selectedClub.id && selectedClub.id !== "") {
        AddMenu({
          title: "Termine",
          url: "/termine",
          iosIcon: listOutline,
          mdIcon: listSharp,
        });
      }
      if (userDetail && userDetail.ownedClub && userDetail.ownedClub !== "") {
        AddClubAdminMenu({
          title: "Events",
          url: "/events",
          iosIcon: documentOutline,
          mdIcon: documentSharp,
        });

        AddClubAdminMenu({
          title: "Gruppen",
          url: "/groups",
          iosIcon: layersOutline,
          mdIcon: layersSharp,
        });

        AddClubAdminMenu({
          title: "Mitglieder",
          url: "/members",
          iosIcon: peopleOutline,
          mdIcon: peopleSharp,
        });
      }
    }
  }, [user, userDetail, selectedClub]);

  if (isNotExpired(authenticationInformation)) {
    securityItem = {
      title: "Logout " + user?.userName,
      url: "/login",
      iosIcon: logOutOutline,
      mdIcon: logOutSharp,
      onClick: () => {
        setSCID({} as Club);
        dispatch(loggedOut());
      },
    };

    AddAdminMenu({
      title: "Profile",
      url: "/profile",
      iosIcon: addOutline,
      mdIcon: addSharp,
    });

    AddMenu({
      title: "Club",
      url: "/club",
      iosIcon: alarmOutline,
      mdIcon: alarmSharp,
    });
  } else {
    securityItem = {
      title: "Login",
      url: "/login",
      iosIcon: logInOutline,
      mdIcon: logInSharp,
      onClick: (e: any) => {},
    };

    secureAppPage = [];
    adminFunctions = [];
  }

  return (
    <IonMenu side="start" contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader className="centered">
          {isNotExpired(authenticationInformation)
            ? user?.userName
            : "Bitte logge dich ein, oder registriere dich, um auf deinen Club zugreifen zu können"}
        </IonListHeader>

        <IonList>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={appPage.url} routerDirection="none">
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          {isNotExpired(authenticationInformation) && (
            <IonNote className="menu_note">
              {selectedClub.name
                ? "Club: " + selectedClub.name
                : "Select a Club"}
            </IonNote>
          )}

          {secureAppPage.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

          
        </IonList>
        <div className="lock_bottom_admin_list">
        {userDetail?.ownedClub && (
            <IonNote className="menu_note">{"Manage deinen Club"}</IonNote>
          )}
          {clubAdminFunctions.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          
            <IonNote className="menu_note">{"Benutzer"}</IonNote>
          
          {adminFunctions.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

        </div>
        
        <IonMenuToggle className="lock_bottom" key={"sec2"} auto-hide="false">
          <IonItem
            routerLink={securityItem.url}
            lines="none"
            onClick={securityItem.onClick}
          >
            <IonIcon
              slot="start"
              ios={securityItem.iosIcon}
              md={securityItem.mdIcon}
            />
            <IonLabel>{securityItem.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
