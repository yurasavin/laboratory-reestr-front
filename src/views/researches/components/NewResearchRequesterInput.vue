<template>
  <el-autocomplete
    :value="requesterDisplay"
    :fetch-suggestions="QuerySearch"
    :debounce="0"
    placeholder="Наименование"
    value-key="name"
    class="requester"
    @input="onInput"
  />
</template>

<script>
import { getList } from '@/api/requesters'

export default {
  props: ['requester', 'requesterDisplay'],
  data() {
    return {
      requesters: []
    }
  },
  mounted() {
    getList().then(response => {
      this.requesters = response.data
    })
  },
  methods: {
    QuerySearch(query, callback) {
      query = query.toLowerCase()
      const results = query ? this.requesters.filter(req => req.name.toLowerCase().includes(query)) : this.requesters
      callback(results)
    },
    onInput(value) {
      let id = null
      for (const requester of this.requesters) {
        if (requester.name === value) {
          id = requester.id
          break
        }
      }
      this.$emit('input', { value, id })
    }
  }
}
</script>

<style scoped>
.requester {
  width: 450px;
}
</style>
