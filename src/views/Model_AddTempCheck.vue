<template>
 	<div>
 		<div class="crumbs">
 			<el-breadcrumb separator="/">
 				<el-breadcrumb-item><i class="el-icon-lx-copy"></i> 模型校验->发起模型校验</el-breadcrumb-item>

 			</el-breadcrumb>
 		</div>



 		<div class="container" direction="vertical">

 			<el-tabs v-model="message">

 				<!-- 二级选择栏框 -->

 				<el-form :inline="true" :model="filters">
 					<el-form-item>
 						<el-select v-model="filters.value1" clearable placeholder="请选择模型" @change="getModel($event)"
 							style="margin-left:20px;">
 							<el-option v-for="item in select1" :key="item.value" :label="item.label"
 								:value="item.value">
 							</el-option>
 						</el-select>

 						<el-select v-model="filters.value2" filterable style="margin-left:20px;" placeholder="请选择版本"
 							:loading="loading" @change="getZip($event)">
 							<el-option v-for="item in select2" :key="item.value" :label="item.label"
 								:value="item.value"></el-option>
 						</el-select>

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
 								<el-button style="margin-left:20px;" type="primary" plain @click="doFilter">查看版本详情
 								</el-button>
 							</template>

 						</el-popover>

 					</el-form-item>

 				</el-form>


 				<el-button v-if="sonFlag" @click="Refresh" size="mini" style="float:right;margin-left:10px;">
 					<i class="el-icon-lx-delete"></i> 清空图片
 				</el-button>


 				<el-button v-if="sonFlag" @click="dialogTableVisible = true" size="mini" type="primary"
 					style="float:right;">
 					<i class="el-icon-lx-top"></i> 上传文件
 				</el-button>

 			</el-tabs>

 			<!-- 上传框    -->
 			<div v-show="!sonFlag&&filters.value1!=''&&filters.value2!=''" @click="dialogTableVisible = true"
 				style="margin-left: 30px;margin-top: 50px;text-align:center;">
 				<el-upload disabled="true" slot='tip' class="upload-demo my-upload-dragger" drag
 					action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
 					<el-icon class="el-icon--upload">
 						<upload-filled slot='tip' />
 					</el-icon>
 					<div class="el-upload__text" slot='tip'>
 						<i class="el-icon-lx-pic" size="large"></i>
 						<p style="font-size:20px;">暂无校验素材</p>
 						<p style="font-size:10px; color: blue;">点击此处</p>
 						<p style="font-size:20px;">选择电脑本地图片</p>
 						<p style="font-size:10px; color: blue;">进行校验</p>
 					</div>

 				</el-upload>
 			</div>

 			<!-- 未选择模型和版本的框    -->
 			<div v-show="!sonFlag&&filters.value1==''||filters.value2==''"
 				style="margin-left: 30px;margin-top: 50px;text-align:center;">
 				<el-upload disabled=“true” slot='tip' class="upload-demo my-upload-dragger" drag
 					action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>

 					<el-icon class="el-icon--upload">
 						<upload-filled slot='tip' />
 					</el-icon>
 					<div class="el-upload__text" slot='tip'>
 						<i class="el-icon-lx-warn" size="large"></i>
 						<p style="font-size:20px;color: red;">未选择模型和版本</p>
 						<p style="font-size:10px;">请先在上方选择模型和版本</p>

 					</div>

 				</el-upload>
 			</div>

 			<!-- 走马灯+标签页子组件 -->
 			<Son v-if="sonFlag"></Son>

 			<!-- 右下方按钮 -->
 			<el-button @click="Refresh" size="mini" style="float: right;margin-left: 30px;">
 				取消
 			</el-button>
 			<!-- activeIndex=true -->


 			<el-button v-if="uploadFlag" @click="beginCheck" size="mini" type="primary" style="float: right;">
 				开始校验
 			</el-button>


 			<!-- 弹窗 -->
 			<div style="text-align:center;height: 100%;">

 				<!-- 单标签表格 -->
 				<el-dialog v-model="dialogTableVisible" title="选择上传方式">

 					<div>
 						<el-radio style="width:150px;height:100px" v-model="radio1" label="1" border>图片上传 <br /><i
 								class="el-icon-lx-pic"></i>
 						</el-radio>
 						<el-radio style="width:150px;height:100px" v-model="radio1" label="2" border>文件夹上传 <br /><i
 								class="el-icon-lx-file"></i></el-radio>

 					</div>
 					<div>
 						<input style="margin-right:20px;margin-top:20px" list-type="picture-card" v-show="radio1==1"
 							ref="file" type='file' name="file" @change="changesPic" />

 						<input style="margin-left:300px;margin-top:20px" v-show="radio1==2" ref="folder" type='file'
 							name="folder" webkitdirectory @change="changesFolder" />
 					</div>
 					<el-button @click="dialogTableVisible=false" size="mini" type="primary" style="float: right">
 						确定
 					</el-button>

 				</el-dialog>

 			</div>

 		</div>
 	</div>
 </template>







 <script lang="ts">
 	import {
 		method,
 		truncate
 	} from "lodash";
 	import {
 		ref,
 		reactive
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
 						name: '火焰模型',
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
 						name: '火焰模型',
 						zip: 'V3',
 						type: 'AI云服务/在线验证',
 						testSet: 'Dog',
 						date: '2022-05-05 21:40:50',
 						state: '校验完成',
 						performance: 'Home',
 					},

 				],

 				//选择器二级选择
 				demoData: [{
 						value: '火焰模型',
 						label: '火焰模型',
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
 				temp: "",
 				radio1: '1',
 				fileList: [],
 				sonFlag: false,
 				uploadFlag: false
 			}
 		},
 		created() {
 			this.resData = this.$route.resData //接收参数


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
 				this.doFilter();
 				console.log("跳转verify")
 				this.$router.push({
 					path: '/model/verify',
 					query: {
 						checkFlag: 'false',
 						name: this.temp.name,
 						zip: this.temp.zip,
 						type: this.temp.type,
 						testSet: this.temp.testSet,
 						date: this.temp.date,
 						state: this.temp.state,
 						performance: this.temp.performance
 					}
 				})
 			},

 			// 上传文件或文件夹
 			changesPic() {
 				this.fileList = this.$refs.file.files;
 				console.log(this.fileList);
 				//利用路由传递对象
 				this.dialogTableVisible = false
 				this.sonFlag = true;
 				this.uploadFlag = true;
 			},
 			changesFolder() {
 				console.log(this.$refs.folder.files);
 				this.dialogTableVisible = false
 				this.sonFlag = true;
 				this.uploadFlag = true;
 			},
 			Refresh() {
 				console.log("刷新页面");
 				location.reload();
 				this.$router.go(0);
 				console.log("刷新页面")
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
 			pro: '火焰模型',
 			label: 'V6'
 		}, {
 			pro: '火焰模型',
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
