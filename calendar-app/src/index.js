import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IntlProvider } from 'react-intl';
import localeEnMessages from "./locales/en";
import localeEsMessages from "./locales/es";


const messages = {
  'es': localeEsMessages,
  'en': localeEnMessages
};

const language = navigator.language.split(/[-_]/)[0];
const selectedMessages = messages[language] || messages['es'];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntlProvider locale={language} messages={selectedMessages}>
    <App />
  </IntlProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
