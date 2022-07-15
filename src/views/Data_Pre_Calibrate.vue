<template>
<div>
  <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> 数据标注
          </el-breadcrumb-item>
          <el-breadcrumb-item>智能标注</el-breadcrumb-item>
          <el-breadcrumb-item>预标注</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

  <!--选择搜索-->
  <div class="container">
    <div>
        <span class="pageTitle">预标注</span>
        <span class="hideFunction">
            <i class="el-icon-lx-attentionforbid el-icon--left" v-if="showTips"></i>
            <i class="el-icon-lx-attention el-icon--left" v-else></i>
            <el-button type="text"  @click="toggle_showTips" style="color: rgb(117,120,137); font-weight: 5">
                <span v-if="showTips">隐藏</span>
                <span v-else>显示</span>功能说明
            </el-button>
        </span>
    </div>
    <transition-group name="fade">
        <div v-if="showTips" style="margin-top:20px">
            <el-alert title="您可以通过发起「预标注任务」来利用已经训练好的模型标注新的数据来减少标注工作量。" type="info" show-icon @close="toggle_showTips">
            </el-alert>
        </div>
    </transition-group>
    <div style="margin: 20px 0;"></div>
    <!--  选择 搜索 创建-->
    <el-select v-model="select_value" clearable >
      <el-option
          v-for="item in select_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-input v-model="search_value" clearable placeholder="搜索数据集名称" style="width:30%" @clear="searchFunc('clear')">
      <template #append>
        <el-button icon="el-icon-search" @click="searchFunc()" />
      </template>
    </el-input>
    <router-link  :to='{path:"pre-calibrate-create"}' style="float: right">
      <el-button  type="primary" class="button-with-createTeam" >
        <i class="el-icon-circle-plus-outline el-icon--left" ></i>
        创建任务
      </el-button>
    </router-link>
    <el-empty description="暂无预标注任务" style="margin: 10%;"></el-empty>
  </div>

  


</div>
</template>

<script setup>
// 隐藏功能显示
import {ref} from "vue";

let showTips = ref(true)
function toggle_showTips(){
  showTips.value = !showTips.value
}
//搜索
const select_options = [
  {
    label: '初始化中',
    value: '初始化中',
  },
  {
    label: '任务失败',
    value: '任务失败',
  },
  {
    label: '任务进行中',
    value: '任务进行中',
  },
  {
    label: '已终止',
    value: '已终止',
  },
  {
    label: '数据处理中',
    value: '数据处理中',
  },
  {
    label: '已完成',
    value: '已完成',
  },
]
let select_value = ref("不限任务状态")
let search_value = ref("")
function searchFunc(name) {

}

</script>

<style scoped>
.function-title-wrap{
  font-size: 20px;
  color: rgb(101,102,108);
  letter-spacing: 0;
  line-height: 30px;
  font-weight: 600;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 5px;
  vertical-align: center;
}
.function-title-wrap div{
  float: right;
  vertical-align: center;
}
.tips {
  height: 32px;
  min-width: 96px;
  border-radius: 4px;
  font-size: 14px;
  padding: 0 4px;
  color: rgba(40,46,66,.8);
}
.pageTitle{
    font-size: 24.5px;
    font-weight: bold
}
.hideFunction{
    float:right;
    margin-right:15px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
