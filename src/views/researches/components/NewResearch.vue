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

        <el-row type="flex">
          <el-form-item label="Направившая мед. организация" prop="requester.name" required>
            <el-input
              v-model="form.requester.name"
              placeholder="Наименование"
              class="requester-name"
            />
          </el-form-item>
          <el-input
            v-model="form.requester.oms_id"
            placeholder="Код в ОМС"
            class="requester-oms-id"
          />
        </el-row>

        <el-form-item label="Цель исследования" prop="reason">
          <new-research-reason-input
            :reason="form.reason"
            :reason-display="form.reason_display"
            @input="onReasonInput"
          />
        </el-form-item>

        <el-form-item label="Дата поступления">
          <el-date-picker
            v-model="collectDate"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
          <span class="line">-</span>
          <el-time-picker
            v-model="collectTime"
            type="fixed-time"
            value-format="HH:mm:ss"
            placeholder="Выберите время"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Дата взятия образца">
          <el-date-picker
            v-model="analysTakenDate"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
          <span class="line">-</span>
          <el-time-picker
            v-model="analysTakenTime"
            type="fixed-time"
            value-format="HH:mm:ss"
            placeholder="Выберите время"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Лицо взявшее образец">
          <el-input v-model="form.analys_taken_by" placeholder="Укажите ФИО" />
        </el-form-item>

        <el-form-item label="Дата транспортировки образца">
          <el-date-picker
            v-model="analysTransportDate"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
          <span class="line">-</span>
          <el-time-picker
            v-model="analysTransportTime"
            type="fixed-time"
            value-format="HH:mm:ss"
            placeholder="Выберите время"
            style="width: 100%"
          />
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

        <el-form-item label="Результат">
          <el-select v-model="form.result" placeholder="Select">
            <el-option label="Не готов" :value="0" />
            <el-option label="Положительный" :value="1" />
            <el-option label="Отрицательный" :value="-1" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.result !== 0" label="Дата выдачи ответа">
          <el-date-picker
            v-model="resultDate"
            type="date"
            placeholder="Выберите дату"
            format="dd.MM.yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            :picker-options="{ firstDayOfWeek: 1 }"
          />
          <span class="line">-</span>
          <el-time-picker
            v-model="resultTime"
            type="fixed-time"
            value-format="HH:mm:ss"
            placeholder="Выберите время"
            style="width: 100%"
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

export default {
  components: { PatientChoose, NewResearchReasonInput },
  data() {
    return {
      visible: false,
      submitDisabled: false,
      collectDate: null,
      collectTime: null,
      analysTransportDate: null,
      analysTransportTime: null,
      analysTakenDate: null,
      analysTakenTime: null,
      resultDate: null,
      resultTime: null,
      form: {
        id: null,
        patient: {},
        requester: {
          name: '',
          oms_id: ''
        },
        reason: null,
        reason_display: '',
        analys_taken_by: '',
        analys_transport_by: '',
        analys_transport_temp: '',
        result: 0,
        note: '',
        collect_date: null,
        analys_taken_date: null,
        analys_transport_date: null,
        result_date: null
      },
      rules: {
        reason: [
          { required: true, message: 'Выберите причину исследования', trigger: 'blur' }
        ],
        requester: {
          name: [
            { required: true, message: 'Обязательное поле', trigger: 'blur' }
          ]
        },
        patient: [
          { required: true, trigger: 'blur', validator: this.patientValidator }
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
          const data = this.processFormData(this.form)
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
    processFormData(formData) {
      formData.collect_date = this.convertToDateTimeString(this.collectDate, this.collectTime)
      formData.analys_taken_date = this.convertToDateTimeString(this.analysTakenDate, this.analysTakenTime)
      formData.analys_transport_date = this.convertToDateTimeString(this.analysTransportDate, this.analysTransportTime)
      formData.result_date = this.convertToDateTimeString(this.resultDate, this.resultTime)

      return formData
    },
    convertToDateTimeString(date, time) {
      if (!date) {
        return null
      }
      return `${date}T${time || '00:00:00'}+03:00`
    },
    onDrawerClose(done) {
      this.collectDate = null
      this.collectTime = null
      this.analysTransportDate = null
      this.analysTransportTime = null
      this.analysTakenDate = null
      this.analysTakenTime = null
      this.resultDate = null
      this.resultTime = null
      this.form = {
        id: null,
        patient: {},
        requester: {
          name: '',
          oms_id: ''
        },
        reason: null,
        reason_display: '',
        analys_taken_by: '',
        analys_transport_by: '',
        analys_transport_temp: '',
        result: 0,
        note: '',
        collect_date: null,
        analys_taken_date: null,
        analys_transport_date: null,
        result_date: null
      }
      done(true)
    },
    showEdit(research) {
      this.visible = true
      this.form = research
      this.form.patient.valid = true
      if (this.form.collect_date) {
        this.collectDate = this.form.collect_date.split('T')[0]
        this.collectTime = this.form.collect_date.split('T')[1].split('+')[0]
      }

      if (this.form.analys_taken_date) {
        this.analysTakenDate = this.form.analys_taken_date.split('T')[0]
        this.analysTakenTime = this.form.analys_taken_date.split('T')[1].split('+')[0]
      }

      if (this.form.analys_transport_date) {
        this.analysTransportDate = this.form.analys_transport_date.split('T')[0]
        this.analysTransportTime = this.form.analys_transport_date.split('T')[1].split('+')[0]
      }
    },
    onReasonInput({ value, id }) {
      this.form.reason_display = value
      this.form.reason = id
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

.requester-name {
  width: 300px;
}

.requester-oms-id {
  width: 20%;
  margin-left: 5px;
}

.header {
  display: flex;
  justify-content: center;
  font: 24px bold;
}
</style>
