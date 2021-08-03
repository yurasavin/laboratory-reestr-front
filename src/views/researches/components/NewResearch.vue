<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="visible = true">Создать</el-button>

    <el-drawer
      custom-class="create-form"
      :destroy-on-close="true"
      :visible.sync="visible"
      direction="ltr"
      size="65%"
      :before-close="onDrawerClose"
    >
      <template slot="title">
        <div class="header">
          {{ form.id ? 'Редактирование исследования' : 'Новое исследование' }}
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="300px" status-icon :rules="rules">
        <el-form-item label="Пациент" prop="patient" required>
          <patient-choose ref="patient" :initial-data="form.patient" @complete="onPatientUpdate" />
        </el-form-item>

        <el-form-item label="Направившая мед. организация" prop="requester.id">
          <new-research-requester-input
            :requester="form.requester.id"
            :requester-display="form.requester.name"
            @input="onRequesterInput"
          />
        </el-form-item>

        <el-form-item label="Цель исследования" prop="reason">
          <new-research-reason-input
            :reason="form.reason"
            :reason-display="form.reason_display"
            @input="onReasonInput"
          />
        </el-form-item>

        <el-divider />

        <el-form-item label="Дата взятия образца" prop="analys_taken_date">
          <el-date-picker
            v-model="form.analys_taken_date"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
        </el-form-item>

        <el-form-item label="Дата транспортировки образца">
          <el-date-picker
            v-model="form.analys_transport_date"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
        </el-form-item>

        <el-form-item label="Дата поступления" prop="collect_date">
          <el-date-picker
            v-model="form.collect_date"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
        </el-form-item>

        <el-divider />

        <el-form-item label="Лицо взявшее образец">
          <el-input v-model="form.analys_taken_by" placeholder="Укажите ФИО" />
        </el-form-item>

        <el-form-item label="Лицо транспортировавшее образец">
          <el-input
            v-model="form.analys_transport_by"
            placeholder="Укажите ФИО"
          />
        </el-form-item>

        <el-form-item label="Температура транспортировки образца">
          <el-input-number
            v-model="form.analys_transport_temp"
            :min="-100"
            :max="50"
          />
        </el-form-item>

        <el-divider />

        <el-form-item label="Результат">
          <el-select v-model="form.result" placeholder="Select">
            <el-option label="Не готов" :value="0" />
            <el-option label="Положительный" :value="1" />
            <el-option label="Отрицательный" :value="-1" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.result !== 0" label="Дата выдачи ответа" prop="result_date">
          <el-date-picker
            v-model="form.result_date"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
        </el-form-item>

        <el-form-item label="Номер за день" prop="daily_num">
          <el-input-number
            v-model="form.daily_num"
            :controls="false"
            placeholder="Укажите номер"
          />
        </el-form-item>

        <el-form-item label="Примечание">
          <el-input v-model="form.note" type="textarea" :autosize="{ minRows: 4 }" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">{{ form.id ? 'Применить' : 'Создать' }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import PatientChoose from '@/views/researches/components/PatientChoose.vue'
import { create, patch } from '@/api/researches'
import NewResearchReasonInput from './NewResearchReasonInput.vue'
import NewResearchRequesterInput from './NewResearchRequesterInput.vue'

export default {
  components: { PatientChoose, NewResearchReasonInput, NewResearchRequesterInput },
  data() {
    return {
      visible: false,
      submitDisabled: false,
      form: {
        id: null,
        patient: {},
        requester: {
          id: null,
          name: ''
        },
        reason: null,
        reason_display: '',
        analys_taken_by: '',
        analys_transport_by: '',
        analys_transport_temp: undefined,
        result: -1,
        daily_num: undefined,
        note: '',
        analys_taken_date: null,
        collect_date: this.$moment().format('YYYY-MM-DD'),
        analys_transport_date: null,
        result_date: this.$moment().format('YYYY-MM-DD')
      },
      rules: {
        reason: [
          { required: true, message: 'Выберите причину исследования', trigger: 'blur' }
        ],
        requester: {
          id: [
            { required: true, message: 'Обязательное поле', trigger: 'blur' }
          ]
        },
        patient: [
          { required: true, trigger: 'blur', validator: this.patientValidator }
        ],
        collect_date: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        analys_taken_date: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        result_date: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        daily_num: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onPatientUpdate(data, valid) {
      this.form.patient = data
      this.form.patient.valid = valid
      this.$refs.form.validateField('patient')
    },
    patientValidator(rule, patient, callback) {
      if (patient.valid) {
        callback()
      } else {
        callback(new Error('Заполните пациента'))
      }
    },
    onSubmit() {
      this.submitDisabled = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = this.form
          const response = data.id ? patch(data) : create(data)
          response.then(response => {
            this.$message(data.id ? 'Исследование изменено' : 'Исследование добавлено')
            this.visible = false
            if (data.id) {
              this.$emit('updated', response.data)
            } else {
              this.$emit('saved')
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => { this.submitDisabled = false })
        } else {
          this.submitDisabled = false
        }
      })
    },
    convertToDateTimeString(date, time) {
      if (!date) {
        return null
      }
      return `${date}T${time || '00:00:00'}+03:00`
    },
    onDrawerClose(done) {
      this.form = {
        id: null,
        patient: {},
        requester: {
          id: null,
          name: ''
        },
        reason: null,
        reason_display: '',
        analys_taken_by: '',
        analys_transport_by: '',
        analys_transport_temp: undefined,
        result: -1,
        daily_num: undefined,
        note: '',
        analys_taken_date: null,
        collect_date: this.$moment().format('YYYY-MM-DD'),
        analys_transport_date: null,
        result_date: this.$moment().format('YYYY-MM-DD')
      }
      done(true)
    },
    showEdit(research) {
      this.visible = true
      this.form = research
      this.form.patient.valid = true
    },
    onReasonInput({ value, id }) {
      this.form.reason_display = value
      this.form.reason = id
      this.$refs.form.validateField('reason')
    },
    onRequesterInput({ value, id }) {
      this.form.requester.name = value
      this.form.requester.id = id
      this.$refs.form.validateField('requester.id')
    }
  }
}
</script>

<style>
.create-form section {
  overflow-y:scroll;
}
</style>
<style scoped>
.line {
  margin: 0 5px;
}

.el-select {
  width: 250px;
}

.el-date-editor {
  width: 200px !important;
}

.el-input,
.el-textarea {
  width: 50%;
}

.header {
  display: flex;
  justify-content: center;
  font: 24px bold;
}
</style>
