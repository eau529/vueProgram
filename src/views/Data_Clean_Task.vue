<template>
	<div class="">
		<div class="container">
			<div>
                <span class="pageTitle">数据诊断</span>
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
                    <el-alert title="支持数据的近似、漏误标等数据诊断工作。" type="info" show-icon @close="changeShowTips">
                    </el-alert>
                </div>
            </transition-group>
            <div style="margin: 20px 0;"></div>

			<div class="searchSelect">
				<el-select v-model="form.type" placeholder="请选择或搜索状态" size="medium" @change="statusSelect">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-input placeholder="请输入数据集名称" v-model="queryInfo.query" clearable class="input-with-select"
					@clear="getTaskList" size="medium" :disabled="true">
				</el-input>
				<el-button size="medium" icon="el-icon-search" disabled></el-button>
				<el-button size="medium" type="primary" class="button-with-createTask" disabled>
					<i class="el-icon-circle-plus-outline el-icon--left"></i>
					发起诊断任务
				</el-button>
			</div>
			<el-table :data="tableData" stripe style="width: 100%">
				<el-table-column prop="name" label="数据集名称" ></el-table-column>
				<el-table-column prop="type" label="数据集类型"></el-table-column>
				<el-table-column prop="pre_version" label="诊断版本"></el-table-column>
				<el-table-column prop="after_version" label="诊断后版本"></el-table-column>
				<el-table-column prop="star_time" label="任务发起时间"></el-table-column>
				<el-table-column prop="state" label="任务状态"></el-table-column>
				<el-table-column prop="option" label="操作"></el-table-column>
			</el-table>

		</div>
	</div>
</template>

