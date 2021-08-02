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
          <el-form-item label="ФИО" prop="last_name">
            <el-input v-model="form.last_name" placeholder="Фамилия" />
          </el-form-item>

          <el-form-item prop="first_name" label-width="0" class="name-middle">
            <el-input v-model="form.first_name" placeholder="Имя" />
          </el-form-item>

          <el-form-item prop="middle_name" label-width="0">
            <el-input v-model="form.middle_name" placeholder="Отчество" />
          </el-form-item>
        </el-row>

        <el-form-item label="Пол">
          <el-radio v-model="form.gender" :label="1">Мужской</el-radio>
          <el-radio v-model="form.gender" :label="0">Женский</el-radio>
        </el-form-item>

        <el-form-item label="Дата рождения" prop="birthday" class="birthday">
          <date-input :raw-date="form.birthday" @input="onBirthdayInput" />
        </el-form-item>

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
import DateInput from '@/components/DateInput'

export default {
  components: {
    DateInput
  },
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
        birthday: '',
        id_doc_type: '',
        id_doc_series: '',
        id_doc_num: '',
        insurance_number: '',
        insurance_company_id: '',
        self_phone: '',
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
        birthday: [
          { required: true, trigger: 'blur', validator: this.birthdayValidator }
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
  },
  methods: {
    onClose() {
      this.$refs.form.validate((valid) => {
        const form = this.form

        if (valid) {
          const dateIsValid = this.$moment(form.birthday, 'YYYY-MM-DD', true).isValid()
          if (!dateIsValid) {
            form.birthday = ''
            return this.onClose()
          }
        }

        this.$emit('complete', form, valid)
        this.visible = false
      })
    },
    onBirthdayInput(value) {
      this.form.birthday = value
      this.$refs.form.validateField('birthday')
    },
    birthdayValidator(rule, birthday, callback) {
      if (!birthday) {
        return callback(new Error('Введите дату'))
      } else if (birthday.search('_') !== -1) {
        return callback()
      } else if (!this.$moment(birthday, 'YYYY-MM-DD').isValid()) {
        return callback(new Error('Введите корректную дату'))
      }
      callback()
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

.confirm {
  display: flex;
  margin: 0 auto 20px;
}

.patient-info {
    margin-right: 10px;
}

.birthday {
  margin-bottom: 20px;
}
</style>
