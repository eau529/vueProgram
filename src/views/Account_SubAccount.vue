<template>
	<div>
		<div>
			<div class="">
				<div class="crumbs">
					<el-breadcrumb separator="/">
						<el-breadcrumb-item>
							<i class="el-icon-lx-calendar"></i>企业管理
						</el-breadcrumb-item>
						<el-breadcrumb-item>子账号管理</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="container">
					<!-- 调整后的头部：功能说明的展示与隐藏 -->
					<div>
						<span class="pageTitle">{{title}}</span>
						<span class="hideFunction">
							<i class="el-icon-lx-attentionforbid el-icon--left" v-if="showTips"></i>
							<i class="el-icon-lx-attention el-icon--left" v-else></i>
							<el-button type="text" @click="changeShowTips"
								style="color: rgb(117,120,137); font-weight: 5">
								<span v-if="showTips">隐藏</span>
								<span v-else>显示</span>功能说明
							</el-button>
						</span>
					</div>
					<transition-group name="fade">
						<div v-if="showTips" style="margin-top:20px">
							<el-alert
								title="企业子账户是一个身份实体，它代表您的企业组织中需要访问AI开放平台的人员。您企业组织中的相关人员，可以通过主体账号名、子账号名和子账号密码登录AI开放平台。"
								type="info" show-icon @close="changeShowTips">
							</el-alert>
						</div>
					</transition-group>
					<div style="margin: 10px 0;"></div>
					<!-- 调整后的头部：功能说明的展示与隐藏 -->
					<el-row>
						<!-- <el-col :span="6">
						<h2>{{title}}</h2>
					</el-col>
					<el-col>
						<div style="margin: 16px 0;">
							<el-alert
								title="企业子账户是一个身份实体，它代表您的企业组织中需要访问AI开放平台的人员。您企业组织中的相关人员，可以通过主体账号名、子账号名和子账号密码登录AI开放平台。"
								type="info" show-icon>
							</el-alert>
						</div>
					</el-col> -->
						<el-col>
							<div class="searchSelect" style="margin-bottom: 10px;">
								<router-link :to="{name:'subAccountCreate'}">
									<el-button size="medium" type="primary" class="button-with-create" @click="">
										<i class="el-icon-circle-plus-outline el-icon--left"></i>
										创建子账户 (40/50)
									</el-button>
								</router-link>

								<span style="float:right">
									<!--					<el-input-->
									<!--							placeholder="搜索子账户名、昵称或用户组"-->
									<!--							clearable-->
									<!--							class="input-with-select"-->
									<!--							@clear="getTaskList"-->
									<!--							size="medium"-->
									<!--					>-->
									<!--					</el-input>-->
									<!--					<el-button icon="el-icon-search" @click="searchGroupName" size="medium"></el-button>-->
									<el-input style="width: 300px" v-model="input_search_value" clearable
										placeholder="搜索子账户名、昵称或用户组" @clear="clearSearch">
										<template #append>
											<el-button icon="el-icon-search" @click="search(input_search_value)" />
										</template>
									</el-input>

								</span>
							</div>
						</el-col>
					</el-row>

					<el-row style="">
						<!--				<el-col>-->
						<!--					<div>-->
						<!--						<el-radio-group v-model="radio1" size="large">-->
						<!--							&lt;!&ndash;                            需要动态加载&ndash;&gt;-->
						<!--							<el-radio-button v-for="(item,index) in category" :key="index" :label="item"-->
						<!--											 @change="optionRenew"></el-radio-button>-->
						<!--						</el-radio-group>-->
						<!--					</div>-->
						<!--				</el-col>-->

						<el-col>
							<div id="infiniteDiv" class="infiniteDiv" v-infinite-scroll="load">

								<ul class="" style="overflow: auto">
									<el-row>
										<el-col :span="6"
											v-for="(item, index) in splitUserDataByPageParam(userListFilter())"
											:key="index">
											<div class="box-card">
												<el-card class="modelCard" shadow="always">
													<template #header>
														<div class="card-header">
															<el-row>
																<el-col :span=24
																	style="display: flex;justify-content: center;align-items: center;">
																	<div class="block" style="margin-top: 3px">
																		<el-avatar shape="square" size="auto"
																			src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />

																	</div>
																	<!--                                                            <div style="width: 100%">-->
																	<!--                                                                账号：-->
																	<!--                                                                <div style="width: 100%;word-wrap: break-word;word-break:break-all;overflow: hidden;">-->
																	<!--                                                                    <h3>{{item.account}}</h3>-->
																	<!--                                                                </div>-->
																	<!--                                                            </div>-->
																	<el-row style="margin-left: 10px;">
																		<el-col :span="24">
																			账号：
																			<div
																				style="word-wrap: break-word;word-break:break-all;overflow: hidden;">
																				<h3>{{item.account}}</h3>
																			</div>
																			<!--                                                                    <h3 style="width: 10px;word-wrap: break-word;overflow: hidden;">aaaaaaaaaaaaaaaasdasdasdasdasd</h3>-->
																		</el-col>
																		<!--                                                                <el-col>-->
																		<!--                                                                    昵称：-->
																		<!--                                                                    <div style="width: 110px;word-wrap: break-word;word-break:break-all;overflow: hidden;">-->
																		<!--                                                                        <h3>aaaaaaaaaaaaaaaasdasdasdasdasd</h3>-->
																		<!--                                                                    </div>-->
																		<!--                                                                </el-col>-->
																	</el-row>

																</el-col>
																<!--                                                        <el-col :span=12>-->
																<!--                                                            <el-row>-->
																<!--                                                                <el-col>-->
																<!--                                                                    账号：<h3>asdasd阿松大</h3>-->
																<!--                                                                </el-col>-->
																<!--                                                                <el-col>-->
																<!--                                                                    昵称：<h3>{{item.version}}</h3>-->
																<!--                                                                </el-col>-->
																<!--                                                            </el-row>-->
																<!--                                                        </el-col>-->

															</el-row>
															<div style="float: right">
																<el-tooltip :content="item.useState" placement="top"
																	style="margin-left: 10px">
																	<el-switch style="size: 100px;"
																		v-model="item.useState" active-value="启用"
																		inactive-value="禁用" size="large" />
																</el-tooltip>
															</div>

														</div>
													</template>

													<div class="card-body">
														<div class="card-body-item">昵称：{{item.nick}}</div>
														<div class="card-body-item">用户组：{{item.userGroup}}</div>
														<div class="card-body-item">手机号：{{item.phone}}</div>
														<div class="card-body-item">描述：{{item.description}}</div>
														<div class="card-body-item">创建时间：{{item.creationTime}}</div>
														<div class="card-body-item">最近登录：{{item.lastLoginTime}}</div>
														<el-divider />
														<el-button-group class="ml-4" style="width: 100%">
															<el-tooltip content="编辑" placement="top">
																<el-button type="" style="width: 25%"
																	@click="openEditAccount(item,'编辑')">
																	<i class="el-icon-lx-edit"></i>
																</el-button>
															</el-tooltip>
															<el-tooltip content="用户组" placement="top">
																<el-button type="" style="width: 25%"
																	@click="openEditAccount(item,'用户组')">
																	<i class="el-icon-lx-group"></i>
																</el-button>
															</el-tooltip>
															<el-tooltip content="修改密码" placement="top">
																<el-button type="" style="width: 25%"
																	@click="changePassWdVisible = true">
																	<i class="el-icon-lx-lock"></i>
																</el-button>
															</el-tooltip>
															<el-tooltip content="删除" placement="top">
																<el-button type="" style="width: 25%"
																	@click="openDeleteMSB(item)">
																	<i class="el-icon-lx-delete"></i>
																</el-button>
															</el-tooltip>
														</el-button-group>

														<!--                                                <router-link class="link"-->
														<!--                                                             :to="{name:'modelDetail',params:{modelId:'123'}}">-->
														<!--                                                    <el-link :size="100" class="link-color">-->
														<!--                                                        校验-->
														<!--                                                    </el-link>-->
														<!--                                                </router-link>-->
														<!--                                                <router-link class="link"-->
														<!--                                                             :to="{name:'modelDetail',params:{modelId:'123'}}">-->
														<!--                                                    <el-link class="link-color">-->
														<!--                                                        导出-->
														<!--                                                    </el-link>-->
														<!--                                                </router-link>-->
														<!--                                                <router-link class="link"-->
														<!--                                                             :to="{name:'modelDetail',params:{modelId:'123'}}">-->
														<!--                                                    <el-link class="link-color">-->
														<!--                                                        评估报告-->
														<!--                                                    </el-link>-->
														<!--                                                </router-link>-->

													</div>
												</el-card>
											</div>
										</el-col>

									</el-row>

								</ul>


							</div>

						</el-col>
						<!-- <el-col>
						<div style="float: right">
							<el-pagination v-model:currentPage="queryInfo.pagenum"
								v-model:page-size="queryInfo.pagesize" :page-sizes="[10, 20, 30, 40]" :small="false"
								:disabled="false" layout="total, sizes, prev, pager, next, jumper"
								:total="userListFilter().length" @size-change="handleSizeChange"
								@current-change="handleCurrentChange" />
						</div>
					</el-col> -->
					</el-row>
				</div>
			</div>

			<!--           修改密码对话框-->
			<el-dialog title="修改密码" v-model="changePassWdVisible" width="400px">
				<el-form :model="editAccountForm" :rules="rules" autocp>
					<el-row>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="主账号密码" prop="passwords">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<!--                    <el-input-->
							<!--                            placeholder="请输入主账号密码"-->
							<!--                            v-model="editAccountForm.currentUserPassword"-->
							<!--                            req-->
							<!--                            type="password"-->
							<!--                            show-password-->
							<!--                            autocomplete="new-password"-->
							<!--                            @click="readonly = false"-->
							<!--                    >-->
							<!--                    </el-input>-->
							<el-input placeholder="请输入主账号密码" v-model="editAccountForm.currentUserPassword" req
								type="password" show-password autocomplete="new-password" readonly
								onfocus="this.removeAttribute('readonly');this.type='password';this.setAttribute('show-password',true)"
								onblur="this.setAttribute('readonly',true);this.type='password';this.setAttribute('show-password',true);">
							</el-input>
						</el-col>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="密码" prop="newPassword">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-input placeholder="请输入新密码" v-model="editAccountForm.newPassword" req type="password"
								show-password autocomplete="new-password" readonly
								onfocus="this.removeAttribute('readonly');this.type='password'"
								onblur="this.setAttribute('readonly',true);">
							</el-input>
							<el-input placeholder="请再次输入新密码" v-model="editAccountForm.copyNewPassword" req
								type="password" show-password autocomplete="new-password" readonly
								onfocus="this.removeAttribute('readonly');this.type='password'"
								onblur="this.setAttribute('readonly',true);" style="margin-top: 15px">

							</el-input>
						</el-col>
					</el-row>
					<div style="display:flex;justify-content: center;align-items:center;width: 100%;margin-top: 25px">
						<el-button size="medium" @click="changePassWdVisible = false">取 消</el-button>
						<el-button size="medium" type="primary" @click="changePassword">确 定</el-button>
					</div>

				</el-form>
			</el-dialog>

			<!--           选择用户组对话框-->
			<el-dialog title="选择用户组" v-model="selectUserGroupVisible" width="600px">
				<el-form :model="editAccountForm" :rules="rules">
					<!--            <el-form-item style="margin-bottom: 0px;" prop="account">-->
					<!--                已选：<strong>{{editAccountForm.userGroup}}</strong>-->
					<!--            </el-form-item>-->
					<el-row>
						<el-col :span="16">
							<div style="display: flex;align-items: center;height: 100%">
								当前已选：<strong>{{editAccountForm.userGroup}}（{{editAccountForm.userGroupType}}）</strong>
							</div>

						</el-col>
						<el-col :span="8">
							<div style="margin-bottom: 30px;display: flex;align-items: center;height: 100%">
								<el-input style="width: 200px;float: right;" size="small" clearable placeholder="搜索用户组"
									@clear="clearSearch" v-model="input_userGroup_search">
									<template #append>
										<el-button icon="el-icon-search"
											@click="selectUserGroup(input_userGroup_search)" />
									</template>
								</el-input>
							</div>
						</el-col>
					</el-row>
					<el-table :data="userGroupFilter()" :show-header="true" style="width: 100%;"
						:scrollbar-always-on="true" max-height="400">
						<el-table-column width="30">
							<template #default="props">
								<el-radio :label="props.row.userGroupName" v-model="userGroupRadio"
									@change="cardRadioChange(props.row)">{{""}}
								</el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="userGroupName" label="用户组名称">
						</el-table-column>
						<el-table-column prop="userGroupType" label="用户组类型">
						</el-table-column>
						<el-table-column prop="groupDescription" label="描述">
						</el-table-column>
					</el-table>
				</el-form>
				<div style="display:flex;justify-content: center;align-items:center;width: 100%;margin-top: 30px;">
					<el-button size="medium" @click="selectUserGroupVisible = false">取 消</el-button>
					<el-button size="medium" type="primary" @click="saveUserGroup">确 定</el-button>
				</div>
			</el-dialog>

			<!--         编辑子账号对话框-->
			<el-dialog title="编辑子账号" v-model="editAccountDialogVisible" width="400px">
				<el-form :model="editAccountForm" :rules="rules">
					<el-row>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="账号名" prop="account">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-input disabled="true" placeholder="请输入账号名..." v-model="editAccountForm.account"
								autocomplete="off" req></el-input>
						</el-col>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="昵称" prop="nick">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-input placeholder="请输入昵称..." v-model="editAccountForm.nick" autocomplete="off" req>
							</el-input>
						</el-col>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="手机号" prop="phone">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-input placeholder="请输入手机号..." v-model="editAccountForm.phone" autocomplete="off" req>
							</el-input>
						</el-col>
						<el-col>
							<el-form-item style="margin-bottom: 0px;" label="描述" prop="description">
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-input v-model="editAccountForm.description" maxlength="100" rows="7"
								placeholder="请输入功能描述..." show-word-limit type="textarea" style="margin-bottom: 10px" />
						</el-col>
						<el-col :span="9"></el-col>

						<!--                <el-divider></el-divider>-->
					</el-row>
					<div style="display:flex;justify-content: center;align-items:center;width: 100%;">
						<el-button size="medium" @click="editAccountDialogVisible = false">取 消</el-button>
						<el-button size="medium" type="primary" @click="saveUser">确 定</el-button>
					</div>

				</el-form>
			</el-dialog>
		</div>
		<!-- 调整后的页码 -->
		<el-row class="child">
			<el-col :span="24" class="paginations" v-if="userListFilter().length">
				<el-pagination v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
					:page-sizes="[2, 5, 10, 20, 50]" :small="false" :disabled="false" :background="false"
					layout="total, sizes, prev, pager, next, jumper" :total="userListFilter().length"
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
		computed,
		watch,
		toRefs,
		watchEffect
	} from "vue";
	import {
		readonly
	} from '@vue/reactivity';
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		h
	} from "@vue/runtime-core";

	export default {
		name: "tabs",
		setup() {
			const userGroup_search = ref("")
			const input_userGroup_search = ref("")
			const changePassWdVisible = ref(false)
			const userGroupRadioId = ref(0)
			const userGroupRadio = ref("")
			const userGroup = JSON.parse(localStorage.getItem('userGroup')) || [{
					id: 1,
					userGroupName: "国信科技大厦标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-28 15:03",
				},
				{
					id: 2,
					userGroupName: "桂圆中学_天安数码城标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-28 10:38",
				},
				{
					id: 3,
					userGroupName: "莱荣站房_光明区委党校标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-27 19:18",
				},
				{
					id: 4,
					userGroupName: "丹阳眼镜城_华侨城标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-27 14:36",
				},
				{
					id: 5,
					userGroupName: "AI工程师",
					userGroupType: "AI工程师",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-27 14:34",
				},
				{
					id: 6,
					userGroupName: "扬帆时光塔_ICT标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-27 14:30",
				},
				{
					id: 7,
					userGroupName: "渤海湾标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-02-27 14:23",
				}, {
					id: 8,
					userGroupName: "华侨城标注组",
					userGroupType: "标注员",
					associatedPartition: "默认分区",
					groupDescription: "--",
					submitTime: "2022-07-14 09:34:41",
				},
			]
			const selectUserGroupVisible = ref(false)
			const editAccountForm = reactive({
				id: '',
				account: "",
				nick: "",
				userGroup: "",
				phone: "",
				description: "",
				creationTime: "",
				lastLoginTime: "",
				useState: '',
				userGroupType: '',
				password: ''
			})
			const editAccountDialogVisible = ref(false)
			const rules = reactive({
				passwords: [{
					required: true,
					message: 'Please input Team name',
					trigger: 'blur'
				}, ],
				newPassword: [{
					required: true,
					message: 'Please input Team name',
					trigger: 'blur'
				}, ],
				account: [{
					required: true,
					message: 'Please input Team name',
					trigger: 'blur'
				}, ],
				nick: [{
					required: true,
					message: 'Please input Team name',
					trigger: 'blur'
				}, ],
			})
			const queryInfo = reactive({
				//查询参数
				query: '',
				// 当前页码
				pagenum: 1,
				// 每页显示条数
				pagesize: 10
			})

			const input_search_value = ref("")
			const search_value = ref("")
			const accountUse = ref(true)

			const userList2 = [{
					id: 10,
					account: "lisi",
					nick: "标注李四",
					userGroup: "华侨城标注组",
					phone: "13232170131",
					description: "华侨城标注组 标注员",
					creationTime: "2022-07-13 16:12:39",
					lastLoginTime: "2022-07-13 16:12:55",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 11,
					account: "liwei",
					nick: "标注李伟",
					userGroup: "华侨城标注组",
					phone: "15423487901",
					description: "华侨城标注组 标注员",
					creationTime: "2022-07-13 16:12:49",
					lastLoginTime: "2022-07-13 16:12:52",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 12,
					account: "zhangsan",
					nick: "AI张三",
					userGroup: "AI工程师",
					phone: "18347487901",
					description: "周一、三上班",
					creationTime: "2022-07-13 16:13:57",
					lastLoginTime: "2022-07-13 16:13:59",
					useState: '启用',
					userGroupType: 'AI工程师'
				},
				{
					id: 13,
					account: "wangwu",
					nick: "AI王五",
					userGroup: "AI工程师",
					phone: "19283754812",
					description: "周五上班",
					creationTime: "2022-07-13 16:14:48",
					lastLoginTime: "2022-07-13 16:14:51",
					useState: '启用',
					userGroupType: 'AI工程师'
				},
				{
					id: 14,
					account: "chenma",
					nick: "标注陈麻",
					userGroup: "华侨城标注组",
					phone: "19283754812",
					description: "周二、四上班",
					creationTime: "2022-07-13 16:15:40",
					lastLoginTime: "2022-07-13 16:15:42",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 15,
					account: "liuqi",
					nick: "标注刘琦",
					userGroup: "华侨城标注组",
					phone: "16325752312",
					description: "华侨城标注组 标注员",
					creationTime: "2022-07-13 16:16:31",
					lastLoginTime: "2022-07-13 16:16:33",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 16,
					account: "zengba",
					nick: "AI曾苑",
					userGroup: "AI工程师",
					phone: "15123752312",
					description: "周一、三上班",
					creationTime: "2022-07-13 16:17:34",
					lastLoginTime: "2022-07-13 16:17:37",
					useState: '启用',
					userGroupType: 'AI工程师'
				},
				{
					id: 17,
					account: "wujiu",
					nick: "AI武九",
					userGroup: "AI工程师",
					phone: "17532753642",
					description: "周二、四上班",
					creationTime: "2022-07-13 16:18:37",
					lastLoginTime: "2022-07-13 16:18:40",
					useState: '启用',
					userGroupType: 'AI工程师'
				},
				{
					id: 18,
					account: "qingqiu",
					nick: "标注青丘",
					userGroup: "华侨城标注组",
					phone: "1382575362",
					description: "华侨城标注组 标注员",
					creationTime: "2022-07-13 16:19:26",
					lastLoginTime: "2022-07-13 16:19:29",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 19,
					account: "tianyuan",
					nick: "标注天元",
					userGroup: "华侨城标注组",
					phone: "19583753612",
					description: "华侨城标注组 标注员",
					creationtTme: "2022-07-13 16:20:23",
					lastLoginTime: "2022-07-13 16:20:25",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 20,
					account: "pangu",
					nick: "标注盘古",
					userGroup: "华侨城标注组",
					phone: "1382575362",
					description: "华侨城标注组 标注员",
					creationTime: "2022-07-13 16:19:26",
					lastLoginTime: "2022-07-13 16:19:29",
					useState: '启用',
					userGroupType: '标注员'
				},
				{
					id: 21,
					account: "midou",
					nick: "标注弥豆",
					userGroup: "华侨城标注组",
					phone: "19583753612",
					description: "华侨城标注组 标注员",
					creationtTme: "2022-07-13 16:20:23",
					lastLoginTime: "2022-07-13 16:20:25",
					useState: '启用',
					userGroupType: '标注员'
				},
			]
			localStorage.setItem("userList", localStorage.getItem("userList") || JSON.stringify(userList2))

			const userList = reactive(JSON.parse(localStorage.getItem('userList')) || [])

			const count = ref(0);
			const radio1 = ref('全部');
			const categoryOption = ref('全部')

			watchEffect(() => {
				// console.log("watcheffect")
				localStorage.setItem('userList', JSON.stringify(userList))
			})
			const load = () => {

			};
			const category = [
				'全部', '云部署', 'AI超脑', 'AI摄像机'
			]
			const accountUseValue = ref('启用')

			const categoryOptions = reactive([])


			const team = ref("first");


			const handleEdit = (index) => {
				console.log("handleEdit");
			};
			const handleDel = (index) => {
				console.log("handleDel");
			};

			const handleClick = (tab, event) => {
				console.log(tab, event)

			};

			const optionRenew = () => {
				categoryOption.value = '全部'
			};
			const userListFilter = () => {

				let condition = search_value.value
				if (condition.length === 0) {
					return userList
				} else {
					return userList.filter((item, index, arr) => {
						return item.account.includes(condition) || item.nick.includes(condition) || item
							.userGroup.includes(condition)
					})
				}
				// return userList.filter((item,index,arr) => {
				//     return item.account.includes(condition) || item.nick.includes(condition) || item.userGroup.includes(condition)
				// })
			}
			const search = (condition) => {

				search_value.value = condition
			}
			const clearSearch = () => {
				userGroup_search.value = ''
				search_value.value = ''
			}
			const splitUserDataByPageParam = (copy_list) => {
				let start = (queryInfo.pagenum - 1) * queryInfo.pagesize
				let end = start + queryInfo.pagesize
				return copy_list.slice(start, end)
			}
			const openEditAccount = (account, visible) => {

				if (visible === '编辑') {
					editAccountDialogVisible.value = true
				} else if (visible === '用户组') {
					selectUserGroupVisible.value = true
				}


				editAccountForm.id = account.id
				editAccountForm.account = account.account
				editAccountForm.nick = account.nick
				editAccountForm.description = account.description
				editAccountForm.phone = account.phone
				editAccountForm.userGroup = account.userGroup
				editAccountForm.userGroupType = account.userGroupType
				userGroupRadio.value = account.userGroup


			}

			const saveUser = () => {
				ElMessageBox.confirm(
						'确定修改用户吗？',
						'提醒', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'info',
						}
					)
					.then(() => {
						ElMessage({
							type: 'success',
							message: '修改成功'
						})


						userList.forEach((obj, index, arr) => {
							console.log(obj)
							if (obj.id === editAccountForm.id) {
								obj.description = editAccountForm.description
								obj.phone = editAccountForm.phone
								obj.nick = editAccountForm.nick
							}
						})
						editAccountDialogVisible.value = false

					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消'
						})
						editAccountDialogVisible.value = false
						// dialogForm.modelName = ''
						// dialogForm.access = false
						// dialogForm.description = ''
						// dialogFormVisible.value = false
					})

			};

			const saveUserGroup = () => {
				ElMessageBox.confirm(
						'确定修改用户组吗？',
						'提醒', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'info',
						}
					)
					.then(() => {
						ElMessage({
							type: 'success',
							message: '修改成功'
						})

						userList.forEach((obj, index, arr) => {

							if (obj.id === editAccountForm.id) {

								obj.userGroup = userGroupRadio.value
								obj.userGroupType = (userGroup.filter((item, index, arr) => {
									return item.id === userGroupRadioId.value
								}))[0].userGroupType
								console.log(obj)
							}
						})
						selectUserGroupVisible.value = false

					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消'
						})
						selectUserGroupVisible.value = false
						// dialogForm.modelName = ''
						// dialogForm.access = false
						// dialogForm.description = ''
						// dialogFormVisible.value = false
					})

			};
			const cardRadioChange = (row) => {
				// userGroupRadio.value = userGroup.indexOf(row);
				userGroupRadioId.value = row.id;
				console.log(row.id)
				console.log(userGroupRadioId.value)
				// userGroupRadio.value = row.userGroupName;

			}
			const userGroupFilter = () => {

				return userGroup.filter((obj, index, arr) => {
					return obj.userGroupName.includes(userGroup_search.value)
				})
			}
			const selectUserGroup = (keyword) => {
				userGroup_search.value = keyword
			}
			const openDeleteMSB = (item) => {
				ElMessageBox.confirm(
						'删除后无法撤回，请谨慎操作',
						'警告', {
							message: h('p', null, [
								h('span', null, '确定删除吗？'),
								h('br', null, ''),
								h('span', {
									style: ''
								}, '删除后无法撤回，请谨慎操作。'),
							]),
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
						console.log(userList.indexOf(item))
						userList.splice(userList.indexOf(item), 1)
						console.log(userList)

					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消',
						})
						// dialogForm.modelName = ''
						// dialogForm.access = false
						// dialogForm.description = ''
					})

			};
			const changePassword = () => {
				ElMessageBox.confirm(
						'确定修改此账户密码吗？',
						'警告', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
						}
					)
					.then(() => {
						ElMessage({
							type: 'success',
							message: '修改成功',
						})
						changePassWdVisible.value = false
						editAccountForm.newPassword = ''
						editAccountForm.currentUserPassword = ''
						editAccountForm.copyNewPassword = ''

					})
					.catch(() => {
						ElMessage({
							type: 'info',
							message: '取消',
						})
						changePassWdVisible.value = false
						editAccountForm.newPassword = ''
						editAccountForm.currentUserPassword = ''
						editAccountForm.copyNewPassword = ''

					})

			}
			return {
				count,
				load,
				category,
				accountUseValue,
				categoryOptions,
				team,
				radio1,
				handleEdit,
				handleDel,
				handleClick,
				categoryOption,
				optionRenew,

				accountUse,
				userList,
				userListFilter,
				search_value,
				queryInfo,
				search,
				clearSearch,
				input_search_value,
				splitUserDataByPageParam,
				rules,
				editAccountDialogVisible,
				editAccountForm,
				openEditAccount,
				saveUser,
				selectUserGroupVisible,
				userGroup,
				userGroupRadio,
				userGroupRadioId,
				cardRadioChange,
				saveUserGroup,
				openDeleteMSB,
				changePassWdVisible,
				changePassword,
				userGroup_search,
				userGroupFilter,
				selectUserGroup,
				input_userGroup_search
			};
		},
		data() {
			const generateData = _ => {
				const AllTeamMembers = [];
				for (var i = 1; i <= 15; i++) {
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
				s: false,
				tableData2: [],
				// tableData: [
				//     {
				//         title: "火焰烟雾",
				//         status: "未授权",
				//         createTime: "2022-07-05 11:43:38",
				//         modelDetailCount: "2",
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
				//         title: "高空作业",
				//         status: "已授权",
				//         createTime: "2022-07-05 18:18:46",
				//         modelDetailCount: "3",
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
				//         title: "佩戴安全帽",
				//         status: "已授权",
				//         createTime: "2022-06-05 18:18:51",
				//         modelDetailCount: "4",
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
				// ],
				title: "子账号管理",
				input: '',
				dialogForm: {
					teamName: '',
					teamDiscription: '',
				},
				dialogFormVisible: false,
				formLabelWidth: '230px',
				AllTeamMembers: generateData(),
				TeamMembers: [],

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
		computed: {},
		methods: {

			// 隐藏功能显示
			changeShowTips() {
				this.showTips = !this.showTips
			},

			categoryFilter(category, categoryOption) {
				console.log('categoryFilter')
				if (category !== '全部') {

					return this.modelListView
						.filter((item, index, arr) => {
							return item.category.includes(category)
						})
						.filter((item, index, arr) => {
							if (this.categoryOption === '全部') {
								return true
							} else {
								return item.category.includes(this.categoryOption)
							}
						})

				} else if (category === '全部') {
					return this.modelListView
				}
			},
			deleteModel(event, item) {
				// 点击后鼠标移开恢复按钮默认样式(如果按钮没有加icon图标的话，target.nodeName == "I"可以去掉)
				let target = event.target;
				if (target.nodeName == "I" || target.nodeName == "SPAN") {
					target = event.target.parentNode;
				}
				target.blur();
				this.openDeleteMSB(item);
				// this.modelListView.splice(index,index)

				// 进行其他操作
			},
			//修改“模型详情列表”div的高度，使其适应浏览器
			findDimensions() {
				var winHeight = 0
				//获取窗口宽度
				// if (window.innerWidth)
				//     winWidth = window.innerWidth;
				// else if ((document.body) && (document.body.clientWidth))
				//     winWidth = document.body.clientWidth;
				//获取窗口高度
				if (window.innerHeight)
					winHeight = window.innerHeight;
				else if ((document.body) && (document.body.clientHeight))
					winHeight = document.body.clientHeight;
				//通过深入Document内部对body进行检测，获取窗口大小
				// if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
				//     winHeight = document.documentElement.clientHeight;
				//     winWidth = document.documentElement.clientWidth;
				// }
				if (document.documentElement && document.documentElement.clientHeight && document.documentElement
					.clientWidth) {
					winHeight = document.documentElement.clientHeight;
					// winWidth = document.documentElement.clientWidth;
				}
				//结果输出至两个文本框
				// document.getElementById("test").style.height = winHeight + 'px';
				winHeight = winHeight - 298;
				document.getElementById("infiniteDiv").style.height = winHeight + 'px';

				alert(winHeight);
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
				console.log(row)
				if (row['typeList'].length > 0)
					return true
				else
					return false
			},
			// 点击行展开
			rowExpand(row, column, event) {
				this.$refs.modelTable.toggleRowExpansion(row)

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
			// this.findDimensions()

			// this.tableData.forEach(row => {
			//     row['expanded'] = false
			// })
		},
	}
</script>
<style  scoped>
	.el-dialog__body {
		padding-top: 0px;
	}

	.infiniteDiv {

		width: 100%;
		/*min-height: 90%;*/
		/*height: 65vh;*/
		/*background: rgb(15, 158, 34);*/

	}
</style>
<style scoped>
	.link {
		border-bottom: 1px solid;
		color: #3649f1;
		margin-right: 20px;
	}

	.link-color {
		color: #3649f1;
	}

	.card-body-item {
		margin-top: 6px;
	}

	.button {
		background: #ffffff;
	}

	.modelCard {
		margin: 10px;
	}

	.box-card .modelCard {
		transition: transform .2s, box-shadow .2s;
		/* 省略部分代码 */
	}

	.box-card .modelCard:hover {
		transition: transform .2s, box-shadow .2s;
		transform: translateY(-4px);
		box-shadow: 4px 4px 8px rgba(0, 0, 0, .1), -4px -4px 8px rgba(0, 0, 0, .1);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.infinite-list {
		height: 100%;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.infinite-list .infinite-list-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		background: var(--el-color-primary-light-9);
		margin: 10px;
		color: var(--el-color-primary);
	}

	.infinite-list .infinite-list-item+.list-item {
		margin-top: 10px;
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
	/* 页码样式设置 */
	.child {
		/* position: absolute;
	  right: 5%; */
		float: right;
	}

	.paginations {
		padding-top: 10px;
	}

	/* 页码样式设置 */
</style>
