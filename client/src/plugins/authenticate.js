import VueAuthenticate from 'vue-authenticate';

export default ({ app, router, store, Vue }) => {
  Vue.use(VueAuthenticate, {
	  baseUrl: process.env.API_ENDPOINT, // Your API domain

	  providers: {
		crcsi: {
		  clientId: '076924',
		  redirectUri: window.location.origin + '/auth/callback', // Your client app URL

		  name: 'crcsi',
		  url: '/auth/crcsi',
		  authorizationEndpoint: 'https://staging.accounts.crcsi.com.au/o/oauth2/authorize',
		  requiredUrlParams: ['scope', 'state'],
		  scope: ['profile', 'email'],
		  scopePrefix: 'openid',
		  scopeDelimiter: ' ',
		  oauthType: '2.0',
		  popupOptions: { width: 352, height: 479 },
		  state: 'STATE',
		  //optionalUrlParams: ['display'],
		  //requiredUrlParams: ['scope'],
		}
	  }
	})
}
