<template>
  <el-dialog
    title="Выгрузка результата"
    :visible.sync="visible"
    center
    :before-close="onBeforeClose"
    width="700px"
  >
    <el-form :model="form" label-width="150px">
      <el-form-item label="Набор реагентов">
        <el-input v-model="form.reagents" type="textarea" autosize />
      </el-form-item>

      <el-form-item label="Серия">
        <el-input v-model="form.series" />
      </el-form-item>

      <el-form-item label="Срок годности" class="date">
        <date-input :raw-date="form.expiration_date" @input="onExpirationDateInput" />
      </el-form-item>

      <el-form-item label="Врач">
        <el-autocomplete
          v-model="form.doctor"
          :fetch-suggestions="querySearch"
          :debounce="0"
          placeholder="Введите врача"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onBeforeClose">Закрыть</el-button>
      <el-button type="primary" @click="exportResearch">Сформировать</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { export_as_xlsx } from '@/api/researches'
import DateInput from '@/components/DateInput'

export default {
  components: {
    DateInput
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    researchId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      doctors: [
        { value: 'Полихова В.В.' },
        { value: 'Таран Е.А.' }
      ],
      form: {
        reagents: 'набор реагентов для выявления РНК коронавируса SARS-CoV-2 и подобных SARS-CoV методом обратной транскрипции и полимеразной цепной реакции в режиме реального времени (SARS-CoV-2/SARS-CoV)',
        series: '',
        expiration_date: '',
        doctor: ''
      }
    }
  },
  methods: {
    exportResearch() {
      export_as_xlsx(this.researchId, this.form).then((response) => {
        const a = document.createElement('a')
        const blobUrl = window.URL.createObjectURL(response.data)
        a.href = blobUrl
        a.download = 'Результат.xlsx'
        a.click()
      }).finally(this.onBeforeClose)
    },
    onBeforeClose() {
      this.$emit('close')
    },
    onExpirationDateInput(val) {
      this.form.expiration_date = val
    },
    querySearch(query, callback) {
      query = query.toLowerCase()
      const results = query ? this.doctors.filter(doc => doc.value.toLowerCase().startsWith(query)) : this.doctors
      callback(results)
    }
  }
}
</script>

<style scoped>
.date {
  width: 300px;
}
</style>
