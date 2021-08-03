<template>
  <el-dialog
    title="Формирование реестра за день"
    :visible.sync="visible"
    center
    :before-close="onBeforeClose"
    width="400px"
  >
    <el-form :model="form" label-width="100px">

      <el-form-item label="Дата">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="Выберите дату"
          format="dd.MM.yyyy"
          value-format="yyyy-MM-dd"
          :picker-options="{ firstDayOfWeek: 1 }"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onBeforeClose">Закрыть</el-button>
      <el-button type="primary" @click="dailyExport">Сформировать</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { daily_export } from '@/api/researches'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        date: this.$moment().format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    dailyExport() {
      daily_export(this.form).then((response) => {
        const a = document.createElement('a')
        const blobUrl = window.URL.createObjectURL(response.data)
        a.href = blobUrl
        a.download = 'Реестр.xlsx'
        a.click()
      }).finally(this.onBeforeClose)
    },
    onBeforeClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
</style>
