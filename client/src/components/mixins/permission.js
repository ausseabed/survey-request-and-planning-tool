import { mapGetters } from 'vuex'

export const permission = {
  computed: {
    ...mapGetters('role',[
      'userRole',
    ]),
    ...mapGetters('custodian',[
      'userCustodian',
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
    hasCustodianLink(custodianAttribute) {
      // checks if the logged in user's assigned custodian is included in the
      // list or custodians returned by the `custodianAttribute` param
      if (_.isNil(this.userCustodian)) {
        return false
      }
      const custodiansList = _.at(this, custodianAttribute)
      // the above `_.at` returns an array of arrays
      if (custodiansList.length == 0) {
        return false
      }
      const custodians = custodiansList[0]

      const custodian = custodians.find((o) => {
        return o.id === this.userCustodian.id;
      })
      return !_.isNil(custodian)
    }
  }
}
