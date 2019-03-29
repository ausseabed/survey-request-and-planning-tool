// Uses the dirty flag to determine if component is in a dirty state.

const DirtyRouteGuard = {
  async beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave drg');
    console.log(`dirty = ${this.dirty}`);

    if (!this.dirty) {
      next();
      return;
    }

    const confirmResult = await this.$refs.confirmNavigation.pop();
    if (confirmResult == 'save') {
      next(false);
    } else if (confirmResult == 'no save') {
      next(true);
    } else if (confirmResult == 'cancel') {
      next(false);
    }

  },
}

export { DirtyRouteGuard }
