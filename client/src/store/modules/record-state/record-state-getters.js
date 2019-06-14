
export const recordState = state => state.recordState

export const requestStatus = state => state.requestStatus

export const requestError = state => state.requestError

export const hasNextEvent = state => eventName => {
  if (!state.recordState || !state.recordState.nextEvents) {
    return false
  }
  return state.recordState.nextEvents.includes(eventName)
}
