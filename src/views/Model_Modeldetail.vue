<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name:'mymodel'}">
                    我的模型
                </el-breadcrumb-item>
                <el-breadcrumb-item>模型详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="6">
                    <h2>{{title}}</h2>
                </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
                <el-col>
                    <div>
                        <el-radio-group v-model="radio1" size="large">
                            <!--                            需要动态加载-->
                            <el-radio-button v-for="(item,index) in category" :key="index" :label="item"
                                             @change="optionRenew"></el-radio-button>
                        </el-radio-group>
                    </div>
                </el-col>

                <el-col style="margin-top: 10px;" v-if="radio1!=='全部'">
                    <el-select v-model="categoryOption" class="m-2" placeholder="Select" size="large">
                        <el-option
                                v-for="(item,index) in categoryOptions"
                                :key="index"
                                :label="item.value"
                                :value="item.value"
                                @change="categoryFilter(radio1)"
                        >

                        </el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <div id="infiniteDiv" class="infiniteDiv" v-infinite-scroll="load">

                        <!--                                                <ul  class="infinite-list" style="overflow: auto">-->
                        <!--                                                    <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>-->
                        <!--                                                </ul>-->

                        <ul class="infinite-list" style="overflow: auto">
                            <el-row>
                                <el-col :span="8" v-for="(item, index) in categoryFilter(radio1,categoryOption)"
                                        :key="index">
                                    <div class="box-card">
                                        <el-card class="modelCard" shadow="always">
                                            <template #header>
                                                <div class="card-header">
                                                    <h2>版本：{{item.version}}</h2>
                                                    <span></span>
                                                    <el-button class="button" text circle
                                                               @click="deleteModel($event,item)">
                                                        <i class="el-icon-lx-delete"></i>
                                                    </el-button>
                                                </div>
                                            </template>

                                            <div class="card-body">
                                                <div class="card-body-item">模型总体性能：{{item.AiEvolutionary}}</div>
                                                <div class="card-body-item">智能调优：{{item.AiEvolutionary}}</div>
                                                <div class="card-body-item">训练开始时间：{{item.trainingTime}}</div>
                                                <div class="card-body-item">应用类型：{{item.category}}</div>
                                                <div class="card-body-item">
                                                    <el-row>
                                                        <el-col>
                                                            数据集：{{item.dataset}}
                                                            <router-link
                                                                    :to="{name:'modelDetail',params:{modelId:'123'}}">
                                                                <el-link class="link-color" :underline=false>
                                                                    <span class="el-icon-lx-link"></span>
                                                                </el-link>
                                                            </router-link>
                                                        </el-col>
                                                        <!--                                                        <el-col :span="4">-->
                                                        <!--                                                            <router-link   :to="{name:'modelDetail',params:{modelId:'123'}}">-->
                                                        <!--                                                                <el-link  class="link-color" :underline=false>-->

                                                        <!--                                                                    <u  style="font-size: 15px;">查看 </u>-->
                                                        <!--                                                                </el-link>-->
                                                        <!--                                                            </router-link>-->
                                                        <!--                                                        </el-col>-->

                                                    </el-row>

                                                </div>
                                                <el-divider/>
                                                <el-row>
                                                    <el-col :span=10 style="margin-bottom: 10px">
                                                        <h4>{{item.trainingState}}</h4>
                                                    </el-col>
                                                </el-row>
                                                <router-link class="link"
                                                             :to="{name:'verify'}">
                                                    <el-link :size="100" class="link-color">
                                                        校验
                                                    </el-link>
                                                </router-link>
                                                <router-link class="link"
                                                             :to="{name:'publish'}">
                                                    <el-link class="link-color">
                                                        导出
                                                    </el-link>
                                                </router-link>
                                                <router-link class="link"
                                                             :to="{name:''}">
                                                    <el-link class="link-color">
                                                        评估报告
                                                    </el-link>
                                                </router-link>
                                            </div>
                                        </el-card>
                                    </div>
                                </el-col>

                            </el-row>

                        </ul>


                    </div>

                </el-col>
            </el-row>
        </div>
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
    import {ElMessage, ElMessageBox} from 'element-plus'

    export default {
        name: "tabs",
        setup() {

            // 所有数据集
            const modelList2 = [
                {
                    id: 10,
                    version: "V10",
                    performance: "92.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S2",
                    dataset: "喷水训练数据A3",
                    trainingState: "训练完成"
                },
                {
                    id: 11,
                    version: "V9",
                    performance: "82.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S3",
                    dataset: "喷水训练数据A4",
                    trainingState: "训练完成"
                },
                {
                    id: 12,
                    version: "V8",
                    performance: "72.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S4",
                    dataset: "喷水训练数据A21",
                    trainingState: "训练完成"
                },
                {
                    id: 13,
                    version: "V7",
                    performance: "98.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S5",
                    dataset: "喷水训练数据A51",
                    trainingState: "训练完成"
                },
                {
                    id: 140,
                    version: "V6",
                    performance: "76.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S6",
                    dataset: "喷水训练数据A31",
                    trainingState: "训练完成"
                },
                {
                    id: 150,
                    version: "V5",
                    performance: "56.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S7",
                    dataset: "喷水训练数据A16",
                    trainingState: "训练完成"
                },
                {
                    id: 160,
                    version: "V4",
                    performance: "87.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S8",
                    dataset: "喷水训练数据A11",
                    trainingState: "训练完成"
                },
                {
                    id: 170,
                    version: "V3",
                    performance: "97.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S9",
                    dataset: "喷水训练数据A13",
                    trainingState: "训练完成"
                },
                {
                    id: 180,
                    version: "V2",
                    performance: "89.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S1",
                    dataset: "喷水训练数据A17",
                    trainingState: "训练完成"
                },
                {
                    id: 190,
                    version: "V10",
                    performance: "92.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S2",
                    dataset: "喷水训练数据A3",
                    trainingState: "训练完成"
                },
                {
                    id: 111,
                    version: "V9",
                    performance: "82.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S3",
                    dataset: "喷水训练数据A4",
                    trainingState: "训练完成"
                },
                {
                    id: 122,
                    version: "V8",
                    performance: "72.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S4",
                    dataset: "喷水训练数据A21",
                    trainingState: "训练完成"
                },
                {
                    id: 133,
                    version: "V7",
                    performance: "98.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S5",
                    dataset: "喷水训练数据A51",
                    trainingState: "训练完成"
                },
                {
                    id: 101,
                    version: "V6",
                    performance: "76.2%",
                    AiEvolutionary: "启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S6",
                    dataset: "喷水训练数据A31",
                    trainingState: "训练完成"
                },
                {
                    id: 102,
                    version: "V5",
                    performance: "56.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S7",
                    dataset: "喷水训练数据A16",
                    trainingState: "训练完成"
                },
                {
                    id: 103,
                    version: "V4",
                    performance: "87.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S8",
                    dataset: "喷水训练数据A11",
                    trainingState: "训练完成"
                },
                {
                    id: 104,
                    version: "V3",
                    performance: "97.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S9",
                    dataset: "喷水训练数据A13",
                    trainingState: "训练完成"
                },
                {
                    id: 105,
                    version: "V2",
                    performance: "89.2%",
                    AiEvolutionary: "未启用",
                    DPIEvolutionary: "未启用",
                    trainingTime: "2022-07-07 12:39:15",
                    category: "云部署_S1",
                    dataset: "喷水训练数据A17",
                    trainingState: "训练完成"
                },
            ]
            localStorage.setItem("modelDetailDataset", localStorage.getItem("modelDetailDataset") || JSON.stringify(modelList2))

            const modelList = reactive(JSON.parse(localStorage.getItem('modelDetailDataset')) || [])
            const modelListView = reactive([])
            watchEffect(() => {
                // console.log("watcheffect")
                localStorage.setItem('modelDetailDataset', JSON.stringify(modelList))
            })
            const count = ref(0);
            const radio1 = ref('全部');
            const categoryOption = ref('全部')
            const load = () => {
                modelListView.push(modelList[modelListView.length])
                modelListView.push(modelList[modelListView.length + 1])
                modelListView.push(modelList[modelListView.length + 2])
            };
            const category = [
                '全部', '云部署', 'AI超脑', 'AI摄像机'
            ]
            const value = ref('全部')

            const categoryOptions = reactive([])

            const modelListViewFilterByCategory = () => {
                // modelListView.push()
                console.log(modelListView)
                let temp = modelListView.filter((item, index, arr) => {
                    // console.log("item"+item['category'])
                    // console.log("category"+categoryOption.value)
                    // console.log(categoryOption)
                    console.log(item['category'] === categoryOption.value)

                    return item['category'] === categoryOption.value
                })
                //
                console.log(temp)
                modelListView.splice(0, modelListView.length)
                modelListView.push(...temp)
                // console.log(modelListView)
            };

            const team = ref("first");

            watch(radio1, (newValue, oldValue) => {
                let prefix = newValue
                categoryOptions.splice(0, categoryOptions.length)
                let categoryList = new Set()
                // let optionsA = new Array()
                let entire = {
                    value: '全部',
                    name: '全部'
                }
                let modelListFilter = modelList.filter(item => {
                    return item.category.includes(prefix)
                })

                for (let i = 0; i < modelListFilter.length; i++) {
                    categoryList.add(modelListFilter[i].category)
                }
                let copyCategoryListSort = new Array()
                for (let key of categoryList.keys()) {
                    let item = {
                        value: key,
                        label: key
                    }
                    // console.log(item)
                    copyCategoryListSort.push(item)
                }
                // copyCategoryListSort.sort()
                copyCategoryListSort.sort((a, b) => {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    } else {
                        return 0
                    }
                })
                categoryOptions.push(entire)
                for (let copyCategoryListSortElement of copyCategoryListSort) {
                    categoryOptions.push(copyCategoryListSortElement)
                }
            })


            const handleEdit = (index) => {
                console.log("handleEdit");
            };
            const handleDel = (index) => {
                console.log("handleDel");
            };

            const handleClick = (tab, event) => {
                console.log(tab, event)

            };
            const openDeleteMSB = (item) => {
                ElMessageBox.confirm(
                    '确认要删除此模型吗？',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                    .then(() => {
                        ElMessage({
                            type: 'success',
                            message: '已删除',
                        })
                        console.log(item)
                        console.log(modelList)
                        console.log(modelList.indexOf(item))
                        modelList.splice(modelList.indexOf(item), 1)
                        modelListView.splice(modelListView.indexOf(item), 1)
                        // modelListView.push(modelList[Math.random()*10])

                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消删除',
                        })
                    })
            }
            const optionRenew = () => {
                categoryOption.value = '全部'
            };
            return {
                count,
                load,
                category,
                value,
                categoryOptions,
                team,
                radio1,
                handleEdit,
                handleDel,
                handleClick,
                openDeleteMSB,
                modelList,
                modelListView,
                categoryOption,
                modelListViewFilterByCategory,
                optionRenew
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
                title: "模型详情",
                input: '',
                dialogForm: {
                    teamName: '',
                    teamDiscription: '',
                },
                queryInfo: {
                    //查询参数
                    query: '',
                    // 当前页码
                    pagenum: 1,
                    // 每页显示条数
                    pagesize: 2
                },
                dialogFormVisible: false,
                formLabelWidth: '230px',
                AllTeamMembers: generateData(),
                TeamMembers: [],
                rules: {
                    teamName: [{
                        required: true,
                        message: 'Please input Team name',
                        trigger: 'blur'
                    },]
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
        computed: {},
        methods: {

            categoryFilter(category, categoryOption) {
                console.log('categoryFilter')
                if (category !== '全部') {

                    return this.modelListView
                        .filter((item, index, arr) => {
                            return item.category.includes(category)
                        })
                        .filter((item,index,arr) => {
                            if (this.categoryOption === '全部') {
                                return true
                            }else{
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
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
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
<style>
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
    .el-table >>> .el-table__expanded-cell[class*="cell"] {
        background: #f5f7fa;
        /*padding-top: 0px;*/
        padding: 0 0 0 0;
    }

    .typeList >>> .el-table__row {
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

    .infinite-list .infinite-list-item + .list-item {
        margin-top: 10px;
    }
</style>
