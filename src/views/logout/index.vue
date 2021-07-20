<template>
  <div>Logout</div>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {}
  },
  created() {
    this.logout()
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>
