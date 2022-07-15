<template>
	<div>
		<div class="">
			<!-- 调整内容：头部，页码，下拉框和按钮组，创建校验按钮 -->
			<div class="container" style="position:relative">
				<!-- 调整后的头部：功能说明的展示与隐藏 -->
				<div>
					<span class="pageTitle">校验模型</span>
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
						<el-alert title="这里您可以对训练完成的模型执行效果测试。" type="info" show-icon @close="changeShowTips">
						</el-alert>
					</div>
				</transition-group>
				<div style="margin: 10px 0;"></div>
				<!-- 调整后的头部：功能说明的展示与隐藏 -->
				<!-- 修改后的 创建校验 按钮 -->
				<div style="float: right;height: 32px;" >
				<el-button size="medium" type="primary" class="button-with-createTask" @click="addCheckButton">
				    <i class="el-icon-circle-plus-outline el-icon--left"></i>
				    创建校验
				</el-button>
				</div>
				<div style="clear: both;"></div>
				<!-- 修改后的 创建校验 按钮 -->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<!-- click操作不能在组件上，要在div里-->
					<!-- <div @click="selectIndex=true"> -->


					<el-tab-pane :label="`测试集校验`" name="first" style="margin-top: 10px">
						<div>
							<!-- 选择框4个,按钮2个 -->
							<!-- <el-select v-model="value1" class="m-2" style="margin-left: 20px" placeholder="选择模型" >
                    <el-option
                    v-for="item in modelData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
                  <el-select v-model="value2" class="m-2" style="margin-left: 20px" placeholder="选择校验状态">
                    <el-option
                    v-for="item in stateData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
                  <el-select v-model="value3" class="m-2" style="margin-left: 20px" placeholder="选择应用类型">
                    <el-option
                    v-for="item in typeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select> -->
							<!-- <div>会封装组件另起一行 -->
							<!-- <el-cascader style="margin-left: 20px" v-model="value4" :options="options" @change="handleChange" placeholder="选择测试集版本" /> -->

							<!--四个选择框到此结束 -->

							<!-- <el-button type="primary" plain style="margin-left: 20px" @click="doFilter">筛选</el-button>
                <el-button plain style="margin-left: 20px" @click="mockRequset">重置</el-button> -->

							<!-- 调整后的下拉框和按钮 -->
							<el-row type="flex" class="row-bg" justify="space-between" style="margin: 10px 0;">
								<el-col :span="5" style="padding-top: 4px;">
									<el-select v-model="value1" placeholder="选择模型">
										<el-option v-for="item in modelData" :key="item.value" :label="item.label"
											:value="item.value" />
									</el-select>
								</el-col>
								<el-col :span="5" style="padding-top: 4px;">
									<el-select v-model="value2" placeholder="选择校验状态">
										<el-option v-for="item in stateData" :key="item.value" :label="item.label"
											:value="item.value" />
									</el-select>
								</el-col>
								<el-col :span="5" style="padding-top: 4px;">
									<el-select v-model="value3" placeholder="选择应用类型">
										<el-option v-for="item in typeData" :key="item.value" :label="item.label"
											:value="item.value" />
									</el-select>
								</el-col>
								<el-col :span="5" style="padding-top: 4px;">
									<el-cascader v-model="value4" :options="options" @change="handleChange"
										placeholder="选择测试集版本" />
								</el-col>
								<el-col :span="2" style="padding-top: 4px;">
									<el-button type="primary" plain size="small" style="width: 90%" @click="doFilter">筛选
									</el-button>
								</el-col>
								<el-col :span="2" style="padding-top: 4px;">
									<el-button plain size="small" style="width: 90%" @click="mockRequset">重置</el-button>
								</el-col>
							</el-row>
							<!-- 调整后的下拉框和按钮 -->

						</div>

						<!-- <el-input 
                v-model="searchValue" size="mini" clearable
                placeholder="模型名称" style="width:300px"></el-input> -->

						<el-table :data="tableData" v-show="tableData.length!=0" style="margin-top:20px">
							<el-table-column prop="name" label="模型名称" />
							<el-table-column prop="zip" label="版本" />
							<el-table-column prop="type" label="类型" />
							<el-table-column prop="testSet" label="测试集" />
							<el-table-column prop="date" label="发起时间" />
							<el-table-column prop="state" label="任务状态" />
							<el-table-column prop="performance" label="检测性能" />
							<el-table-column label="操作">
								<template #default="scope">
									<el-button link size="small" @click="detail(scope.$index)">详情</el-button>
									<el-button link type="primary" size="small" @click="handleDel(scope.$index)">删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>



						<!--表格没有任务时，显示创建任务界面--->
						<!-- 上传框    -->
						<div v-show="!activeIndex&&!tableData.length" @click="dialogTableVisible = true"
							style="margin-left: 30px;margin-top: 50px;text-align:center;">
							<el-upload disabled=“true” slot='tip' class="upload-demo my-upload-dragger" drag
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
								<el-icon class="el-icon--upload">
									<upload-filled slot='tip' />
								</el-icon>
								<div class="el-upload__text" slot='tip'>
									<i class="el-icon-lx-presentfill" size="large"></i>
									<p style="font-size:20px;">暂无校验任务</p>
									<router-link to="/model/addCheck" style="color: white">
										<p style="font-size:10px; color:blue;margin-top: 8px;">创建任务</p>
									</router-link>

								</div>

							</el-upload>
						</div>

						<!-- 完成框    -->
						<div v-show="activeIndex&&!tableData.length"
							style="margin-left: 30px;margin-top: 50px;text-align:center;">
							<el-upload disabled=“true” slot='tip' class="upload-demo my-upload-dragger" drag
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>

								<el-icon class="el-icon--upload">
									<upload-filled slot='tip' />
								</el-icon>
								<div class="el-upload__text" slot='tip'>
									<i class="el-icon-lx-refresh" size="large"></i>
									<p style="font-size:20px;">正在校验中</p>
									<p style="font-size:10px;">请稍后</p>

								</div>

							</el-upload>
						</div>




						<!-- <el-pagination
                style="margin-top:20px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[1,4, 8]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems"
                ></el-pagination> -->


					</el-tab-pane>
					<!-- 新的页面，等同addCheck -->



					<el-tab-pane :label="`临时校验`" name="second">
						<!-- 上传框,新建临时校验   -->

						<div v-show="!activeIndex&&!$route.query.checkFlag" @click="dialogTableVisible = true"
							style="margin-left: 30px;margin-top: 50px;text-align:center;">
							<el-upload disabled=“true” slot='tip' class="upload-demo my-upload-dragger" drag
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
								<el-icon class="el-icon--upload">
									<upload-filled slot='tip' />
								</el-icon>
								<div class="el-upload__text" slot='tip'>
									<i class="el-icon-lx-favorfill" size="large"></i>
									<p style="font-size:20px;">暂无校验任务</p>
									<router-link to="/model/addTempCheck" style="color: white">
										<p style="font-size:15px; color:blue;margin-top:8px;">立即创建</p>
									</router-link>
								</div>

							</el-upload>
						</div>

						<!-- 已有校验任务存在框    -->
						<div v-show="$route.query.checkFlag"
							style="margin-left: 30px;margin-top: 50px;text-align:center;">
							<el-upload disabled=“true” slot='tip' class="upload-demo my-upload-dragger" drag
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>

								<el-icon class="el-icon--upload">
									<upload-filled slot='tip' />
								</el-icon>
								<div class="el-upload__text" slot='tip'>
									<i class="el-icon-lx-file" size="large"></i>
									<p style="font-size:20px;font-weight:bold">校验完成</p>

									<div>

										<p style="font-size:5px; margin-top:8px;">已于{{$route.query.date}}时完成任务</p>

										<p @click="lookHis" style="font-size:10px;color: blue;">查看记录</p>

										<router-link to="/model/addTempCheck">
											<p style="font-size:10px;margin-top: 20px;;color: blue;">删除记录</p>
										</router-link>
									</div>


								</div>

							</el-upload>
						</div>








						<!-- 弹窗 -->
						<div style="text-align:center;height: 100%;">

							<!-- 单标签表格 -->
							<el-dialog v-model="dialogTableVisible" title="选择测试集">

								<el-tabs :tab-position="tabPosition" v-model="dialogTableVisible" class="demo-tabs">


									<el-tab-pane label="Fire校验" style="height: 80%">
										<el-table :data="TestSetData" @selection-change="handleSelectionChange"
											ref="tb">
											<el-checkbox v-model="checked1" label="Option 1" size="large" />
											<el-table-column :selectable="checkboxT" type="selection" property="zip"
												label="版本" width="150" />
											<el-table-column property="labelNum" label="标签数" width="200" />
											<el-table-column property="pictureNum" label="已标注图片" />
											<el-table-column property="total" label="标注总数" />
										</el-table>
										<el-button @click="dialogTableVisible = false" size="mini"
											style="float: right;margin-left: 30px;">
											取消
										</el-button>

										<el-button @click="beginCheck" size="mini" type="primary" style="float: right;">
											确认
										</el-button>
									</el-tab-pane>



									<el-tab-pane label="Cat校验">
										<el-table>
											<el-table-column property="zip" label="版本" width="150" />
											<el-table-column property="labelNum" label="标签数" width="200" />
											<el-table-column property="pictureNum" label="已标注图片" />
											<el-table-column property="total" label="标注总数" />
										</el-table>
										<el-button size="mini" style="float: right;margin-left: 30px;">
											<router-link to="/model/addCheck" style="color: blue">
												取消
											</router-link>
										</el-button>

										<el-button size="mini" type="primary" style="float: right;">
											<router-link to="/model/addCheck" style="color: white">
												确认
											</router-link>
										</el-button>
									</el-tab-pane>

								</el-tabs>

							</el-dialog>
						</div>
					</el-tab-pane>
					<!-- 页面结束  -->



				</el-tabs>

				<!-- $router.push({name:'tempIndex?addTempCheck:addCheck'}) -->
				<!-- <el-button @click="addCheckButton" size="large" type="primary" style='position: absolute;right:20px;top:70px;' >
                    创建校验
                    <i class="el-icon-lx-add"></i>
           </el-button> -->

			</div>
		</div>
		<!-- 调整后的页码 -->
		<el-row class="child">
			<el-col :span="24" class="paginations" v-if="totalItems && activeName==='first'">
				<el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
					:page-sizes="[2, 5, 10, 20, 50]" :small="false" :disabled="false" :background="false"
					layout="total, sizes, prev, pager, next, jumper" :total="totalItems" @size-change="handleSizeChange"
					@current-change="handleCurrentChange" />
			</el-col>
		</el-row>
		<!-- 调整后的页码 -->
	</div>
