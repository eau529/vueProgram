<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i> 数据标注
                </el-breadcrumb-item>
                <el-breadcrumb-item>多人标注</el-breadcrumb-item>
                <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <span class="pageTitle">任务管理</span>
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
                    <el-alert title="这里您可以管理发起或接收到的多人标注任务。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>
            <el-tabs v-model="message" @tab-click="changeQueryInfo(message)">
                <el-tab-pane :label="`我发起的任务`" name="first">
                </el-tab-pane>
                <el-tab-pane :label="`我接受的任务`" name="second">
                </el-tab-pane>
            </el-tabs>
            <div>
                <template v-if="message === 'first'">
                    <div class="searchSelect">
                        <el-select v-model="form.type" placeholder="全部任务状态" size="medium" @change="statusSelect">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input 
                            placeholder="搜索任务名称/标注团队名称" 
                            v-model="queryInfo.query" 
                            clearable 
                            class="input-with-select" 
                            @clear="getTaskList"
                            size="medium"
                        >
                        </el-input>
                        <el-button size="medium" icon="el-icon-search" @click="searchName"></el-button>
                        <el-button size="medium" type="primary" class="button-with-createTask" @click="dialogFormVisible = true">
                            <i class="el-icon-circle-plus-outline el-icon--left"></i>
                            创建任务
                        </el-button>
                    </div>
                    <el-dialog title="创建任务" v-model="dialogFormVisible" @close="clearDialog(dialogForm)">
                        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" >
                            <el-form-item label="任务名称" :label-width="formLabelWidth" prop="taskName">
                                <el-row><el-col :span="10">
                                    <el-input v-model="dialogForm.taskName" autocomplete="off"></el-input>
                                </el-col></el-row>
                            </el-form-item>
                            <el-form-item label="标注团队" :label-width="formLabelWidth" prop="markTeam">
                                <el-select v-model="dialogForm.markTeam" placeholder="请选择或搜索团队">
                                    <el-option label="华侨城" value="华侨城"></el-option>
                                    <el-option label="天安数码城" value="天安数码城"></el-option>
									<el-option label="火焰标注团队" value="火焰标注团队"></el-option>
                                    <el-option label="消防器材标注_时光塔" value="消防器材标注_时光塔"></el-option>
                                    <el-option label="混凝土振捣" value="混凝土振捣"></el-option>
                                    <el-option label="信达项目" value="信达项目"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据集类型" :label-width="formLabelWidth" prop="datasetType">
                                <el-radio-group v-model="dialogForm.datasetType">
                                    <el-radio :label="0">
                                        <span>训练集</span>
                                    </el-radio>
                                    <el-radio :label="1">
                                        <span>测试集</span>
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="数据集版本" :label-width="formLabelWidth" prop="datasetVersion">
                                <el-select v-model="dialogForm.datasetVersion" placeholder="请选择或搜索">
                                    <el-option label="航运中心加水1（V1-混合模型）" value="13_15_1(V4)"></el-option>
                                    <el-option label="消防器材丢失标注（V1-混合模型）" value="13_15_1(V1)"></el-option>
									<el-option label="火焰标注（V1-混合模型" value="13_15_1(V2)"></el-option>
                                    <el-option label="test（V1-物体检测模型）" value="13_15_1(V3)"></el-option>
                                    <el-option label="消防器材1（V1-物体检测模型）" value="13_15_1(V1)"></el-option>
                                    <el-option label="消防器材示例（V1-物体检测模型）" value="13_15_1(V2)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标注范围" :label-width="formLabelWidth" prop="taskScope">
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox-group v-model="dialogForm.taskScope" :label-width="formLabelWidth">
                                    <div>
                                        <el-checkbox v-model="checked1" label="未标注图片">
                                            <span>未标注图片</span>
                                            <span class="taskScopeDiscription">（发起后需对未标注图片进行标注）</span>
                                        </el-checkbox>
                                    </div>
                                    <div>
                                        <el-checkbox v-model="checked2" label="已标注图片">
                                            <span>已标注图片</span>
                                            <span class="taskScopeDiscription">（发起后需对已标注图片进行内容的修改和确认）</span>
                                        </el-checkbox></div>
                                    <div>
                                        <el-checkbox v-model="checked3" label="待确认图片">
                                            <span>待确认图片</span>
                                            <span class="taskScopeDiscription">（发起后需对待确认图片内容的修改和确认）</span>

                                        </el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form>
                        <div class="dialog-footer">
                            <el-button size="medium" @click="cancelDialog('dialogForm')">取 消</el-button>
                            <el-button size="medium" type="primary" @click="confirm(dialogForm)">确 定</el-button>
                        </div>
                    </el-dialog>
                    <el-table :data="initiatedTasks.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                        <el-table-column
                            prop="taskName"
                            label="任务名称">
                        </el-table-column>
                        <el-table-column
                            prop="markTeam"
                            label="标注团队">
                        </el-table-column>
                        <el-table-column
                            prop="datasetType"
                            label="数据集类型">
                        </el-table-column>
                        <el-table-column
                            prop="datasetVersion"
                            label="数据集版本">
                        </el-table-column>
                        <el-table-column
                            prop="taskScope"
                            label="标注范围">
                        </el-table-column>
                        <el-table-column
                            prop="creationTime"
                            label="创建时间">
                        </el-table-column>
                        <el-table-column
                            prop="taskStatus"
                            label="任务状态">
                        </el-table-column>
                        <el-table-column
                            prop="teamEditor"
                            label="操作">
                            <template #default="scope">
                                <el-button type="text" size="small" link="true" @click="editTasks(scope.row)">详情</el-button>
                                <!-- <router-link :to="{name:'details',params:{nameId:'123'}}">
                                    <el-link type="text" size="small" link="true">详情</el-link>
                                </router-link> -->
                                <el-button type="text" size="small" @click="delInitiatedTasks(scope.row)"> 删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

                <template v-if="message === 'second'">
                    <div class="searchSelect">
                        <el-select v-model="form.type" placeholder="全部任务状态" size="medium" @change="statusSelectAccepted">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input 
                            placeholder="搜索任务名称" 
                            v-model="queryInfo.query" 
                            clearable 
                            class="input-with-select" 
                            @clear="getTaskListAccepted"
                            size="medium"
                        >
                        </el-input>
                        <el-button icon="el-icon-search" @click="searchNameAccepted" size="medium"></el-button>
                    </div>
                    <el-table :data="acceptedTask.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                        <el-table-column
                            prop="taskName"
                            label="任务名称">
                        </el-table-column>
                        <el-table-column
                            prop="markTeam"
                            label="标注团队">
                        </el-table-column>
                        <el-table-column
                            prop="datasetType"
                            label="数据集类型">
                        </el-table-column>
                        <el-table-column
                            prop="datasetVersion"
                            label="数据集版本">
                        </el-table-column>
                        <el-table-column
                            prop="taskScope"
                            label="标注范围">
                        </el-table-column>
                        <el-table-column
                            prop="creationTime"
                            label="创建时间">
                        </el-table-column>
                        <el-table-column
                            prop="taskStatus"
                            label="任务状态">
                        </el-table-column>
                        <el-table-column
                            prop="teamEditor"
                            label="操作">
                            <template #default="scope">
                                <el-button type="text" size="small" link="true" @click="editTasks(scope.row)">详情</el-button>
                                <el-button type="text" size="small" @click="delAcceptedTask(scope.row)">删除</el-button>
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
    name: "taskManagement",
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
            label: '全部任务状态'
            }, {
            value: '选项2',
            label: '正在创建'
            }, {
            value: '选项3',
            label: '任务失败'
            }, {
            value: '选项4',
            label: '进行中'
            }, {
            value: '选项5',
            label: '正在同步'
            }, {
            value: '选项6',
            label: '已终止'
            }, {
            value: '选项7',
            label: '已完成'
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
            rules: {
                taskName: [{
                    required: true,
                    message: '任务名称不能为空',
                    trigger: 'blur'
                }],
                markTeam: [{
                    required: true,
                    message: '请选择标注团队',
                    trigger: 'change'
                }],
                datasetType: [{
                    required: true,
                    message: '请选择数据集类型',
                    trigger: 'change'
                }],
                datasetVersion: [{
                    required: true,
                    message: '请选择数据集版本',
                    trigger: 'change'
                }],
                taskScope: [{
                    required: true,
                    message: '请至少选择一个标注范围',
                    trigger: 'change'
                }],
            },
            dialogFormVisible: false,
            formLabelWidth: '230px',
            checked1: false,
            checked2: false,
            checked3: false,
            initiatedTasks:[],
            initiatedTasks:JSON.parse(localStorage.getItem('initiatedTasks')) || [],
            allInitiatedTasks:JSON.parse(localStorage.getItem('allInitiatedTasks')) || [],
            acceptedTask:JSON.parse(localStorage.getItem('acceptedTask')) || [],
            allAcceptedTask:JSON.parse(localStorage.getItem('allAcceptedTask')) || [],
            allAcceptedTask: [
                {
                    taskName: "11",
                    markTeam: "华侨城",
                    datasetType:"测试集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"待确认图片",
                    creationTime:"2022-12-06 20:19:25",
                    taskStatus:"已终止",
                },
                {
                    taskName: "22",
                    markTeam: "华侨城",
                    datasetType:"测试集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"未标注图片",
                    creationTime:"2022-06-08 08:20:17",
                    taskStatus:"进行中",
                },
                {
                    taskName: "1122",
                    markTeam: "华侨城",
                    datasetType:"训练集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"已标注图片",
                    creationTime:"2022-03-16 22:04:25",
                    taskStatus:"已完成",
                },
            ],
            acceptedTask: [
                {
                    id:111,
                    taskName: "11",
                    markTeam: "华侨城",
                    datasetType:"测试集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"待确认图片",
                    creationTime:"2022-12-06 20:19:25",
                    taskStatus:"已终止",
                },
                {
                    id:222,
                    taskName: "22",
                    markTeam: "华侨城",
                    datasetType:"测试集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"未标注图片",
                    creationTime:"2022-06-08 08:20:17",
                    taskStatus:"进行中",
                },
                {
                    id:333,
                    taskName: "1122",
                    markTeam: "华侨城",
                    datasetType:"训练集",
                    datasetVersion:"13_15_1(V1)",
                    taskScope:"已标注图片",
                    creationTime:"2022-03-16 22:04:25",
                    taskStatus:"已完成",
                },
            ],
        }
    },
    methods: {
        // 隐藏功能显示
        changeShowTips(){
            this.showTips = !this.showTips
        },
        confirm(dialogForm){
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    const taskObj = {
                        id:nanoid(), 
                        taskName:dialogForm.taskName.trim(), 
                        markTeam:dialogForm.markTeam, 
                        datasetType:dialogForm.datasetType? "测试集":"训练集",
                        datasetVersion:dialogForm.datasetVersion,
                        taskScope:dialogForm.taskScope,
                        creationTime:this.getCurrentTime(),
                        taskStatus:"进行中",
                    }
                    this.allInitiatedTasks.unshift(taskObj)
                    this.initiatedTasks = this.allInitiatedTasks
                    this.dialogFormVisible = false
                    dialogForm.taskName = ''
                    dialogForm.markTeam = ''
                    dialogForm.datasetType = ''
                    dialogForm.datasetVersion = ''
                    dialogForm.taskScope = []
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getCurrentTime() {
			//获取当前时间并打印
			var _this = this;
			let yy = new Date().getFullYear();
			let mm = new Date().getMonth()+1 < 10 ? "0" +(new Date().getMonth()+1) :new Date().getMonth()+1;
			let dd = new Date().getDate() < 10 ? "0" +new Date().getDate() :new Date().getDate();
			let hh = new Date().getHours() < 10 ? "0" +new Date().getHours() : new Date().getHours();
			let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
			let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
			_this.gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
			console.log(_this.gettime) 
			return _this.gettime 
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
        delInitiatedTasks(row){
            this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            
            type: 'warning'
            }).then(() => {
                this.allInitiatedTasks = this.allInitiatedTasks.filter((allInitiatedTask)=>{
                    return allInitiatedTask.id !== row.id
                })
                this.initiatedTasks = this.allInitiatedTasks
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        delAcceptedTask(row){
            this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {                
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            
            type: 'warning'
            }).then(() => {
                this.allAcceptedTask = this.allAcceptedTask.filter((allAcceptedTas)=>{
                    return allAcceptedTas.id !== row.id
                })
                this.acceptedTask = this.allAcceptedTask
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        searchName(){
            this.initiatedTasks = this.allInitiatedTasks
            this.initiatedTasks = this.initiatedTasks.filter(initiatedTask=>{
                return initiatedTask.taskName.indexOf(this.queryInfo.query)!= -1 || 
                        initiatedTask.markTeam.indexOf(this.queryInfo.query) != -1 
            })
            this.queryInfo.query = ''
        },
        searchNameAccepted(){
            this.acceptedTask = this.allAcceptedTask
            this.acceptedTask = this.acceptedTask.filter(acceptedTas=>{
                return acceptedTas.taskName.indexOf(this.queryInfo.query)!= -1 || 
                        acceptedTas.markTeam.indexOf(this.queryInfo.query) != -1 
            })
            this.queryInfo.query = ''
        },
        getTaskList(){
            this.initiatedTasks = this.allInitiatedTasks
        },
        getTaskListAccepted(){
            this.acceptedTask = this.allAcceptedTask
        },
        getList(){
            
            this.getTaskListAccepted()
            this.getTaskList()
        },
        statusSelect(value){
            this.initiatedTasks = this.allInitiatedTasks
            for (let index = 0; index < this.options.length; index++) {
                if (this.options[index].value === value) {
                    this.statusLabel = this.options[index].label
                    break
                }                
            }
            if(this.statusLabel === '全部任务状态'){
                this.initiatedTasks = this.allInitiatedTasks
            }
            else{
                this.initiatedTasks = this.initiatedTasks.filter(initiatedTask=>{
                    return initiatedTask.taskStatus.indexOf(this.statusLabel)!= -1
                })
            }
        },
        statusSelectAccepted(value){
            this.acceptedTask = this.allAcceptedTask
            for (let index = 0; index < this.options.length; index++) {
                if (this.options[index].value === value) {
                    this.statusLabel = this.options[index].label
                    break
                }                
            }
            if(this.statusLabel === '全部任务状态'){
                this.acceptedTask = this.allAcceptedTask
            }
            else{
                this.acceptedTask = this.acceptedTask.filter(acceptedTas=>{
                    return acceptedTas.taskStatus.indexOf(this.statusLabel)!= -1
                })
            }
        },
        editTasks(row){
            console.log(row.id);
            // window.open('/#/data/task-manage/details/initiated/'+row.id, '_blank')
            this.$router.push({name:'details',params: {nameId:row.id}})
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
                this.initiatedTasks = this.allInitiatedTasks
                this.queryInfo.total = this.initiatedTasks.length
            }else {
                this.acceptedTask = this.allAcceptedTask
                this.queryInfo.total = this.acceptedTask.length
            }
        },
    },
    watch:{
        initiatedTasks:{
            deep:true,
            handler(value){
                localStorage.setItem('initiatedTasks',JSON.stringify(value))
                this.queryInfo.total = this.initiatedTasks.length
            }
        },
        allInitiatedTasks:{
            deep:true,
            handler(value){
                localStorage.setItem('allInitiatedTasks',JSON.stringify(value))
                this.queryInfo.total = this.initiatedTasks.length
            }
        },
        acceptedTask:{
            deep:true,
            handler(value){
                localStorage.setItem('acceptedTask',JSON.stringify(value))
                this.queryInfo.total = this.acceptedTask.length
            }
        },
        allAcceptedTask:{
            deep:true,
            handler(value){
                localStorage.setItem('allAcceptedTask',JSON.stringify(value))
                this.queryInfo.total = this.acceptedTask.length
            }
        },
    },
    mounted() {
        this.initiatedTasks = this.allInitiatedTasks
        this.acceptedTask = this.allAcceptedTask
    },
    updated() {
        if(!this.condition){
            this.queryInfo.total = this.initiatedTasks.length
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

