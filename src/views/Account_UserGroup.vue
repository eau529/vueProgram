<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i>企业管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户组管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <span class="pageTitle">用户组管理</span>
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
                    <el-alert title="用户组管理-通过创建并将子账户加入用户组的方式为子账户赋予不同的权限。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>
            <div>
                <div class="searchSelect">
                    <el-button size="medium" type="primary" class="button-with-create" @click="dialogFormVisible = true">
                        <i class="el-icon-circle-plus-outline el-icon--left"></i>
                        创建用户组
                    </el-button>
					<span style="float:right">
					<el-select v-model="form.type" placeholder="不限用户组类型" size="medium" @change="typeSelect">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<el-input 
						placeholder="搜索用户组名称" 
						v-model="queryInfo.query" 
						clearable 
						class="input-with-select" 
						@clear="getTaskList"
						size="medium"
					>
					</el-input>
					<el-button icon="el-icon-search" @click="searchGroupName" size="medium"></el-button>
					</span>
                </div>
                <el-dialog title="创建用户组" v-model="dialogFormVisible" @close="cancelDialog(dialogForm)">
                    <el-form :model="dialogForm" :rules="rules" ref="dialogForm" >
                        <el-form-item label="用户组名称" :label-width="formLabelWidth" prop="userGroupName">
							<el-input v-model="dialogForm.userGroupName" autocomplete="off" req></el-input>
						</el-form-item>
						<el-form-item label="用户组类型" :label-width="formLabelWidth" prop="userGroupType">
                        </el-form-item>
						<el-form-item>
							<el-radio-group v-model="dialogForm.userGroupType" :label-width="formLabelWidth">
								<div>
                                    <el-radio label="AI工程师">
                                        <span>AI工程师</span>
                                    </el-radio>
                                </div>
								<div>
                                    <el-radio label="标注员">
                                        <span>标注员</span>
                                    </el-radio>
                                </div>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="关联分区" :label-width="formLabelWidth" prop="associatedPartition">
						</el-form-item>
						<el-form-item>
							<el-checkbox-group v-model="dialogForm.associatedPartition" :label-width="formLabelWidth">
								<div>
									<el-checkbox v-model="checked1" label="吊装合规性识别">
										<span>吊装合规性识别</span>
									</el-checkbox>
								</div>
								<div>
									<el-checkbox v-model="checked2" label="默认分区">
										<span>默认分区</span>
									</el-checkbox>
								</div>
							</el-checkbox-group>
						</el-form-item>
                        <el-form-item label="描述" :label-width="formLabelWidth" prop="groupDescription">
                            <el-row><el-col :span="20">
                                <el-input 
                                    type="textarea"
                                    v-model="dialogForm.groupDescription" 
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
                <el-dialog title="管理用户组" v-model="dialogMergeVisible" @close="cancelDialogMerge">
					<el-form :model="dialogMerge" :rules="rules" ref="dialogMerge">
						<el-form-item label="" prop="teamMembers">
							<el-table
								:data="members"
								@selection-change="selectionLineChangeHandle"
								height="300"
								border
								style="width: 100%">
								<el-table-column
								type="selection"
								width="55">
								</el-table-column>
								<el-table-column
								prop="name"
								label="子账号名"
								width="180">
								</el-table-column>
								<el-table-column
								prop="nickName"
								label="昵称"
								width="180">
								</el-table-column>
								<el-table-column
								prop="userGroup"
								label="用户组">
								</el-table-column>
								<el-table-column
								prop="status"
								label="启用状态">
								</el-table-column>
							</el-table>
						</el-form-item>
						<div class="dialog-footer">
							<div style="margin: 8px 0;"></div>
							<el-button size="medium" @click="cancelDialogMerge">取 消</el-button>
							<el-button size="medium" type="primary" @click="confirmDialogMerge(dialogMerge)">确 定</el-button>
						</div>
					</el-form>
				</el-dialog>
                <el-table :data="userGroup.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                    <el-table-column
                        prop="userGroupName"
                        label="用户组名称">
                    </el-table-column>
                    <el-table-column
                        prop="userGroupType"
                        label="用户组类型">
                    </el-table-column>
                    <el-table-column
                        prop="associatedPartition"
                        label="关联分区">
                    </el-table-column>
					<el-table-column
						prop="groupDescription"
						label="描述">
					</el-table-column>
					<el-table-column
						prop="submitTime"
						label="提交时间">
					</el-table-column>
                    <el-table-column
                        prop="teamEditor"
                        label="操作">
                        <template #default="scope">
							<el-button type="text" size="small" @click="dataMerge(scope.row)"> 管理用户组</el-button>
                            <el-button type="text" size="small" link="true" @click="editGroup(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="delGroup(scope.row)"> 删除</el-button>
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
    name: "userGroup",
    data() {
        return {
            input:'',
            showTips: true,
            isEdit:false,
            rowId:'',
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
			options: [{
            value: '不限用户组类型',
            label: '不限用户组类型'
            }, {
            value: 'AI工程师',
            label: 'AI工程师'
            }, {
            value: '标注员',
            label: '标注员'
            }],
            form: {
                type:'不限用户组类型'
            },
            dialogForm: {
                userGroupName:'',
                userGroupType:'',
                associatedPartition:[],
				groupDescription:'',
            },
            dialogMerge: '',
            rules: {
                userGroupName: [{
                    required: true,
                    message: '用户组名称不能为空',
                    trigger: 'blur'
                }],
                associatedPartition: [{
                    required: true,
                    message: '请选择管理分类',
                    trigger: 'change'
                }],
            },
			members: [
				{
				name: 'xdsisheng',
				nickName: '标注员司胜',
				userGroup: '信达标注组',
				status: '启用中',
				},
				{
				name: 'xddouxiuxian',
				nickName: '标注员窦修贤',
				userGroup: '信达标注组',
				status: '启用中',
				},
				{
				name: 'bhhaopengzheng',
				nickName: '标注员郝鹏正',
				userGroup: '渤海湾标注组',
				status: '启用中',
				},
				{
				name: 'bhqinhuakui',
				nickName: '标注员秦华奎',
				userGroup: '渤海湾标注组',
				status: '启用中',
				},
				{
				name: 'bjyaohaofan',
				nickName: 'AI工程师姚皓凡',
				userGroup: 'AI工程师',
				status: '启用中',
				},
				{
				name: 'xdzhanghe',
				nickName: 'AI工程师张鹤',
				userGroup: 'AI工程师',
				status: '启用中',
				},
				{
				name: 'yfdenglei',
				nickName: 'AI工程师邓磊',
				userGroup: 'AI工程师',
				status: '启用中',
				},
			],
            dialogFormVisible: false,
            dialogMergeVisible: false,
            formLabelWidth: '230px',
            mergeLabelWidth: '150px',
            userGroup:[],
            userGroup:JSON.parse(localStorage.getItem('userGroup')) || [],
            allUserGroup:JSON.parse(localStorage.getItem('allUserGroup')) || [],
            allUserGroup:[
                {
                    id:1,
                    userGroupName:"国信科技大厦标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-28 15:03",
                },
                {
                    id:2,
                    userGroupName:"桂圆中学_天安数码城标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-28 10:38",
                },
                {
                    id:3,
                    userGroupName:"莱荣站房_光明区委党校标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-27 19:18",
                },
                {
                    id:4,
                    userGroupName:"丹阳眼镜城_华侨城标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-27 14:36",
                },
                {
                    id:5,
                    userGroupName:"AI工程师",
                    userGroupType:"AI工程师",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-27 14:34",
                },
                {
                    id:6,
                    userGroupName:"扬帆时光塔_ICT标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-27 14:30",
                },
                {
                    id:7,
                    userGroupName:"渤海湾标注组",
                    userGroupType:"标注员",
                    associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-02-27 14:23",
                }, {
					id:8,
					userGroupName:"华侨城标注组",
					userGroupType:"标注员",
					associatedPartition:"默认分区",
					groupDescription:"--",
					submitTime:"2022-07-14 09:34:41",
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
						this.isEdit = false
                    }
                    const taskObj = {
                        id:nanoid(), 
                        userGroupName:dialogForm.userGroupName.trim(), 
                        userGroupType:dialogForm.userGroupType, 
                        associatedPartition:dialogForm.associatedPartition, 
                        groupDescription:dialogForm.groupDescription || "--", 
						submitTime:this.getCurrentTime()
                    }
                    this.allUserGroup.unshift(taskObj)
                    this.userGroup = this.allUserGroup
                    this.cancelDialog(dialogForm)
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
		selectionLineChangeHandle(selectObj){
			this.dataonLineListSelections = selectObj
		},
        cancelDialog(dialogForm){
            this.dialogFormVisible = false
            dialogForm.userGroupName = ''
            dialogForm.userGroupType = ''
            dialogForm.associatedPartition = []
            dialogForm.groupDescription = ''
        },
		confirmDialogMerge(){
			this.dialogMergeVisible = false
		},
		cancelDialogMerge(){
            this.dialogMergeVisible = false
            this.dataonLineListSelections = []
			// this.$refs[dialogMerge].resetFields();
        },
        delGroup(row){
            this.$confirm('确定删除用户组？', '删除用户组', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.allUserGroup = this.allUserGroup.filter((allUserGrou)=>{
                    return allUserGrou.id !== row.id
                })
                this.userGroup = this.allUserGroup
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
            this.userGroup = this.allUserGroup
        },
        getList(){
            this.getTaskList()
            this.getTaskListAccepted()
        },
        clearEditData(id){
            this.allUserGroup = this.allUserGroup.filter((allUserGrou)=>{
                return allUserGrou.id !== id
            })
            this.userGroup = this.allUserGroup
        },
        editGroup(row){
            this.isEdit = true
            this.rowId = ''
            this.rowId = row.id
            this.dialogFormVisible = true
            this.dialogForm.userGroupName = row.userGroupName
            this.dialogForm.userGroupType = row.userGroupType
			console.log(row.associatedPartition);
            this.dialogForm.associatedPartition = row.associatedPartition
			console.log(this.dialogForm.associatedPartition);
            this.dialogForm.groupDescription = row.groupDescription
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
        },
        handleCurrentChange(newPage) {
            this.queryInfo.currentPage = newPage
        },
		typeSelect(value){
			this.userGroup = this.allUserGroup
            if(value === '不限用户组类型'){
                this.userGroup = this.allUserGroup
            }else{
                this.userGroup = this.userGroup.filter(userGrou=>{
                    return userGrou.userGroupType.indexOf(value)!= -1
                })
            }
        },
		searchGroupName(){
            this.userGroup = this.allUserGroup
            this.userGroup = this.userGroup.filter(userGrou=>{
                return userGrou.userGroupName.indexOf(this.queryInfo.query)!= -1 
            })
            this.queryInfo.query = ''
        },
    },
    watch:{
        userGroup:{
            deep:true,
            handler(value){
                localStorage.setItem('userGroup',JSON.stringify(value))
                this.queryInfo.total = this.userGroup.length
            }
        },
        allUserGroup:{
            deep:true,
            handler(value){
                localStorage.setItem('allUserGroup',JSON.stringify(value))
            }
        },
    },
    mounted() {
        this.userGroup = this.allUserGroup
    },
    updated() {
        if(!this.condition){
            this.queryInfo.total = this.userGroup.length
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

