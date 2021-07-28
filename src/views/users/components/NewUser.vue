<template>
  <el-drawer
    custom-class="create-form"
    :destroy-on-close="true"
    :visible.sync="visible"
    direction="ltr"
    size="50%"
    :before-close="onDrawerClose"
  >
    <template slot="title">
      <div class="header">
        {{ form.id ? 'Редактирование пользователя' : 'Новый пользователь' }}
      </div>
    </template>
    <el-form ref="form" :model="form" label-width="200px" status-icon :rules="rules">
      <el-form-item label="Имя" prop="first_name">
        <el-input v-model="form.first_name" required placeholder="Укажите имя" />
      </el-form-item>

      <el-form-item label="Фамилия" prop="last_name">
        <el-input v-model="form.last_name" required placeholder="Укажите фамилию" />
      </el-form-item>

      <el-form-item label="Логин" prop="username">
        <el-input v-model="form.username" autocomplete="off" required placeholder="Укажите логин" />
      </el-form-item>

      <el-form-item v-if="!form.id" label="Пароль" prop="password">
        <el-input v-model="form.password" autocomplete="off" required placeholder="Укажите пароль" />
      </el-form-item>

      <el-form-item label="Права" prop="role" required width="450">
        <el-select
          v-model="form.role"
          placeholder="Выберите права"
          width="450"
        >
          <el-option label="Только просмотр записей" :value="1" />
          <el-option label="Просмотр, создание и редактирование записей" :value="2" />
          <el-option label="Просмотр, создание редактирование и удаление записей" :value="3" />
          <el-option label="Администратор" :value="10" />
        </el-select>
      </el-form-item>

      <el-form-item label="Активный">
        <el-switch
          v-model="form.is_active"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">{{ form.id ? 'Применить' : 'Создать' }}</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { create, patch } from '@/api/user'

export default {
  data() {
    return {
      visible: false,
      submitDisabled: false,
      form: {
        id: null,
        username: null,
        first_name: null,
        last_name: null,
        role: 1,
        is_active: true
      },
      rules: {
        first_name: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'Обязательное поле', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.submitDisabled = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = this.form
          const response = data.id ? patch(data) : create(data)
          response.then(response => {
            this.$message(data.id ? 'Пользователь изменен' : 'Пользователь добавлен')
            this.onDrawerClose()
            this.visible = false
            if (data.id) {
              this.$emit('updated', response.data)
            } else {
              this.$emit('saved', response.data)
            }
          }).finally(() => { this.submitDisabled = false })
        } else {
          this.submitDisabled = false
        }
      })
    },
    onDrawerClose(done) {
      this.form = {
        id: null,
        username: null,
        first_name: null,
        last_name: null,
        role: 1,
        is_active: true
      }
      if (done) {
        done(true)
      }
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
  width: 450px;
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
