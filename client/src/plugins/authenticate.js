import VueAuthenticate from 'vue-authenticate';

const authServer = process.env.AUTH_HOST
console.log(authServer)

export default ({ app, router, store, Vue }) => {
  Vue.use(VueAuthenticate, {

	  providers: {
		crcsi: {
		  clientId: '076924',
		  redirectUri: window.location.origin + '/auth/callback', // Your client app URL

		  name: 'crcsi',
		  url: '/api/auth/crcsi',
		  authorizationEndpoint: authServer + '/o/oauth2/authorize',
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
