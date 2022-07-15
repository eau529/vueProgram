<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i> 数据标注
                </el-breadcrumb-item>
                <el-breadcrumb-item>多人标注</el-breadcrumb-item>
                <el-breadcrumb-item>团队管理</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="container">
			<div>
			<span class="pageTitle">团队管理</span>
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
                    <el-alert title="这里展示的是您创建的所有多人标注团队。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>
			<el-tabs v-model="team" @tab-click="changeQueryInfo(team)">
				<el-tab-pane :label="`所有团队(${allAllTeam.length})`" name="first">
				</el-tab-pane>
				<el-tab-pane :label="`标注中(${allInMarkTeam.length})`" name="second">
				</el-tab-pane>
				<el-tab-pane :label="`空闲中(${allSpareTeam.length})`" name="third">
				</el-tab-pane>
			</el-tabs>
			<el-dialog title="创建团队" v-model="dialogFormVisible" @close="clearDialog(dialogForm)">
				<el-form :model="dialogForm" :rules="rules" ref="dialogForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="团队名称" prop="teamName">
								<el-input v-model="dialogForm.teamName" autocomplete="off" req></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="团队描述" prop="teamDiscription">
								<el-input v-model="dialogForm.teamDiscription" autocomplete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="团队成员" prop="teamMembers">
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
							prop="tel"
							label="手机号">
							</el-table-column>
							<el-table-column
							prop="userGroup"
							label="用户组">
							</el-table-column>
						</el-table>
					</el-form-item>

					<div class="dialog-footer">
						<el-button size="medium" @click="cancelDialog(dialogForm)">取 消</el-button>
						<el-button size="medium" type="primary" @click="confirm(dialogForm)">确 定</el-button>
					</div>
				</el-form>
			</el-dialog>
			<div>
				<template v-if="team === 'first'">
					<div class="searchSelect">
						<el-input 
							placeholder="搜索团队名称" 
							v-model="queryInfo.query" 
							clearable 
							@clear="getTaskListAll"
							class="input-with-select" 
							size="medium"
						>
						</el-input>
						<el-button icon="el-icon-search" size="medium" @click="searchNameAll"></el-button>
						<el-button size="medium" type="primary" class="button-with-createTeam" @click="dialogFormVisible = true">
							<i class="el-icon-circle-plus-outline el-icon--left"></i>
							创建团队
						</el-button>
					</div>
					<el-table :data="allTeam.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
						<el-table-column prop="teamName" label="团队名称">
						</el-table-column>
						<el-table-column prop="teamDiscription" label="团队描述">
						</el-table-column>
						<el-table-column prop="teamNumber" label="成员数">
						</el-table-column>
						<el-table-column prop="teamTagStatus" label="标注状态">
						</el-table-column>
						<el-table-column prop="teamEditor" label="操作">
							<template #default="scope">
								<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
								<el-button type="text" size="small" @click="delAllTask(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<template v-if="team === 'second'">
					<div class="searchSelect">
						<el-input 
							placeholder="搜索团队名称" 
							v-model="queryInfo.query" 
							clearable 
							class="input-with-select" 
							@clear="getTaskListInMark"
							size="medium"
						>
						</el-input>
						<el-button icon="el-icon-search" size="medium" @click="searchNameInMark"></el-button>
						<el-button size="medium" type="primary" class="button-with-createTeam" @click="dialogFormVisible = true">
							<i class="el-icon-circle-plus-outline el-icon--left"></i>
							创建团队
						</el-button>
					</div>
					<el-table :data="inMarkTeam.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
						<el-table-column prop="teamName" label="团队名称">
						</el-table-column>
						<el-table-column prop="teamDiscription" label="团队描述">
						</el-table-column>
						<el-table-column prop="teamNumber" label="成员数">
						</el-table-column>
						<el-table-column prop="teamTagStatus" label="标注状态">
						</el-table-column>
						<el-table-column prop="teamEditor" label="操作">
							<template #default="scope">
								<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
								<el-button type="text" size="small" @click="delAllTask(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<template v-if="team === 'third'">
					<div class="searchSelect">
						<el-input 
							placeholder="搜索团队名称" 
							v-model="queryInfo.query" 
							clearable 
							class="input-with-select" 
							@clear="getTaskListSpare"
							size="medium"
						>
						</el-input>
						<el-button icon="el-icon-search" size="medium" @click="searchNameSpare"></el-button>
						<el-button size="medium" type="primary" class="button-with-createTeam" @click="dialogFormVisible = true">
							<i class="el-icon-circle-plus-outline el-icon--left"></i>
							创建团队
						</el-button>
					</div>
					<el-table :data="spareTeam.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
						<el-table-column prop="teamName" label="团队名称">
						</el-table-column>
						<el-table-column prop="teamDiscription" label="团队描述">
						</el-table-column>
						<el-table-column prop="teamNumber" label="成员数">
						</el-table-column>
						<el-table-column prop="teamTagStatus" label="标注状态">
						</el-table-column>
						<el-table-column prop="teamEditor" label="操作">
							<template #default="scope">
								<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
								<el-button type="text" size="small" @click="delAllTask(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</div>
		</div>
		<el-row  class="child">
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
import {ref,reactive} from "vue";
	export default {
		name: "tabs",
		setup() {
			const team = ref("first");
			const handleEdit = (index) => {
				console.log("handleEdit");
			};
			const handleDel = (index) => {
				console.log("handleDel");
			};
			return {
				team,
				handleEdit,
				handleDel,
			};
		},
		data() {
			return {
				input: '',
				showTips: true,
				isEdit:false,
				editStatus:'',
				rowId:'',
				condition:false,
				dialogForm: {
					teamName: '',
					teamDiscription: '',
				},
				dataonLineListSelections: [],
				queryInfo:{
					//查询参数
					query: '',
					// 当前页码
					currentPage: 1,
					// 每页显示条数
					pagesize: 5,
					total: 0,
				},
				members: [
					{
					name: 'xdsisheng',
					nickName: '标注员司胜',
					tel: '--',
					userGroup: '信达标注组'
					},
					{
					name: 'xddouxiuxian',
					nickName: '标注员窦修贤',
					tel: '--',
					userGroup: '信达标注组'
					},
					{
					name: 'bhhaopengzheng',
					nickName: '标注员郝鹏正',
					tel: '--',
					userGroup: '渤海湾标注组'
					},
					{
					name: 'bhqinhuakui',
					nickName: '标注员秦华奎',
					tel: '--',
					userGroup: '渤海湾标注组'
					},
					{
					name: 'bjyaohaofan',
					nickName: 'AI工程师姚皓凡',
					tel: '--',
					userGroup: 'AI工程师'
					},
					{
					name: 'xdzhanghe',
					nickName: 'AI工程师张鹤',
					tel: '--',
					userGroup: 'AI工程师'
					},
					{
					name: 'yfdenglei',
					nickName: 'AI工程师邓磊',
					tel: '--',
					userGroup: 'AI工程师'
					},
				],
				dialogFormVisible: false,
				formLabelWidth: '230px',
				// AllteamMembers: generateData(),
				teamMembers: [],
				rules: {
					teamName: [{
						required: true,
						message: '团队名称不能为空',
						trigger: 'blur'
					},]
				},
				allTeam:JSON.parse(localStorage.getItem('allTeam')) || [],
				allAllTeam:JSON.parse(localStorage.getItem('allAllTeam')) || [],
				inMarkTeam:JSON.parse(localStorage.getItem('inMarkTeam')) || [],
				allInMarkTeam:JSON.parse(localStorage.getItem('allInMarkTeam')) || [],
				spareTeam:JSON.parse(localStorage.getItem('spareTeam')) || [],
				allSpareTeam:JSON.parse(localStorage.getItem('allSpareTeam')) || [],
				// allAllTeam: [
					// {
					// 	teamName: "华侨城",
					// 	teamDiscription: "--",
					// 	teamNumber: "3",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "天安数码城",
					// 	teamDiscription: "AI标注",
					// 	teamNumber: "2",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "华侨城",
					// 	teamDiscription: "AI标注",
					// 	teamNumber: "6",
					// 	teamTagStatus: "标注中",
					// },
					// {
					// 	teamName: "消防器材标注_时光塔",
					// 	teamDiscription: "--",
					// 	teamNumber: "4",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "混凝土振捣",
					// 	teamDiscription: "--",
					// 	teamNumber: "5",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "信达项目",
					// 	teamDiscription: "--",
					// 	teamNumber: "2",
					// 	teamTagStatus: "标注中",
					// }
				// ],
				// allInMarkTeam: [
					// {
					// 	teamName: "华侨城",
					// 	teamDiscription: "--",
					// 	teamNumber: "3",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "天安数码城",
					// 	teamDiscription: "AI标注",
					// 	teamNumber: "2",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "消防器材标注_时光塔",
					// 	teamDiscription: "--",
					// 	teamNumber: "4",
					// 	teamTagStatus: "空闲中",
					// },
					// {
					// 	teamName: "混凝土振捣",
					// 	teamDiscription: "--",
					// 	teamNumber: "5",
					// 	teamTagStatus: "空闲中",
					// }
				// ],
				// allSpareTeam: [
					// {
					// 	teamName: "信达项目",
					// 	teamDiscription: "--",
					// 	teamNumber: "2",
					// 	teamTagStatus: "标注中",
					// }
				// ],
			}
		},
		methods: {
			// 隐藏功能显示
			changeShowTips(){
				this.showTips = !this.showTips
			},
			confirm(dialogForm) {
				this.$refs.dialogForm.validate((valid) => {
					if (valid) {
						const taskObj = {
							id: nanoid(),
							teamName: dialogForm.teamName,
							teamDiscription: dialogForm.teamDiscription || "--",
							teamNumber: this.dataonLineListSelections.length,
							teamTagStatus: "空闲中",
						}
						if(this.isEdit){
							this.clearEditData(this.rowId, this.editStatus)
							taskObj.teamTagStatus = this.editStatus
						}
						if(taskObj.teamTagStatus == "空闲中"){
							this.allSpareTeam.unshift(taskObj)
						}else{
							this.allInMarkTeam.unshift(taskObj)
						}
						this.allAllTeam.unshift(taskObj)
						this.dialogFormVisible = false
						dialogForm.teamName = ''
						dialogForm.teamDiscription = ''
						this.dataonLineListSelections = []
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			clearEditData(id, editStatus){
				if(editStatus == "标注中"){
					this.allInMarkTeam = this.allInMarkTeam.filter((allInMarkTea)=>{
						return allInMarkTea.id !== id
					})
					this.inMarkTeam = this.allInMarkTeam
				}else{
					this.allSpareTeam = this.allSpareTeam.filter((allSpareTea)=>{
						return allSpareTea.id !== id
					})
					this.spareTeam = this.allSpareTeam
				}
				this.allAllTeam = this.allAllTeam.filter((allAllTea)=>{
					return allAllTea.id !== id
				})
				this.allTeam = this.allAllTeam
			},
			selectionLineChangeHandle(selectObj){
				this.dataonLineListSelections = selectObj
			},
			cancelDialog(dialogForm){
				this.dialogFormVisible = false
				dialogForm.teamName = ''
				dialogForm.teamDiscription = ''
				this.dataonLineListSelections = []
			},
			delAllTask(row){
				this.$confirm('确定删除团队？', '删除团队', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					if(row.teamTagStatus == "标注中"){
						this.allInMarkTeam = this.allInMarkTeam.filter((allInMarkTea)=>{
							return allInMarkTea.id !== row.id
						})
						this.inMarkTeam = this.allInMarkTeam
					}else{
						this.allSpareTeam = this.allSpareTeam.filter((allSpareTea)=>{
							return allSpareTea.id !== row.id
						})
						this.spareTeam = this.allSpareTeam
					}
					this.allAllTeam = this.allAllTeam.filter((allAllTea)=>{
						return allAllTea.id !== row.id
					})
					this.allTeam = this.allAllTeam
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			// delInMarkTask(row){
			// 	this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {                
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// 	}).then(() => {
			// 		this.allInMarkTeam = this.allInMarkTeam.filter((allInMarkTea)=>{
			// 			return allInMarkTea.id !== row.id
			// 		})
			// 		this.inMarkTeam = this.allInMarkTeam
			// 	}).catch(() => {
			// 		this.$message({
			// 			type: 'info',
			// 			message: '已取消删除'
			// 		});          
			// 	});
			// },
			// delSpareTask(row){
			// 	this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {                
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// 	}).then(() => {
			// 		this.allSpareTeam = this.allSpareTeam.filter((allSpareTea)=>{
			// 			return allSpareTea.id !== row.id
			// 		})
			// 		this.spareTeam = this.allSpareTeam
			// 	}).catch(() => {
			// 		this.$message({
			// 			type: 'info',
			// 			message: '已取消删除'
			// 		});          
			// 	});
			// },
			searchNameAll(){
				this.allTeam = this.allAllTeam
				this.allTeam = this.allTeam.filter(allTea=>{
					return allTea.teamName.indexOf(this.queryInfo.query)!= -1
				})
				this.queryInfo.query = ''
			},
			searchNameInMark(){
				this.inMarkTeam = this.allInMarkTeam
				this.inMarkTeam = this.inMarkTeam.filter(inMarkTea=>{
					return inMarkTea.teamName.indexOf(this.queryInfo.query)!= -1
				})
				this.queryInfo.query = ''
			},
			searchNameSpare(){
				this.spareTeam = this.allSpareTeam
				this.spareTeam = this.spareTeam.filter(spareTea=>{
					return spareTea.teamName.indexOf(this.queryInfo.query)!= -1
				})
				this.queryInfo.query = ''
			},
			getTaskListAll(){
				this.allTeam = this.allAllTeam
			},
			getTaskListInMark(){
				this.inMarkTeam = this.allInMarkTeam
			},
			getTaskListSpare(){
				this.spareTeam = this.allSpareTeam
			},
			getList(){
				this.getTaskListAll()
				this.getTaskListInMark()
				this.getTaskListSpare()
			},
			getTotal(){
				console.log(this.team);
				if(this.team == "first"){
					return this.allAllTeam.length
				}else if(this.team == "second"){
					return this.allInMarkTeam.length
				}else{
					return this.allSpareTeam.length
				}
			},
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
			},
			handleCurrentChange(newPage) {
				this.queryInfo.currentPage = newPage
			},
			changeQueryInfo(team){
				console.log("changeQueryInfo");
				console.log(team);
				if(team == "first"){
					this.allTeam = this.allAllTeam
					this.queryInfo.total = this.allTeam.length
				}else if (team == "second") {
					this.inMarkTeam = this.allInMarkTeam
					this.queryInfo.total = this.inMarkTeam.length
				}else {
					this.spareTeam = this.allSpareTeam
					this.queryInfo.total = this.spareTeam.length
				}
				// this.getList();
			},
			handleEdit(row){
				this.isEdit = true
				this.rowId = ''
				this.rowId = row.id
				this.editStatus = ''
				this.editStatus = row.teamTagStatus
				this.dialogFormVisible = true
				this.dialogForm.teamName = row.teamName
				this.dialogForm.teamDiscription = row.teamDiscription
			},
			clearDialog(dialogForm){
				this.dialogFormVisible = false
				dialogForm.teamName = ''
				dialogForm.teamDiscription = ''
				this.dataonLineListSelections = []
			},
		},
		watch:{
			allTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('allTeam',JSON.stringify(value))
					this.queryInfo.total = this.allTeam.length
				}
			},
			allAllTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('allAllTeam',JSON.stringify(value))
				}
			},
			inMarkTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('inMarkTeam',JSON.stringify(value))
					this.queryInfo.total = this.inMarkTeam.length
				}
			},
			allInMarkTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('allInMarkTeam',JSON.stringify(value))
				}
			},
			spareTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('spareTeam',JSON.stringify(value))
					this.queryInfo.total = this.spareTeam.length
				}
			},
			allSpareTeam:{
				deep:true,
				handler(value){
					localStorage.setItem('allSpareTeam',JSON.stringify(value))
				}
			},
		},
		mounted() {
			this.allTeam = this.allAllTeam
			this.allInMarkTeam = []
			this.allSpareTeam = []
			for (let i = 0; i < this.allAllTeam.length; i++) {
				if (this.allAllTeam[i].teamTagStatus == "标注中") {
					this.allInMarkTeam.unshift(this.allAllTeam[i])
				}
				else if (this.allAllTeam[i].teamTagStatus == "空闲中") {
					this.allSpareTeam.unshift(this.allAllTeam[i])
				}
			}
			this.inMarkTeam = this.allInMarkTeam
			this.spareTeam = this.allSpareTeam
		},
		updated() {
			if(!this.condition){
				console.log(this.condition);
				this.queryInfo.total = this.allTeam.length
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
		width: 300px;
		background-color: #fff;
	}

	.button-with-createTeam {
		float: right;
		margin-right: 5px;
	}
	.searchSelect{
    margin-bottom:20px;
	}
	.child{
	position: absolute;
	right: 5%;
	}
	.paginations {
	padding-top: 10px;
	}
	.dialog-footer{
		float:right;
		margin-right:30px;
		margin-top:-15px;
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
