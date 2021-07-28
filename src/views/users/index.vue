<template>
  <div class="app-container">
    <new-user ref="newUser" @saved="onSaved" @updated="onUpdated" />
    <el-row type="flex" class="row-bg">
      <el-button
        type="success"
        icon="el-icon-plus"
        @click="$refs.newUser.visible = true"
      >
        Добавить пользователя
      </el-button>
    </el-row>

    <el-table
      ref="table"
      v-loading="initLoading"
      :data="usersList"
      height="90vh"
      empty-text="Данные отсутствуют"
      element-loading-text="Загрузка"
      border
      fit
    >
      <template v-slot:default>
        <el-table-column align="center" label="Действия">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="Редактировать" placement="top-start">
              <el-button icon="el-icon-edit" type="primary" circle @click="setUpdateData(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="Изменить пароль" placement="top-start">
              <el-button type="warning" circle @click="changePassword(scope.row)">
                <svg-icon icon-class="password-change" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Логин">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Фамилия">
          <template slot-scope="scope">
            {{ scope.row.first_name }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Имя">
          <template slot-scope="scope">
            {{ scope.row.last_name }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Права" width="410">
          <template slot-scope="scope">
            {{ scope.row.role_display }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Активный">
          <template slot-scope="scope">
            {{ scope.row.is_active ? 'Да' : 'Нет' }}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { getList, setPassword } from '@/api/user'
import NewUser from '@/views/users/components/NewUser.vue'

export default {
  name: 'Users',
  components: { NewUser },
  data() {
    return {
      initLoading: false,
      usersList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.initLoading = true

      getList().then(response => {
        this.usersList = response.data
        this.initLoading = false
      })
    },
    onSaved(userData) {
      this.usersList.unshift(userData)
    },
    setUpdateData(userData) {
      this.$refs.newUser.form = userData
      this.$refs.newUser.visible = true
    },
    onUpdated(userData) {
      for (let index = 0; index < this.usersList.length; index++) {
        if (this.usersList[index].id === userData.id) {
          this.usersList[index] = userData
          break
        }
      }
      this.$refs.table.doLayout()
    },
    changePassword(userData) {
      this.$prompt('Введите новый пароль', 'Смена пароля', {
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отменить',
        inputValidator: val => !!val,
        inputErrorMessage: 'Пароль не может быть пустым!'
      }).then(({ value }) => {
        const data = {
          id: userData.id,
          password: value
        }
        setPassword(data).then(() => {
          this.$message({
            type: 'success',
            message: 'Пароль успешно изменен!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: 'При изменении пароля возникла ошибка!'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.row-bg {
  margin: 0 10px 15px 0;
}
</style>
