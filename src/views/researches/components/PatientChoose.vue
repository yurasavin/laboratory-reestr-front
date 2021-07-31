<template>
  <div>
    <el-tag v-show="patientInfo" type="info" class="patient-info">{{ patientInfo }}</el-tag>
    <el-button type="primary" plain @click="visible=true">{{ formStatus }}</el-button>

    <el-drawer :visible.sync="visible" :before-close="onClose" :append-to-body="true" direction="ltr" size="60%" custom-class="patient-form">
      <template slot="title">
        <div class="header">
          Пациент
        </div>
      </template>

      <el-form ref="form" :model="form" label-width="220px" :rules="rules">
        <el-row type="flex">
          <el-form-item label="ФИО" prop="last_name" required>
            <el-input v-model="form.last_name" placeholder="Фамилия" />
          </el-form-item>

          <el-form-item prop="first_name" label-width="0" class="name-middle" required>
            <el-input v-model="form.first_name" placeholder="Имя" />
          </el-form-item>

          <el-form-item prop="middle_name" label-width="0" required>
            <el-input v-model="form.middle_name" placeholder="Отчество" />
          </el-form-item>
        </el-row>

        <el-form-item label="Пол">
          <el-radio v-model="form.gender" :label="1">Мужской</el-radio>
          <el-radio v-model="form.gender" :label="0">Женский</el-radio>
        </el-form-item>

        <el-row type="flex">
          <el-form-item label="Дата рождения" prop="birthdayDay" required>
            <el-select v-model="form.birthdayDay" placeholder="День">
              <el-option v-for="day in generateDays()" :key="day" :label="day" :value="day" />
            </el-select>
          </el-form-item>

          <el-form-item prop="birthdayMonth" label-width="0" class="birthday" required>
            <el-select
              v-model="form.birthdayMonth"
              placeholder="Месяц"
              class="birthday-middle"
            >
              <el-option label="Январь" value="1" />
              <el-option label="Февраль" value="2" />
              <el-option label="Март" value="3" />
              <el-option label="Апрель" value="4" />
              <el-option label="Май" value="5" />
              <el-option label="Июнь" value="6" />
              <el-option label="Июль" value="7" />
              <el-option label="Август" value="8" />
              <el-option label="Сентябрь" value="9" />
              <el-option label="Октябрь" value="10" />
              <el-option label="Ноябрь" value="11" />
              <el-option label="Декабрь" value="12" />
            </el-select>
          </el-form-item>

          <el-form-item prop="birthdayYear" label-width="0" class="birthday" required>
            <el-select v-model="form.birthdayYear" placeholder="Год">
              <el-option v-for="year in generateYears()" :key="year" :label="year" :value="year" />
            </el-select>
          </el-form-item>
        </el-row>

        <el-form-item label="Документ">
          <el-input v-model="form.id_doc_type" placeholder="Наименование" class="document" />
          <el-input v-model="form.id_doc_series" placeholder="Серия" class="document document-middle" />
          <el-input v-model="form.id_doc_num" placeholder="Номер" class="document" />
        </el-form-item>

        <el-form-item label="Страховой полис">
          <el-input v-model="form.insurance_number" placeholder="Номер" class="half-width" />
        </el-form-item>

        <el-form-item label="Страховая компания">
          <el-input v-model="form.insurance_company_id" placeholder="Реестровый номер" class="half-width" />
        </el-form-item>

        <el-form-item label="Контактный номер телефона">
          <el-input v-model="form.self_phone" placeholder="Телефон" class="half-width" />
        </el-form-item>

        <el-form-item label="Рабочий номер телефона">
          <el-input v-model="form.work_phone" placeholder="Телефон" class="half-width" />
        </el-form-item>

        <el-form-item label="Адрес регистрации">
          <el-input v-model="form.reg_address" placeholder="Адрес" />
        </el-form-item>

        <el-form-item label="Фактический адрес">
          <el-input v-model="form.fact_address" placeholder="Адрес" />
        </el-form-item>

        <el-form-item label="Адрес работы/учебы">
          <el-input v-model="form.work_address" placeholder="Адрес" />
        </el-form-item>

        <el-form-item label="Место работы/учебы">
          <el-input v-model="form.work_place" placeholder="Наименование" class="half-width" />
        </el-form-item>

        <el-form-item label="Должность">
          <el-input v-model="form.work_post" placeholder="Наименование" class="half-width" />
        </el-form-item>
      </el-form>

      <el-button type="primary" class="confirm" @click="onClose">Подтвердить</el-button>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    initialData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: 1,
        birthday: null,
        birthdayDay: '',
        birthdayMonth: '',
        birthdayYear: '',
        id_doc_type: '',
        id_doc_series: '',
        id_doc_num: '',
        insurance_number: '',
        insurance_company_id: '',
        self_phone: '',
        work_phone: '',
        reg_address: '',
        fact_address: '',
        work_address: '',
        work_place: '',
        work_post: ''
      },
      rules: {
        first_name: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        middle_name: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        birthdayDay: [
          { required: true, message: 'Выберите день', trigger: 'blur' }
        ],
        birthdayMonth: [
          { required: true, message: 'Выберите месяц', trigger: 'blur' }
        ],
        birthdayYear: [
          { required: true, message: 'Выберите год', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    patientInfo() {
      if (this.form.last_name || this.form.first_name || this.form.middle_name) {
        return `${this.form.last_name} ${this.form.first_name} ${this.form.middle_name}`
      }
      return ''
    },
    formStatus() {
      if (this.patientInfo) {
        return 'Изменить'
      }
      return 'Заполнить'
    }
  },
  beforeMount() {
    for (const key in this.initialData) {
      this.form[key] = this.initialData[key]
    }

    if (this.initialData.birthday) {
      this.form.birthdayDay = this.initialData.birthday.split('-')[2]
      this.form.birthdayMonth = this.initialData.birthday.split('-')[1]
      this.form.birthdayYear = this.initialData.birthday.split('-')[0]
    }
  },
  methods: {
    onClose() {
      this.$refs.form.validate((valid) => {
        const form = this.form
        if (valid) {
          form.birthday = `${form.birthdayYear}-${form.birthdayMonth}-${form.birthdayDay}`
        }
        this.$emit('complete', form, valid)
        this.visible = false
      })
    },
    generateDays() {
      const range = []
      for (let day = 1; day < 32; day++) {
        range.push(day)
      }
      return range
    },
    generateYears() {
      const range = []
      for (let year = 1940; year < 2101; year++) {
        range.push(year)
      }
      return range
    }
  }
}
</script>

<style>
.patient-form section {
    padding-right: 10px;
    overflow-y: scroll;
}
</style>

<style scoped>
.document {
  width: 33%;
}

.name-middle,
.document-middle {
  padding: 0 8px;
}

.half-width {
  width: 50%;
}

.el-form-item {
  margin-top: 10px;
  margin-bottom: 10px;
}

.header {
  display: flex;
  justify-content: center;
  font: 24px bold;
}

.birthday-middle {
  padding: 0 8px;
}

.confirm {
  display: flex;
  margin: 0 auto 20px;
}

.patient-info {
    margin-right: 10px;
}
</style>
