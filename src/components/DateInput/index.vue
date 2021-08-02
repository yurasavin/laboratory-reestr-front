<template>
  <div class="el-input el-input--suffix">
    <masked-input
      v-model="date"
      type="text"
      placeholder="дд.мм.гггг"
      class="el-input__inner"
      :mask="[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]"
      guide
      placeholder-char="_"
      :keep-char-positions="true"
    />
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-input__icon el-icon-date" />
      </span>
      <i class="el-input__icon el-input__validateIcon el-icon-circle-close" />
    </span>
  </div>
</template>

<script>
import MaskedInput from 'vue-text-mask'

export default {
  components: {
    MaskedInput
  },
  props: {
    rawDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    date: {
      get: function() {
        return this.rawDate.split('-').reverse().join('.')
      },
      set: function(newValue) {
        newValue = newValue.split('.').reverse().join('-')
        if (newValue !== this.rawDate) {
          this.$emit('input', newValue)
        }
      }
    }
  }
}
</script>
