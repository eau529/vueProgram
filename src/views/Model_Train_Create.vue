<template>
	<div>
		<div class="container" style="background-color: #fff;height: 90%;">
			<el-container style="background-color: #fff ;height: 100%;">
				<el-header style="height: 10%;">
					<el-page-header @back="this.$router.go(-1)" content="发起训练模型"></el-page-header>
				</el-header>
				<el-main style="height: 80%;border-bottom: 1px solid #DCDFE6;padding-bottom: 0;">
					<el-container style="height: 100%;">
						<el-aside width="700px">
							<el-form label-position="top" :model="formData">
								<el-form-item label="模型">
									<el-select style="width:80%" v-model="formData.modelName" placeholder="请选择或搜索">
										<el-option v-for="item in modelNameOptions" :key="item.value"
											:label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="训练数据">
									<el-button v-show="dialogForm" style="width:80%" type="primary" plain
										@click="dialogFormVisible = true">添加数据</el-button>
									<el-dialog title="添加数据" v-model="dialogFormVisible">
										<p>数据集版本</p>
										<el-input v-model="formData.input" placeholder="请选择或搜索">
											<template #suffix>
												<i slot="suffix" class="el-input__icon el-icon-arrow-down"
													@click="input1show=true"></i>
											</template>
										</el-input>
										<div class="block" v-show="!input1show && !input2show">
											<el-image :src="dataselect"></el-image>
											<div>
												<span class="demonstration">请先选择数据集和数据集版本</span>
											</div>
										</div>
										<div v-show="input1show">
											<el-tabs v-show="input1show" type="card" v-model="message" stretch="true">
												<el-tab-pane :label="`选择数据集`" name="first">
												</el-tab-pane>
												<el-tab-pane :label="`选择版本`" name="second">
												</el-tab-pane>
											</el-tabs>
											<div>
												<template v-if="message === 'first'">
													<el-input placeholder="搜素" suffix-icon="el-icon-search"
														v-model="input1">
													</el-input>
													<div v-for="dataset in selectoptions">
														<span
															@click="getinput1(dataset.value)">{{ dataset.value }}</span>
													</div>
												</template>
												<template v-if="message === 'second'">
													<div v-for="dataset in selectoptions">
														<div v-if="input1 === dataset.value"
															v-for="setversion in dataset.children">
															<span
																@click="getinput2(setversion.value)">{{ setversion.value }}</span>
														</div>
													</div>
												</template>
											</div>
										</div>
										<div v-show="input2show">
											<el-row>
												<el-col :span="15"></el-col>
												<el-col :span="9">
													<p>已选标签{{ selectTagsNum }}个，标签下有目标图注图片{{ tagPictureNum }}张</p>
												</el-col>
											</el-row>
											<el-input placeholder="搜索标签名称" suffix-icon="el-icon-search" v-model="input2"
												style="margin-bottom: 5px;">
											</el-input>
											<el-table :data="tagTableData" :header-cell-style="{background:'#e4e7f3'}"
												style="width: 100%; border-bottom:0;"
												:header-cell-class-name="cellClass"
												@selection-change="handleSelectionChange">
												<el-table-column type="selection">
												</el-table-column>
												<el-table-column prop="tagName" label="标签名称">
													<template #default="scope">
														<i class="el-icon-price-tag"></i>
														<span style="margin-left: 10px">{{ scope.row.tagName }}</span>
													</template>
												</el-table-column>
												<el-table-column prop="pictureNum" label="图片数">
												</el-table-column>
												<el-table-column prop="targetNum" label="目标数">
												</el-table-column>
											</el-table>
										</div>

										<div class="dialog-footer"
											style="width:100%;margin:10px -20px; bottom: 10px;">
											<div style="border-top: 1px solid #DCDFE6;"></div>
											<el-row type="flex" class="row-bg" justify="end">
												<el-col :span="12">
													<el-button style="width: 45%; margin-left:5%" size="medium"
														type="primary" @click="confirm()">确 定</el-button>
													<el-button style="width: 45%;" size="medium"
														@click="dialogFormVisible = false">取 消</el-button>
												</el-col>
											</el-row>
										</div>
									</el-dialog>
									<el-card class="box-card" style="width: 80%;" v-show="!dialogForm">
										<div slot="header" class="clearfix">
											<el-row type="flex" class="row-bg" justify="space-between">
												<el-col :span="12"><span>数据集版本：{{ formData.input }}</span></el-col>
												<el-col :span="6"><span>标注方式：矩形标注</span></el-col>
											</el-row>
										</div>
										<div>
											<el-table :data="formData.multipleSelection"
												:header-cell-style="{background:'#e4e7f3'}"
												style="width: 100%; border-bottom:0;">
												<el-table-column prop="tagName" label="标签名称">
													<template #default="scope">
							   				<i class="el-icon-price-tag"></i>
														<span style="margin-left: 10px">{{ scope.row.tagName }}</span>
													</template>
												</el-table-column>
												<el-table-column prop="pictureNum" label="图片数">
												</el-table-column>
												<el-table-column prop="targetNum" label="目标数">
												</el-table-column>
											</el-table>
											<el-button style="float: right;margin: 10px 0;" type="primary" plain
												@click="dialogFormVisible = true">修改数据</el-button>
										</div>
									</el-card>
								</el-form-item>
							</el-form>
						</el-aside>
						<el-container style="height: 100%;">
							<el-main style="height: 100%;border-left: 1px solid #DCDFE6;">
								<h2><i class="el-icon-warning"></i>训练要求</h2>
								1个大于等于标签数小于等于16个，每个标签下有目标标注图片数大于等于40张
							</el-main>
						</el-container>
					</el-container>
				</el-main>
				<el-footer style="height: 30px; padding-top: 10px;">
					<el-row type="flex" class="row-bg" justify="end">
						<el-col :span="2">
							<el-button type="primary" @click="onSubmit"><i class="el-icon-circle-plus"></i>开始训练
							</el-button>
						</el-col>
					</el-row>
				</el-footer>
			</el-container>
		</div>
	</div>
