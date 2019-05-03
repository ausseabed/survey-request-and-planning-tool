export const errorHandler = {
  methods: {
    handleApiError(e) {
      this.notify('negative', e.response ? (e.response.status + ": " + (e.response.data ? e.response.data : e.response.statusText)) : 'Something went wrong!')
    },
    notify(type, message) {
      return this.$q.notify({
        type: type,
        message: message,
        position: 'bottom-left'
      })
    },
    notifyError(message) {
      return this.$q.notify({
        message: message,
        type: 'negative',
        color: 'negative',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 900,
      });
    },
    notifySuccess(message) {
      return this.$q.notify({
        message: message,
        type: 'positive',
        color: 'positive',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 700,
      });
    },
    notifyInfo(message) {
      return this.$q.notify({
        message: message,
        type: 'info',
        color: 'secondary',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 700,
      });
    }
  }
}
