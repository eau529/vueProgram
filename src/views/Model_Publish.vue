<template>
	<div class="">
		<div class="container">
			<!-- 调整后的头部：功能说明的展示与隐藏 -->
			<div>
				<span class="pageTitle">发布/导出模型</span>
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
					<el-alert v-if="message === 'first'" title="将训练完成的模型导出至本地路径,导出后的模型可在海康设备中使用。" type="info" show-icon @close="changeShowTips">
					</el-alert>
					<el-alert  v-if="message === 'second'" title="只有训练完成的在线验证模型版本才能发布，发布完成后可在我的模型中查看。" type="info" show-icon @close="changeShowTips">
					</el-alert>
				</div>
			</transition-group>
			<div style="margin: 20px 0;"></div>
			 <!-- 调整后的头部：功能说明的展示与隐藏 -->
			
			<!-- <h2>发布/导出模型</h2>
			<div style="margin: 16px 0;">
				<template v-if="message === 'first'">
					<el-alert title="将训练完成的模型导出至本地路径,导出后的模型可在海康设备中使用。" type="info" show-icon>
					</el-alert>
				</template>
			</div>
			<div style="margin: 16px 0;">
				<template v-if="message === 'second'">
					<el-alert title="只有训练完成的在线验证模型版本才能发布，发布完成后可在我的模型中查看。" type="info" show-icon>
					</el-alert>
				</template>
			</div> -->
			<el-tabs v-model="message">
				<el-tab-pane :label="`导出模型`" name="first">
				</el-tab-pane>
				<el-tab-pane :label="`发布模型`" name="second">
				</el-tab-pane>
			</el-tabs>
			
			<div class="frame">
				<div style="margin-top: 8.5%;padding-bottom: 12%;">

					<template v-if="message === 'first'">
						<br>
						<p>
						<div style="margin-bottom: 8px;" class="choose">模型 / 版本及应用类型</div>
						<el-cascader :options="options" clearable style="width:350px" id="options"></el-cascader>
						</p>
					</template>

					<template v-if="message === 'second'">
						<br>
						<p>
						<div style="margin-bottom: 8px;" class="choose">模型 / 版本及应用类型</div>
						<el-select v-model="value1" style="width:350px">
							<el-option v-for="item in options_model" :key="item.value" :label="item.label"
								:value="item.value" :disabled="item.disabled">
							</el-option>
						</el-select>
						</p>
					</template>


					<br>
				</div>
				<div style="padding-bottom: 1.5%;">
					<div class="tableTitle"></div>
				</div>
				<div style="padding-bottom: 1.5%;">
					<div style="float:right;">
						<el-button type="primary" :disabled="submissionFlag" @click="billingSubmission" size="small">
							发布模型
						</el-button>
					</div>
				</div>
			</div>
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
		name: "taskManagement",
		setup() {
			const message = ref("first");
			const state = reactive({
				initiatedTasks: [],
				acceptedTask: [{
					taskName: "混凝土振捣3",
					markTeam: "混凝土振捣",
					datasetType: "训练集",
					datasetVersion: "13_15_1(V4)",
					taskScope: "未标注 已标注 待确认",
					creationTime: "2022-04-06 20:19:25",
					taskStatus: "已完成",
				}, ],
			});
			const handleEdit = (index) => {
				console.log("handleEdit");

			};
			const handleDel = (index) => {
				console.log("handleDel");
			};
			return {
				message,
				state,
				handleEdit,
				handleDel,
			};
		},
		data() {
			return {
				showTips: true,
				
				input: '',

				options: [{
					value: '选项1',
					label: 'test21',
					disabled: true
				}, {
					value: '选项2',
					label: '航运中心火焰烟雾',
					children: [{
							value: '选项2-1',
							label: 'V3 - AI摄像机/H7/OPAI_V2.0',
						}, {
							value: '选项2-2',
							label: 'V2 - AI摄像机/G3',
						}, {
							value: '选项2-3',
							label: 'V1 - AI摄像机/H7/OPAI_V2.0',
						},

					]
				}, {
					value: '选项3',
					label: '消防器材2',
					children: [{
						value: '选项3-1',
						label: 'V2 - AI摄像机/G3',
					}, {
						value: '选项3-2',
						label: 'V1 - AI摄像机/G3',
					}, ]
				}, {
					value: '选项4',
					label: '航运中心加水',
					disabled: true
				}, {
					value: '选项5',
					label: '航运中心消防器材',
					children: [{
						value: '选项5-1',
						label: 'V4 - AI摄像机/G3',
					}, {
						value: '选项5-2',
						label: 'V3 - AI摄像机/G3',
					}, {
						value: '选项5-3',
						label: 'V2 - AI摄像机/G3',
					}, {
						value: '选项5-4',
						label: 'V1 - AI摄像机/G3',
					}, ]
				}, {
					value: '选项6',
					label: '电梯人数',
					children: [{
						value: '选项6-1',
						label: 'V7 - AI摄像机/G3',
					}, {
						value: '选项6-2',
						label: 'V6 - AI超脑/KT2',
					}, {
						value: '选项6-3',
						label: 'V5 - AI摄像机/G3',
					}, {
						value: '选项6-4',
						label: 'V4 - AI摄像机/G3',
					}, {
						value: '选项6-5',
						label: 'V3 - AI摄像机/G3',
					}, {
						value: '选项6-6',
						label: 'V2 - AI超脑/H3/OPAI_V2.0',
					}, {
						value: '选项6-7',
						label: 'V1 - AI摄像机/KT2',
					}, ]
				}, {
					value: '选项7',
					label: '塔吊升回转与标准节插销',
					children: [{
						value: '选项7-1',
						label: 'V2 - AI超脑/KT2',
					}, {
						value: '选项7-2',
						label: 'V1 - AI超脑/KT2',
					}, ]
				}, {
					value: '选项8',
					label: '混凝土测试5',
					children: [{
						value: '选项8-1',
						label: 'V2 - AI摄像机/H7/OPAI_VQ.0',
					}, {
						value: '选项8-2',
						label: 'V1 - AI超脑/KT2',
					}, ]
				}, {
					value: '选项9',
					label: '火焰测试2',
					children: [{
						value: '选项9-1',
						label: 'V1 - AI摄像机/G3',
					}, ]
				}, {
					value: '选项10',
					label: '火灾烟雾混合模型',
					children: [{
						value: '选项10-1',
						label: 'V3 - AI摄像机/H3/OPAI_V2.0',
					}, {
						value: '选项10-2',
						label: 'V2 - AI摄像机/H3/OPAI_V2.0',
					}, {
						value: '选项10-3',
						label: 'V1 - AI超脑/KT2',
					}, ],
				}, ],
				options_model: [{
					value: '选项1',
					label: 'test21',
					disabled: true
				}, {
					value: '选项2',
					label: '航运中心火焰烟雾',
					disabled: true
				}, {
					value: '选项3',
					label: '消防器材2',
					disabled: true
				}, {
					value: '选项4',
					label: '航运中心加水',
					disabled: true
				}, {
					value: '选项5',
					label: '航运中心消防器材',
					disabled: true
				}, {
					value: '选项6',
					label: '电梯人数',
					disabled: true
				}, {
					value: '选项7',
					label: '塔吊升回转与标准节插销',
					disabled: true
				}, {
					value: '选项8',
					label: '混凝土测试5',
					disabled: true
				}, {
					value: '选项9',
					label: '火焰测试2',
					disabled: true
				}, {
					value: '选项10',
					label: '火灾烟雾混合模型',
					disabled: true
				}, ],
				value1: [],
				value2: [],
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
				submissionFlag: false,
			}
		},
		methods: {
			// 隐藏功能显示
			changeShowTips(){
			    this.showTips = !this.showTips
			},
			confirm(dialogForm) {
				// if(!this.name.trim()) return alert('输入不能为空')
				console.log(dialogForm)
				const taskObj = {
					id: nanoid(),
					taskName: dialogForm.taskName,
					markTeam: dialogForm.markTeam,
					datasetType: dialogForm.datasetType,
					datasetVersion: dialogForm.datasetVersion,
					taskScope: dialogForm.taskScope,
					creationTime: "2022-04-06 20:19:25",
					taskStatus: "已完成",
				}

				console.log(taskObj);

				this.state.initiatedTasks.unshift(taskObj)
				this.dialogFormVisible = false
				dialogForm.taskName = ''
				dialogForm.markTeam = ''
				dialogForm.datasetType = ''
				dialogForm.datasetVersion = ''
				dialogForm.taskScope = []
			}
		},
	};
	// let obtain = this.options.value;
	// if(obtain == null){
	// this.submissionFlag=true;//赋值给el-button
	// }else{
	// this.submissionFlag=false;//赋值给el-button
	// }
</script>
<style scoped>
	.frame {
		text-align: center;
	}

	.tableTitle {
		position: relative;
		margin: 0 auto;
		width: 100%;
		height: 0.9px;
		background-color: #e1e1e1;
		text-align: center;
		font-size: 16px;
	}
	.choose{
		color: #7d7d7d;
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
	.pageTitle{
	    font-size: 24.5px;
	    font-weight: bold
	}
	.hideFunction{
	    float:right;
	    margin-right:15px;
	}
	/* ---隐藏功能说明--- */
</style>
