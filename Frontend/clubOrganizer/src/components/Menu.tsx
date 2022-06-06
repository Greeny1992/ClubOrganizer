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
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  homeOutline,
  homeSharp,
  listOutline,
  listSharp,
  logInSharp,
  logInOutline,
  logOutSharp,
  logOutOutline,
  addSharp, addOutline, alarmOutline, alarmSharp, alertOutline, alertSharp, logIn, personAddOutline, personAddSharp
} from 'ionicons/icons';
import './Menu.css';
import React, { useState, useEffect } from "react";
import {useDispatch, useSelector, useStore} from "react-redux";
import {loggedOut} from "../services/actions/security";
import {isNotExpired} from "../services/rest/security";
import {RootState} from "../services/reducers";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Login',
    url: '/login',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  }


];

var secureAppPage: AppPage[] = [

];

function AddMenu(item : AppPage)
{
  if (secureAppPage.some(e => e.url === item.url) == false) {
    secureAppPage.push(item );
  }
}



const Menu: React.FC = () => {
  const location = useLocation();

  const {user, authentication } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const store = useStore();
  const token : String = "";
  var securityItem = null;

  if(isNotExpired(authentication))
  {
    securityItem = {
      title: 'Logout ' + user?.username,
      url: '/login',
      iosIcon: logOutOutline,
      mdIcon: logOutSharp,
      onClick: () => {dispatch(loggedOut())}
    }

    AddMenu({
      title: 'Termine',
      url : '/termine',
      iosIcon : listOutline,
      mdIcon : listSharp
    })

    AddMenu({
      title: 'Profile',
      url : '/profile',
      iosIcon : addOutline,
      mdIcon : addSharp
    })

    AddMenu({
      title: 'Club',
      url : '/club',
      iosIcon : alarmOutline,
      mdIcon : alarmSharp
    })

    if(user!.role == "Admin") {
      AddMenu(
          {
              title: 'Users',
              url: '/users',
              iosIcon: personAddOutline,
              mdIcon: personAddSharp
          }
      );
  }

  }
  else{
    securityItem =
        {
          title: 'Login',
          url: '/login',
          iosIcon: logInOutline,
          mdIcon: logInSharp,
          onClick: (e: any) => {}
        }

    secureAppPage = [];

  }

  return (
      <IonMenu side='start' contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonListHeader>Welcome</IonListHeader>
          <IonNote>{isNotExpired(authentication) ? 'Hello ' + user?.username : 'Not Logged in'}</IonNote>
          <IonList>
            {appPages.map((appPage, index) => {
              return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem routerLink={appPage.url} routerDirection="none">
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              );
            })}
            {secureAppPage.map((appPage, index) => {
              return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              );
            })}
            <IonMenuToggle key={'sec2'} auto-hide="false">
              <IonItem routerLink={securityItem.url} lines="none" onClick={securityItem.onClick} >
                <IonIcon slot="start" ios={securityItem.iosIcon} md={securityItem.mdIcon} />
                <IonLabel>{securityItem.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
  );
};


export default Menu;