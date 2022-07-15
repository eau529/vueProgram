<template>
  <div>
    <div class="function-title-wrap">
      <el-row type="flex" align="middle"  >
        <i class="el-icon-back" ></i>
        <router-link :to="{path:'overall'}">
          <el-button type="text" >
            数据总览
          </el-button>
        </router-link>
        <i class="el-icon-arrow-right" style="font-size: 8px"></i>
        <el-button type="text" >
          全部版本（{{ oneData.datasetsName }}）
        </el-button>
      </el-row>
    </div>

    <div class="container">
      <el-row >
        <el-col  :span="8">
          <el-row>
            <el-select v-model="select_value" clearable placeholder="请选择算法类型">
              <el-option
                  v-for="item in select_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-button @click="oneData.createVersionVisible=true" type="primary"
                       class="button-with-createTeam" style="float: right; margin-left: 10px">
              <i class="el-icon-circle-plus-outline el-icon--left" ></i>
              创建新版本
            </el-button>
          </el-row>
<!--          全部版本部分-->
          <el-row v-if="showVersion.length">
              <el-col v-for="data in showVersion.slice().reverse()">
                <el-button :class="{selectBtn:currSelect==data.id}" style="width: 90%; text-align: left; margin-top: 10px;"
                           class="btn-version" @click="selectVersion(data.id)">
                  <i class="el-icon-receiving"></i>
                  V{{data.editionName}}（{{data.algorithmType}}）
                </el-button>
              </el-col>
          </el-row>
          <el-row v-else type="flex" align="middle">
              <el-col  :span="24" type="flex" align="middle" style="margin: 50% 0">
                <el-image style="width: 100px; height: 100px" src="src/assets/img/no_version.png" :fit="fit" />
                <div style="font-weight:300;">暂无版本</div>
              </el-col>
          </el-row>

        </el-col >
<!--        一个版本对应的信息-->
        <el-col  :span="16"  style="border-left: 0.5px solid grey;padding-left: 20px; padding-top: 15px">
          <div v-if="showVersion.length">
            <el-row type="flex" align="middle">
              <span style="font-size: 18px; color: black; font-weight: bold">版本：V{{oneEditionData.editionName}} </span>
              <span v-if="oneEditionData.isPutEditions" style="margin-left:10px;color: rgb(137,207,105);  border-radius: 0.3em; background-color: rgb(240,248,237); padding: 2px 4px" >
              已发布
            </span>
              <span v-else style="margin-left:10px;color: rgb(216,104,78);  border-radius: 0.3em; background-color: rgb(250,236,230); padding: 2px 4px" >
              未发布
            </span>
            </el-row>
            <el-row style="padding-bottom: 20%; margin-top: 20px" >
              <el-col :span="10" >
                继承路径：
                <el-tooltip
                    class="box-item"
                    effect="light"
                    content="继承路径展示所选版本和其直接继承或被继承版本的关系"
                    placement="bottom-start"
                >
                  <i class="el-icon-lx-question  el-icon--left" ></i>
                </el-tooltip>
                <el-timeline style="margin-top: 20px">
                  <el-timeline-item
                      v-for="(edition, index) in curEditionList"
                      :key="index"
                      :timestamp="edition[2]"
                      :type="index==0 ? 'success': 'danger' "
                      :size="index==0 ? 'large': 'normal'"
                  >
                    V{{ edition[1] }}
                  </el-timeline-item>
                </el-timeline>
              </el-col>
              <el-col :span="14">
                <el-row class="cntrow" type="flex" align="middle" v-if="oneEditionData.isPutEditions">
                  <span class="cnttitile">发布时间：</span>
                  <el-row  type="flex" align="middle" >
                    {{oneEditionData.createTime}}
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle" v-else>
                  <span class="cnttitile">创建时间：</span>
                  <el-row  type="flex" align="middle" >
                    {{oneEditionData.createTime}}
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">标注方式：</span>
                  <el-row  type="flex" align="middle" >
                    矩形标注
                  </el-row>

                </el-row>
                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">版本备注：</span>
                  <el-row  type="flex" align="middle" >
                    {{oneEditionData.comment}}
                  </el-row>
                </el-row>

                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">算法类型：</span>
                  <el-row   type="flex" align="middle" >
                    {{oneEditionData.algorithmType}}
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        content="就绪条件：至少存在一个图片数>40的检测标签"
                        placement="bottom-start"
                    >
                      <i class="el-icon-lx-question  el-icon--left" ></i>
                    </el-tooltip>
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">继承版本：</span>
                  <el-row  type="flex" align="middle" >
                    {{oneEditionData.inheritEditionName == "-" ? "-": "V"+oneEditionData.inheritEditionName}}
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">数据状态：</span>
                  <!--                v-if="oneEditionData.isStandard"-->
                  <el-row  type="flex" align="middle" >
                    <img :src="oneEditionData.isStandard ? 'src/assets/img/isStandard.png' : 'src/assets/img/notStandard.png'" />
                    <span style="background-color: rgb(244,244,248)" >
                    {{oneEditionData.isStandard.isStandard? "已":"未"}}达到训练标准</span>
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle">
                  <span class="cnttitile">标签数量：</span>
                  <el-row  type="flex" align="middle" >
                    {{oneEditionData.labels}}
                  </el-row>
                </el-row>
                <el-row class="cntrow" type="flex" align="middle" style="margin-top: 10px">
                  <el-col class="cnttitile">有目标标注图片数/总图片数：（{{oneEditionData.isLabelNums}}/{{oneEditionData.needLabelNums}}}）</el-col>
                  <el-col class="demo-progress" :span="24" style="margin-top: 10px">
                    <el-progress :percentage="oneEditionData.percent" />
                  </el-col>
                </el-row>

                <el-row style="margin-top: 20px">
                  <el-button>
                    <i class="el-icon-lx-text"></i>
                    查看详情
                  </el-button>
                  <el-button>
                    <i class="el-icon-pie-chart"></i>
                    数据诊断
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
          </div>

          <el-row v-else type="flex" align="middle" >
            <el-col  :span="24" type="flex" align="middle" style="margin: 30% 0">
              <el-image style="width: 100px; height: 100px" src="src/assets/img/need_create.png" :fit="fit" />
              <div style="font-weight:300;">您需要<el-button type="text" size="large" @click="oneData.createVersionVisible=true">创建新版本</el-button>, 才能进行数据的上传、标注等操作</div>
            </el-col>
          </el-row>
        </el-col>





      </el-row>



    </div>
