<template>
  <el-autocomplete
    :value="reasonDisplay"
    :fetch-suggestions="reasonQuerySearch"
    :debounce="0"
    placeholder="Выберите цель"
    class="reason"
    @input="onInput"
  />
</template>

<script>

export default {
  props: ['reason', 'reasonDisplay'],
  data() {
    return {
      reasons: [
        { value: 'Беременность', id: 1 },
        { value: 'Госпитализация', id: 2 },
        { value: 'Контакт', id: 3 },
        { value: 'Медицинский работник', id: 4 },
        { value: 'Новорожденный', id: 5 },
        { value: 'ОРВИ', id: 13 },
        { value: 'Острый бронхит', id: 6 },
        { value: 'Обследование', id: 7 },
        { value: 'Пневмония', id: 8 },
        { value: 'Прибывшие', id: 9 },
        { value: 'COVID-19', id: 10 },
        { value: 'Хронический фарингит', id: 11 },
        { value: 'Другое', id: 12 }
      ]
    }
  },
  methods: {
    reasonQuerySearch(query, callback) {
      query = query.toLowerCase()
      const results = query ? this.reasons.filter(doc => doc.value.toLowerCase().startsWith(query)) : this.reasons
      callback(results)
    },
    onInput(value) {
      let id = null
      for (const reason of this.reasons) {
        if (reason.value === value) {
          id = reason.id
          break
        }
      }
      this.$emit('input', { value, id })
    }
  }
}
</script>

<style scoped>
.reason {
  width: 300px;
}
</style>
