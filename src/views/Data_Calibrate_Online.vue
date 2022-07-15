<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i> 数据标注
                </el-breadcrumb-item>
                <el-breadcrumb-item>在线标注</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <span class="pageTitle">在线标注</span>
                <span class="hideFunction">
                    <i class="el-icon-lx-attentionforbid el-icon--left" v-if="showTips"></i>
                    <i class="el-icon-lx-attention el-icon--left" v-else></i>
                    <el-button type="text"  @click="changeShowTips" style="color: rgb(117,120,137); font-weight: 5">
                        <span v-if="showTips">隐藏</span>
                        <span v-else>显示</span>功能说明
                    </el-button>
                </span>
            </div>
            <transition-group name="fade">
                <div v-if="showTips" style="margin-top:20px">
                    <el-alert title="你可以选择一个未发布的数据集版本开始进行标注。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>
            <el-tabs v-model="message" @tab-click="changeQueryInfo(message)">
                <el-tab-pane :label="`训练集`" name="first">
                </el-tab-pane>
                <el-tab-pane :label="`测试集`" name="second">
                </el-tab-pane>
            </el-tabs>
            <div>
                <template v-if="message === 'first'">
                    <div class="searchSelect">
                        <el-select v-model="form.type" placeholder="全部算法类型" size="medium" @change="statusSelect">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input 
                            placeholder="请输入数据集名称" 
                            v-model="queryInfo.query" 
                            clearable 
                            class="input-with-select" 
                            @clear="getTaskList"
                            size="medium"
                        >
                        </el-input>
                        <el-button size="medium" icon="el-icon-search" @click="searchName"></el-button>
                        <span class="textInfo">{{trainingSet.length}}个数据集版本可选</span>
                    </div>
                    <el-table :data="trainingSet.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                        <el-table-column
                            prop="datasetName"
                            label="数据集名称">
                        </el-table-column>
                        <el-table-column
                            prop="algorithmType"
                            label="算法类型">
                        </el-table-column>
                        <el-table-column
                            prop="version"
                            label="版本">
                        </el-table-column>
                        <el-table-column
                            prop="teamEditor"
                            label="操作">
                            <template #default="scope">
                                <el-button type="text" size="small" link="true" @click="go2Annotated">标注</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

                <template v-if="message === 'second'">
                    <div class="searchSelect">
                        <el-select v-model="form.type" placeholder="全部算法类型" size="medium" @change="statusSelectTestSet">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input 
                            placeholder="请输入数据集名称" 
                            v-model="queryInfo.query" 
                            clearable 
                            class="input-with-select" 
                            @clear="getTaskListTestSet"
                            size="medium"
                        >
                        </el-input>
                        <el-button icon="el-icon-search" @click="searchNameTestSet" size="medium"></el-button>
                        <span class="textInfo">{{testSet.length}}个数据集版本可选</span>
                    </div>
                    <el-table :data="testSet.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                        <el-table-column
                            prop="datasetName"
                            label="数据集名称">
                        </el-table-column>
                        <el-table-column
                            prop="algorithmType"
                            label="算法类型">
                        </el-table-column>
                        <el-table-column
                            prop="version"
                            label="版本">
                        </el-table-column>
                        <el-table-column
                            prop="teamEditor"
                            label="操作">
                            <template #default="scope">
                                <el-button type="text" size="small" link="true" @click="go2Annotated">标注</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>
        <el-row  class="child" >
            <el-col :span="24" class="paginations" v-if="queryInfo.total">
                <el-pagination
                    v-model:currentPage="queryInfo.currentPage"
                    v-model:page-size="queryInfo.pagesize"
                    :page-sizes="[2, 5, 10, 20, 50]"
                    :small="false"
                    :disabled="false"
                    :background="false"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="queryInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-col>
        </el-row>
    </div>
    
</template>