</template>

<script>
	import dataselect from "../assets/img/dataselect.png";
	export default {
		setup() {
			const group1 = [];
			const group2 = ['H5', 'H7', 'H8', 'G3', 'G5'];
			const group3 = ['H5', 'KT2'];
			const group4 = ['T4', 'P4', 'KT', 'KT2'];
			const group5 = ['KT2', 'H5'];
			const selectoptions = [{
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
			]
			return {
				group1,
				group2,
				group3,
				group4,
				group5,
				selectoptions,
				dataselect,
			};
		},
		data() {
			return {
				modelNameOptions: [{
					value: '航运中心火焰烟雾',
					label: '航运中心火焰烟雾'
				}, {
					value: '消防器材2',
					label: '消防器材2'
				}],
				tagTableData: [{
					tagName: '桶',
					pictureNum: 80,
					targetNum: 399,
				}, {
					tagName: '灭火器',
					pictureNum: 80,
					targetNum: 400,
				}, {
					tagName: '斧头',
					pictureNum: 80,
					targetNum: 321,
				}, {
					tagName: '铁锹',
					pictureNum: 80,
					targetNum: 320,
				}],
				input1: '',
				dialogFormVisible: false,
				message: 'first',
				state: '',
				input1show: false,
				input2show: false,
				dialogForm: true,
				formData: {
					modelName: '',
					input: '',
					multipleSelection: [],
				}
			}
		},
		methods: {
			// 禁用表格头部多选按钮
			cellClass(row) {
				if (row.columnIndex === 0) {
					console.log(row.columnIndex);
					return 'disabledCheck'
				}
			},
			taskStatusValue(taskStatus) {
				return taskStatus
			},
			getinput1(data) {
				console.log(data);
				this.input1 = data;
				this.formData.input = data;
				this.message = 'second';
			},
			getinput2(data) {
				this.formData.input = this.formData.input + '/' + data;
				console.log(this.formData.input);
				this.message = '';
				this.input1show = false;
				this.input2show = true;
			},
			handleSelectionChange(val) {
				this.formData.multipleSelection = val;
				console.log(val);
			},
			confirm() {
				console.log(this.formData.multipleSelection);
				console.log(this.input);
				this.dialogFormVisible = false;
				this.dialogForm = false;
			},
			onSubmit() {
				console.log(this.formData);
				this.$router.push({
					name: 'train',
					params: {
						modelName: this.formData.modelName,
						dataset: this.formData.input
					}
				});
			},
		},
		computed: {
			selectTagsNum() {
				return this.formData.multipleSelection.length;
			},
			tagPictureNum() {
				var num = 0;
				for (var i = 0; i < this.formData.multipleSelection.length; i++) {
					num = num + this.formData.multipleSelection[i].targetNum;
				}
				return num;
			},
		}
	};
</script>

<style scoped>
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

	.el-dialog {
		height: 580px;

	}

	.el-dialog__header {
		border-bottom: 1px solid #DCDFE6;
		padding: 10px 20px;
	}

	.el-dialog__body {
		padding-top: 10px;
		height: 80%;
	}

	.block {
		background: #f3f5fc;
		border-radius: 4px;
		width: 100%;
		height: 312px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.el-table .disabledCheck .cell .el-checkbox {
		display: none;
	}

	.el-table td,
	.el-table th.is-leaf {
		border-bottom: none;
	}

	.table-wrapper>>>.el-table__inner-wrapper::before {
		/* 去除下边框 */
		height: 0;
	}
</style>