<script>
	import {
		nanoid
	} from 'nanoid'
	import {
		ref,
		reactive
	} from "vue";
	export default {
		name: "cleanTask",
		setup() {
			const message = ref("first");
			const editInitiatedTasks = (index) => {
				console.log("editInitiatedTasks");

			};
			return {
				message,
				editInitiatedTasks,
			};
		},
		data() {
			return {
				input: '',
				showTips: true,
				statusLabel: '',
				tempMarks: [],
				queryInfo: {
					//查询参数
					query: '',
					// 当前页码
					pagenum: 1,
					// 每页显示条数
					pagesize: 2
				},
				options: [{
					value: '选项1',
					label: '初始化中'
				}, {
					value: '选项2',
					label: '进行中'
				}, {
					value: '选项3',
					label: '失败'
				}, {
					value: '选项4',
					label: '已取消'
				}, {
					value: '选项5',
					label: '待确认'
				}, {
					value: '选项6',
					label: '确认中'
				}, {
					value: '选项7',
					label: '已完成'
				}],
				form: {
					type: '选项1'
				},
				dialogForm: {
					taskName: '',
					markTeam: '',
					datasetType: '',
					datasetVersion: '',
					taskScope: [],
				},
				addTaskRules: {
					taskName: [{
						required: true,
						trigger: 'blur'
					}],
					markTeam: [{
						required: true,
						trigger: 'blur'
					}],
				},
				dialogFormVisible: false,
				formLabelWidth: '230px',
				checked1: false,
				checked2: false,
				checked3: false,
				initiatedTasks: [],
				initiatedTasks: JSON.parse(localStorage.getItem('initiatedTasks')) || [],
				allInitiatedTasks: JSON.parse(localStorage.getItem('allInitiatedTasks')) || [],
				acceptedTask: JSON.parse(localStorage.getItem('acceptedTask')) || [],
				allAcceptedTask: JSON.parse(localStorage.getItem('allAcceptedTask')) || [],
				allAcceptedTask: [{
						taskName: "11",
						markTeam: "华侨城",
						datasetType: "测试集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "待确认图片",
						creationTime: "2022-12-06 20:19:25",
						taskStatus: "已终止",
					},
					{
						taskName: "22",
						markTeam: "华侨城",
						datasetType: "测试集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "未标注图片",
						creationTime: "2022-06-08 08:20:17",
						taskStatus: "进行中",
					},
					{
						taskName: "1122",
						markTeam: "华侨城",
						datasetType: "训练集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "已标注图片",
						creationTime: "2022-03-16 22:04:25",
						taskStatus: "已完成",
					},
				],
				acceptedTask: [{
						taskName: "11",
						markTeam: "华侨城",
						datasetType: "测试集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "待确认图片",
						creationTime: "2022-12-06 20:19:25",
						taskStatus: "已终止",
					},
					{
						taskName: "22",
						markTeam: "华侨城",
						datasetType: "测试集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "未标注图片",
						creationTime: "2022-06-08 08:20:17",
						taskStatus: "进行中",
					},
					{
						taskName: "1122",
						markTeam: "华侨城",
						datasetType: "训练集",
						datasetVersion: "13_15_1(V1)",
						taskScope: "已标注图片",
						creationTime: "2022-03-16 22:04:25",
						taskStatus: "已完成",
					},
				],
			}
		},
		methods: {
			// 隐藏功能显示
			changeShowTips(){
				this.showTips = !this.showTips
			},
			confirm(dialogForm) {
				// if(!taskName.trim()) return alert('输入不能为空')
				const taskObj = {
					id: nanoid(),
					taskName: dialogForm.taskName,
					markTeam: dialogForm.markTeam,
					datasetType: dialogForm.datasetType,
					datasetVersion: dialogForm.datasetVersion,
					taskScope: dialogForm.taskScope,
					creationTime: "2022-04-06 20:19:25",
					taskStatus: "进行中",
				}
				this.allInitiatedTasks.unshift(taskObj)
				this.initiatedTasks = this.allInitiatedTasks
				this.dialogFormVisible = false
				dialogForm.taskName = ''
				dialogForm.markTeam = ''
				dialogForm.datasetType = ''
				dialogForm.datasetVersion = ''
				dialogForm.taskScope = []
			},
			delInitiatedTasks(row) {
				this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

					type: 'warning'
				}).then(() => {
					this.allInitiatedTasks = this.allInitiatedTasks.filter((allInitiatedTask) => {
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
			delAcceptedTask(row) {
				this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

					type: 'warning'
				}).then(() => {
					this.allAcceptedTask = this.allAcceptedTask.filter((allAcceptedTas) => {
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
			searchName() {
				this.initiatedTasks = this.allInitiatedTasks
				this.initiatedTasks = this.initiatedTasks.filter(initiatedTask => {
					return initiatedTask.taskName.indexOf(this.queryInfo.query) != -1 ||
						initiatedTask.markTeam.indexOf(this.queryInfo.query) != -1
				})
				this.queryInfo.query = ''

			},
			searchNameAccepted() {
				this.acceptedTask = this.allAcceptedTask
				this.acceptedTask = this.acceptedTask.filter(acceptedTas => {
					return acceptedTas.taskName.indexOf(this.queryInfo.query) != -1 ||
						acceptedTas.markTeam.indexOf(this.queryInfo.query) != -1
				})
				this.queryInfo.query = ''
			},
			getTaskList() {
				this.initiatedTasks = this.allInitiatedTasks
			},
			getTaskListAccepted() {
				this.acceptedTask = this.allAcceptedTask
			},
			statusSelect(value) {
				this.initiatedTasks = this.allInitiatedTasks
				for (let index = 0; index < this.options.length; index++) {
					if (this.options[index].value === value) {
						this.statusLabel = this.options[index].label
						break
					}
				}
				if (this.statusLabel === '全部任务状态') {
					this.initiatedTasks = this.allInitiatedTasks
				} else {
					this.initiatedTasks = this.initiatedTasks.filter(initiatedTask => {
						return initiatedTask.taskStatus.indexOf(this.statusLabel) != -1
					})
				}
			},
			statusSelectAccepted(value) {
				this.acceptedTask = this.allAcceptedTask
				for (let index = 0; index < this.options.length; index++) {
					if (this.options[index].value === value) {
						this.statusLabel = this.options[index].label
						break
					}
				}
				if (this.statusLabel === '全部任务状态') {
					this.acceptedTask = this.allAcceptedTask
				} else {
					this.acceptedTask = this.acceptedTask.filter(acceptedTas => {
						return acceptedTas.taskStatus.indexOf(this.statusLabel) != -1
					})
				}
			},
		},
		watch: {
			initiatedTasks: {
				deep: true,
				handler(value) {
					localStorage.setItem('initiatedTasks', JSON.stringify(value))
				}
			},
			allInitiatedTasks: {
				deep: true,
				handler(value) {
					localStorage.setItem('allInitiatedTasks', JSON.stringify(value))
				}
			},
			acceptedTask: {
				deep: true,
				handler(value) {
					localStorage.setItem('acceptedTask', JSON.stringify(value))
				}
			},
			allAcceptedTask: {
				deep: true,
				handler(value) {
					localStorage.setItem('allAcceptedTask', JSON.stringify(value))
				}
			},
		},
		mounted() {
			this.initiatedTasks = this.allInitiatedTasks
			this.acceptedTask = this.allAcceptedTask
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

	.button-with-createTask {
		float: right;
		margin-right: 5px;
	}

	.el-checkbox-group {
		margin-left: 150px;
		margin-top: -20px;
	}

	.dialog-footer {
		float: right;
		margin-right: 30px;
		margin-top: -20px;
	}

	.searchSelect {
		margin-bottom: 20px;
	}

	.searchSelect .el-select {
		margin-right: 15px;
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
