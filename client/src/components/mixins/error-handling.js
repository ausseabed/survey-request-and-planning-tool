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
      this.$q.notify({
        message: message,
        type: 'negative',
        color: 'negative',
        closeBtn: true,
        timeout: 900,
      });
    },
    notifySuccess(message) {
      this.$q.notify({
        message: message,
        type: 'positive',
        color: 'positive',
        closeBtn: true,
        timeout: 700,
      });

    }
  }
}