</template>

<script lang="ts">
	import {
		method
	} from "lodash";
	import {
		ref,
		reactive
	} from "vue";
	import {
		computed
	} from "vue";

	export default {
		name: "tabs",

		data() {
			return {
				showTips: true,
				resData: [{
						name: '火焰模型',
						zip: 'V6',
						type: '在线验证',
						testSet: 'Fire',
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
						type: '在线验证',
						testSet: 'Pig',
						date: '2022-04-01 21:40:50',
						state: '校验完成',
						performance: 'Home',
					},
				],

				searchValue: "",
				tableData: [],
				currentPage: 1,
				pageSize: 5,
				totalItems: 0,
				filterTableData: [],
				flag: false,

				modelData: [{
						value: '火焰模型',
						label: '火焰模型',
					},
					{
						value: 'test21',
						label: 'test21',
					},
					{
						value: '电梯人数',
						label: '电梯人数',
					},
					{
						value: '混凝土测试',
						label: '混凝土测试',
					},
				],
				stateData: [{
						value: '初始化中',
						label: '初始化中',
					},
					{
						value: '校验失败',
						label: '校验失败',
					},
					{
						value: '校验中',
						label: '校验中',
					},
					{
						value: '已取消',
						label: '已取消',
					},
					{
						value: '校验完成',
						label: '校验完成',
					},
				],
				typeData: [{
						value: '在线验证',
						label: '在线验证',
					},
					{
						value: '高精度在线验证',
						label: '高精度在线验证',
					},
					{
						value: 'AI摄像机-G5',
						label: 'AI摄像机-G5',
					},
				],

				demoData: [{
						value: 'Option1',
						label: 'Option1',
					},
					{
						value: 'Option2',
						label: 'Option2',
					},
					{
						value: 'Option3',
						label: 'Option3',
					},
					{
						value: 'Option4',
						label: 'Option4',
					},
					{
						value: 'Option5',
						label: 'Option5',
					},
				],
				// 级联选择框，二级数据
				options: [

					{
						value: 'Fire',
						label: 'Fire',
						children: [{
								value: 'V6',
								label: 'V6',

							},
							{
								value: 'V1',
								label: 'V1',

							},
							{
								value: 'V2',
								label: 'V2',

							},
							{
								value: 'V4',
								label: 'V4',

							},
						],
					},
					{
						value: 'Cat',
						label: 'Cat',
						children: [{
								value: 'V1',
								label: 'V1',

							},
							{
								value: 'V3',
								label: 'V3',

							},
							{
								value: 'V2',
								label: 'V2',

							},
							{
								value: 'V4',
								label: 'V4',

							},
						],
					},
				],


				value1: '',
				value2: '',
				value3: '',
				value4: '',
				selectIndex: true,
				activeIndex: false,
				testIndex: 0,
				checkFlag: true,
				activeName: 'first'
			}
		},

		//methods和data同级别
		methods: {
			// 隐藏功能显示
			changeShowTips() {
				this.showTips = !this.showTips
			},

			handleClick(tab, event) {
				// console.log(tab, event);
				// if (tab.name == 'first') {
				// 	// 触发‘配置管理’事件
				// 	console.log(1111);
				// } else {
				// 	// 触发‘用户管理’事件
				// 	console.log(22222);
				// }
			},
			addCheckButton() {
				console.log("按键成功")
				if (this.activeName == "first") {
					this.$router.push('/model/addCheck')
				}
				if (this.activeName == "second") {
					this.$router.push('/model/addTempCheck')
				}
			},
			mockRequset() {
				//   选择框重置
				this.value1 = '';
				this.value2 = '';
				this.value3 = '';
				this.value4 = '';

				//   表格重置
				this.totalItems = this.resData.length; // 注意： 这里mock数据是写在data里的，请求需考虑异步的情况
				if (this.totalItems > this.pageSize) {
					for (let index = 0; index < this.pageSize; index++) {
						this.tableData.push(this.resData[index]);
					}
				} else {
					this.tableData = this.resData;
				}
			},
			// 前端搜索功能需要区分是否检索,因为对应的字段的索引不同
			doFilter() {
				this.tableData = [];
				this.filterTableData = [];
				var temp;
				this.resData.filter((item) => {
					if ('name' in item || 'zip' in item) {

						//alert(this.value4.length)//级联框的回显数据是数组


						//按编号或地区查询 注意：根据实际数据 灵活调整字母大小写
						if (item.name.toUpperCase().indexOf(this.value1.toUpperCase()) > -1 &&
							item.state.indexOf(this.value2) > -1 && item.type.indexOf(this.value3) > -1 &&
							this.value4.indexOf(item.testSet) > -1 && this.value4.indexOf(item.zip) > -1
						) {
							this.filterTableData.push(item);
						}
					}
				})
				// 页面数据改变重新统计数据数量和当前页
				this.currentPage = 1;
				this.totalItems = this.filterTableData.length;
				// 渲染表格,根据值
				this.currentChangePage(this.filterTableData);
				// 页面初始化数据需要判断是否检索过
				this.flag = true;
			},
			// 每页显示条数改变触发
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.handleCurrentChange(1);
			},
			// 当前页改变触发
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
				// 判断是否为搜索的数据,传入对应值
				if (!this.flag) {
					this.currentChangePage(this.resData);
				} else {
					this.currentChangePage(this.filterTableData);
				}
			},
			// 根据分页，确定当前显示的数据
			currentChangePage(list) {
				let fromNum = (this.currentPage - 1) * this.pageSize;
				let toNum = this.currentPage * this.pageSize;
				this.tableData = [];
				for (; fromNum < toNum; fromNum++) {
					if (list[fromNum]) {
						this.tableData.push(list[fromNum]);
					}
				}
			},

			handleDel(index) {
				this.tableData.splice(index, 1)
			},
			detail(index) {
				// console.log("点击detail")        
				// alert(this.tableData[index].name);
				this.$router.push({
					path: '/model/checkDetail',
					query: {
						name: this.tableData[index].name,
						zip: this.tableData[index].zip,
						type: this.tableData[index].type,
						testSet: this.tableData[index].testSet,
						date: this.tableData[index].date,
						state: this.tableData[index].state,
						performance: this.tableData[index].performance
					}
				})
			},
			// testSetCheck(){
			//     this.testIndex=0;
			//     console.log('当前id'+this.testIndex)          
			// },
			// tempCheck(){
			//     this.testIndex=1;
			//     console.log('当前id'+this.testIndex)
			// },

			// initTempCheck(){

			//     if(this.$route.query.checkFlag!=undefined){
			//     this.checkFlag=this.$route.query.checkFlag
			//     }
			//     console.log("成功点击"+this.$route.query.checkFlag);
			// },
			lookHis() {
				console.log("跳转成功")
				this.$router.push({
					path: '/model/tempCheckDetail',
					query: {
						checkFlag: 'false',
						name: this.$route.query.name,
						zip: this.$route.query.zip,
						type: this.$route.query.type,
						testSet: this.$route.query.testSet,
						date: this.$route.query.date,
						state: this.$route.query.state,
						performance: this.$route.query.performance
					}
				})
			},


		},
		beforeMount() {
			this.mockRequset()
		},
		//------------------------ 到此处方法结束------------------------

		created() {
			this.testIndex = 0;
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
			// const addCheckButton=(index)=> {
			//         console.log("按键成功")
			//         if(this.activeName=="first")
			//         {   
			//             this.$router.push('/model/addCheck')
			//         }
			//         if(this.activeName=="second")
			//         {
			//             this.$router.push('/model/addTempCheck')
			//         }
			// };


			// const handleDel = (index) => {
			//     alert("pig")
			//     const item = state.read.splice(index, 1);
			//     state.recycle = item.concat(state.recycle);
			// };
			const handleRestore = (index) => {
				const item = state.recycle.splice(index, 1);
				state.read = item.concat(state.read);

			};
			// const detail = (index) =>  {    
			// console.log("点击detail"+index)        
			// console.log(this.tableData[index]);   
			// };

			const value = ref([])
			const props = {
				expandTrigger: 'hover',
			}

			const handleChange = (value) => {
				console.log(value)
			}


			return {
				message,
				state,
				// handleRead,
				// handleDel,
				handleRestore,

			};
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

	/* 页码样式设置 */
	.child {
		position: absolute;
		right: 5%;
	}

	.paginations {
		padding-top: 10px;
	}

	/* 增加的下拉框和按钮样式 */
	.el-input__inner,
	.el-button {
		height: 32px;
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
