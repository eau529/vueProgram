<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-lx-calendar"></i> 数据标注
                </el-breadcrumb-item>
                <el-breadcrumb-item>多人标注</el-breadcrumb-item>
                <el-breadcrumb-item>任务管理</el-breadcrumb-item>
                <el-breadcrumb-item>任务详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
			<h2 class="detailsHeader">混凝土加水</h2>
            <el-descriptions column="3" direction="vertical"  border style="font-size: 15px;">
                <el-descriptions-item label="素材总数">1474</el-descriptions-item>
                <el-descriptions-item label="已标注数">855</el-descriptions-item>
                <el-descriptions-item label="已删除数">619</el-descriptions-item>
            </el-descriptions>
            <!-- <div>
                <el-table
                    :data="materialTable"
                    style="width: 100%">
                    <el-table-column
                        prop="materialNum"
                        label="素材总数"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="markedNum"
                        label="已标注数"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="deletedNum"
                        label="已删除数">
                    </el-table-column>
                </el-table>
            </div> -->
            <div class="memberList">成员进度列表</div>
            <div>
                <!-- <el-table :data="memberProgressList" :show-header="true" style="width: 100%"> -->
                <el-table :data="memberProgressList.slice((queryInfo.currentPage-1)*queryInfo.pagesize,queryInfo.currentPage*queryInfo.pagesize)" :show-header="true" style="width: 100%">
                    <el-table-column
                        prop="accountName"
                        label="子账号名">
                    </el-table-column>
                    <el-table-column
                        prop="tel"
                        label="手机号">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="昵称">
                    </el-table-column>
                    <el-table-column
                        prop="processedNumber"
                        label="已处理数">
                    </el-table-column>
                    <el-table-column
                        prop="deletedNumber"
                        label="已删除数">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-row  class="child">
            <el-col :span="24" class="paginations">
                <el-pagination
                    v-model:currentPage="queryInfo.currentPage"
                    v-model:page-size="queryInfo.pagesize"
                    :page-sizes="[5, 10, 20, 50]"
                    :small="false"
                    :disabled="false"
                    :background="false"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="memberProgressList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-col>
        </el-row>
    </div>
    
</template>

<script>
import {nanoid} from 'nanoid'
import { ref, reactive } from "vue";
export default {
    name: "details",
    data() {
        return {
            input:'',
            statusLabel:'',
            queryInfo:{
                //查询参数
                query: '',
                // 当前页码
                currentPage: 1,
                // 每页显示条数
                pagesize: 5,
            },
            formLabelWidth: '230px',
            memberProgressList:JSON.parse(localStorage.getItem('memberProgressList')) || [],
            memberProgressList: [
                {
                    accountName: "hqxuzesen",
                    tel: "--",
                    name:"华侨城标注员徐泽森",
                    processedNumber:"328",
                    deletedNumber:"334",
                },
                {
                    accountName: "hqyangkai",
                    tel: "--",
                    name:"华侨城标注员杨凯",
                    processedNumber:"527",
                    deletedNumber:"285",
                },
                {
                    accountName: "hqruiyuefeng",
                    tel: "--",
                    name:"AI工程师芮越峰",
                    processedNumber:"0",
                    deletedNumber:"0",
                },
                {
                    accountName: "hqruiyuefeng",
                    tel: "--",
                    name:"AI工程师芮越峰",
                    processedNumber:"0",
                    deletedNumber:"0",
                },
                {
                    accountName: "hqruiyuefeng",
                    tel: "--",
                    name:"AI工程师芮越峰",
                    processedNumber:"0",
                    deletedNumber:"0",
                },
                {
                    accountName: "hqruiyuefeng",
                    tel: "--",
                    name:"AI工程师芮越峰",
                    processedNumber:"0",
                    deletedNumber:"0",
                },
                {
                    accountName: "hqruiyuefeng",
                    tel: "--",
                    name:"AI工程师芮越峰",
                    processedNumber:"0",
                    deletedNumber:"0",
                },
            ],
            materialTable: [
                {
                    materialNum: "1474",
                    markedNum: "855",
                    deletedNum:"619",
                },
            ],
        }
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
        },
        handleCurrentChange(newPage) {
            this.queryInfo.currentPage = newPage
        },
    },
    mounted: function () {
	  this.$nextTick(function () {
	    // 仅在整个视图都被渲染之后才会运行的代码
		document.getElementsByClassName("collapse-btn")[0].click()
	  })
	},
    watch:{
        memberProgressList:{
            deep:true,
            handler(value){
                localStorage.setItem('memberProgressList',JSON.stringify(value))
            }
        },
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
.input-with-select {
    width: 220px;
    background-color: #fff;
}
.button-with-createTask{
    float:right;
    margin-right:5px;
}
.el-checkbox-group{
    margin-left:150px;
    margin-top: -20px;
}
.dialog-footer{
    float:right;
    margin-right:30px;
    margin-top:-20px;
}
.searchSelect{
    margin-bottom:20px;
}
.searchSelect .el-select{
    margin-right:15px;
}
.memberList{
    font-family:'微软雅黑';
    margin-top:20px;
    margin-bottom:20px;
    font-size: 18px;
    font-weight: bold;
}
.detailsHeader{
    margin-bottom:20px;
}
.child{
  position: absolute;
  right: 5%;
}
.paginations {
  padding-top: 10px;
}
</style>

