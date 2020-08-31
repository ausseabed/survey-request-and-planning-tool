import VueAuthenticate from 'vue-authenticate';
import axios from 'axios';

export default async ({ app, router, store, Vue }) => {

  // fetch details of the authentication server from the SCT backend
  // we do this to avoid having environment variables built into the client
  // these env vars were applied at build time making them hard to work with
  // in some deployment environments
  const authConfigResponse = await axios.get('/api/util/auth-details');
  const authConfig = authConfigResponse.data;

  Vue.use(VueAuthenticate, {
    providers: {
      crcsi: {
        clientId: authConfig.authClientId,
        redirectUri: window.location.origin + '/auth/callback',
        name: 'crcsi',
        url: '/api/auth/crcsi',
        authorizationEndpoint: authConfig.authHost + '/oauth2/authorize',
        requiredUrlParams: ['scope', 'state'],
        scope: ['profile', 'email'],
        scopePrefix: 'openid',
        scopeDelimiter: ' ',
        oauthType: '2.0',
        popupOptions: { width: 352, height: 479 },
        state: 'STATE',
      }
    }
  })
}
