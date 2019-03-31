// Uses the dirty flag to determine if component is in a dirty state.

const DirtyRouteGuard = {
  async beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave drg');
    console.log(`dirty = ${this.dirty}`);

    if (!this.dirty) {
      // for not dirty, so no prompt needed before navigation.
      next(true);
      return;
    }

    // show dialog, wait for user to select what action
    const confirmResult = await this.$refs.confirmNavigation.pop();
    if (confirmResult == 'save') {
      // touch form to trigger validations
      this.$v.$touch()
      if (this.$v.$error) {
        // if there's a validation error, we can't save so stop navigation
        this.notifyError('Field(s) not valid, unable to save');
        next(false);
      } else {
        // save the form
        this.submit();
        next(true);
      }
    } else if (confirmResult == 'no save') {
      next(true);
    } else if (confirmResult == 'cancel') {
      next(false);
    }

  },
}

export { DirtyRouteGuard }
