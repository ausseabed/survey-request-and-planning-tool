import { mapGetters } from 'vuex'

export const permission = {
  computed: {
    ...mapGetters('role',[
      'userRole',
    ]),
  },
  methods: {
    hasPermission(permission) {
      // support passing in a single permission, or an array of permissions.
      // if a single permission is passed in, the convert it to an array.
      const permissions = Array.isArray(permission) ? permission : [permission]
      if (_.isNil(this.userRole)) {
        // no role, so default to not having this permission
        return false
      } else {
        let res = false;
        // loop through all given permissions. This method returns true if the
        // role has one of the permissions.
        for (let perm of permissions) {
          if (!_.has(this.userRole, perm)) {
            throw new Error(`Permission ${perm} does not exist on role`)
          }
          if (this.userRole[perm]) {
            res = true;
          }
        }
        return res
      }
    },
  }
}
