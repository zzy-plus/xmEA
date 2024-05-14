<script setup>
import {onMounted, ref} from "vue";
import request from "@/utils/request";


const tableData = ref([])

const getTableData = async()=>{
  const resp = await request.get('/api/profile')
  tableData.value = resp.data.data
  console.log(resp.data)
}

onMounted(async ()=>{
  //获取所有存档
  getTableData()

})


const profileEditVisible = ref(false)
const profile = ref({})



const handleEditProfile = (index, row)=>{
  console.log(row)
  profile.value = row
  profileEditVisible.value = true
}

const editProfileConfirm = async ()=>{
  const resp = await request.put('/api/profile',{
    id: profile.value.id,
    eventTime: profile.value.eventTime,
    eventName: profile.value.eventName,
    note: profile.value.note
  })
  console.log(resp.data)
  profileEditVisible.value = false
}

const handleDeleteProfile = (index, row)=>{

}


const handleEditMidway = (row)=>{
  console.log(row)
}

const handleDeleteMidway = (row)=>{
  console.log(row)
}

const handleAddMidway = (profileId)=>{
  console.log(profileId)
}



</script>

<template>
  <el-table :data="tableData" style="width: 100%" :style="{'--el-table-tr-bg-color': 'rgba(61,173,96,0.63)'}">

    <!-- 内层内容 -->
    <el-table-column type="expand">
      <template #default="props">
        <p>存档名称：{{props.row.cname}}</p>
        <p>存档说明：{{props.row.note}}</p>
        <el-table :data="props.row.midways" >
          <el-table-column label="Name" prop="placeName" width="250"/>
          <el-table-column label="Truck&Trailer" prop="truckPlace" >
            <template #default="scope">
              {{scope.row.truckPlace}}<br/>{{scope.row.trailerPlace}}
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>
              <el-button type="primary" @click="handleAddMidway(props.row.id)" size="small">添加中途点</el-button>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEditMidway(scope.row)">
                编辑
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDeleteMidway(scope.row)"
                  plain
              > 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>

    <!-- 外层内容 -->
    <el-table-column label="活动时间" prop="eventTime" width="120" />
    <el-table-column label="活动名称" prop="eventName" width="180" />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEditProfile(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button
            size="small"
            type="danger"
            @click="handleDeleteProfile(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>




  </el-table>


  <el-dialog title="" width="400" v-model="profileEditVisible">
    <div style="margin: 10px">活动时间：<el-input v-model="profile.eventTime" style="width: 250px"/></div>
    <div style="margin: 10px">活动名称：<el-input v-model="profile.eventName" style="width: 250px"/></div>
    <div style="margin: 10px">存档说明：<el-input v-model="profile.note" style="width: 250px"/></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="profileEditVisible=false">取消</el-button>
        <el-button type="primary" @click="editProfileConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
