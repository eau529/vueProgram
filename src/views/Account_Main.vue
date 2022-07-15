<template>
	<div>
		<el-container style="height: 100%;">
			<el-main>
				<div style="margin-bottom: 15px;">
				<el-card class="box-card">
					<el-image :src="block_tag"></el-image>
					<div slot="header" class="clearfix" style="margin-bottom: 20px;">
						<el-row type="flex" class="row-bg" justify="space-between">
							<el-col :span="10">
								<span>基本信息</span>
							</el-col>
							<el-col :span="4">
								<router-link :to="{path:'/account-center/modify-phone'}">修改手机号</router-link> 
								<span style="margin: 0 10px;">|</span>
								<router-link :to="{path:'/account-center/modify-password'}">修改密码</router-link> 
							</el-col>
						</el-row>
					</div>
					<div style="margin: 20px 0;">
						<el-row type="flex" class="row-bg">
							<el-col :span="10">主体账号名cscecfzjs</el-col>
							<el-col :span="7">账号名cscecfzjs</el-col>
							<el-col :span="7">手机号18845633603</el-col>
						</el-row>
					</div>
					<div style="margin: 20px 0;">
						<el-row type="flex" class="row-bg">
							<el-col :span="10">
								APPKey 4b5a4c9fefbc4a369e913a27f0766de7
								<el-link style="margin-left: 10px;" type="primary">复制</el-link>
							</el-col>
							<el-col :span="14">
								APPSecret 55e7a458d8c22445ac5fed7a5d553bcd6
								<el-link style="margin-left: 10px;" type="primary">复制</el-link>
							</el-col>
						</el-row>
					</div>
				</el-card>
				</div>
				<div style="margin-bottom: 15px;">
				<el-card class="box-card">
					<el-image :src="block_tag"></el-image>
					<div slot="header" class="clearfix" style="margin-bottom: 20px;">
						<span>认证信息</span>
					</div>
					<div style="padding: 15px;border:1px solid #DCDFE6;">
						<el-row type="flex" class="row-bg" justify="space-between">
							<el-col :span="12">
								<p style="margin: 20px 0;">您已通过海康威视AI开放平台企业认证</p>
								<div style="margin: 20px 0;">
									<el-row type="flex" class="row-bg">
										<el-col :span="12">名称 中建八局发展建设有限公司</el-col>
										<el-col :span="12">认证时间 2021-09-29 09:57</el-col>
									</el-row>
								</div>
								<p>证件号 913**********NXE</p>
							</el-col>
							<el-col :span="8">
								<div style="text-align: center;justify-content: center;border-left:1px solid #DCDFE6 ;">
									<el-image :src="certification_tag"></el-image>
									<p><el-link type="primary">查看认证详情</el-link></p>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-card>
				</div>
				<div style="margin-bottom: 15px;">
				<el-card class="box-card">
					<el-image :src="block_tag"></el-image>
					<div slot="header" class="clearfix">
						<span>服务商信息</span>
					</div>
					<div style="text-align: center;justify-content: center;">
						<p><el-link type="primary">服务商入驻</el-link></p>
					</div>
				</el-card>
			</div>
			<div>
				<el-card class="box-card">
					<el-image :src="block_tag"></el-image>
					<div slot="header" class="clearfix">
						<span>合作伙伴信息</span>
					</div>
					<div style="text-align: center;justify-content: center;">
						<p><el-link type="primary">合作伙伴入驻</el-link></p>
					</div>
				</el-card>
			</div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import block_tag from "../assets/img/block_tag.png";
	import certification_tag from "../assets/img/certification_tag.png";
	
	export default {
		setup(){
			return{
				block_tag,
				certification_tag,
			};
		},
		data() {
			return {
			
			}
		}
	};
</script>

<style scoped>
	a{
		color: #409EFF;
	}
	.el-card__body {
	    padding-top: 0;
		padding-bottom: 30px;
	}
	
</style>