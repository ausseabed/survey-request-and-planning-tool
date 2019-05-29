import { mapGetters } from 'vuex'

export const permission = {
  computed: {
    ...mapGetters('role',[
      'userRole',
    ]),
  },
  methods: {
    hasPermission(permission) {
      if (_.isNil(this.userRole)) {
        return false
      } else {
        if (!_.has(this.userRole, permission)) {
          throw new Error(`Permission ${permission} does not exist on role`)
        }
        return this.userRole[permission]
      }
    },
  }
}
