let keycloak = null;
let keycloakConfig = {
  url: 'https://auth.xenadu-services.de',
  realm: 'xenadu',
  clientId: 'xenadu-services',
};

const keycloakApi = {
  keycloak,
  keycloakConfig,
  accessTokenName: 'access_token',
  refreshTokenName: 'refresh_token',
  removeToken: function () {
    localStorage.removeItem(this.accessTokenName);
  },
};

export default keycloakApi;
