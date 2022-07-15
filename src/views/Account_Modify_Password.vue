<template>
	<div>
		<el-container style="height: 100%; width: 80%;margin: auto;">
			<el-main>
				<el-card class="box-card main_card_body">
				  <div slot="header" class="clearfix main_card">
					<h3>修改密码</h3>
				  </div>
					<div style="text-align: center; margin: 80px 0;">
						<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						  <el-form-item class="el-form-item_input" prop="oldPass" label-width=0>
						    <el-input :type="ruleFormShow.oldPassShow.showType" v-model="ruleForm.oldPass" placeholder="请输入旧密码" prefix-icon="el-icon-lock">
								<template #suffix>
									<i class="el-icon-lx-attentionforbid el-icon--left" @click="toggle_showTips('oldPass')" v-show="!ruleFormShow.oldPassShow.flag"></i>
									<i class="el-icon-lx-attention el-icon--left" @click="toggle_showTips('oldPass')" v-show="ruleFormShow.oldPassShow.flag"></i>
								</template>
							</el-input>
						  </el-form-item>
						  <el-form-item class="el-form-item_input" prop="newPass" label-width=0>
						    <el-input :type="ruleFormShow.newPassShow.showType" v-model="ruleForm.newPass" placeholder="请输入新密码" prefix-icon="el-icon-lock">
								<template #suffix>
									<i class="el-icon-lx-attentionforbid el-icon--left" @click="toggle_showTips('newPass')" v-show="!ruleFormShow.newPassShow.flag"></i>
									<i class="el-icon-lx-attention el-icon--left" @click="toggle_showTips('newPass')" v-show="ruleFormShow.newPassShow.flag"></i>
								</template>
							</el-input>
						  </el-form-item>
						  <el-form-item class="el-form-item_input" prop="checkNewPass" label-width=0>
						    <el-input :type="ruleFormShow.checkNewPassShow.showType" v-model="ruleForm.checkNewPass" placeholder="重新输入新密码" prefix-icon="el-icon-lock">
								<template #suffix>
									<i class="el-icon-lx-attentionforbid el-icon--left" @click="toggle_showTips('checkNewPass')" v-show="!ruleFormShow.checkNewPassShow.flag"></i>
									<i class="el-icon-lx-attention el-icon--left" @click="toggle_showTips('checkNewPass')" v-show="ruleFormShow.checkNewPassShow.flag"></i>
								</template>
							</el-input>
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
			var validateOldPass = (rule, value, callback) => {
				if (value === '') {
			        callback(new Error('请输入旧密码'));
			    } else {
			        if (this.ruleForm.oldPass !== '') {
						this.$refs.ruleForm.validateField('oldPass');
			        }
			        callback();
			    }
			};
			var validateNewPass = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请输入新密码'));
			    } else {
			        if (this.ruleForm.newPass !== '') {
						this.$refs.ruleForm.validateField('newPass');
			        }
			        callback();
			    }
			};
			var validateNewPass2 = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error('请再次输入新密码'));
			    } else if (value !== this.ruleForm.newPass) {
			        callback(new Error('两次输入新密码不一致!'));
			    } else {
			        callback();
			    }
			};
			return {
				ruleForm: {
				    oldPass: '',
				    newPass: '',
				    checkNewPass: ''
				},
			    rules: {
			        oldPass: [
			            { validator: validateOldPass, trigger: 'blur' }
			        ],
			        newPass: [
			            { validator: validateNewPass, trigger: 'blur' }
			        ],
			        checkNewPass: [
			            { validator: validateNewPass2, trigger: 'blur' }
			        ]
			    },
				ruleFormShow: {
				    oldPassShow: {
						flag:false,
						showType:'password'
					},
				    newPassShow: {
						flag:false,
						showType:'password'
					},
				    checkNewPassShow: {
						flag:false,
						showType:'password'
					},
				},
			};
		},
		methods:{
			toggle_showTips(data){
				if(data === 'oldPass'){
					this.ruleFormShow.oldPassShow.flag = !this.ruleFormShow.oldPassShow.flag;
					if(this.ruleFormShow.oldPassShow.showType === 'password'){
						this.ruleFormShow.oldPassShow.showType = '';
					}else{
						this.ruleFormShow.oldPassShow.showType = 'password'
					}
				}else if(data === 'newPass'){
					this.ruleFormShow.newPassShow.flag = !this.ruleFormShow.newPassShow.flag;
					if(this.ruleFormShow.newPassShow.showType === 'password'){
						this.ruleFormShow.newPassShow.showType = '';
					}else{
						this.ruleFormShow.newPassShow.showType = 'password'
					}
				}else if(data === 'checkNewPass'){
					this.ruleFormShow.checkNewPassShow.flag = !this.ruleFormShow.checkNewPassShow.flag;
					if(this.ruleFormShow.checkNewPassShow.showType === 'password'){
						this.ruleFormShow.checkNewPassShow.showType = '';
					}else{
						this.ruleFormShow.checkNewPassShow.showType = 'password'
					}
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
		},
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