<!--    创建新版本-->
    <el-dialog :title =  "'创建数据集（'+oneData.datasetsName+'）的版本'" v-model="oneData.createVersionVisible" width="40%" destroy-on-close>
      <el-form >
        <el-form-item>
          创建方式：
          <el-radio-group v-model="oneData.createVersionsPattern" class="ml-4" >
            <el-radio label="a" size="large"  :disabled="oneData.versions.length==0?true:false">继承已有版本</el-radio>
            <el-radio label="b" size="large">创建全新版本</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item v-if="oneData.createVersionsPattern=='b'">
          算法类型：
          <el-select v-model="oneData.createVersions_type" clearable placeholder="请选择算法类型" style="width: 80%">
            <el-option
                v-for="item in createVersionsSlect_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else>
          继承来源：
          <el-select v-model="oneData.createInheritVersion" clearable placeholder="继承已有版本" style="width: 80%">
            <el-option
                v-for="item in oneData.versions.slice().reverse()"
                :key="item.editionName"
                :label="'V'+item.editionName"
                :value="item.editionName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          版本备注：
          <el-input
              v-model="oneData.createVersions_comment"
              :autosize="{ minRows: 8, maxRows: 12 }"
              type="textarea"
              placeholder="版本备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
            <span class="dialog-footer">
              <el-button @click="oneData.createVersionVisible=false;oneData.createVersionsPattern='b'">取 消</el-button>
              <el-button type="primary" @click="createVersion(oneData.id)">确 定</el-button>
            </span>
      </template>
    </el-dialog>




  </div>
</template>


<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import {watchEffect, ref, watch} from 'vue'
import {ElMessage} from "element-plus"
//接收者
const route = useRoute()
//发送者
const router = useRouter()
// 所有数据集
let allDataSet = ref(JSON.parse(localStorage.getItem('allDataSet') ) || []) ;
watchEffect(()=>{
  localStorage.setItem('allDataSet', JSON.stringify(allDataSet.value))
})


