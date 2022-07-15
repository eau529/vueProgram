<template>
	<div>
		<el-container style="height: 100%; width: 80%;margin: auto;">
			<el-main>
				<el-card class="box-card main_card_body">
					<div slot="header" class="clearfix main_card">
						<h3>修改手机号</h3>
					</div>
					<div style="text-align: center; margin: 80px 0;">
						<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						  <el-form-item class="el-form-item_input" prop="pass" label-width=0>
						    <el-input :type="showType" v-model="ruleForm.pass" placeholder="请输入密码" prefix-icon="el-icon-lock">
								<template #suffix>
									<i class="el-icon-lx-attentionforbid el-icon--left" @click="toggle_showTips()" v-show="!showTips"></i>
									<i class="el-icon-lx-attention el-icon--left" @click="toggle_showTips()" v-show="showTips"></i>
								</template>
							</el-input>
						  </el-form-item>
						  <el-form-item class="el-form-item_input" prop="newPhone" label-width=0>
						    <el-input type="text" v-model="ruleForm.newPhone" placeholder="请输入新手机号" prefix-icon="el-icon-mobile-phone"></el-input>
						  </el-form-item>
						  <el-form-item class="el-form-item_input" prop="verificationCode" label-width=0>
						    <el-row type="flex" class="row-bg" justify="space-between">
								<el-col :span="12">
									<el-input type="text" v-model="ruleForm.verificationCode" placeholder="请输入验证码" prefix-icon="el-icon-c-scale-to-original">
									</el-input>
								</el-col>
								<el-col :span="10">
									<el-button type="primary" plain size="small">获取验证码</el-button>
								</el-col>
							</el-row>
						  </el-form-item>
						  <el-form-item label-width=0>
						    <el-row type="flex" class="row-bg" justify="space-around">
								<el-col :span="12">
									<el-button @click="resetForm('ruleForm')">取消</el-button>
								</el-col>
								<el-col :span="12">
									<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
								</el-col>
							</el-row>
						  </el-form-item>
						</el-form>
					</div>
				</el-card>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import modify_back from "../assets/img/modify_back.png";
	
	export default {
		setup(){
			return{
				modify_back,
			};
		},
		data() {
			var validatePass = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请输入密码'));
			    } else {
			        if (this.ruleForm.pass !== '') {
						this.$refs.ruleForm.validateField('pass');
			        }
			        callback();
			    }
			};
			var validatePhone = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请输入新手机号'));
			    } else {
			        if (this.ruleForm.newPhone !== '') {
						this.$refs.ruleForm.validateField('newPhone');
			        }
			        callback();
			    }
			};
			var validateVerificationCode = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请输入验证码'));
			    } else {
			        if (this.ruleForm.verificationCode !== '') {
						this.$refs.ruleForm.validateField('verificationCode');
			        }
			        callback();
			    }
			};
			return {
			    ruleForm: {
			        pass: '',
			        newPhone: '',
			        verificationCode: ''
			    },
			    rules: {
			        pass: [
			            { validator: validatePass, trigger: 'blur' }
			        ],
			        newPhone: [
			            { validator: validatePhone, trigger: 'blur' }
			        ],
			        verificationCode: [
			            { validator: validateVerificationCode, trigger: 'blur' }
			        ]
			    },
				showTips: false,// 密码的显示与隐藏
				showType:'password'
			};
		},
		methods:{
			toggle_showTips(){
				this.showTips = !this.showTips;
				if(this.showType === 'password'){
					this.showType = '';
				}else{
					this.showType = 'password';
				}
			},
			submitForm(formName) {
			    this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(this.ruleForm)
			            alert('submit!');
					} else {
			            console.log('error submit!!');
			            return false;
			        }
			    });
			},
			resetForm(formName) {
			    this.$refs[formName].resetFields();
			},
		}
	};
</script>

<style scoped>
	.main_card_body .el-card__body{
		padding: 0;
	}
	.main_card{
		background: url("../assets/img/modify_back.png");
		height: 80px;
		padding:40px 0 0 10%;
		
	}
	.el-form-item{
		width: 30%;
		margin: 15px auto;
	}
	.el-button{
		width: 90%;
	}
	.el-input__inner{
		border: 0;
	}
	.el-form-item_input .el-form-item__content{
		border-bottom: 1px solid #DCDFE6;
	}
</style>