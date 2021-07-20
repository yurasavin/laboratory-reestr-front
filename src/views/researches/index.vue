<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg">
      <new-research v-if="roles.includes('write')" ref="newResearch" class="top-row-btn" @saved="onSearch" />
      <el-badge :value="filtersCount" class="top-row-btn">
        <el-button type="primary" icon="el-icon-s-operation" @click="filtersShowing = !filtersShowing">Фильтры</el-button>
      </el-badge>
    </el-row>

    <div v-show="filtersShowing" class="filters-container">
      <el-input v-model="searchNum" placeholder="Номер исследования" size="small" clearable class="filter-input" @input="onSearch" />
      <el-input v-model="searchPatient" placeholder="ФИО пациента" size="small" clearable class="filter-input" @input="onSearch" />
      <el-input v-model="searchRequester" placeholder="Наименование или код направившей орг." size="small" clearable class="filter-input" @input="onSearch" />
    </div>

    <el-table
      v-loading="initLoading"
      :data="researchesList"
      height="90vh"
      empty-text="Данные отсутствуют"
      element-loading-text="Загрузка"
      border
      fit
      highlight-current-row
    >
      <template v-slot:default>
        <el-table-column align="center" label="Действия" width="160">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-tooltip class="item" effect="light" content="Удалить" placement="top-start">
                <el-button :disabled="!roles.includes('delete')" icon="el-icon-delete" title="sdsd" type="danger" circle @click="deleteResearch(scope.row.id)" />
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="Изменить" placement="top-start">
                <el-button :disabled="!roles.includes('edit')" icon="el-icon-edit" type="primary" circle @click="$refs.newResearch.showEdit(scope.row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="Сформировать результат" placement="top-start">
                <el-button icon="el-icon-tickets" type="warning" circle @click="exportResearch(scope.row.id)" />
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Номер" width="80">
          <template slot-scope="scope">
            {{ scope.row.total_num }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Номер за день" width="80">
          <template slot-scope="scope">
            {{ scope.row.daily_num }}
          </template>
        </el-table-column>

        <el-table-column label="Фамилия" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.patient.last_name }}
          </template>
        </el-table-column>

        <el-table-column label="Имя" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.patient.first_name }}
          </template>
        </el-table-column>

        <el-table-column label="Отчество" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.patient.middle_name }}
          </template>
        </el-table-column>

        <el-table-column label="Результат" align="center" width="140">
          <template slot-scope="scope">
            <el-tag :type="scope.row.result | resultFilter">
              {{ scope.row.result_display }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Направлен из" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.requester.name }}
          </template>
        </el-table-column>

        <el-table-column label="Цель исследования" align="center" width="135">
          <template slot-scope="scope">
            {{ scope.row.reason_display }}
          </template>
        </el-table-column>

        <el-table-column label="Дата поступления" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.collect_date_display }}
          </template>
        </el-table-column>

        <el-table-column label="Дата выдачи ответа" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.result_date_display }}
          </template>
        </el-table-column>

        <el-table-column label="Дата взятия образца" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.analys_taken_date_display }}
          </template>
        </el-table-column>

        <el-table-column label="Лицо взявшее образец" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.analys_taken_by }}
          </template>
        </el-table-column>

        <el-table-column label="Дата транспортировки образца" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.analys_transport_date_display }}
          </template>
        </el-table-column>

        <el-table-column label="Лицо транспортировавшее образец" align="center" width="110">
          <template slot-scope="scope">
            {{ scope.row.analys_transport_by }}
          </template>
        </el-table-column>

        <el-table-column label="Температура транспортировки образца" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.analys_transport_temp }}
          </template>
        </el-table-column>

        <el-table-column label="Примечание" align="center" width="300">
          <template slot-scope="scope">
            {{ scope.row.note }}
          </template>
        </el-table-column>
      </template>

      <template v-slot:append>
        <div id="load-next">
          <el-button
            v-if="nextLink"
            type="primary"
            plain
            :disabled="fetchingNext"
            @click="fetchNextData"
          >
            Загрузить больше
          </el-button>
        </div>
      </template>

      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { export_as_xlsx, getList, getNextList, remove } from '@/api/researches'
