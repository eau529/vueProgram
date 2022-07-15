<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">AI一体化训练平台</div>
			<div style="padding-top:5%">
				<div style="margin-left:10%;margin-right:10%;float:center;" >
					<el-tabs  v-model="message" @tab-click="handleClick" stretch>
						<el-tab-pane
							label="企业账号登录"
							name="first">
						</el-tab-pane>
						<el-tab-pane
							label="&nbsp;&nbsp;&nbsp;企业子账号登录 &nbsp;&nbsp;&nbsp;"
							name="second">
						</el-tab-pane>
					
					</el-tabs>
				</div>
			<div>
				<template v-if="message === 'first'">
				<div style="">
				<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" style="margin-top: 30px;">
				    <div style="">
					<el-form-item prop="username">
				        <el-input v-model="param.username" placeholder="username">
				            <template #prepend>
				                <el-button icon="el-icon-user"></el-button>
				            </template>
				        </el-input>
				    </el-form-item>
				    <el-form-item prop="password">
				        <el-input type="password" placeholder="password" v-model="param.password"
				            @keyup.enter="submitForm()">
				            <template #prepend>
				                <el-button icon="el-icon-lock"></el-button>
				            </template>
				        </el-input>
				    </el-form-item>
					</div>
				    <div class="login-btn" style="padding-top:47px">
				        <el-button type="primary" @click="submitForm()">登录</el-button>
				    </div>
				    <p class="login-tips">Tips : 用户名和密码由管理员提供。</p>
				</el-form>
				</div>
				</template>
			
				<template v-if="message === 'second'">
				<div style="">
				<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" style="margin-top: 30px;">
				    <el-form-item prop="account">
				        <el-input v-model="param.account" placeholder="account">
				            <template #prepend>
				                <el-button icon="el-icon-user"></el-button>
				            </template>
				        </el-input>
				    </el-form-item>
					
					<el-form-item prop="sub_account">
					    <el-input v-model="param.sub_account" placeholder="sub_account">
					        <template #prepend>
					            <el-button icon="el-icon-user"></el-button>
					        </template>
					    </el-input>
					</el-form-item>
					
				    <el-form-item prop="sub_password">
				        <el-input type="password" placeholder="sub_password" v-model="param.sub_password"
				            @keyup.enter="submitForm()">
				            <template #prepend>
				                <el-button icon="el-icon-lock"></el-button>
				            </template>
				        </el-input>
				    </el-form-item>
				    <div class="login-btn">
				        <el-button type="primary" @click="submitForm()">登录</el-button>
				    </div>
				    <p class="login-tips">Tips : 用户名和密码由管理员提供。</p>
				</el-form>
				</div>
				</template>
			
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import {
		ref,
		reactive
	} from "vue";
	import {
		useStore
	} from "vuex";
	import {
		useRouter
	} from "vue-router";
	import {
		ElMessage
	} from "element-plus";

	export default {
		setup() {
			const message = ref("first");
			const router = useRouter();
			const param = reactive({
				username: "admin",
				password: "123123",
				account: "account",
				sub_account: "sub_account",
				sub_password: "sub_password",
			});

			const rules = {
				username: [{
					required: true,
					message: "请输入用户名",
					trigger: "blur",
				}, ],
				password: [{
					required: true,
					message: "请输入密码",
					trigger: "blur"
				}, ],
				account: [{
					required: true,
					message: "请输入主体账号名称",
					trigger: "blur"
				}, ],
				sub_account: [{
					required: true,
					message: "请输入子账号名称",
					trigger: "blur"
				}, ],
				sub_password: [{
					required: true,
					message: "请输子账号密码",
					trigger: "blur"
				}, ],
			};
			const login = ref(null);
			const submitForm = () => {
				login.value.validate((valid) => {
					if (valid) {
						ElMessage.success("登录成功");
						localStorage.setItem("ms_username", param.username);
						router.push("/");
					} else {
						ElMessage.error("登录失败");
						return false;
					}
				});
			};

			const store = useStore();
			store.commit("clearTags");

			return {
				message,
				param,
				rules,
				login,
				submitForm,
			};
		},
		data() {
			return {
				activeName: 'second'
			};
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			}
		}
	};
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../assets/img/login-bg.jpg);
		background-size: cover;
		background-repeat:no-repeat;
		background-attachment: fixed;
	}

	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -190px 0 0 -175px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.ms-content {
		padding: 30px 30px;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
</style>
