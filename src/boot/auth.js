import { boot } from 'quasar/wrappers';
import { api, isLive } from './api';
import keycloakApi from './keycloak-boot';
import Keycloak from 'keycloak-js';

console.log('boot axios and auth ...');
export default boot(async ({ app /*router, store*/ }) => {
  // init keycloakApi with keycloak instance
  keycloakApi.keycloak = null;

  if (!isLive) return;

  const auth = {
    tokenName: 'access_token',
    removeToken: function () {
      localStorage.removeItem(this.tokenName);
    },
  };

  function doAuth() {
    console.log('do auth');
    return new Promise((resolve, reject) => {
      keycloakApi.keycloak = new Keycloak(keycloakApi.keycloakConfig);

      keycloakApi.keycloak
        .init({
          onLoad: 'login-required',
        })
        .then((authenticated) => {
          if (authenticated) {
            resolve(keycloakApi.keycloak.token);
          } else {
            reject({ message: 'not authenticated' });
          }
        });
    });
  }

  let token = await doAuth();

  // init api bearer header
  localStorage.setItem(keycloakApi.accessTokenName, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}}`;

  // start update token
  setInterval(() => {
    console.log('Try: Update Token');
    keycloakApi.keycloak
      .updateToken(70)
      .success((refreshed) => {
        if (refreshed) {
          const token = keycloakApi.keycloak.token;
          console.log(
            'Token valid for: ' +
              Math.round(
                keycloakApi.keycloak.tokenParsed.exp +
                  keycloakApi.keycloak.timeSkew -
                  new Date().getTime() / 1000
              ) +
              ' seconds'
          );
          console.log('Token refreshed', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}}`;
        } else {
          console.log(
            'Not refreshed. Token still valid for: ' +
              Math.round(
                keycloakApi.keycloak.tokenParsed.exp +
                  keycloakApi.keycloak.timeSkew -
                  new Date().getTime() / 1000
              ) +
              ' seconds'
          );
        }
      })
      .error((e) => {
        console.error('Something went wrong. Token not refreshed :(', e);
      });
  }, 30000);
});