let oneData = ref({})
let showVersion = ref([])
let data_id = route.query.data_id
let select_value = ref("")
//当前版本继承链定义
let curEditionList = ref([])
//版本选中互斥
let editionsList = new Map() //版本链
let currSelect = ref(-1)
let oneEditionData = ref({})  //一个版本信息

//该数据集下的所有版本
if (findEdtions(data_id) == false) {
  ElMessage.error("访问错误！错误的URL！")
  router.push({
    path: 'overall',
    query: {}
  })
}  else {
}
// 根据数据集id找到对于的数据集；并过滤出根据算法类型过滤出版本列表
function findEdtions(data_id) {
  //data_id为"",或者undefined
  if (data_id == "" || data_id == undefined) {
    return false
  }
  //过滤出data_id数据集所在的index
  let index = allDataSet.value.findIndex((data)=>data.id == data_id)
  if (index == -1) { //找不到该id对应的数据，路由错误
    return false
  }
  //取出该数据集
  oneData.value = allDataSet.value[index]
  // console.log(oneData)
  //根据下拉列表对当前版本做一个过滤
  showVersion.value = select_value.value != "" ? oneData.value["versions"].filter(data=> data.algorithmType == select_value.value) : oneData.value["versions"]
  return true
}

const select_options = [
  {
    label: '物品检测模型',
    value: '物品检测模型',
  },
  {
    label: '混合模型',
    value: '混合模型',
  },
  {
    label: '图像单标签分类模型',
    value: '图像单标签分类模型',
  },
  {
    label: '图像多标签分类模型',
    value: '图像多标签分类模型',
  },
]

selectVersion(-1) //填充进入页面后的版本信息
//刷新右边版本填充信息和选择最后一个版本
// function showRight() {
//   if (showVersion.value.length > 0) {
//     selectVersion(showVersion.value[showVersion.value.length - 1].id)
//   }
// }
//选择一个版本 修改样式，填充右边信息
function selectVersion(selectId) {
  //默认选择最后一个
  if (selectId == -1) {
    if (showVersion.value.length > 0) {
      currSelect.value = showVersion.value[showVersion.value.length - 1].id
    }
  } else {
    currSelect.value = selectId
  }

  finedOneVersion(currSelect.value) //填充选择的版本信息
}
//根据version id填充版本信息和继承链
function finedOneVersion(version_id) {
  let index = oneData.value["versions"].findIndex((data)=>data.id == version_id)
  console.log(oneData.value["versions"][index])
  // 如果是-1，也就是该数据集存在，但是没有版本，oneEditionData.value 会等于undefined
  oneEditionData.value = oneData.value["versions"][index]

  //创建继承版本链
  editionsList = createInheritList(oneData.value)
  curEditionList.value = editionsList.get(version_id)
}
//创建/继承新版本
//创建数据集版本
let createVersionsSlect_options = JSON.parse(JSON.stringify(select_options))
function createVersion(id){
  let index = allDataSet.value.findIndex((data)=>data.id==id)
  //创建新版本
  let newEdition = {}
  if (allDataSet.value[index].createVersionsPattern == "b") {
    //是否为空
    if (allDataSet.value[index].createVersions_type == "") {
      ElMessage.error("创建失败，未选择算法类型！")
      return false
    }
    let editionName = 1
    if (allDataSet.value[index].versions.length > 0) {
      editionName = allDataSet.value[index].versions[allDataSet.value[index].versions.length-1].editionName + 1
    }
    newEdition = {
      id : randNums(12), //版本ID
      algorithmType : allDataSet.value[index].createVersions_type, //算法类型
      editionName : editionName, //版本名
      labels: 0, // 标签数量
      isLabelNums: 0 , //已经标注图片数
      needLabelNums: 0, //总图片数
      percent: 0, // 标注图片占比
      isPutEditions: false, //是否发布
      isStandard: false, //数据状态
      comment: allDataSet.value[index].createVersions_comment, //版本备注
      createTime: new Date().toLocaleString(), //创建时间
      putTime: "", //发布时间
      inheritVersionId: -1, // 继承版本id，-1为不继承其他版本
      inheritEditionName: "-", //继承版本名，-为不继承其他版本
    }
  } else if (allDataSet.value[index].createVersionsPattern == "a") {
    if (allDataSet.value[index].createInheritVersion == "") {
      ElMessage.error("创建失败，未选择继承已有版本信息！")
      return false
    }
    //继承新版本
    let inheritIndex = allDataSet.value[index].versions.findIndex((v)=>v.editionName==allDataSet.value[index].createInheritVersion)
    let editionName = allDataSet.value[index].versions[allDataSet.value[index].versions.length-1].editionName + 1
    newEdition = {
      id : randNums(12), //版本ID
      algorithmType : allDataSet.value[index].versions[inheritIndex].algorithmType, //算法类型
      editionName : editionName, //版本名
      labels: allDataSet.value[index].versions[inheritIndex].labels, // 标签数量
      isLabelNums: allDataSet.value[index].versions[inheritIndex].isLabelNums , //已经标注图片数
      needLabelNums: allDataSet.value[index].versions[inheritIndex].needLabelNums, //总图片数
      percent: allDataSet.value[index].versions[inheritIndex].percent, // 标注图片占比
      isPutEditions: false, //是否发布
      isStandard: allDataSet.value[index].versions[inheritIndex].isStandard, //数据状态
      comment: allDataSet.value[index].createVersions_comment, //版本备注
      createTime: new Date().toLocaleString(), //创建时间
      putTime: "", //发布时间
      inheritVersionId: allDataSet.value[index].versions[inheritIndex].id, // 继承版本id，-1为不继承其他版本
      inheritEditionName: allDataSet.value[index].versions[inheritIndex].editionName, //继承版本名，-为不继承其他版本
    }
  }
  allDataSet.value[index].versions.push(newEdition)

  allDataSet.value[index].createVersionVisible = false
  allDataSet.value[index].createVersions_type = ""
  allDataSet.value[index].createVersionsPattern = "b"
  allDataSet.value[index].createVersions_comment = ""
  allDataSet.value[index].createInheritVersion = allDataSet.value[index].versions[allDataSet.value[index].versions.length-1].editionName
  ElMessage.success("创建数据集版本成功。")

  findEdtions(data_id)  //重新刷选一遍左边版本信息，
  selectVersion(-1) //根据显示右边最后一个版本的信息，对应的版本继承链和版本信息
}

