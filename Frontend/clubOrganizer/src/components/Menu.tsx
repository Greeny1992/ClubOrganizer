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
  IonTabButton,
  IonTabBar,
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
  addSharp, addOutline, alarmOutline, alarmSharp, alertOutline, alertSharp, logIn, personAddOutline, personAddSharp, manOutline
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
    title: 'Club',
    url: '/club',
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
      url: '/home',
      iosIcon: logOutOutline,
      mdIcon: logOutSharp,
      onClick: () => {dispatch(loggedOut())}
    }

    AddMenu({
      title: 'Profile',
      url : '/profile',
      iosIcon : listOutline,
      mdIcon : listSharp
    })

    AddMenu({
      title: 'Club',
      url : '/club',
      iosIcon : addOutline,
      mdIcon : addSharp
    })

    AddMenu({
      title: 'Termine',
      url : '/termine',
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
    <IonTabBar slot="bottom">
            {appPages.map((appPage, index) => {
              return (
                  <IonTabButton tab={appPage.title} href={appPage.url}>
                       <IonIcon icon={manOutline} />
                       <IonLabel>{appPage.title}</IonLabel>
                      </IonTabButton>
                    
              );
            })}
            {secureAppPage.map((appPage, index) => {
              return (
                 <IonTabButton tab={appPage.title} href={appPage.url}>
                        <IonIcon icon={manOutline} />
                        <IonLabel>{appPage.title}</IonLabel>
                  </IonTabButton>
                    
              );
            })}
    </IonTabBar>
        
  );
};


export default Menu;