<template>
  <div>
    <div class="container">
      <!--  数据总览和功能说明-->
      <div>
			<span class="pageTitle">数据总览</span>
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
              <el-alert title="您可以在此查看已创建的所有数据集并进行跨算法类型的操作和管理。" type="info" show-icon @close="toggle_showTips">
              </el-alert>
          </div>
      </transition-group>
      <div style="margin: 20px 0;"></div>

    <!--选择搜索-->
      <!--  训练集 测试集 -->
      <el-tabs v-model="activeTrain" @click="toggle_train(activeTrain)">
        <el-tab-pane :label="`训练集`" name="train">
        </el-tab-pane>
        <el-tab-pane :label="`测试集`" name="test">
        </el-tab-pane>
      </el-tabs>
      <!--  图片 音频-->
      <div style="margin-bottom: 10px">
        <el-radio-group v-model="activePic" size="medium" >
          <el-radio-button label="pic" @click="toggle_pic('pic')">图片</el-radio-button>
          <!-- <el-radio-button label="voice" @click="toggle_pic('voice')">音频</el-radio-button> -->
        </el-radio-group>
      </div>
      <!--  选择 搜索 创建-->
      <el-select v-model="select_value" clearable placeholder="请选择算法类型">
        <el-option
          v-for="item in select_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="search_value" clearable placeholder="请输入数据集名称" style="width:30%" @clear="searchFunc('clear')">
        <template #append>
          <el-button icon="el-icon-search" @click="searchFunc()" />
        </template>
      </el-input>

      <el-button  type="primary" class="button-with-createTeam" style="float: right"
        @click="addNewVisible=true"  v-if="activeTrain=='train'">
        <i class="el-icon-circle-plus-outline el-icon--left" ></i>
        创建训练集
      </el-button>
      <el-button  type="primary" class="button-with-createTeam" style="float: right"
        @click="addNewVisible=true"  v-if="activeTrain=='test'">
        <i class="el-icon-circle-plus-outline el-icon--left" ></i>
        创建测试集
      </el-button>
      <div v-if="!showList.length" style="margin: 10%;">
        <el-row >
          <el-col  :span="24" type="flex" align="middle">
            <el-image src="src/assets/img/nothing.png"></el-image>
            <div >暂无数据集</div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--  数据分页-->
    <div class="container parent" v-if="showList.length">
      <!--    训练集数据-->
      <div v-for="data in showList"  style="border: 1px solid rgb(216,218,229); margin-bottom: 15px;
        border-radius: 0.5em; font-size: 14px">
        <el-row   style="height: 60px; "  type="flex" align="middle">
          <el-col @click="toggle_oneDataSet(data.id)" :span="10"  style="cursor: pointer">
            <el-row type="flex" align="middle">
              &nbsp;&nbsp;&nbsp;
              <el-button type="text">
                <i :class="[data.showContent ? 'el-icon-arrow-down el-icon--left':'el-icon-arrow-right el-icon--left']" ></i>
              </el-button>
              <el-image src="src/assets/img/overall-block.png" ></el-image>
              <el-button type="text">{{data.datasetsName}}</el-button>
            </el-row>
          </el-col>
          <el-col :span="14" >
            <el-row style="float:right; margin-right: 10px">

              <el-button type="text" class="btn" @click="data.createVersionVisible=true">
                <i class="el-icon-plus el-icon--left" >创建新版本</i>
              </el-button>
              <el-button type="text" class="btn" @click="showAllEdtions(data.id)">
                <i class="el-icon-files el-icon--left" >全部版本</i>

              </el-button>

              <el-dropdown trigger="click" size="small">
                <span class="el-dropdown-link" >
                  <el-button type="text" class="btn">
                    <i class="el-icon-more el-icon--left" >更多</i>
                  </el-button>
                </span>
                <template #dropdown >
                  <el-dropdown-menu   class="demonstration">
                    <el-dropdown-item @click="data.editVisible=true;data.editDatasetName=data.datasetsName">
                      <i class="el-icon-edit el-icon--left" ></i>修改名称
                    </el-dropdown-item>
                    <el-dropdown-item @click="data.delVisible=true">
                      <i class="el-icon-delete el-icon--left" ></i>删除数据集
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-row>

          </el-col>
        </el-row>

        <transition-group  name="fade">
          <!--        单个数据集最新版本-->
          <div v-if="data.showContent"  name="fade" >
            <el-row style="background-color: rgb(229,230,242); height: 48px" type="flex" align="middle" >
              <el-col :span="4">
                &nbsp;&nbsp; 算法类型
              </el-col>
              <el-col :span="4" class="link-left">
                &nbsp;&nbsp; 最新版本
              </el-col>
              <el-col :span="4" class="link-left">
                &nbsp;&nbsp; 标签数量
              </el-col>
              <el-col :span="4" class="link-left">
                &nbsp;&nbsp; 已标注图片数/总图片数
              </el-col>
              <el-col :span="4" class="link-left">
                &nbsp;&nbsp; 数据状态
              </el-col>
              <el-col :span="4" class="link-left">
                &nbsp;&nbsp; 操作
              </el-col>
            </el-row>

            <el-row v-if="data.versions.length" style="background-color: rgb(243,245,251); height: 52px" type="flex" align="middle">
              <el-col :span="4">
                &nbsp;&nbsp; {{data.versions[data.versions.length-1].algorithmType}}
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="就绪条件：至少存在一个图片数>40的检测标签"
                  placement="bottom-start"
                >
                  <i class="el-icon-lx-question  el-icon--left" ></i>
                </el-tooltip>
              </el-col>
              <el-col :span="4" >
                &nbsp;&nbsp; V{{data.versions[data.versions.length-1].editionName}} (
                <span style="color: rgb(137,207,105)" v-if="data.versions[data.versions.length-1].isPutEditions">已发布</span>
                <span v-else>未发布</span>
                )
              </el-col>

              <el-col :span="4">
                &nbsp;&nbsp; {{data.versions[data.versions.length-1].labels}}
              </el-col>
              <el-col :span="4">
                <el-progress :percentage="data.versions[data.versions.length-1].percent">
                  <el-button type="text">{{data.versions[data.versions.length-1].isLabelNums}}/{{data.versions[data.versions.length-1].needLabelNums}}</el-button>
                </el-progress>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" align="middle">
                  <img :src="data.versions[data.versions.length-1].isStandard ? 'src/assets/img/isStandard.png' : 'src/assets/img/notStandard.png'" />
                  <span v-if="data.versions[data.versions.length-1].isStandard" style="color: black" >已达到训练标准</span>
                  <span v-else style="color: black" >未达到训练标准</span>
                </el-row>

              </el-col>
              <el-col :span="4">

                <el-button type="text" size="small">
                  查看
                </el-button>
                  <el-button type="text" size="small" @click="putEdition(data.id, data.versions[data.versions.length-1].id)"
                             v-if="data.versions[data.versions.length-1].isPutEditions == false">
                    发布
                  </el-button>
                  <el-button type="text" size="small" v-if="data.versions[data.versions.length-1].isPutEditions == false">
                    导入
                  </el-button>
                  <el-button type="text" size="small" v-if="data.versions[data.versions.length-1].isPutEditions == false">
                    标注
                  </el-button>

                <el-button type="text" size="small" @click="data.delVersionVisible=true">
                  删除
                </el-button>
              </el-col>
            </el-row>
            <!--        无版本-->
            <el-row v-else type="flex" align="middle" style="background-color: rgb(243,245,251);text-align: center; height: 36px; color: rgb(122,125,139)">
              <el-col :span="24" >
                您需要 <el-button type="text" class="btn" @click="data.createVersionVisible=true">创建新版本</el-button>，才能进行数据的上传、标注等操作
              </el-col>
            </el-row>
          </div>
        </transition-group>

        <!-- 数据集名字修改弹出框 -->
        <el-dialog :title =  "'修改数据集-'+data.datasetsName" v-model="data.editVisible" width="25%" destroy-on-close>
          <el-form >
            <el-form-item label="名称：" >
              <el-input v-model="data.editDatasetName"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="data.editVisible=false">取 消</el-button>
              <el-button type="primary" @click="saveEditDataset(data.id, data.editDatasetName)">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <!--  数据集删除弹出确认框-->
        <el-dialog
          v-model="data.delVisible"
          width="30%"
          destroy-on-close
          center
        >
          <el-row type="flex" align="middle">
            <el-col align="middle" >
              <i class="el-icon-lx-question"></i>
              确定删除数据集{{data.datasetsName}}吗？
            </el-col>
          </el-row>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="data.delVisible = false">取 消</el-button>
              <el-button type="primary" @click="delDataSet(data.id)">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <!--     创建对应数据集版本-->
        <el-dialog :title =  "'创建数据集（'+data.datasetsName+'）的版本'" v-model="data.createVersionVisible" width="40%" destroy-on-close>
          <el-form >
            <el-form-item>
              创建方式：
              <el-radio-group v-model="data.createVersionsPattern" class="ml-4" >
                <el-radio label="a" size="large"  :disabled="data.versions.length==0?true:false">继承已有版本</el-radio>
                <el-radio label="b" size="large">创建全新版本</el-radio>
              </el-radio-group>

            </el-form-item>
            <el-form-item v-if="data.createVersionsPattern=='b'">
              算法类型：
              <el-select v-model="data.createVersions_type" clearable placeholder="请选择算法类型" style="width: 80%">
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
              <el-select v-model="data.createInheritVersion" clearable placeholder="继承已有版本" style="width: 80%">
                <el-option
                  v-for="item in data.versions.slice().reverse()"
                  :key="item.editionName"
                  :label="'V'+item.editionName"
                  :value="item.editionName"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              版本备注：
              <el-input
                v-model="data.createVersions_comment"
                :autosize="{ minRows: 8, maxRows: 12 }"
                type="textarea"
                placeholder="版本备注信息"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="data.createVersionVisible=false;data.createVersionsPattern='b'">取 消</el-button>
              <el-button type="primary" @click="createVersion(data.id)">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <!--  数据集最新版本删除弹出确认框-->
        <el-dialog
          v-model="data.delVersionVisible"
          width="30%"
          destroy-on-close
          center
          v-if="data.versions.length"
        >
          <el-row type="flex" align="middle">
            <el-col align="middle" >
              <i class="el-icon-lx-question"></i>
              确定删除数据集({{data.datasetsName}})版本V{{data.versions[data.versions.length-1].editionName}}吗？
            </el-col>
          </el-row>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="data.delVersionVisible = false">取 消</el-button>
              <el-button type="primary" @click="delDatasetVersion(data.id, data.versions[data.versions.length-1].id)">确 定</el-button>
            </span>
          </template>
        </el-dialog>

      </div>
      <!--    测试集合数据-->
    </div>
    
    <div>
      <!--  分页栏-->
      <el-row  class="child" v-if="showList.length">
        <el-col :span="24" class="paginations">
          <el-pagination
            v-model:currentPage="queryInfo.pagenum"
            v-model:page-size="queryInfo.pagesize"
            :page-sizes="[5, 10, 20, 50, 100]"
            :small="false"
            :disabled="false"
            :background="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo.totalpage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 数据集名字新增弹出框 -->
    <el-dialog title = "新增数据集" v-model="addNewVisible" width="25%" destroy-on-close>
      <el-form >
        <el-form-item label="名称：" >
          <el-input v-model="newDatasetName" ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addNewVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveNewDataset()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, watchEffect, ref, reactive, unref} from 'vue'
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

