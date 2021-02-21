import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import App from './App';
import theme from './theme';
import { store } from './store/store';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="brannigans-chess.us.auth0.com"
      clientId="ze6Tou8TRTMzdxpXHqUIZg27GviJqYD7"
      redirectUri={window.location.origin}
      audience="https://branniganschess.com"
      useRefreshTokens
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
