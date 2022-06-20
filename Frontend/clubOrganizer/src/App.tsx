import { Redirect, Route } from "react-router-dom";
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
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Profile from "./pages/Profile/Profile";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { SecureRoute } from "./components/SecurePage";
import Login from "./pages/Login/Login";
import Menu from "./components/Menu";
import RegisterGroup from "./pages/AdminPages/Groups/RegisterGroup";
import ClubPage from "./pages/Club/Club";
import Members from "./pages/Members/Members";
import Groups from "./pages/AdminPages/Groups/Groups";
import Events from "./pages/AdminPages/Events/Events";
import RegisterEvents from "./pages/AdminPages/Events/RegisterEvents";
import AddMembers from "./pages/Members/AddMembers";
import Termine from "./pages/Termine/Termine";
import Register from "./pages/Register/Register";
import AddOwnedClub from "./pages/Club/AddOwnedClub";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Menu />
      <IonRouterOutlet id="main">
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register("add")} exact={true} />
        <SecureRoute path="/profile" component={Profile} exact={true} />
        <SecureRoute path="/club" component={ClubPage} exact={true} />
        <SecureRoute
          path="/club/add"
          component={AddOwnedClub("add")}
          exact={true}
        />
        <SecureRoute path="/termine" component={Termine} exact={true} />
        <SecureRoute path="/members" component={Members} exact={true} />
        <SecureRoute path="/members/add" component={AddMembers} exact={true} />
        <SecureRoute path="/groups" component={Groups} exact={true} />
        <SecureRoute
          path="/groups/add"
          component={RegisterGroup("add")}
          exact={true}
        />
        <SecureRoute
          path="/groups/edit/:id"
          component={RegisterGroup("edit")}
          exact={true}
        />
        <SecureRoute path="/events" component={Events} exact={true} />
        <SecureRoute
          path="/events/add"
          component={RegisterEvents("add")}
          exact={true}
        />
        <SecureRoute
          path="/events/edit/:id"
          component={RegisterEvents("edit")}
          exact={true}
        />
        <Route path="/" exact={true}>
          <Redirect to="/profile" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
