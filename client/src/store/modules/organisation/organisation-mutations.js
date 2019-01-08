export const clearOrganisationList = (state, payload) => {
  state.organisations.splice(0, state.organisations.length);
}

export const setOrganisations = (state, organisations) => {
  state.organisations = _.cloneDeep(organisations);
}

export const addOrganisation = (state, organisation) => {
  state.organisations.push(organisation);
}
