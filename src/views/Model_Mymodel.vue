<template>
	<div>
		<div class="">
			<!--        <div class="crumbs">-->
			<!--            <el-breadcrumb separator="/">-->
			<!--                <el-breadcrumb-item>-->
			<!--&lt;!&ndash;                        <svg style="width: 12px;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="currentColor" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></svg>&ndash;&gt;-->
			<!--                    <svg  style="width: 13px;height: 13px;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M320 256a64 64 0 0 0-64 64v384a64 64 0 0 0 64 64h384a64 64 0 0 0 64-64V320a64 64 0 0 0-64-64H320zm0-64h384a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V320a128 128 0 0 1 128-128z"></path><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v128h-64V96a32 32 0 0 1 32-32zm160 0a32 32 0 0 1 32 32v128h-64V96a32 32 0 0 1 32-32zm-320 0a32 32 0 0 1 32 32v128h-64V96a32 32 0 0 1 32-32zm160 896a32 32 0 0 1-32-32V800h64v128a32 32 0 0 1-32 32zm160 0a32 32 0 0 1-32-32V800h64v128a32 32 0 0 1-32 32zm-320 0a32 32 0 0 1-32-32V800h64v128a32 32 0 0 1-32 32zM64 512a32 32 0 0 1 32-32h128v64H96a32 32 0 0 1-32-32zm0-160a32 32 0 0 1 32-32h128v64H96a32 32 0 0 1-32-32zm0 320a32 32 0 0 1 32-32h128v64H96a32 32 0 0 1-32-32zm896-160a32 32 0 0 1-32 32H800v-64h128a32 32 0 0 1 32 32zm0-160a32 32 0 0 1-32 32H800v-64h128a32 32 0 0 1 32 32zm0 320a32 32 0 0 1-32 32H800v-64h128a32 32 0 0 1 32 32z"></path></svg>-->
			<!--                    {{title}}-->
			<!--                </el-breadcrumb-item>-->
			<!--            </el-breadcrumb>-->

			<!--        </div>-->

			<div class="container">
				<!-- 调整后的头部：功能说明的展示与隐藏 -->
				<div>
					<span class="pageTitle">我的模型</span>
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
						<el-alert title="这里展示您创建的所有物体检测模型，您可以查看详细内容并快速触发相关功能操作。" type="info" show-icon
							@close="changeShowTips">
						</el-alert>
					</div>
				</transition-group>
				<div style="margin: 10px 0;"></div>
				<!-- 调整后的头部：功能说明的展示与隐藏 -->

				<div>

					<template v-if="team === 'first'">
						<div class="searchSelect">

							<el-input placeholder="请输入模型名称搜索" v-model="queryInfo.query" clearable @clear="getTableData"
								class="input-with-select" size="medium">
							</el-input>
							<el-button icon="el-icon-search" size="medium" @click="selectByModelName"></el-button>
							<el-button size="medium" type="primary" class="button-with-createTeam" @click="createModel">
								<i class="el-icon-circle-plus-outline el-icon--left"></i>
								创建模型
							</el-button>
						</div>
						<el-empty description="description" v-if="!exitModelList()" />
						<!--                    列表-->
						<el-table :data="splitTableDataByPageParam()" style="width: 100%" :show-header='false'
							ref="modelTable" @row-click="rowExpand" v-if="exitModelList()">
							<el-table-column type="expand">
								<template #default="props">

									<el-row v-if="!exitTypeList(props.row)" style="padding: 20px">
										<el-col :span=2></el-col>
										<el-col :span=19>
											模型创建成功，若无数据集请前往
											<!--                                        <router-link>-->

											<!--                                            <a style="border-bottom:1px solid;color: #409eff" href="www.baidu.com">-->
											<!--                                                数据服务-->
											<!--                                            </a>-->
											<!--                                        </router-link>-->
											<a style="border-bottom:1px solid;color: #409eff" href="#/data/overall">

												数据服务
											</a>
											创建，上传并标注数据集。
											<a style="border-bottom:1px solid;color: #409eff"
												href="#/model/train/create">
												训练模型
											</a>
											后可在此处查看模型的最新版本。
										</el-col>
										<el-col :span=3></el-col>

									</el-row>
									<el-row>
										<el-table class="typeList" :data="props.row.typeList" style="width: 100%;"
											v-if="exitTypeList(props.row)">
											<el-table-column prop="type" label="应用类型" />
											<el-table-column prop="versions" label="最新版本" />
											<el-table-column prop="trainingStatus" label="训练状态" />
											<el-table-column prop="trainingTime" label="训练时间" />
											<el-table-column label="操作">
												<template #default="props">
													<router-link :to="{name:'verify'}">

														<el-link style="border-bottom:1px solid;margin-left: 20px;  ">
															评估报告
														</el-link>
													</router-link>

													<router-link :to="{name:'verify'}">

														<el-link style="border-bottom:1px solid;margin-left: 20px;  ">
															校验
														</el-link>
													</router-link>
													<!--                                                <el-link style="border-bottom:1px solid; margin-left: 20px;  ">-->
													<!--                                                    校验-->
													<!--                                                </el-link>-->
												</template>
											</el-table-column>
											<!--                                        <el-table-column prop="trainingTime" label="操作"/>-->
										</el-table>
									</el-row>
								</template>
							</el-table-column>
							<el-table-column>
								<template #default="props">
									<el-row>
										<el-col :span="6">
											{{ props.row.title }}
										</el-col>

										<el-col :span="6">
											创建时间：{{props.row.creationTime }}
										</el-col>

										<el-col :span="2">
											{{ props.row.access?'已授权':'未授权' }}
										</el-col>

										<el-col :span="3">
											<router-link :to="{name:'createTraining'}">
												<el-link style="border-bottom:1px solid ">
													训练新版本
												</el-link>
											</router-link>
											<!--                                        <el-link style="border-bottom:1px solid ">-->
											<!--                                            训练新版本-->
											<!--                                        </el-link>-->
										</el-col>

										<el-col :span="3">
											<!--                                        <button style="border-bottom:1px solid"   @click.stop="" @click="goDetail(123)" > 模型详情({{ props.row.modelDetailCount }})</button>-->
											<router-link :to="{name:'modelDetail',params:{modelId:'123'}}">
												<el-link style="border-bottom:1px solid">
													模型详情({{ props.row.modelDetailCount }})
												</el-link>
											</router-link>
											<!--                                        <el-link style="border-bottom:1px solid"  :href="goDetail(123)" @click.stop="" >-->
											<!--                                            模型详情({{ props.row.modelDetailCount }})-->
											<!--                                        </el-link>-->


										</el-col>
										<el-col :span="2">
											<router-link :to="{name:'verify'}">

												<el-link style="border-bottom:1px solid  ">
													校验记录
												</el-link>
											</router-link>
										</el-col>

										<el-col :span="2">
											<el-dropdown trigger="hover">
												<span class="el-dropdown-link dropdownList" @click.stop="">
													<i class="el-icon-more el-icon--left" />更多
												</span>
												<template #dropdown>
													<el-dropdown-menu>
														<el-dropdown-item @click="openEditModel(props.row)">
															<i class="el-icon-edit el-icon--left"></i>编辑模型
														</el-dropdown-item>
														<el-dropdown-item @click="openDeleteModelMSB(props.row)">
															<i class="el-icon-delete el-icon--left"></i>删除模型
														</el-dropdown-item>
													</el-dropdown-menu>
												</template>

											</el-dropdown>

											<!--                                        <el-link style="border-bottom:1px solid  ">-->
											<!--                                            &lt;!&ndash;                                            ···更多&ndash;&gt;-->

											<!--                                        </el-link>-->
										</el-col>
									</el-row>
								</template>
							</el-table-column>

						</el-table>
						<!-- <el-row justify="end" style="margin-top: 10px"  >
                        <el-col :span="16">
                        </el-col>
                        <el-col :span="1">
                            <div class="">
                                <el-pagination
                                        v-model:currentPage="queryInfo.pagenum"
                                        v-model:page-size="queryInfo.pagesize"
                                        :page-sizes="[10, 20, 30, 40]"
                                        :small="middle"
                                        :disabled="disabled"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="tableDataCount"
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                />
                            </div>
                        </el-col>
                    </el-row> -->


					</template>


				</div>

				<!--            创建模型对话框-->
				<el-dialog :title="modelDialogTitle" v-model="dialogFormVisible">
					<el-form :model="dialogForm" :rules="rules">
						<el-row>
							<el-col>
								<el-form-item style="margin-bottom: 0px;" label="模型名称" prop="modelName">
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-input placeholder="请输入模型名称..." v-model="dialogForm.title" autocomplete="off" req>
								</el-input>
							</el-col>
							<el-col>
								<el-form-item style="margin-bottom: 0px;" label="功能描述" prop="description">
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-input v-model="dialogForm.description" maxlength="300" rows="7"
									placeholder="请输入功能描述..." show-word-limit type="textarea"
									style="margin-bottom: 10px" />
							</el-col>
							<el-col :span="6">
								<el-form-item label="模型授权">
									<el-switch v-model="dialogForm.access" />
								</el-form-item>
							</el-col>
							<el-col :span="18" style="padding-top: 11px">
								<a style="border-bottom:1px solid;color: #427cce" href="www.baidu.com">
									什么是模型授权？
								</a>
							</el-col>
							<el-col :span="9"></el-col>
							<el-col :span="12">
								<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
								<el-button size="medium" type="primary" @click="openModelFormMSB">确 定</el-button>
							</el-col>

						</el-row>

					</el-form>
				</el-dialog>
			</div>
		</div>
		<!-- 调整后的页码 -->
		<el-row class="child">
			<el-col :span="24" class="paginations" v-if="tableDataCount">
				<el-pagination v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
					:page-sizes="[2, 5, 10, 20, 50]" :small="false" :disabled="false" :background="false"
					layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</el-col>
		</el-row>
		<!-- 调整后的页码 -->
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		watch,
		watchEffect
	} from "vue";
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		nanoid
	} from "nanoid";
	// 所有数据集


	// watchEffect(()=>{
	//     localStorage.setItem('modelListDataset', JSON.stringify(tableData2))
	// })
	console.log("script")
	export default {
		name: "tabs",
		setup() {
			const modelDialogTitle = ref('创建模型')
			const queryInfo = reactive({
				//查询参数
				query: '',
				// 当前页码
				pagenum: 1,
				// 每页显示条数
				pagesize: 7
			})


			const tableDataCount = ref(0)
			const dialogFormVisible = ref(false)

			//数据
			const tableData2 = [{
					id: 1,
					title: "火焰烟雾",
					status: "未授权",
					access: false,
					creationTime: "2022-07-05 11:43:38",
					modelDetailCount: "2",
					description: '火焰烟雾',
					typeList: [{
							type: "AI-A1",
							versions: "v3",
							trainingStatus: "正在训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-B2",
							versions: "v3",
							trainingStatus: "未训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-C3",
							versions: "v3",
							trainingStatus: "训练完成",
							trainingTime: "2022-07-05 11:43:35"
						},
					]
				},
				{
					id: 2,
					title: "高空作业",
					status: "已授权",
					access: true,
					creationTime: "2022-07-05 18:18:46",
					modelDetailCount: "3",
					description: '高空作业',
					typeList: [{
						type: "GKZY-AI-A1",
						versions: "v3",
						//0-训练失败，1-训练完成，2-正在训练
						trainingStatus: "训练完成",
						trainingTime: "2022-07-05 11:43:35"
					}]
				},
				{
					id: 3,
					title: "佩戴安全帽",
					status: "已授权",
					access: true,
					creationTime: "2022-06-05 18:18:51",
					modelDetailCount: "4",
					description: '佩戴安全帽',
					typeList: [
						// {
						//     type: "AI-A1",
						//     versions: "v3",
						//     //0-训练失败，1-训练完成，2-正在训练
						//     trainingStatus: "1",
						//     trainingTime: "2022-07-05 11:43:35"
						// }
					]
				},
				{
					id: 11,
					title: "火焰烟雾",
					status: "未授权",
					access: false,
					creationTime: "2022-07-05 11:43:38",
					modelDetailCount: "2",
					description: '火焰烟雾',
					typeList: [{
							type: "AI-A1",
							versions: "v3",
							trainingStatus: "正在训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-B2",
							versions: "v3",
							trainingStatus: "未训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-C3",
							versions: "v3",
							trainingStatus: "训练完成",
							trainingTime: "2022-07-05 11:43:35"
						},
					]
				},
				{
					id: 21,
					title: "高空作业",
					status: "已授权",
					access: true,
					creationTime: "2022-07-05 18:18:46",
					modelDetailCount: "3",
					description: '高空作业',
					typeList: [{
						type: "GKZY-AI-A1",
						versions: "v3",
						//0-训练失败，1-训练完成，2-正在训练
						trainingStatus: "训练完成",
						trainingTime: "2022-07-05 11:43:35"
					}]
				},
				{
					id: 13,
					title: "佩戴安全帽",
					status: "已授权",
					access: true,
					creationTime: "2022-06-05 18:18:51",
					modelDetailCount: "4",
					description: '佩戴安全帽',
					typeList: [
						// {
						//     type: "AI-A1",
						//     versions: "v3",
						//     //0-训练失败，1-训练完成，2-正在训练
						//     trainingStatus: "1",
						//     trainingTime: "2022-07-05 11:43:35"
						// }
					]
				},
				{
					id: 12,
					title: "火焰烟雾",
					status: "未授权",
					access: false,
					creationTime: "2022-07-05 11:43:38",
					modelDetailCount: "2",
					description: '火焰烟雾',
					typeList: [{
							type: "AI-A1",
							versions: "v3",
							trainingStatus: "正在训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-B2",
							versions: "v3",
							trainingStatus: "未训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-C3",
							versions: "v3",
							trainingStatus: "训练完成",
							trainingTime: "2022-07-05 11:43:35"
						},
					]
				},
				{
					id: 22,
					title: "高空作业",
					status: "已授权",
					access: true,
					creationTime: "2022-07-05 18:18:46",
					modelDetailCount: "3",
					description: '高空作业',
					typeList: [{
						type: "GKZY-AI-A1",
						versions: "v3",
						//0-训练失败，1-训练完成，2-正在训练
						trainingStatus: "训练完成",
						trainingTime: "2022-07-05 11:43:35"
					}]
				},
				{
					id: 32,
					title: "佩戴安全帽",
					status: "已授权",
					access: true,
					creationTime: "2022-06-05 18:18:51",
					modelDetailCount: "4",
					description: '佩戴安全帽',
					typeList: [
						// {
						//     type: "AI-A1",
						//     versions: "v3",
						//     //0-训练失败，1-训练完成，2-正在训练
						//     trainingStatus: "1",
						//     trainingTime: "2022-07-05 11:43:35"
						// }
					]
				},
				{
					id: 13,
					title: "火焰烟雾",
					status: "未授权",
					access: false,
					creationTime: "2022-07-05 11:43:38",
					modelDetailCount: "2",
					description: '火焰烟雾',
					typeList: [{
							type: "AI-A1",
							versions: "v3",
							trainingStatus: "正在训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-B2",
							versions: "v3",
							trainingStatus: "未训练",
							trainingTime: "2022-07-05 11:43:35"
						},
						{
							type: "AI-C3",
							versions: "v3",
							trainingStatus: "训练完成",
							trainingTime: "2022-07-05 11:43:35"
						},
					]
				},
				{
					id: 23,
					title: "高空作业",
					status: "已授权",
					access: true,
					creationTime: "2022-07-05 18:18:46",
					modelDetailCount: "3",
					description: '高空作业',
					typeList: [{
						type: "GKZY-AI-A1",
						versions: "v3",
						//0-训练失败，1-训练完成，2-正在训练
						trainingStatus: "训练完成",
						trainingTime: "2022-07-05 11:43:35"
					}]
				},
				{
					id: 33,
					title: "佩戴安全帽",
					status: "已授权",
					access: true,
					creationTime: "2022-06-05 18:18:51",
					modelDetailCount: "4",
					description: '佩戴安全帽',
					typeList: [
						// {
						//     type: "AI-A1",
						//     versions: "v3",
						//     //0-训练失败，1-训练完成，2-正在训练
						//     trainingStatus: "1",
						//     trainingTime: "2022-07-05 11:43:35"
						// }
					]
				},

			]
			localStorage.setItem("modelListDataset", localStorage.getItem("modelListDataset") || JSON.stringify(
				tableData2))


			// const tableData2 = reactive([
			//     {
			//         id: 1,
			//         title: "火焰烟雾",
			//         status: "未授权",
			//         access: false,
			//         creationTime: "2022-07-05 11:43:38",
			//         modelDetailCount: "2",
			//         description: '火焰烟雾',
			//         typeList: [
			//             {
			//                 type: "AI-A1",
			//                 versions: "v3",
			//                 trainingStatus: "正在训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-B2",
			//                 versions: "v3",
			//                 trainingStatus: "未训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-C3",
			//                 versions: "v3",
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//         ]
			//     },
			//     {
			//         id: 2,
			//         title: "高空作业",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-07-05 18:18:46",
			//         modelDetailCount: "3",
			//         description: '高空作业',
			//         typeList: [
			//             {
			//                 type: "GKZY-AI-A1",
			//                 versions: "v3",
			//                 //0-训练失败，1-训练完成，2-正在训练
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             }
			//         ]
			//     },
			//     {
			//         id: 3,
			//         title: "佩戴安全帽",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-06-05 18:18:51",
			//         modelDetailCount: "4",
			//         description: '佩戴安全帽',
			//         typeList: [
			//             // {
			//             //     type: "AI-A1",
			//             //     versions: "v3",
			//             //     //0-训练失败，1-训练完成，2-正在训练
			//             //     trainingStatus: "1",
			//             //     trainingTime: "2022-07-05 11:43:35"
			//             // }
			//         ]
			//     },
			//     {
			//         id: 11,
			//         title: "火焰烟雾",
			//         status: "未授权",
			//         access: false,
			//         creationTime: "2022-07-05 11:43:38",
			//         modelDetailCount: "2",
			//         description: '火焰烟雾',
			//         typeList: [
			//             {
			//                 type: "AI-A1",
			//                 versions: "v3",
			//                 trainingStatus: "正在训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-B2",
			//                 versions: "v3",
			//                 trainingStatus: "未训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-C3",
			//                 versions: "v3",
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//         ]
			//     },
			//     {
			//         id: 21,
			//         title: "高空作业",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-07-05 18:18:46",
			//         modelDetailCount: "3",
			//         description: '高空作业',
			//         typeList: [
			//             {
			//                 type: "GKZY-AI-A1",
			//                 versions: "v3",
			//                 //0-训练失败，1-训练完成，2-正在训练
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             }
			//         ]
			//     },
			//     {
			//         id: 13,
			//         title: "佩戴安全帽",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-06-05 18:18:51",
			//         modelDetailCount: "4",
			//         description: '佩戴安全帽',
			//         typeList: [
			//             // {
			//             //     type: "AI-A1",
			//             //     versions: "v3",
			//             //     //0-训练失败，1-训练完成，2-正在训练
			//             //     trainingStatus: "1",
			//             //     trainingTime: "2022-07-05 11:43:35"
			//             // }
			//         ]
			//     },
			//     {
			//         id: 12,
			//         title: "火焰烟雾",
			//         status: "未授权",
			//         access: false,
			//         creationTime: "2022-07-05 11:43:38",
			//         modelDetailCount: "2",
			//         description: '火焰烟雾',
			//         typeList: [
			//             {
			//                 type: "AI-A1",
			//                 versions: "v3",
			//                 trainingStatus: "正在训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-B2",
			//                 versions: "v3",
			//                 trainingStatus: "未训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-C3",
			//                 versions: "v3",
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//         ]
			//     },
			//     {
			//         id: 22,
			//         title: "高空作业",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-07-05 18:18:46",
			//         modelDetailCount: "3",
			//         description: '高空作业',
			//         typeList: [
			//             {
			//                 type: "GKZY-AI-A1",
			//                 versions: "v3",
			//                 //0-训练失败，1-训练完成，2-正在训练
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             }
			//         ]
			//     },
			//     {
			//         id: 32,
			//         title: "佩戴安全帽",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-06-05 18:18:51",
			//         modelDetailCount: "4",
			//         description: '佩戴安全帽',
			//         typeList: [
			//             // {
			//             //     type: "AI-A1",
			//             //     versions: "v3",
			//             //     //0-训练失败，1-训练完成，2-正在训练
			//             //     trainingStatus: "1",
			//             //     trainingTime: "2022-07-05 11:43:35"
			//             // }
			//         ]
			//     },
			//     {
			//         id: 13,
			//         title: "火焰烟雾",
			//         status: "未授权",
			//         access: false,
			//         creationTime: "2022-07-05 11:43:38",
			//         modelDetailCount: "2",
			//         description: '火焰烟雾',
			//         typeList: [
			//             {
			//                 type: "AI-A1",
			//                 versions: "v3",
			//                 trainingStatus: "正在训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-B2",
			//                 versions: "v3",
			//                 trainingStatus: "未训练",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//             {
			//                 type: "AI-C3",
			//                 versions: "v3",
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             },
			//         ]
			//     },
			//     {
			//         id: 23,
			//         title: "高空作业",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-07-05 18:18:46",
			//         modelDetailCount: "3",
			//         description: '高空作业',
			//         typeList: [
			//             {
			//                 type: "GKZY-AI-A1",
			//                 versions: "v3",
			//                 //0-训练失败，1-训练完成，2-正在训练
			//                 trainingStatus: "训练完成",
			//                 trainingTime: "2022-07-05 11:43:35"
			//             }
			//         ]
			//     },
			//     {
			//         id: 33,
			//         title: "佩戴安全帽",
			//         status: "已授权",
			//         access: true,
			//         creationTime: "2022-06-05 18:18:51",
			//         modelDetailCount: "4",
			//         description: '佩戴安全帽',
			//         typeList: [
			//             // {
			//             //     type: "AI-A1",
			//             //     versions: "v3",
			//             //     //0-训练失败，1-训练完成，2-正在训练
			//             //     trainingStatus: "1",
			//             //     trainingTime: "2022-07-05 11:43:35"
			//             // }
			//         ]
			//     },
			//
			// ])



			// console.log(localStorage.getItem("modelListDataset"))
			// const tableData = reactive(JSON.parse(localStorage.getItem('modelListDataset')) || []);
			const tableData = reactive(JSON.parse(localStorage.getItem('modelListDataset')) || []);
			console.log(tableData)


			const team = ref("first");
			const currentPage = ref(1)
			const pageSize = ref(10)
			const tableView = reactive([])
			tableView.push(...tableData)
			tableDataCount.value = tableView.length
			// const tableView = () =>{
			//     // console.log(tableData.filter( item => {return item['id'] === 1}))
			//     // return tableData.filter( item => {return item['id'] === 1})
			// }

			watchEffect(() => {
				// console.log("watcheffect")
				localStorage.setItem('modelListDataset', JSON.stringify(tableData))
			})
			watch(tableData, (newValue, oldValue) => {
				tableView.splice(0, tableView.length)
				tableView.push(...tableData)
			})
			watch(tableView, (newValue, oldValue) => {
				tableDataCount.value = newValue.length
			})

			// watch(tableView,(newValue,oldValue) => {
			//     splitTableDataByPageParam()
			// })


			watch(queryInfo, (newValue, oldValue) => {

				if (queryInfo.query === '') {
					tableView.splice(0, tableView.length)
					tableView.push(...tableData)
				}

				//
				// if(queryInfo.query !== ''){
				//     tableView.splice(0,tableView.length)
				//     tableView.push(...tableData.filter((item,index,arr) => {
				//         return item.title.includes(newValue.query)
				//     }))
				// }else {
				//     tableView.splice(0,tableView.length)
				//     tableView.push(...tableData)
				// }

			})

			const dialogForm = reactive({
				// id: 3,
				// title: "",
				// status: "",
				// access: false,
				// creationTime: "",
				// modelDetailCount: 0,
				// typeList: [
				//     // {
				//     //     type: "AI-A1",
				//     //     versions: "v3",
				//     //     //0-训练失败，1-训练完成，2-正在训练
				//     //     trainingStatus: "1",
				//     //     trainingTime: "2022-07-05 11:43:35"
				//     // }
				// ]
			})
			const handleEdit = (index) => {
				console.log("handleEdit");
			};
			const handleDel = (index) => {
				console.log("handleDel");
			};
			const submitModelForm = (model) => {
				console.log('submitModelForm')
				var date = new Date();
				var seperator1 = "-";
				var seperator2 = ":";
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date
				.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
				var model = {}
				model.id = nanoid()
				model.title = dialogForm.title
				model.status = dialogForm.status
				model.access = dialogForm.access
				model.creationTime = currentdate
				model.modelDetailCount = 0
				model.typeList = []

				tableData.push(model)
				// localStorage.setItem("modelListDataset",JSON.stringify(tableData))

				// localStorage.getItem("modelListDataset")


			};
			const handleSizeChange = (val) => {
				console.log(`${val} items per page`)
				splitTableDataByPageParam()
			};
			const handleCurrentChange = (val) => {
				console.log(`current page: ${val}`)
				splitTableDataByPageParam()
			};
			const openModelFormMSB = (modelId, model) => {
				ElMessageBox.confirm(
						'确定' + modelDialogTitle.value + '吗？',
						'提醒', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'info',
						}
					)
					.then(() => {
						ElMessage({
							type: 'success',
							message: modelDialogTitle.value + '成功'
						})
						if (modelDialogTitle.value === '创建模型') {
							submitModelForm()
							dialogFormVisible.value = false
						} else if (modelDialogTitle.value === '修改模型') {


							tableData.forEach((value, index, arr) => {
								if (value.id === dialogForm.id) {
									// value = model
									console.log(value)
									value.title = dialogForm.title
									value.description = dialogForm.description
									value.access = dialogForm.access
								}
							})


							dialogFormVisible.value = false
						}

					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消' + modelDialogTitle.value
						})
						dialogForm.modelName = ''
						dialogForm.access = false
						dialogForm.description = ''
						// dialogFormVisible.value = false
					})

			};
			const openDeleteModelMSB = (model) => {
				ElMessageBox.confirm(
						'确定删除此模型吗？',
						'警告', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
						}
					)
					.then(() => {
						ElMessage({
							type: 'success',
							message: '删除成功',
						})
						// submitModelForm()
						// dialogFormVisible.value = false
						tableData.splice(tableData.indexOf(model), 1)
						tableView.splice(tableView.indexOf(model), 1)
					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消删除',
						})
						// dialogForm.modelName = ''
						// dialogForm.access = false
						// dialogForm.description = ''
					})

			};
			const getTableData = () => {
				console.log("clear")
				tableView.splice(0, tableView.length)
				tableView.push(...tableData)
			}
			const selectByModelName = () => {

				if (queryInfo.query !== '') {
					tableView.splice(0, tableView.length)
					tableView.push(...tableData.filter((item, index, arr) => {
						return item.title.includes(queryInfo.query)
					}))
				}

			}
			const splitTableDataByPageParam = () => {
				let start = (queryInfo.pagenum - 1) * queryInfo.pagesize
				let end = start + queryInfo.pagesize
				return tableView.slice(start, end)
			}
			const openEditModel = (model) => {
				dialogForm.id = model.id
				dialogForm.title = model.title
				dialogForm.description = model.description
				dialogForm.access = model.access
				modelDialogTitle.value = '修改模型'
				dialogFormVisible.value = true


			}
			const createModel = () => {
				dialogFormVisible.value = true;
				modelDialogTitle.value = '创建模型';
				dialogForm.description = ''
				dialogForm.title = ''
				dialogForm.access = false
			}
			return {
				createModel,
				modelDialogTitle,
				openEditModel,
				tableDataCount,
				team,
				handleEdit,
				handleDel,
				tableData,
				openModelFormMSB,
				dialogForm,
				submitModelForm,
				dialogFormVisible,
				handleSizeChange,
				handleCurrentChange,
				pageSize,
				currentPage,
				queryInfo,
				tableView,
				getTableData,
				selectByModelName,
				splitTableDataByPageParam,
				openDeleteModelMSB
			};

		},
		data() {

			const generateData = _ => {
				const AllTeamMembers = [];
				for (let i = 1; i <= 15; i++) {
					AllTeamMembers.push({
						key: i,
						label: `备选项 ${i}`,
						disabled: i % 4 === 0
					});
				}
				return AllTeamMembers;
			};

			return {
				showTips: true,
				prefix: "#/",
				s: false,
				tableData2: [],

				title: "我的模型",
				input: '',
				// dialogForm: {
				//     modelName: '',
				//     description: '',
				//     access: false
				// },
				// dialogFormVisible: false,
				formLabelWidth: '230px',
				AllTeamMembers: generateData(),
				TeamMembers: [],
				rules: {
					modelName: [{
						required: true,
						message: 'Please input Team name',
						trigger: 'blur'
					}, ],
					description: [{
						required: true,
						message: 'Please input Team name',
						trigger: 'blur'
					}, ]
				},
				allTeam: JSON.parse(localStorage.getItem('allTeam')) || [],
				allAllTeam: JSON.parse(localStorage.getItem('allAllTeam')) || [],
				inMarkTeam: JSON.parse(localStorage.getItem('inMarkTeam')) || [],
				allInMarkTeam: JSON.parse(localStorage.getItem('allInMarkTeam')) || [],
				spareTeam: JSON.parse(localStorage.getItem('spareTeam')) || [],
				allSpareTeam: JSON.parse(localStorage.getItem('allSpareTeam')) || [],
				allAllTeam: [{
						teamName: "华侨城",
						teamDiscription: "--",
						teamNumber: "3",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "天安数码城",
						teamDiscription: "AI标注",
						teamNumber: "2",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "消防器材标注_时光塔",
						teamDiscription: "--",
						teamNumber: "4",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "混凝土振捣",
						teamDiscription: "--",
						teamNumber: "5",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "信达项目",
						teamDiscription: "--",
						teamNumber: "2",
						teamTagStatus: "标注中",
					}
				],
				allInMarkTeam: [{
						teamName: "华侨城",
						teamDiscription: "--",
						teamNumber: "3",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "天安数码城",
						teamDiscription: "AI标注",
						teamNumber: "2",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "消防器材标注_时光塔",
						teamDiscription: "--",
						teamNumber: "4",
						teamTagStatus: "空闲中",
					},
					{
						teamName: "混凝土振捣",
						teamDiscription: "--",
						teamNumber: "5",
						teamTagStatus: "空闲中",
					}
				],
				allSpareTeam: [{
					teamName: "信达项目",
					teamDiscription: "--",
					teamNumber: "2",
					teamTagStatus: "标注中",
				}],
			}
		},
		methods: {
			// 隐藏功能显示
			changeShowTips() {
				this.showTips = !this.showTips
			},
			goDetail(id) {
				console.log("goDetail")
				// this.$router.push({name:'/mymodel/:modelId',query:{modelId:id}})
				// this.$router.push({name:'team-manage'})
				return this.prefix + "model/mymodel/" + id.toString()
				// return "www.baidu.com"
			},
			exitModelList() {
				if (this.tableData.length > 0)
					return true
				else
					return false
			},
			// headerStyle(row,index){
			//     let json = {'background':'#ff407c','color':'#40041c'}
			//     return json
			// },

			exitTypeList(row) {
				if (row['typeList'].length > 0)
					return true
				else
					return false
			},
			// 点击行展开
			rowExpand(row, column, event) {
				this.$refs.modelTable.toggleRowExpansion(row)

			},

			searchNameAll() {
				this.allTeam = this.allAllTeam
				this.allTeam = this.allTeam.filter(allTea => {
					return allTea.teamName.indexOf(this.queryInfo.query) != -1
				})
				this.queryInfo.query = ''
			},
			searchNameInMark() {
				this.inMarkTeam = this.allInMarkTeam
				this.inMarkTeam = this.inMarkTeam.filter(inMarkTea => {
					return inMarkTea.teamName.indexOf(this.queryInfo.query) != -1
				})
				this.queryInfo.query = ''
			},
			searchNameSpare() {
				this.spareTeam = this.allSpareTeam
				this.spareTeam = this.spareTeam.filter(spareTea => {
					return spareTea.teamName.indexOf(this.queryInfo.query) != -1
				})
				this.queryInfo.query = ''
			},
			getTaskListAll() {
				this.allTeam = this.allAllTeam
			},
			getTaskListInMark() {
				this.inMarkTeam = this.allInMarkTeam
			},
			getTaskListSpare() {
				this.spareTeam = this.allSpareTeam
			},
		},
		watch: {
			allTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('allTeam', JSON.stringify(value))
				}
			},
			allAllTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('allAllTeam', JSON.stringify(value))
				}
			},
			inMarkTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('inMarkTeam', JSON.stringify(value))
				}
			},
			allInMarkTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('allInMarkTeam', JSON.stringify(value))
				}
			},
			spareTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('spareTeam', JSON.stringify(value))
				}
			},
			allSpareTeam: {
				deep: true,
				handler(value) {
					localStorage.setItem('allSpareTeam', JSON.stringify(value))
				}
			},
		},
		mounted() {
			this.allTeam = this.allAllTeam
			this.inMarkTeam = this.allInMarkTeam
			this.spareTeam = this.allSpareTeam
			// this.tableData.forEach(row => {
			//     row['expanded'] = false
			// })
		},
	}
</script>
<style scoped>
	.el-dialog__body {
		padding-top: 0px;
	}

	/* 页码样式设置 */
	.child {
		/* position: absolute;
	  right: 5%; */
		float: right;
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
<style scoped>
	.dropdownList {
		cursor: pointer;
	}

	/*expanded-cell背景色*/
	.el-table>>>.el-table__expanded-cell[class*="cell"] {
		background: #f5f7fa;
		/*padding-top: 0px;*/
		padding: 0 0 0 0;
	}

	.typeList>>>.el-table__row {
		background: #f5f7fa;
		/*background: rgb(144, 147, 153);*/
	}


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

	.searchSelect {
		margin-bottom: 20px;
	}
</style>