import NewResearch from '@/views/researches/components/NewResearch.vue'

export default {
  name: 'Researches',
  components: { NewResearch },
  filters: {
    resultFilter(status) {
      const statusMap = {
        '-1': 'success',
        '0': 'error',
        '1': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      researchesList: null,
      initLoading: true,
      nextLink: null,
      fetchingNext: false,
      createDialog: false,
      filtersShowing: false,
      fetchingRequestCreated: null,
      fetchingTimeout: null,
      searchNum: null,
      searchPatient: null,
      searchRequester: null
    }
  },
  computed: {
    ...mapGetters(['roles']),
    filtersCount() {
      let count = 0
      if (this.searchNum) { count++ }
      if (this.searchPatient) { count++ }
      if (this.searchRequester) { count++ }
      return count || ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      if (this.fetchingRequest) {
        this.fetchingRequest.cancell()
      }

      this.initLoading = true
      const filtersParams = this.getFiltersData()

      const requestTime = new Date()
      this.fetchingRequestCreated = requestTime

      getList(filtersParams).then(response => {
        if (requestTime !== this.fetchingRequestCreated) {
          return
        }

        this.researchesList = response.data.results
        this.initLoading = false
        this.nextLink = response.data.next
      })
    },
    fetchNextData() {
      if (this.fetchingRequest) {
        this.fetchingRequest.cancell()
      }

      this.fetchingNext = true
      const url = this.nextLink.replace(process.env.VUE_APP_BASE_API, '')

      const requestTime = new Date()
      this.fetchingRequestCreated = requestTime

      getNextList(url).then(response => {
        if (requestTime !== this.fetchingRequestCreated) {
          return
        }

        const scrollTop = document.documentElement.scrollTop
        this.researchesList.push(...response.data.results)
        this.nextLink = response.data.next
        this.fetchingNext = false
        setTimeout(() => document.documentElement.scrollTop = scrollTop, 0)
      })
    },
    getFiltersData() {
      const params = {}

      if (this.searchNum) {
        params.search_num = this.searchNum
      }

      if (this.searchPatient) {
        params.search_patient = this.searchPatient
      }

      if (this.searchRequester) {
        params.search_requester = this.searchRequester
      }

      return params
    },
    onSearch() {
      if (this.fetchingTimeout) {
        window.clearTimeout(this.fetchingTimeout)
        this.fetchingTimeout = null
      }
      this.fetchingTimeout = setTimeout(this.fetchData, 150)
    },
    deleteResearch(id) {
      this.$confirm('Вы действительно хотите удалить исследование?', 'Внимание', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        type: 'warning',
        center: true
      }).then(() => {
        remove({ id }).then(() => {
          this.researchesList = this.researchesList.filter(research => research.id !== id)
          this.$message({ type: 'success', message: 'Исследование удалено' })
        }).catch(() => {
          this.$message({ type: 'error', message: 'При удалении произошла ошибка!' })
        })
      })
    },
    exportResearch(id) {
      export_as_xlsx(id).then((response) => {
        const a = document.createElement('a')
        const blobUrl = window.URL.createObjectURL(response.data)
        a.href = blobUrl
        a.download = 'Результат.xlsx'
        a.click()
      })
    }
  }
}
</script>

<style>
.el-table th .cell,
.el-table tr .cell {
  word-break: break-word;
}

#load-next {
  margin: 10px 200px;
}
</style>

<style scoped>
.filters-container {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.filter-input {
  width: 350px;
  padding: 5px 0;
}

.top-row-btn {
  margin: 0 10px 15px 0;
}
</style>