// 隐藏功能显示
let showTips = ref(true)
function toggle_showTips(){
  showTips.value = !showTips.value
}
// 训练集/测试集选择按钮 //图片 音频选择
let activeTrain = ref('train')
let activePic = ref('pic')
function toggle_train(val){
  activeTrain.value = val
  getList()
}
function toggle_pic(val) {
  activePic.value = val
  getList()
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

//算法类型 数据集搜索
let select_value = ref("")
let search_value = ref("")
//搜索
let queryArr = new Map()
// 所有数据集
let allDataSet = ref(JSON.parse(localStorage.getItem('allDataSet') ) || []) ;
watchEffect(()=>{
  localStorage.setItem('allDataSet', JSON.stringify(allDataSet.value))
})

let showAllDataSet = allDataSet
let showList = ref([])
// 数据分页
// 获取用户列表的参数对象
let queryInfo = ref({
  query: queryArr, // 查询参数
  pagenum: 1, // 当前页码
  pagesize: 5, // 每页显示条数
  totalpage: 0, //总页数
})
function getList() {
  //过滤query条件
  const query_datasetsName = queryInfo.value.query.get("datasetsName")
  const query_algorithmType = queryInfo.value.query.get("algorithmType")
  let filterList = ref([])
  // 数据集名称搜索过滤  模糊搜索 indexOf(myText)
  filterList.value = query_datasetsName != "" && query_datasetsName != undefined ? showAllDataSet.value.filter(data =>
    data.datasetsName.indexOf(query_datasetsName) > -1 ) : showAllDataSet.value
  // console.log(filterList)
  // 数据集最后一个版本算法搜索过滤
  filterList.value = query_algorithmType != "" && query_algorithmType != undefined ? filterList.value.filter(data => data.versions.length > 0 &&
    data.versions[data.versions.length-1].algorithmType == query_algorithmType) : filterList.value
  //训练集/测试集过滤
  filterList.value = filterList.value.filter(data => data.datasetType == activeTrain.value)
  // 图片 音频过滤
  filterList.value = filterList.value.filter(data => data.datasetMedia == activePic.value)
  //搜索条件下的总条数更新
  queryInfo.value.totalpage = filterList.value.length
  // if (queryInfo.value.totalpage == (queryInfo.value.pagenum - 1) * queryInfo.value.pagesize) {
  //   queryInfo.value.pagenum--
  // }
  //最后对总条数分页
  showList.value = filterList.value.slice((queryInfo.value.pagenum - 1) * queryInfo.value.pagesize,
    (queryInfo.value.pagenum) * queryInfo.value.pagesize)
}
function searchFunc(name) {
  if (name == "clear") {
    queryArr.set("datasetsName", "")
  }
  getList()
}

//监听搜索栏值变化
watchEffect(()=>{
  queryArr.set("datasetsName", search_value.value)
})
watchEffect(()=>{
  queryArr.set("algorithmType", select_value.value)
  getList()
})

function handleCurrentChange(num){
  queryInfo.value.pagenum = num
  getList()
}
function handleSizeChange(size) {
  queryInfo.value.pagesize = size
  getList()
}

function toggle_oneDataSet(id){
  let index = showAllDataSet.value.findIndex((data)=>data.id==id)
  showAllDataSet.value[index].showContent = !showAllDataSet.value[index].showContent
}

// 创建新数据集 修改数据集
let addNewVisible = ref(false) //控制数据集新增
let newDatasetName = ref("") //默认为空，更新，置空
function saveNewDataset() {
  let isSaveIndex = showAllDataSet.value.findIndex((data)=>data.datasetsName==newDatasetName.value)
  if (newDatasetName.value == "" || isSaveIndex > -1) {
    ElMessage.error(newDatasetName.value == "" ? "输入数据集名称为空!" : "输入数据集名称重复!")
    return false
  }
  let newDataset = {
    datasetType: activeTrain.value, // 训练集 测试集
    datasetMedia: "pic", // 图片 音频
    showContent: false, //是否折叠该数据集合
    id: randNums(12), //该数据集ID
    datasetsName: newDatasetName.value, //该数据集名字
    versions: [], //每个数据集由多个版本组成
    editVisible: false, //该数据集修改界面显示
    editDatasetName: "", //绑定编辑数据名
    delVisible: false, //该数据集删除界面显示
    createVersionVisible: false, //该数据集创建新版本界面显示
    createVersionsPattern: "b", //绑定版本创建方式
    createVersions_type: "", //绑定版本算法类型
    createVersions_comment: "", //绑定版本备注
    createInheritVersion: -1, //绑定继承版本值
    delVersionVisible: false, //该数据集最新版本界面显示
  }
  showAllDataSet.value.unshift(newDataset)

  newDatasetName.value = ""
  addNewVisible.value = false
  ElMessage.success("新增数据集成功")
  queryInfo.value.pagenum = 1
  getList()
  lastDatasetOpenStatus()
}
function saveEditDataset(id, editDatasetName) {
  let isSaveIndex = showAllDataSet.value.findIndex((data)=>data.datasetsName==editDatasetName)
  if (editDatasetName == "" || isSaveIndex > -1) {
    ElMessage.error(editDatasetName == "" ? "输入数据集名称为空!" : "输入数据集名称重复!")
    return false
  }
  let editIndex = showAllDataSet.value.findIndex((data)=>data.id==id)
  showAllDataSet.value[editIndex].datasetsName = editDatasetName

  showAllDataSet.value[editIndex].editDatasetName = ""
  showAllDataSet.value[editIndex].editVisible = false
  ElMessage.success("修改数据集成功")
  getList()
}
//删除数据集
function  delDataSet(id) {
  let delIndex = showAllDataSet.value.findIndex((data)=>data.id == id)
  showAllDataSet.value.splice(delIndex, 1)
  ElMessage.success("删除数据集成功")
  getList()
}
//创建/继承新版本
//创建数据集版本
let createVersionsSlect_options = JSON.parse(JSON.stringify(select_options))
function createVersion(id){
  let index = showAllDataSet.value.findIndex((data)=>data.id==id)
  //创建新版本
  let newEdition = {}
  if (showAllDataSet.value[index].createVersionsPattern == "b") {
    //是否为空
    if (showAllDataSet.value[index].createVersions_type == "") {
      ElMessage.error("创建失败，未选择算法类型！")
      return false
    }
    let editionName = 1
    if (showAllDataSet.value[index].versions.length > 0) {
      editionName = showAllDataSet.value[index].versions[showAllDataSet.value[index].versions.length-1].editionName + 1
    }
    newEdition = {
      id : randNums(12), //版本ID
      algorithmType : showAllDataSet.value[index].createVersions_type, //算法类型
      editionName : editionName, //版本名
      labels: 0, // 标签数量
      isLabelNums: 0 , //已经标注图片数
      needLabelNums: 0, //总图片数
      percent: 0, // 标注图片占比
      isPutEditions: false, //是否发布
      isStandard: false, //数据状态
      comment: showAllDataSet.value[index].createVersions_comment, //版本备注
      createTime: new Date().toLocaleString(), //创建时间
      putTime: "", //发布时间
      inheritVersionId: -1, // 继承版本id，-1为不继承其他版本
      inheritEditionName: "-", //继承版本名，-为不继承其他版本
    }
  } else if (showAllDataSet.value[index].createVersionsPattern == "a") {
    if (showAllDataSet.value[index].createInheritVersion == "") {
      ElMessage.error("创建失败，未选择继承已有版本信息！")
      return false
    }
    //继承新版本
    let inheritIndex = showAllDataSet.value[index].versions.findIndex((v)=>v.editionName==showAllDataSet.value[index].createInheritVersion)
    let editionName = showAllDataSet.value[index].versions[showAllDataSet.value[index].versions.length-1].editionName + 1
    newEdition = {
      id : randNums(12), //版本ID
      algorithmType : showAllDataSet.value[index].versions[inheritIndex].algorithmType, //算法类型
      editionName : editionName, //版本名
      labels: showAllDataSet.value[index].versions[inheritIndex].labels, // 标签数量
      isLabelNums: showAllDataSet.value[index].versions[inheritIndex].isLabelNums , //已经标注图片数
      needLabelNums: showAllDataSet.value[index].versions[inheritIndex].needLabelNums, //总图片数
      percent: showAllDataSet.value[index].versions[inheritIndex].percent, // 标注图片占比
      isPutEditions: false, //是否发布
      isStandard: showAllDataSet.value[index].versions[inheritIndex].isStandard, //数据状态
      comment: showAllDataSet.value[index].createVersions_comment, //版本备注
      createTime: new Date().toLocaleString(), //创建时间
      putTime: "", //发布时间
      inheritVersionId: showAllDataSet.value[index].versions[inheritIndex].id, // 继承版本id，-1为不继承其他版本
      inheritEditionName: showAllDataSet.value[index].versions[inheritIndex].editionName, //继承版本名，-为不继承其他版本
    }
  }
  showAllDataSet.value[index].versions.push(newEdition)

  showAllDataSet.value[index].createVersionVisible = false
  showAllDataSet.value[index].createVersions_type = ""
  showAllDataSet.value[index].createVersionsPattern = "b"
  showAllDataSet.value[index].createVersions_comment = ""
  showAllDataSet.value[index].createInheritVersion = showAllDataSet.value[index].versions[showAllDataSet.value[index].versions.length-1].editionName
  ElMessage.success("创建数据集版本成功。")

}
//删除数据集中的一个版本
function delDatasetVersion(id, versionId) {
  let dataIndex = showAllDataSet.value.findIndex((data)=>data.id == id)
  let versionIndex = showAllDataSet.value[dataIndex].versions.findIndex((v)=>v.id==versionId)
  showAllDataSet.value[dataIndex].versions.splice(versionIndex, 1)
  ElMessage.success("删除版本成功")
  showAllDataSet.value[dataIndex].delVersionVisible = false

}


//触发操作：只有最新数据集呈打开状态，其他都折叠状态
function lastDatasetOpenStatus() {
  if (showList.value.length == 0) {
    return
  }
  showList.value[0].showContent = true
  for (let i = 1; i < showList.value.length; i++) {
    showList.value[i].showContent = false
  }
}

//发布操作
function putEdition(id, versionId){
  // ElMessage.error("文件数量少于10，不允许发布！")
  let dataIndex = showAllDataSet.value.findIndex((data)=>data.id == id)
  let versionIndex = showAllDataSet.value[dataIndex].versions.findIndex((v)=>v.id==versionId)
  showAllDataSet.value[dataIndex].versions[versionIndex].isPutEditions = true

  ElMessage.success("发布成功。")
  return false
}





//监听页面刷新
window.onbeforeunload = function () {
  getList()
  lastDatasetOpenStatus()
};

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

// 查看全部版本
const dataRouter = useRouter()
function showAllEdtions(data_id) {
  dataRouter.push({
    path: "/data/onedata",
    query: {
      data_id:data_id
    }
  })

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/*分页*/
.parent{
  position: relative;
  margin:0 auto;
  padding-bottom: 50px;
}
.child{
  position: absolute;
  right: 5%;
}
.paginations {
  padding-top: 10px;
}
/*画一条再左边的竖线*/
.link-left {
  height: 50%;
  border-left: solid #ACC0D8 1px;
  vertical-align: center;
}
.btn:hover{
  color: rgb(74,105,239);
  text-decoration: underline;
}
.demonstration {
  display: block;
  font-size: 10px;
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

