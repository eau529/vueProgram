<template>
	<div>
		<div class="container">
			<div>
				<span class="pageTitle">训练模型</span>
				<span class="hideFunction">
					<i class="el-icon-lx-attentionforbid el-icon--left" v-if="showTips"></i>
					<i class="el-icon-lx-attention el-icon--left" v-else></i>
					<el-button type="text" @click="changeShowTips" style="color: rgb(117,120,137); font-weight: 5">
						<span v-if="showTips">隐藏</span>
						<span v-else>显示</span>功能说明
					</el-button>
				</span>
			</div>
			<transition-group name="fade">
				<div v-if="showTips" style="margin-top:20px">
					<el-alert title="您可以在此训练已创建的模型,训练好的模型可以在我的模型>详情内查看。" type="info" show-icon @close="changeShowTips">
					</el-alert>
				</div>
			</transition-group>
			<div style="margin: 20px 0;"></div>
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="6">
					<h3>训练任务</h3>
				</el-col>
				<el-col :span="4">
					<el-button style="width: 100%;" size="small" type="primary"
						@click="$router.push('/model/train/create')">
						<i class="el-icon-circle-plus"></i>创建训练
					</el-button>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" justify="space-between" style="margin: 10px 0;">
				<el-col :span="5">
					<el-select v-model="filterCondition.modelName" placeholder="选择模型">
						<el-option v-for="item in modelNameOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="5">
					<el-select v-model="filterCondition.taskStatus" placeholder="选择训练状态">
						<el-option v-for="item in taskStatusOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="5">
					<el-select v-model="filterCondition.appTypes" placeholder="选择应用类型">
						<el-option v-for="item in appTypesOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="5">
					<el-select v-model="filterCondition.trainingSet" placeholder="选择训练集版本">
						<el-option v-for="item in appTypesOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="2">
					<el-button style="width: 90%;" size="small" type="primary" plain @click="conditionalFilter">筛选
					</el-button>
				</el-col>
				<el-col :span="2">
					<el-button style="width: 100%;" size="small" @click="clearSelect">重置</el-button>
				</el-col>
			</el-row>
			<div>
				<el-table :data="tableList" :header-cell-style="{background:'#e4e7f3'}" style="width: 100%"
					max-height="300">
					<el-table-column prop="modelName" label="模型名称">
					</el-table-column>
					<el-table-column prop="version" width='50' label="版本">
					</el-table-column>
					<el-table-column prop="appTypes" label="应用类型">
					</el-table-column>
					<el-table-column prop="trainingSet" label="训练集">
					</el-table-column>
					<el-table-column prop="startingTime" label="发起时间">
					</el-table-column>
					<el-table-column prop="taskStatus" label="任务状态">
						<template #default="scope">
							<i class="el-icon-success"></i>
							<span>{{taskStatusValue(scope.row.taskStatus)}}</span>
							<i class="el-icon-question"></i>
						</template>
					</el-table-column>
					<el-table-column prop="operate" label="操作">
						<template #default="scope">
							<el-button type="text" size="small" @click="getReport(scope.row)">详情</el-button>
							<el-button type="text" size="small" @click="delRow(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-row class="child">
			<el-col :span="24" class="paginations" v-if="totalList">
				<el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
					:page-sizes="[2, 5, 10, 20, 50]" :small="false" :disabled="false" :background="false"
					layout="total, sizes, prev, pager, next, jumper" :total="totalList" @size-change="handleSizeChange"
					@current-change="handleCurrentChange" />
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showTips: true,
				tableData: [{
					id: 1,
					modelName: '航运中心火焰烟雾',
					version: 'V3',
					appTypes: 'AI摄像机-H7',
					trainingSet: '火灾烟雾混合测试（V5）',
					startingTime: '2022-07-01 08:44:34',
					taskStatus: '训练完成'
				}, {
					id: 2,
					modelName: '航运中心火焰烟雾',
					version: 'V2',
					appTypes: 'AI摄像机-G3',
					trainingSet: '火灾烟雾混合测试（V5）',
					startingTime: '2022-06-30 17:12:54',
					taskStatus: '训练完成'
				}, {
					id: 3,
					modelName: '航运中心火焰烟雾',
					version: 'V1',
					appTypes: 'AI摄像机-H7',
					trainingSet: '火灾烟雾混合测试（V4）',
			  startingTime: '2022-06-29 16:37:10',
					taskStatus: '训练完成'
				}, {
					id: 4,
					modelName: '消防器材2',
					version: 'V2',
					appTypes: 'AI摄像机-G3',
					trainingSet: '消防器材2（V2）',
					startingTime: '2022-06-29 09:40:37',
					taskStatus: '训练中'
				}, {
					id: 5,
					modelName: '消防器材2',
					version: 'V1',
					appTypes: 'AI摄像机-G3',
					trainingSet: '消防器材2（V1）',
					startingTime: '2022-06-28 17:16:00',
					taskStatus: '训练完成'
				}, {
					id: 6,
					modelName: '航运中心消防器材',
			  version: 'V1',
					appTypes: 'AI摄像机-G7',
					trainingSet: '航运中心消防器材（V1）',
					startingTime: '2022-06-23 19:55:30',
					taskStatus: '训练中'
				}],
				tableSelectData: [],
				modelNameOptions: [{
					value: '航运中心火焰烟雾',
					label: '航运中心火焰烟雾'
				}, {
					value: '消防器材2',
					label: '消防器材2'
				}],
				taskStatusOptions: [{
					value: '初始化中',
					label: '初始化中'
				}, {
					value: '训练中',
					label: '训练中'
				}, {
					value: '训练完成',
					label: '训练完成'
				}],
				appTypesOptions: [{
					value: 'AI摄像机-G3',
					label: 'AI摄像机-G3'
				}, {
					value: 'AI摄像机-H7',
					label: 'AI摄像机-H7'
				}],
				versionOptions: [{
						value: '消防器材1',
						label: '消防器材1',
						children: [{
								value: 'v1',
								label: 'v1',
							},
							{
								value: 'v2',
								label: 'v2',
							},
						],
					},
					{
						value: '消防器材2',
						label: '消防器材2',
						children: [{
								value: 'v1',
								label: 'v1',
							},
							{
								value: 'v2',
								label: 'v2',
							},
							{
								value: 'v3',
								label: 'v3',
							},
						],
					},
				],
				select: false,
				filterCondition: {
					modelName: '',
					trainingSet: '',
					appTypes: '',
					taskStatus: ''
				},
				activeNames: '1',
				currentPage: 1,
				pageSize: 4,
			}
		},
		methods: {
			// 隐藏功能显示
			changeShowTips() {
				this.showTips = !this.showTips
			},
			// 表格数据--任务状态的判断
			taskStatusValue(taskStatus) {
				return taskStatus
			},
			// 数据筛选
			conditionalFilter() {
				var search = this.filterCondition.modelName || this.filterCondition.trainingSet ||
					this.filterCondition.appTypes || this.filterCondition.taskStatus;
				if (search) {
					var data = this.tableData;
					var condition = this.filterCondition;
					var items1;
					items1 = data.filter(item => {
						return Object.keys(condition).every(key => {
							return String(item[key]).toLowerCase().includes(
								String(condition[key]).trim().toLowerCase())
						})
					})

					this.select = true;
					this.tableSelectData = items1;
				} else {
					this.$message('请选择筛选条件！');
				}
			},
			// 重置筛选条件
			clearSelect() {
				this.filterCondition.modelName = '';
				this.filterCondition.trainingSet = '';
				this.filterCondition.appTypes = '';
				this.filterCondition.taskStatus = '';
				this.tableSelectData = this.tableData;
				this.select = false;
			},
			// 前往评估报告页面
			getReport(data) {
				console.log(data.modelName);
				console.log(data.version);
				this.$router.push({
					path: '/model/train/report',
					query: {
						modelName: data.modelName,
						version: data.version,
						trainTime: data.startingTime
					}
				});
			},
			// 删除一条数据
			delRow(row) {
				this.$confirm('删除后对已生效的标注不会产生影响，但相关任务记录将无法找回', '确定删除任务？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (this.select) {
						this.tableSelectData = this.tableSelectData.filter((data) => {
							return data.id !== row.id
						})
					} else {
						this.tableData = this.tableData.filter((data) => {
							return data.id !== row.id
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 页码设置
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val
			},

		},
		computed: {
			// 监测表格内容及页码的变化
			tableList() {
				if (this.select) {
					return this.tableSelectData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
						.pageSize);
				} else {
					return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
				}
			},
			totalList() {
				if (this.select) {
					return this.tableSelectData.length;
				} else {
					return this.tableData.length;
				}
			}
		},
		mounted() {
			// 添加一条新的表格数据（当有参数传入时触发）
			if (this.$route.params.modelName) {
				var list = {
					modelName: this.$route.params.modelName,
					version: '',
					appTypes: '',
					trainingSet: this.$route.params.dataset,
					startingTime: '2022-06-28 17:16:00',
					taskStatus: '训练完成'
				}
				this.tableData.unshift(list);
			}
		}
	};
</script>

<style scoped>
	.el-collapse-item__arrow {
		margin: 0;
	}

	.el-card__header,
	.el-collapse,
	.el-collapse-item__header,
	.el-collapse-item__wrap {
		border: 0;
	}

	.el-input__inner,
	.el-button {
		height: 32px;
	}

	.el-table td,
	.el-table th {
		height: 36px;
	}

	.el-table__row td,
	.el-table__row th {
		height: 36px;
	}

	/* 页码样式设置 */
	.child {
		position: absolute;
		right: 5%;
	}

	.paginations {
		padding-top: 10px;
	}

	/* ---隐藏功能说明--- */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s linear;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	.pageTitle {
		font-size: 24.5px;
		font-weight: bold
	}

	.hideFunction {
		float: right;
		margin-right: 15px;
	}

	/* ---隐藏功能说明--- */
</style>
