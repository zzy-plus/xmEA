<script setup>
import {onMounted, ref} from "vue";
import request from "@/utils/request";


const tableData = ref([])

onMounted(async ()=>{
  //获取所有存档
  let resp
  resp = await request.get('/api/profile')
  tableData.value = resp.data.data




})

const handleEditProfile = (index, row)=>{
  console.log(row.cname)
}

const handleDeleteProfile = (index, row)=>{

}

const handleAddProfile = ()=>{

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
  <el-table :data="tableData" style="width: 100%" :style="{'--el-table-tr-bg-color': `var(--el-color-success-light-7)`}">

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
              <el-button type="primary" @click="handleAddMidway(props.row.id)">添加中途点</el-button>
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
    <el-table-column label="时间" prop="eventTime" width="120" />
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

</template>
