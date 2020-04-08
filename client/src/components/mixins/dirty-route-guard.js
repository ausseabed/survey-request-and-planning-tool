// Uses the dirty flag to determine if component is in a dirty state.
const _ = require('lodash');

const DirtyRouteGuard = {
  beforeRouteUpdate (to, from, next) {
    this.doGuard(to, from, next);
  },

  beforeRouteLeave (to, from, next) {
    this.doGuard(to, from, next);
  },

  methods: {
    async doGuard (to, from, next) {
      if (!this.dirty) {
        // for not dirty, so no prompt needed before navigation.
        next();
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
          next();
        }
      } else if (confirmResult == 'no save') {
        if (_.isFunction(this.restore)) {
          // check if restore function exists. If it does we need to call this
          // funciton to restore state based on data fetched from the server
          // (for example)
          this.restore();
        }
        next();
      } else if (confirmResult == 'cancel') {
        next(false);
      }
    }
  },

}

export { DirtyRouteGuard }
