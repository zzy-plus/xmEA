<script setup>
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {Msg} from "@/utils/ElMessage";

const ipc = myApi.ipc

/*************本地存档***********/

const selectedProfile = ref()
const profileOptions = ref([])
const eventName = ref()
const eventTime = ref()
const note = ref('')

const getLocalProfiles = async ()=>{
  const resp = await ipc.invoke('event_get_profiles')
  profileOptions.value = resp.data

}

const handleUploadProfile = async()=>{
  if(!(selectedProfile.value && eventName.value && eventTime.value)) return
  const result = await ipc.invoke('event_upload_profile', selectedProfile.value)
  if(result.code === 1){
    Msg.error(result.msg)
  }

  const resp = await request.post('/api/profile', {
    name: selectedProfile.value,
    cname: getCnameByName(selectedProfile.value),
    eventName: eventName.value,
    eventTime: eventTime.value,
    note: note.value
  })

  if(resp.data.code === 0){
    Msg.success(resp.data.data)
  }else {
    Msg.error(resp.data.msg)
  }
  getTableData()
}

const getCnameByName = (name)=>{
  for (const profileOption of profileOptions.value) {
    if(profileOption.name === name){
      return profileOption.cname
    }
  }
  return 'xxx'
}




onMounted(async ()=>{

  //获取本地存档
  getLocalProfiles()


  //获取所有存档
  getTableData()

})


/*************服务端***********/

const tableData = ref([])

const getTableData = async()=>{
  const resp = await request.get('/api/profile')
  tableData.value = resp.data.data
}




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
  profileEditVisible.value = false
  if(resp.data.code === 0){
    Msg.success(resp.data.data)
  }else {
    Msg.error(resp.data.msg)
  }
  getTableData()
}

const handleDeleteProfile = async (index, row)=>{
  const resp = await request.delete(`/api/profile/${row.id}`)
  if(resp.data.code === 0){
    Msg.success(resp.data.data)
  }else {
    Msg.error(resp.data.msg)
  }
  getTableData()
}


const handleEditMidway = (row)=>{
  console.log(row)
}

const handleDeleteMidway = async (row)=>{
  const resp = await request.delete(`/api/midway/${row.id}`)
  if(resp.data.code === 0){
    Msg.success(resp.data.data)
  }else {
    Msg.error(resp.data.msg)
  }
  getTableData()
}

const handleAddMidway = (profile)=>{
  console.log(profile)
  const profileId = profile.id
  const profileName = profile.name

}



</script>

<template>

  <div style="border: #ffb92e 2px solid; height: 125px; width: 470px; padding: 5px; margin: 5px;">

    <div style="display: flex; flex-direction: row; align-items: center; padding: 3px">
      <div>本地存档：</div>
      <el-select v-model="selectedProfile" placeholder="选择要上传的存档" style="width: 300px; margin-left: 5px">
        <el-option
            v-for="item in profileOptions"
            :key="item.name"
            :label="item.cname"
            :value="item.name" />
      </el-select>
      <el-button type="primary" @click="handleUploadProfile" style="position: relative; left: 10px; width: 70px">
        上传
      </el-button>
    </div>

    <div style="margin-top: 5px; padding: 3px">
      <el-input v-model="eventName" placeholder="活动名称" style="width: 227px; margin-right: 10px"/>
      <el-input v-model="eventTime" placeholder="活动时间" style="width: 227px;"/>
    </div>

    <div style="margin-top: 5px; padding: 3px">
      <span>备注：</span>
      <el-input v-model="note" placeholder="（选填）" style="width: 415px;"/>
    </div>

  </div>



  <el-table :data="tableData" style="width: 900px; height: 490px;"
            :style="{'--el-table-tr-bg-color': 'rgba(103,197,255,0.16)'}">
    <!-- 内层内容 -->
    <el-table-column type="expand" align="center">
      <template #default="props">
        <div style="padding: 10px">
          <div style="margin-bottom: 10px; font-weight: bold">存档名称：{{props.row.cname}}</div>
          <div>存档说明：{{props.row.note}}</div>
        </div>
        <el-table :data="props.row.midways" >
          <el-table-column width="140" align="center">
            <template #header>
              <el-button type="primary" @click="handleAddMidway(props.row)" size="small" style="width: 107px;">添加中途点</el-button>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEditMidway(scope.row)">
                编辑
              </el-button>
              <el-popconfirm title="Are you sure to delete this?" @confirm="handleDeleteMidway(scope.row)">
                <template #reference>
                  <el-button size="small" type="danger" plain> 删除 </el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
          <el-table-column label="中途点" prop="placeName" width="250" align="center"/>
          <el-table-column label="Truck&Trailer" prop="truckPlace" align="center">
            <template #default="scope">
              {{scope.row.truckPlace}}<br/>{{scope.row.trailerPlace}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>

    <!-- 外层内容 -->
    <el-table-column label="活动时间" prop="eventTime" width="130" align="center"/>
    <el-table-column label="活动名称" prop="eventName" width="500" align="center"/>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button size="small" @click="handleEditProfile(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-popconfirm title="Are you sure to delete this?" @confirm="handleDeleteProfile(scope.$index, scope.row)">
          <template #reference>
            <el-button size="small" type="danger"> 删除 </el-button>
          </template>
        </el-popconfirm>
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

<style scoped>

</style>
