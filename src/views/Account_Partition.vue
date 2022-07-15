<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i>企业管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>数据分区管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <span class="pageTitle">数据分区管理</span>
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
                    <el-alert title="这里您可看到已创建的所有的分区并进行跨分区数据的操作和管理。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>
            <div>
                <div class="searchSelect">
                    <el-button size="medium" type="primary" class="button-with-create" @click="dialogFormVisible = true">
                        <i class="el-icon-circle-plus-outline el-icon--left"></i>
                        创建分区
                    </el-button>
                </div>
                <el-dialog title="创建分区" v-model="dialogFormVisible" @close="cancelDialog(dialogForm)">
                    <el-form :model="dialogForm" :rules="rules" ref="dialogForm" >
                        <el-form-item label="分区名称" :label-width="formLabelWidth" prop="partitionName">
                            <el-row><el-col :span="20">
                                <el-input v-model="dialogForm.partitionName" autocomplete="off"  placeholder="请输入分区名称"></el-input>
                            </el-col></el-row>
                        </el-form-item>
                        <div style="margin: 30px 0;"></div>
                        <el-form-item label="描述" :label-width="formLabelWidth" prop="partitionDescription">
                            <el-row><el-col :span="20">
                                <el-input 
                                    type="textarea"
                                    v-model="dialogForm.partitionDescription" 
                                    autocomplete="off" 
                                    :autosize="{ minRows: 6, maxRows: 10}" 
                                    placeholder="请输入分区描述" 
                                    maxlength="500"
                                    show-word-limit
                                ></el-input>
                            </el-col></el-row>
                        </el-form-item>
                        <div style="margin: 40px 0;"></div>
                    </el-form>
                    <div class="dialog-footer">
                        <el-button size="medium" @click="cancelDialog(dialogForm)">取 消</el-button>
                        <el-button size="medium" type="primary" @click="confirm(dialogForm)">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="数据合并至" v-model="dialogMergeVisible" @close="cancelDialogMerge">
                    <el-form :model="dialogForm" ref="dialogMerge" >
                        <el-form-item label="请选择分区" :label-width="mergeLabelWidth" prop="">
                        </el-form-item>
                        <el-form-item>
                            <el-radio-group v-model="dialogMerge" :label-width="mergeLabelWidth">
                                <div>
                                    <el-radio label="默认分区">
                                        <span>默认分区</span>
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="吊装合规性识别">
                                        <span>吊装合规性识别</span>
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="test1分区">
                                        <span>test1分区</span>
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="test2分区">
                                        <span>test2分区</span>
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>

                        <div style="margin: 40px 0;"></div>
                    </el-form>
                    <div class="dialog-footer">
                        <el-button size="medium" @click="cancelDialogMerge">取 消</el-button>
                        <el-button size="medium" type="primary" @click="confirmMerge(dialogMerge)">确 定</el-button>
                    </div>
                </el-dialog>
                <el-table :data="partitionGroup.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                    <el-table-column
                        prop="partitionName"
                        label="分区名称">
                    </el-table-column>
                    <el-table-column
                        prop="partitionDescription"
                        label="分区描述">
                    </el-table-column>
                    <el-table-column
                        prop="associatedGroup"
                        label="关联用户组">
                    </el-table-column>
                    <el-table-column
                        prop="teamEditor"
                        label="操作">
                        <template #default="scope">
                            <el-button type="text" size="small" link="true" @click="editPartition(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="delPartition(scope.row)"> 删除</el-button>
                            <el-button type="text" size="small" @click="dataMerge(scope.row)"> 分区数据合并</el-button>
                        </template>
                    </el-table-column>
                </el-table>
				
            </div>
        </div>
        <el-row  class="child">
            <el-col :span="24" class="paginations"  v-if="queryInfo.total">
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
    name: "partition",
    data() {
        return {
            input:'',
            showTips: true,
            isEdit:false,
            rowId:'',
            rowAssociatedGroup:[],
            condition:false,
            mergeRowName:'',
            mergeGroup:[],
            queryInfo:{
                //查询参数
                query: '',
                // 当前页码
                currentPage: 1,
                // 每页显示条数
                pagesize: 5,
                total:0,
            },
            dialogForm: {
                partitionName:'',
                partitionDescription:'',
                associatedGroup:[],
            },
            dialogMerge: '',
            rules: {
                partitionName: [{
                    required: true,
                    message: '分区名称不能为空',
                    trigger: 'blur'
                }],
            },
            dialogFormVisible: false,
            dialogMergeVisible: false,
            formLabelWidth: '230px',
            mergeLabelWidth: '150px',
            partitionGroup:[],
            partitionGroup:JSON.parse(localStorage.getItem('partitionGroup')) || [],
            allPartitionGroup:JSON.parse(localStorage.getItem('partitionGroup')) || [],
            allPartitionGroup:[
                {
                    id:1,
                    partitionName:"吊装合规性识别",
                    partitionDescription:"test",
                    associatedGroup:[],
                },
                {
                    id:2,
                    partitionName:"默认分区",
                    partitionDescription:"",
                    associatedGroup:["国信科技大厦标注组","桂圆中学_天安数码城标注组",
                                    "莱荣站房_光明区委党校标注组","丹阳眼镜城_华侨城标注组",
                                    "AI工程师","扬帆时光塔_ICT标注组","渤海湾标注组",
                                    "北京城市副中心标注组","信达标注组"],
                },
                {
                    id:3,
                    partitionName:"test1分区",
                    partitionDescription:"",
                    associatedGroup:["国信科技大厦标注组"],
                },
                {
                    id:4,
                    partitionName:"test2分区",
                    partitionDescription:"",
                    associatedGroup:["北京城市副中心标注组","信达标注组"],
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
                    if(this.isEdit){
                        this.clearEditData(this.rowId)
                    }
                    const taskObj = {
                        id:nanoid(), 
                        partitionName:dialogForm.partitionName.trim(), 
                        partitionDescription:dialogForm.partitionDescription || "--", 
                        associatedGroup:this.rowAssociatedGroup
                    }
                    this.allPartitionGroup.unshift(taskObj)
                    this.partitionGroup = this.allPartitionGroup
                    this.dialogFormVisible = false
                    dialogForm.partitionName = ''
                    dialogForm.partitionDescription = ''
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelDialog(dialogForm){
            this.dialogFormVisible = false
            dialogForm.partitionName = ''
            dialogForm.partitionDescription = ''
        },
        confirmMerge(dialogMerge){
            this.dialogMergeVisible = false
            for (let i = 0; i < this.allPartitionGroup.length; i++) {
                if(this.allPartitionGroup[i].partitionName == dialogMerge){
                    for (let j = 0; j < this.allPartitionGroup.length; j++) {
                        if(this.allPartitionGroup[j].partitionName == this.mergeRowName){
                            console.log(this.allPartitionGroup[j].associatedGroup);
                            this.mergeGroup = this.allPartitionGroup[j].associatedGroup
                            console.log(this.mergeGroup);
                            this.allPartitionGroup[i].associatedGroup = this.allPartitionGroup[i].associatedGroup.concat(this.mergeGroup)
                            console.log(this.allPartitionGroup[i].associatedGroup);
                            this.clearEditData(this.allPartitionGroup[j].id)
                        }
                    }
                }
            }

        },
        cancelDialogMerge(){
            this.dialogMergeVisible = false
            this.dialogMerge = ''
        },
        delPartition(row){
            this.$confirm('确定删除分区？', '删除分区', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.allPartitionGroup = this.allPartitionGroup.filter((allPartitionGrou)=>{
                    return allPartitionGrou.id !== row.id
                })
                this.partitionGroup = this.allPartitionGroup
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        dataMerge(row){
            this.dialogMergeVisible = true
            this.mergeRowName = row.partitionName
        },
        getTaskList(){
            console.log("getTaskList");
            this.initiatedTasks = this.allInitiatedTasks
        },
        getTaskListAccepted(){
            console.log("getTaskListAccepted");
            this.acceptedTask = this.allAcceptedTask
        },
        getList(){
            this.getTaskList()
            this.getTaskListAccepted()
        },
        clearEditData(id){
            this.allPartitionGroup = this.allPartitionGroup.filter((allPartitionGrou)=>{
                return allPartitionGrou.id !== id
            })
            this.partitionGroup = this.allPartitionGroup
        },
        editPartition(row){
            this.isEdit = true
            this.rowId = ''
            this.rowId = row.id
            this.rowAssociatedGroup = row.associatedGroup
            this.dialogFormVisible = true
            this.dialogForm.partitionName = row.partitionName
            this.dialogForm.partitionDescription = row.partitionDescription
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
        },
        handleCurrentChange(newPage) {
            this.queryInfo.currentPage = newPage
        },
    },
    watch:{
        partitionGroup:{
            deep:true,
            handler(value){
                localStorage.setItem('partitionGroup',JSON.stringify(value))
                this.queryInfo.total = this.partitionGroup.length
            }
        },
        allPartitionGroup:{
            deep:true,
            handler(value){
                localStorage.setItem('allPartitionGroup',JSON.stringify(value))
            }
        },
    },
    mounted() {
        this.partitionGroup = this.allPartitionGroup
    },
    updated() {
        if(!this.condition){
            this.queryInfo.total = this.partitionGroup.length
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
.button-with-create{
    float:left;
    margin-left:5px;
    margin-bottom:10px;
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
.el-radio-group{
    margin-left:150px;
    margin-top: -20px;
}
.el-radio{
    margin-top: 20px;
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

