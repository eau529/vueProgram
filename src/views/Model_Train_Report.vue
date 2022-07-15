<template>
	<div>
		<div class="container" style="background-color: #fff;position:absolute;top:0;bottom: 0;left: 0;right: 0;">
			<el-container style="position:absolute;top:0;bottom: 0;left: 0;right: 0;padding: 10px;">
				<el-header style="height: 75px;">
					<p style="margin: 10px 0;">
						<i class="el-icon-back"></i><span @click="this.$router.push('/model/mymodel')">我的模型</span>
						<i class="el-icon-arrow-right"></i><span class="platform">{{ modelName }}</span>
						<i class="el-icon-arrow-right"></i><span>评估报告</span>
					</p>
					<p>
						<el-popover title="模型分析说明：" width="300px" trigger="click">
							<template #reference>
								<el-button size="mini" type="info" plain>模型版本{{ modelVersion }}</el-button>
							</template>
							<template #default>
								<el-row type="flex" class="row-bg" justify="center">
									<el-col :span="11" style="text-align: end;">
										<p>模型版本：</p>
										<p>应用类型：</p>
										<p>训练开始时间：</p>
										<p>数据集版本：</p>
										<p>有目标标注图片数：</p>
										<p>模型总体性能：</p>
										<p>智能调优：</p>
									</el-col>
									<el-col :span="13">
										<p>航运中心火焰烟雾（V3）</p>
										<p>AI摄像机/H7/OPAI_V2.0</p>
										<p>2022-07-01 08:44:34</p>
										<p>查看</p>
										<p>130</p>
										<p>98.8%</p>
										<p>启用</p>
									</el-col>
								</el-row>
							</template>
						</el-popover>
						<span class="platform">训练时间 {{ trainTime }}</span>
					</p>
				</el-header>
				<el-main style="height: 100%;">
					<div class="model_analysis_title">数据分析</div>
					<div class="model_analysis_content">
						无明显数据问题
					</div>
					<div class="model_analysis_title">
						模型分析
						<el-popover placement="top-start" title="模型分析说明：" width="200" trigger="hover">
							<template #reference>
								<i class="el-icon-question"></i>
							</template>
							<template #default>
								<p>mAP ≥ 0.9：模型效果优秀。</p>
								<p>0.7 ≤ mAP &lt; 0.9：模型效果良好，建议针对错误分类图片进行优化.</p>
								<p>0.5 ≤ mAP &lt; 0.7：模型效果一般，建议增加训练数据，检查标注信息正确性（漏标、错标）。</p>
								<p>mAP &lt; 0.5：模型效果较差，建议检查标注信息正确性（漏标、错标），添加训练数据。</p>
							</template>
						</el-popover>
					</div>
					<div class="model_analysis_content">
						模型效果优秀
					</div>
					<div class="model_analysis_title">
						模型性能（mAP）
						<el-popover placement="top-start" title="模型性能（mAP）说明：" width="200" trigger="hover">
							<template #reference>
								<i class="el-icon-question"></i>
							</template>
							<template #default>
								<p>每类目标的AP值之和/目标类别数。mAP值越大，模型性能越好。</p>
							</template>
						</el-popover>
					</div>
					<div class="model_analysis_content">
						<el-progress percentage="98.8" color="rgb(6, 184, 130)"></el-progress>
					</div>
					<div v-for="item in analysis_tag">
						<div class="model_analysis_title">
							检测标签：{{ item.tag }}
						</div>
						<div class="model_analysis_content model_analysis_progress">
							<el-row type="flex" class="row-bg" justify="space-between">
								<el-col :span="8">
									<div class="circleBox">
										<el-progress type="circle" :percentage="item.performance" :show-text="false"
											:stroke-width="15"></el-progress>
										<div class="circleCenter">
							   	<p>评估性能</p>
											<p>{{item.performance}}%</p>
										</div>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="circleBox">
										<el-progress type="circle" :percentage="item.detection" :show-text="false"
											:stroke-width="15"></el-progress>
										<div class="circleCenter">
											<p>检出率</p>
											<p>{{item.detection}}%</p>
										</div>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="circleBox">
										<el-progress type="circle" :percentage="item.accuracy" :show-text="false"
											:stroke-width="15"></el-progress>
										<div class="circleCenter">
											<p>检准率</p>
											<p>{{item.accuracy}}%</p>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
						<div>
							<el-row type="flex" class="row-bg" justify="space-around">
								<el-col :span="7">
									<i class="el-icon-s-order"></i>
									<el-link>如何解读标签综合评分图？</el-link>
								</el-col>
								<el-col :span="7">
									<i class="el-icon-location"></i>
									<span>推荐使用阈值<span class="high-light-text ">30%</span></span>
									<el-popover placement="top-start" title="模型性能（mAP）说明：" width="200" trigger="hover">
										<template #reference>
											<i class="el-icon-question"></i>
										</template>
										<template #default>
											<p>该数值为百分比，根据您具体设备的最大值进行配置。例如您设备可配置最大置信度为1000，推荐阈值是30%，则您配置值为1000*30%=300
											</p>
										</template>
									</el-popover>
								</el-col>
								<el-col :span="8">
									<el-radio-group v-model="radio1" style="margin-right: 2%;">
										<el-radio-button label="检出率"></el-radio-button>
										<el-radio-button label="检准率"></el-radio-button>
									</el-radio-group>
									<el-input style="width: 25%;margin-right: 2%;" v-model="input" placeholder="1~100%">
									</el-input>
									<el-button type="primary" plain>搜索</el-button>
								</el-col>
							</el-row>
						</div>
						<div>
							<el-table border style="margin-top: 50px;" :data="item.originData">
								<el-table-column v-for="(item, index) in transTitle" :label="item" :key="index"
									align="center">
									<template #default="scope">
										{{scope.row[index]}}
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-main>
			</el-container>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				transTitle: ['阈值', '10%', '20%', '30%', '40%', '50%', '60%', '70%', ',80%', '90%', '100%'],
				analysis_tag: [{
					tag: '火焰',
					performance: 99.9,
					detection: 100,
					accuracy: 92.3,
					originData: [
						['检出率', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%',
						'100%'],
						['检准率', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%',
							'92.3%', '92.3%'
						],
					],
				}, {
					tag: '烟雾',
					performance: 97.7,
					detection: 100,
					accuracy: 76.5,
					originData: [
						['检出率', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%',
						'100%'],
						['检准率', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%', '92.3%',
							'92.3%', '92.3%'
						],
					],
				}],

			}
		},
		computed: {
			modelName() {
				var modelName = this.$route.query.modelName;
				return modelName;
			},
			modelVersion() {
				var modelVersion = this.$route.query.version;
				return modelVersion;
			},
			trainTime() {
				var trainTime = this.$route.query.trainTime;
				return trainTime;
			}
		}
	};
</script>

<style scoped>
	.model_analysis_title {
		display: flex;
		margin-top: 16px;
		font-size: 16px;
		color: rgba(40, 46, 66, .8);
		letter-spacing: 0;
		line-height: 24px;
		font-weight: 600;
	}

	.model_analysis_content,
	.platform {
		margin-top: 8px;
		font-size: 14px;
		color: rgba(0, 0, 0, .5);
		letter-spacing: 0;
		line-height: 20px;
	}

	.model_analysis_progress {
		padding: 15px 0;
		background-color: #f3f5fc;
		margin-bottom: 15px;
	}

	.circleBox {
		position: relative;
		text-align: center;
	}

	.circleCenter {
		position: absolute;
		top: 50px;
		left: 45%;
	}

	.high-light-text {
		font-size: 22px;
		color: #3569f4;
		font-weight: 600;
	}
</style>
