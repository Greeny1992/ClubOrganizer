import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonMenu,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addOutline, homeOutline, manOutline, square } from 'ionicons/icons';
import Club from './pages/Club';
import Profile from './pages/Profile';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Terminplanung from './pages/Tab3';
import { SecureRoute } from './components/SecurePage';
import Login from './pages/Login/Login';
import Menu from './components/Menu';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
          
          <Menu />
            <IonRouterOutlet id="main">
              <Route path="/login" component={Login} exact={true} />
              <SecureRoute path="/profile" component={Profile} exact={true} />
              <SecureRoute path="/club" component={Club} exact={true} />
              <SecureRoute path="/termine" component={Terminplanung} exact={true} />
              <Route path="/" exact={true}>
                <Redirect to="/profile" />
              </Route>
            </IonRouterOutlet>
          
        </IonReactRouter>
  </IonApp>
);

export default App;



/* <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <SecureRoute exact path="/club">
            <Club />
          </SecureRoute>
          <SecureRoute path="/termine">
            <Terminplanung />
          </SecureRoute>

          <Route path="/login" component={Login}/>
          <Route exact path="/">
            <Redirect to="/club" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={manOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
          <IonTabButton tab="club" href="/club">
            <IonIcon icon={homeOutline} />
            <IonLabel>Club</IonLabel>
          </IonTabButton>
          <IonTabButton tab="termine" href="/termine">
            <IonIcon icon={addOutline} />
            <IonLabel>Terminplanung</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter> */