<script>
import {nanoid} from 'nanoid'
import { ref, reactive } from "vue";
export default {
    name: "calibrateOnline",
    setup() {
        const message = ref("first");
        return {
            message,
        };
    },
    data() {
        return {
            input:'',
            showTips: true,
            condition:false,
            statusLabel:'',
            tempMarks: [],
            queryInfo:{
                //查询参数
                query: '',
                // 当前页码
                currentPage: 1,
                // 每页显示条数
                pagesize: 5,
                total:0,
            },
            options: [{
            value: '选项1',
            label: '全部算法类型'
            }, {
            value: '选项2',
            label: '物体检测模型'
            }, {
            value: '选项3',
            label: '混合模型'
            }, {
            value: '选项4',
            label: '图像单标签分类模型'
            }, {
            value: '选项5',
            label: '图像多标签分类模型'
            }, {
            value: '选项6',
            label: '图像多属性分类模型'
            }, {
            value: '选项7',
            label: '图像文字识别模型'
            }, {
            value: '选项8',
            label: '结构化图像文字识别模型'
            }],
            form: {
                type:'选项1'
            },
            dialogForm: {
                taskName:'',
                markTeam:'',
                datasetType:'',
                datasetVersion:'',
                taskScope:[],
            },
            dialogFormVisible: false,
            formLabelWidth: '230px',
            checked1: false,
            checked2: false,
            checked3: false,
            trainingSet:JSON.parse(localStorage.getItem('trainingSet')) || [],
            alltrainingSet:JSON.parse(localStorage.getItem('alltrainingSet')) || [],
            testSet:JSON.parse(localStorage.getItem('testSet')) || [],
            alltestSet:JSON.parse(localStorage.getItem('alltestSet')) || [],
            alltrainingSet:[
                {
                    datasetName: "航运中心加水1",
                    algorithmType: "混合模型",
                    version:"V3",
                },
                {
                    datasetName: "消防器材丢失标注",
                    algorithmType: "混合模型",
                    version:"V1",
                },
                {
                    datasetName: "消防器材1",
                    algorithmType: "物体检测模型",
                    version:"V1",
                },
                {
                    datasetName: "消防器材示例",
                    algorithmType: "物体检测模型",
                    version:"V1",
                },
                {
                    datasetName: "航运中心消防器材",
                    algorithmType: "物体检测模型",
                    version:"V7",
                },
                {
                    datasetName: "航运中心加水",
                    algorithmType: "物体检测模型",
                    version:"V1",
                },
            ],
            alltestSet: [
                {
                    datasetName: "电梯人数",
                    algorithmType: "物体检测模型",
                    version:"V2",
                },
                
            ],
        }
    },
    methods: {
        // 隐藏功能显示
        changeShowTips(){
            this.showTips = !this.showTips
        },
        go2Annotated() {
            this.$router.replace({
                path: '/data/annotated',
            })
        },
        cancelDialog(dialogForm){
            this.dialogFormVisible = false
            dialogForm.taskName = ''
            dialogForm.markTeam = ''
            dialogForm.datasetType = ''
            dialogForm.datasetVersion = ''
            dialogForm.taskScope = []
        },
        clearDialog(dialogForm){
            this.dialogFormVisible = false
            dialogForm.taskName = ''
            dialogForm.markTeam = ''
            dialogForm.datasetType = ''
            dialogForm.datasetVersion = ''
            dialogForm.taskScope = []
        },
        searchName(){
            this.trainingSet = this.alltrainingSet
            this.trainingSet = this.trainingSet.filter(trainingSe=>{
                return trainingSe.datasetName.indexOf(this.queryInfo.query)!= -1
            })
            this.queryInfo.query = ''
        },
        searchNameTestSet(){
            this.testSet = this.alltestSet
            this.testSet = this.testSet.filter(testSe=>{
                return testSe.datasetName.indexOf(this.queryInfo.query)!= -1
            })
            this.queryInfo.query = ''
        },
        getTaskList(){
            this.trainingSet = this.alltrainingSet
        },
        getTaskListTestSet(){
            this.testSet = this.alltestSet
        },
        getList(){
            
            this.getTaskListAccepted()
            this.getTaskList()
        },
        statusSelect(value){
            this.trainingSet = this.alltrainingSet
            for (let index = 0; index < this.options.length; index++) {
                if (this.options[index].value === value) {
                    this.statusLabel = this.options[index].label
                    break
                }                
            }
            if(this.statusLabel === '全部算法类型'){
                this.trainingSet = this.alltrainingSet
            }
            else{
                this.trainingSet = this.trainingSet.filter(trainingSe=>{
                    return trainingSe.algorithmType.indexOf(this.statusLabel)!= -1
                })
            }
        },
        statusSelectTestSet(value){
            this.testSet = this.alltestSet
            for (let index = 0; index < this.options.length; index++) {
                if (this.options[index].value === value) {
                    this.statusLabel = this.options[index].label
                    break
                }                
            }
            if(this.statusLabel === '全部算法类型'){
                this.testSet = this.alltestSet
            }
            else{
                this.testSet = this.testSet.filter(testSe=>{
                    return testSe.algorithmType.indexOf(this.statusLabel)!= -1
                })
            }
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            console.log(this.queryInfo.total);
        },
        handleCurrentChange(newPage) {
            this.queryInfo.currentPage = newPage
            console.log(this.queryInfo.total);
        },
        changeQueryInfo(team){
            // this.getList();
            if(team == "first"){
                this.trainingSet = this.alltrainingSet
                this.queryInfo.total = this.trainingSet.length
            }else {
                this.testSet = this.alltestSet
                this.queryInfo.total = this.testSet.length
            }
        },
    },
    watch:{
        trainingSet:{
            deep:true,
            handler(value){
                localStorage.setItem('trainingSet',JSON.stringify(value))
                this.queryInfo.total = this.trainingSet.length
            }
        },
        alltrainingSet:{
            deep:true,
            handler(value){
                localStorage.setItem('alltrainingSet',JSON.stringify(value))
                this.queryInfo.total = this.trainingSet.length
            }
        },
        testSet:{
            deep:true,
            handler(value){
                localStorage.setItem('testSet',JSON.stringify(value))
                this.queryInfo.total = this.testSet.length
            }
        },
        alltestSet:{
            deep:true,
            handler(value){
                localStorage.setItem('alltestSet',JSON.stringify(value))
                this.queryInfo.total = this.testSet.length
            }
        },
    },
    mounted() {
        this.trainingSet = this.alltrainingSet
        this.testSet = this.alltestSet
    },
    updated() {
        if(!this.condition){
            this.queryInfo.total = this.trainingSet.length
            this.condition = true
        }
    },
};
</script>

<style scoped>
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
.input-with-select {
    width: 220px;
    background-color: #fff;
}
.button-with-createTask{
    float:right;
    margin-right:5px;
}
.el-checkbox-group{
    margin-left:150px;
    margin-top: -20px;
}
.dialog-footer{
    float:right;
    margin-right:30px;
    margin-top:-20px;
}
.searchSelect{
    margin-bottom:20px;
}
.searchSelect .el-select{
    margin-right:15px;
}
.el-link {
  margin-right: 10px;
}
.textInfo{
    float: right;
    margin-right: 25px;
    text-align:center;
    font-size:15px;
    border: 3px solid rgb(255, 255, 255);
    font-family:"微软雅黑" ;
    font-style: italic;
}
.child{
  position: absolute;
  right: 5%;
}
.paginations {
  padding-top: 10px;
}
.taskScopeDiscription {
  font-size: 13px;
  color: gray;
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

