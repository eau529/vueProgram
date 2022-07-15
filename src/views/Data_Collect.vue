<template>
	<div>
		<div class="container">
			<div>
				<span class="pageTitle">回传管理</span>
				<span class="hideFunction">
					<i class="el-icon-lx-attentionforbid el-icon--left" v-if="showTips"></i>
					<i class="el-icon-lx-attention el-icon--left" v-else></i>
					<el-button type="text"  @click="changeShowTips" style="color: rgb(117,120,137); font-weight: 5">
						<span v-if="showTips">隐藏</span>
						<span v-else>显示</span>功能说明
					</el-button>
				</span>
			</div>
			<transition-group name="fade">
				<div v-if="showTips" style="margin-top:20px">
					<el-alert title="支持回传数据的管理以及导出工作。" type="info" show-icon @close="changeShowTips">
					</el-alert>
				</div>
			</transition-group>
			<div style="margin: 20px 0;"></div>
			<div style="background-color: #fff ;height: 100%;">
				<el-main style="height: 80%;">
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
						<el-row>
						<el-col :span="18">
							<el-form-item>
									<el-select v-model="value" placeholder="图片">
										<el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
							</el-form-item>
							<el-form-item>
								<div class="block">
									<el-date-picker
									v-model="value"
									type="daterange"
									start-placeholder="回传开始时间"
									end-placeholder="回传结束时间"
									:default-time="['00:00:00', '23:59:59']">
									</el-date-picker>
								</div>
							</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label-position:right>
								<el-input
								type="text"
								suffix-icon="el-icon-search"
								v-model="kb_content"
								placeholder="请输入检查数据集名称"
								style="width: 270px; cursor: pointer"
								@keyup.enter.native="getAllKb"
								></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-table
						:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
						:header-cell-style="{background:'#e4e7f3'}"
						style="width: 100%">
							<el-table-column
								prop="datasetName"
								label="数据集名称">
							</el-table-column>
							<el-table-column
								prop="dataType"
								label="数据类型">
							</el-table-column>
							<el-table-column
							prop="lastReturnTime"
							label="最近回传时间">
							</el-table-column>
							<el-table-column
							prop="proportionOfImportedData"
							label="已导入数据集数据数/全部数据数">
							<template v-slot="scope">
								<el-progress :percentage="setItemProgress(scope.row)" color='#67c23a' :format="setItemText(scope.row)"></el-progress>
							</template>
							</el-table-column>
							<el-table-column
							prop="operate"
							label="操作">
							<template #default="scope">
								<el-button type="text" size="small" @click="handleEdit(scope.$index)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-main>
			</div>
		</div>
		<!-- <el-row  class="child" >
			<el-col :span="24" class="paginations" v-if="tableData.length">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.length">
				</el-pagination>
			</el-col>
		</el-row> -->
		<el-row  class="child" >
		    <el-col :span="24" class="paginations" v-if="tableData.length">
		        <el-pagination
		            v-model:currentPage="currentPage"
		            v-model:page-size="pageSize"
		            :page-sizes="[2, 5, 10, 20, 50]"
		            :small="false"
		            :disabled="false"
		            :background="false"
		            layout="total, sizes, prev, pager, next, jumper"
		            :total="tableData.length"
		            @size-change="handleSizeChange"
		            @current-change="handleCurrentChange"
		        />
		    </el-col>
		</el-row>
	</div>
</template>

<script>
  export default {
    data() {
      return {
		showTips: true,
        tableData: [{
          datasetName: '混合',
          dataType: '图片',
          lastReturnTime: '2021-07-05 19:09:14',
		  importedData: 4,
		  totalData: 63
        }, {
          datasetName: '检测',
          dataType: '图片',
          lastReturnTime: '2021-07-05 19:04:35',
		  importedData: 13, 
		  totalData: 100
        }, {
          datasetName: 'fc多属性分类',
          dataType: '图片',
          lastReturnTime: '2021-07-05 18:57:16',
		  importedData: 13, 
		  totalData: 22
        }, {
          datasetName: '单分类',
          dataType: '图片',
          lastReturnTime: '2021-07-05 18:54:34',
		  importedData: 6, 
		  totalData: 23
        }],
		options: [{
		    value: '选项1',
		    label: '图片'
		}, {
		    value: '选项2',
		    label: '视频'
		}],
		activeNames:'1',
		currentPage: 1,
		pageSize:2,
      }
    },
	methods: {
		// 隐藏功能显示
        changeShowTips(){
            this.showTips = !this.showTips
        },
		setItemProgress(data) {
		    if (data.importedData > data.totalData) {
		        return 100
		    } else {
		        return parseInt((data.importedData / data.totalData).toFixed(1) * 100)
		    }
		},
		setItemText(data) {
		    const percentage = Math.ceil(data.importedData/data.totalData*100)
			return () => {
			    return '(' + data.importedData + '/' + data.totalData + ') ' + percentage + '%'
			}
			
		},
		handleSizeChange(val) {
		    console.log(`每页 ${val} 条`);
			this.pageSize = val
		},
		handleCurrentChange(val) {
		    console.log(`当前页: ${val}`);
			this.currentPage = val
		}
	},
 };
</script>

<style scoped>
	.el-collapse-item__arrow{
		margin: 0;
	}
	.el-card__header, .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap{
		border: 0;
	}
	.el-input__inner{
		height: 32px;
	}
	.el-table td, .el-table th{
		height: 36px;
	}
	.el-table__row td, .el-table__row th{
		height: 36px;
	}
	.pageTitle{
		font-size: 24.5px;
		font-weight: bold
	}
	.hideFunction{
		float:right;
		margin-right:15px;
	}
	.fade-enter-active,
	.fade-leave-active {
	transition: opacity 0.3s linear;
	}
	.fade-enter-from,
	.fade-leave-to {
	opacity: 0;
	}
	.child{
	position: absolute;
	right: 5%;
	}
	.paginations {
	padding-top: 10px;
	}
</style>