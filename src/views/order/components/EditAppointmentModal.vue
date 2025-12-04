<template>
  <el-dialog v-model="visible" draggable :title="title" :close-on-click-modal="false" width="500px">
    <template #default>
      <el-form :model="form">
        <el-form-item label="预约时间" required>
          <el-date-picker
            v-model="form.appointmentTime"
            type="datetime"
            placeholder="请选择预约时间"
          />
        </el-form-item>
        <el-form-item v-permission="'doctor'" label="状态" required>
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-for="(item, index) in APPOINTMENT_STATUS"
              :key="index"
              :value="item.value"
              >{{ item.key }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end gap-4">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { APPOINTMENT_STATUS } from '@/const'
import { IAppointment, IEditAppointment } from '@/types/common'
import { getUserId, Message } from '@/utils'
import { addAppointment, updateAppointment } from '@/server/api/order'

type addProp = {
  show: boolean
  mode: 'add' | 'edit'
  data: IAppointment | null
}

const props = withDefaults(defineProps<addProp>(), {
  show: false,
  mode: 'add',
  data: null,
})

const { show, mode, data } = toRefs(props)

const form = reactive({
  id: '',
  patientId: getUserId(),
  appointmentTime: '',
  status: 0,
})

const emits = defineEmits(['update:show', 'submit'])

const visible = computed({
  get: () => show.value,
  set: (value) => emits('update:show', value),
})

const title = computed(() => {
  return mode.value === 'add' ? '新增预约' : '编辑预约'
})

const initData = () => {
  if (mode.value === 'edit') {
    form.id = data.value?.id ?? ''
    form.patientId = data.value?.patientId ?? ''
    form.appointmentTime = data.value?.appointmentTime ?? ''
    form.status = data.value?.status ?? 0
  } else {
    form.id = ''
    form.patientId = ''
    form.appointmentTime = ''
    form.status = 0
  }
}

const handleConfirm = async () => {
  const params: IEditAppointment = {
    ...form,
  }
  if (mode.value === 'add') {
    const res: never = await addAppointment(params)
    const { message, status } = res
    if (status === 200) {
      Message.success(message)
    } else {
      Message.warning(message)
    }
  } else {
    const res: never = await updateAppointment(params)
    const { status, message } = res
    if (status === 200) {
      Message.success(message)
    } else {
      Message.warning(message)
    }
  }
  visible.value = false
  emits('submit')
}

watchEffect(() => {
  initData()
})
</script>

<style scoped></style>
