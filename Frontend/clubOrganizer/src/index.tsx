import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './services/store';
import { combineReducers } from 'redux';
import rootReducer from './services/reducers';
import { loadUserData } from './services/rest/security';
import { loggedIn } from './services/actions/security';
import { getActiveClub } from './services/rest/club';

const AppReducer = combineReducers({
  rootReducer,

})

loadUserData()
    .then(info =>  {
        return info.user && info.authentication ? store.dispatch(loggedIn({user: info.user, authenticationInformation: info.authentication})): false
    })
    .catch(e => console.log(e))

getActiveClub()

const render = () => {
  const App = require("./App").default;
  ReactDOM.render(
      <Provider store={store}>
          <App />
      </Provider>,
      document.getElementById("root")
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
