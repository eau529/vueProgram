<template>
 	<div>
 		<div class="crumbs">
 			<el-breadcrumb separator="/">
 				<el-breadcrumb-item><i class="el-icon-lx-copy"></i> 模型校验->发起模型校验</el-breadcrumb-item>

 			</el-breadcrumb>
 		</div>



 		<div class="container" direction="vertical">

 			<el-tabs v-model="message">
 				<!-- 选择框 -->

 				<el-form :inline="true" :model="filters">

 					<el-form-item>
 						<p style="font-size:30px;font-weight: bold;">{{temp.name}}</p>
 					</el-form-item>

 					<el-form-item>
 						<!-- 查看版本详情弹出框 -->
 						<el-popover v-model:visible="visible" placement="right" :width="600" style="margin-left:20px;">



 							<el-descriptions :data="PopovereData" class="margin-left" title="模型详情" :column="1"
 								style="margin-left:20px;">
 								<el-descriptions-item label="模型名称:">{{temp.name}}</el-descriptions-item>
 								<el-descriptions-item label="版本:">{{temp.zip}}</el-descriptions-item>
 								<el-descriptions-item label="类型:">{{temp.type}}</el-descriptions-item>
 								<el-descriptions-item label="测试集:">{{temp.testSet}}</el-descriptions-item>
 								<el-descriptions-item label="发起时间:">{{temp.date}}</el-descriptions-item>
 								<el-descriptions-item label="任务状态:">{{temp.state}}</el-descriptions-item>
 								<el-descriptions-item label="检测性能:">{{temp.performance}}</el-descriptions-item>
 							</el-descriptions>

 							<template #reference style="margin-left:20px;">

 								<el-button style="margin-left:20px;" type="primary" plain @click="doFilter">
 									模型版本{{temp.zip}}</el-button>
 							</template>

 						</el-popover>
 					</el-form-item>

 					<el-form-item>
 						<p style="font-size:15px;margin-left:10px">检验成功数:98/100</p>
 					</el-form-item>

 					<el-form-item>
 						<p style="font-size:15px;margin-left:10px">发起时间:{{temp.date}}</p>
 					</el-form-item>

 					<el-button @click="Refresh" size="mini" style="float:right;margin-left:10px;">
 						<i class="el-icon-lx-delete"></i> 删除记录
 					</el-button>


 					<el-button @click="dialogTableVisible = true" size="mini" type="primary" style="float:right;">
 						<i class="el-icon-lx-top"></i> 导出检验文件
 					</el-button>
 				</el-form>




 			</el-tabs>





 			<!-- 走马灯+标签页子组件 -->
 			<Son></Son>

			<el-button @click="Refresh" size="mini" style="float:right;margin-left:10px;">
				 返回
			</el-button>




 		</div>
 	</div>




 </template>







 <script lang="ts">
 	import {
 		create,
 		method,
 		truncate
 	} from "lodash";
 	import {
 		ref,
 		reactive,
 		onActivated
 	} from "vue";
 	import {
 		defineComponent
 	} from 'vue'
 	import Son from "../views/Son.vue"
 	import emitter from "../utils/bus.js";

 	export default {
 		name: "addTempCheck",
 		components: {
 			Son
 		},

 		data() {
 			return {
 				tableData: [{
 						name: '狗狗模型',
 						zip: 'V6',
 						type: 'AI云服务/在线验证',
 						testSet: 'Dog',
 						date: '2022-05-03 21:40:50',
 						state: '校验完成',
 						performance: 'Home',
 					},
 					{
 						name: 'test21',
 						zip: 'V3',
 						type: '在线验证',
 						testSet: 'Test',
 						date: '2022-04-01 21:40:50',
 						state: '初始化中',
 						performance: 'Home',
 					},
 					{
 						name: '猪猪模型',
 						zip: 'V2',
 						type: 'AI云服务/在线验证',
 						testSet: 'Pig',
 						date: '2022-04-01 21:40:50',
 						state: '校验完成',
 						performance: 'Home',
 					},

 				],

 				//选择器二级选择
 				demoData: [{
 						value: '狗狗模型',
 						label: '狗狗模型',
 						children: [{
 								value: 'V3',
 								label: 'V3',

 							},
 							{
 								value: 'V6',
 								label: 'V6',

 							},
 						],
 					},
 					{
 						value: '猪猪模型',
 						label: '猪猪模型',
 						children: [{
 								value: 'V0',
 								label: 'V0',

 							},
 							{
 								value: 'V2',
 								label: 'V2',

 							},
 						],
 					},
 					{
 						value: 'test21',
 						label: 'test21',
 						children: [{
 								value: 'V1',
 								label: 'V1',

 							},
 							{
 								value: 'V3',
 								label: 'V3',

 							},
 						],
 					},

 				],
 				TestSetData: [{
 						zip: 'v3',
 						labelNum: '90',
 						pictureNum: '50',
 						total: '700',
 					},
 					{
 						zip: 'v2',
 						labelNum: '900',
 						pictureNum: '500',
 						total: '7000',
 					},
 					{
 						zip: 'v1',
 						labelNum: '904',
 						pictureNum: '504',
 						total: '7004',
 					},
 					{
 						zip: 'v4',
 						labelNum: '903',
 						pictureNum: '503',
 						total: '7003',
 					},
 				],
 				value1: '',
 				value2: '',
 				value3: '',
 				value4: '',
 				dialogTableVisible: false,
 				tabPosition: 'left',
 				activeIndex: false,
 				select1: select1,
 				loading: false,
 				filters: {
 					value1: '',
 					value2: ''
 				},
 				select2: [],
 				PopovereData: [], //弹出框搜索后的数据
 				resData: [],
 				temp: {},
 				radio1: '1',
 				fileList: [],
 				sonFlag: false,

 			}
 		},
 		created() {


 			this.temp.name = this.$route.query.name;
 			this.temp.zip = this.$route.query.zip;
 			this.temp.type = this.$route.query.type;
 			this.temp.testSet = this.$route.query.testSet;
 			this.temp.date = this.$route.query.date;
 			this.temp.state = this.$route.query.state;
 			this.temp.performance = this.$route.query.performance
 		},
 		methods: {
 			// 二级选择器
 			getModel(prov) {
 				let roles = []
 				this.select2 = []
 				for (var val of allrole) {
 					if (prov === val.pro) {
 						console.log(val)
 						roles.push({
 							label: val.label,
 							value: val.label
 						})
 					}
 					this.select2 = roles
 				}
 			},
 			getZip(opt) {
 				console.log(opt)
 			},
 			// 搜索功能
 			doFilter() {


 				this.tableData.filter((item) => {
 					if ('name' in item || 'zip' in item) {
 						// alert(item.name); 

 						// alert(item.zip);  
 						//alert(this.value4.length)// 级联框的回显数据是数组
 						// alert(this.filters)//this.filters是一个对象

 						// var zip=this.filters.value2;
 						var objToStr = JSON.stringify(this.filters)
 						// alert(objToStr);
 						// alert(item.name);  
 						//按编号或地区查询 注意：根据实际数据 灵活调整字母大小写

 						if (this.filters.value1.indexOf(item.name) > -1 && this.filters.value2.indexOf(item.zip) >
 							-1) {
 							this.PopovereData.push(item);
 							this.temp = item;

 						}

 					}
 				})
 			},

 			beginCheck() {

 				if (this.filters.value1 != "" && this.filters.value2 != "")
 					this.activeIndex = true;
 				else
 					alert("请选择模型及其版本")
 			},
 			// 上传文件或文件夹
 			changesPic() {
 				this.fileList = this.$refs.file.files;
 				console.log(this.fileList);
 				//利用路由传递对象
 				this.dialogTableVisible = false
 				this.sonFlag = true;
 			},
 			changesFolder() {
 				console.log(this.$refs.folder.files);
 				this.dialogTableVisible = false
 				this.sonFlag = true;
 			},
 			Refresh() {

 				this.$router.push({
 					path: '/model/verify'
 				})

 			}
 		},

 		setup() {
 			const message = ref("first");
 			const state = reactive({
 				unread: [{
 						date: "2018-04-19 20:00:00",
 						title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
 					},
 					{
 						date: "2018-04-19 21:00:00",
 						title: "今晚12点整发大红包，先到先得",
 					},
 				],
 				read: [{
 					date: "2018-04-19 20:00:00",
 					title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
 				}, ],
 				recycle: [{
 					date: "2018-04-19 20:00:00",
 					title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
 				}, ],
 			});


 			const handleRead = (index) => {
 				const item = state.unread.splice(index, 1);
 				console.log(item);
 				state.read = item.concat(state.read);
 				alert(12323321231);
 			};
 			const handleDel = (index) => {
 				const item = state.read.splice(index, 1);
 				state.recycle = item.concat(state.recycle);
 				alert(12323321231);
 			};
 			const handleRestore = (index) => {
 				const item = state.recycle.splice(index, 1);
 				state.read = item.concat(state.read);
 				alert(12323321231);
 			};
 			const detail = (index) => {
 				console.log(123);
 				alert(12323321231);
 			};
 			const addCheck = (index) => {
 				this.$router.push({
 					path: '/model/addCheck'
 				})
 			};
 			const confirm = (index) => {
 				activeIndex: true
 				dialogTableVisible: false
 			};

 			//  兄弟页面传值

 			const input1 = ref();
 			const addInput1 = (index) => {
 				emitter.emit("event", input1.value);
 				console.log("传值成功")
 			};

 			// 弹窗
 			const dialogTableVisible = ref()
 			const dialogFormVisible = ref()
 			const formLabelWidth = '140px'

 			const form = reactive({
 				name: '',
 				region: '',
 				date1: '',
 				date2: '',
 				delivery: false,
 				type: [],
 				resource: '',
 				desc: '',
 				fileList: []
 			})

 			//    父子页面传值
 			const parentValue = ref('父组件传给子组件的值')
 			// 兄弟页面传值
 			let money = ref(100)

 			function sendMitt() {
 				emitter.emit('mittFn', money.value -= 2)
 			}





 			//vue3方法和data都封装在setup()中，最后要return方法
 			return {
 				message,
 				state,
 				handleRead,
 				handleDel,
 				handleRestore,
 				detail,
 				addCheck,
 				parentValue,
 				addInput1,
 				money,
 				sendMitt,
 				input1
 			};
 		},



 	};

 	let select1 = [{
 			value: '火焰模型',
 			label: '火焰模型'
 		},
 		{
 			value: 'test21',
 			label: 'test21'
 		},
 		
 	]
 	let allrole = [{
 			pro: '狗狗模型',
 			label: 'V6'
 		}, {
 			pro: '狗狗模型',
 			label: 'V3'
 		}, //pro链接上一级select框
 		{
 			pro: 'test21',
 			label: 'V3'
 		}, 
 	]
 	// 弹出框
 	const visible = ref(false)
 </script>




 <style scoped>
 	.message-title {
 		cursor: pointer;
 	}

 	.handle-row {
 		margin-top: 30px;
 	}

 	.demo-tabs>.el-tabs__content {
 		padding: 32px;
 		color: #6b778c;
 		font-size: 32px;
 		font-weight: 600;
 	}

 	.el-tabs--right .el-tabs__content,
 	.el-tabs--left .el-tabs__content {
 		height: 100%;
 	}
 </style>