//构建继承版本信息 版本id : [[版本id，版本名，创建时间，继承版本id], ...] //从后往前
function createInheritList(data) {
  // 对于每一个版本构建一个版本链，包含本身，继承版本之前的链条，(not 下一个继承版本 下一个继承版本可能有多个)
  // oneData，对该数据集所有版本做一次遍历，从最后一个版本开始
  for (let i = data["versions"].length-1; i >= 0 ; i--) {
    //i个版本链
    let res = []
    let oneRes = []
    //加入当前版本id
    oneRes.push(data["versions"][i].id)
    oneRes.push(data["versions"][i].editionName)
    oneRes.push(data["versions"][i].createTime)
    oneRes.push(data["versions"][i].inheritVersionId)
    res.push(oneRes)
    //从当前版本前一个开始向前找继承来的版本，没有则break
    if (data["versions"][i].inheritVersionId != -1) { //未继承其他版本
      for (let j = i-1; j >= 0; j--) {
        oneRes = []
        let inheritId = res[res.length-1][3]
        if (inheritId == data["versions"][j].id) {
          oneRes.push(data["versions"][j].id)
          oneRes.push(data["versions"][j].editionName)
          oneRes.push(data["versions"][j].createTime)
          oneRes.push(data["versions"][j].inheritVersionId)
          res.push(oneRes)
        }
      }
    }
    editionsList.set(data["versions"][i].id, res)
  }
  return editionsList
}


//响应下拉检索
// watchEffect(()=>{
//   console.log(select_value.value)
//   // showRight() //
//   // findEdtions(data_id) //
//   // selectVersion(showVersion.value[showVersion.value.length-1].id)
// })
watch(select_value, (newVal, oldVal) => {
  //算法类型变化时，
  findEdtions(data_id)  //重新刷选一遍左边版本信息，
  selectVersion(-1) //根据显示右边最后一个版本的信息，对应的版本继承链和版本信息
})

//生成随机数id
function randNums(len) {
  let code = ""
  const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random()*10)
    code += random[index]
  }
  return parseInt(code)
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
.cntrow {
  margin-bottom: 20px;
}
.cnttitile{
  font-weight:100;
  margin-right: 10px;
}

.selectBtn{
  background-color: #00b0f8;
  color: #ffffff;
}
</style>
