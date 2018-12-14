export const isConnected = state => {
  return state.connected;
}

export const isAuthenticated = state => {
  return state.connected && state.authenticated;
}
