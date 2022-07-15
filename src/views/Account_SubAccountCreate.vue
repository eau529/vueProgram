<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name:'subAccount'}">
                    子账号管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>创建子账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h2>创建子账号</h2>
            <!--            style="display: flex;justify-content: center"-->
            <div>

                <el-row>
                    <el-col style="margin-top: 30px;">
                        <el-form
                                :model="createAccountForm"
                                :rules="rules"
                                label-width="120px"
                                autocp>
                            <el-form-item style="width: 55%" label="子账号名" prop="account">
                                <el-input
                                        placeholder="请输入子账号名"
                                        v-model="createAccountForm.account"

                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item style="width:55%" label="昵称" prop="nick">
                                <el-input
                                        placeholder="请输入昵称"
                                        v-model="createAccountForm.nick"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item style="width: 55%" label="手机" prop="phone">
                                <el-input
                                        placeholder="请输入手机"
                                        v-model="createAccountForm.phone"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item style="width: 55%" label="密码" prop="password">
                                <el-input
                                        placeholder="请输入密码"
                                        v-model="createAccountForm.password"
                                        style="margin-bottom: 10px"
                                        req
                                        type="password"
                                        show-password
                                        autocomplete="new-password"
                                >
                                </el-input>

                                <el-input
                                        placeholder="请再次输入密码"
                                        v-model="createAccountForm.copy_password"
                                        req
                                        type="password"
                                        autocomplete="new-password"

                                        show-password
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item style="width:55%" label="描述" prop="description">
                                <el-input
                                        v-model="createAccountForm.description"
                                        maxlength="100"
                                        rows="7"
                                        placeholder="请输入描述..."
                                        show-word-limit
                                        type="textarea"
                                        style="margin-bottom: 10px"
                                />
                            </el-form-item>
                            <el-form-item style="width:55%" label="用户组（可选）">
                                <el-row style="width:100%">
                                    <el-col>
                                        <div style="margin-bottom:20px;width:100%">
                                            <el-input
                                                    style="margin-top:5px;width: 300px;"
                                                    size="small"
                                                    clearable
                                                    placeholder="搜索用户组"
                                                    @clear="userGroup_search =''"
                                                    v-model="input_userGroup_search"
                                            >
                                                <template #append>
                                                    <el-button icon="el-icon-search"
                                                               @click="selectUserGroup(input_userGroup_search)"/>
                                                </template>

                                            </el-input>

                                            <div style="float: right">
                                                <el-button size="small" type="primary" class="button-with-create"
                                                           style="height: 32px;margin-top: 5px;"
                                                           @click="createUserGroupDialogFormVisible =true">
                                                    <i class="el-icon-circle-plus-outline el-icon--left"></i>
                                                    创建用户组
                                                </el-button>
                                            </div>

                                        </div>
                                    </el-col>
                                    <el-col>
                                        <el-table :data="userGroupFilter()" :show-header="true"
                                                  :scrollbar-always-on="true"
                                                  max-height="400">
                                            >
                                            <el-table-column width="30">
                                                <template #default="props">
                                                    <el-radio :label="props.row.userGroupName" v-model="userGroupRadio"
                                                              @change="userGroupChange(props.row)">{{""}}
                                                    </el-radio>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                    prop="userGroupName"
                                                    label="用户组名称">
                                            </el-table-column>
                                            <el-table-column
                                                    prop="userGroupType"
                                                    label="用户组类型">
                                            </el-table-column>
                                            <el-table-column
                                                    prop="groupDescription"
                                                    label="描述">
                                            </el-table-column>
                                        </el-table>
                                    </el-col>

                                </el-row>


                            </el-form-item>

                            <div style="display:flex;justify-content: center;align-items:center;width: 100%;margin-top: 25px">
                                <el-button size="medium" @click="changePassWdVisible = false">取 消</el-button>
                                <el-button size="medium" type="primary" @click="openCreateAccountMSB">确 定</el-button>
                            </div>

                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-dialog title="创建用户组" v-model="createUserGroupDialogFormVisible" style="">

                <el-form
                        :model="userGroupDialogForm"
                        :rules="createUserGroupRules"
                        label-width="120px"
                        style="margin-right: 30px"
                        autocp>
                    <el-form-item label="用户组名称" prop="userGroupName">
                        <el-input
                                placeholder="请输入用户组名称"
                                v-model="userGroupDialogForm.userGroupName"
                                prop="account"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="用户组类型" prop="userGroupType">
                        <el-radio-group v-model="userGroupDialogForm.userGroupType" :label-width="formLabelWidth">
                            <el-radio label="AI工程师">
                                <span>AI工程师</span>
                            </el-radio>
                            <el-radio label="标注员">
                                <span>标注员</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联分区" prop="associatedPartition">
                        <el-checkbox-group v-model="userGroupDialogForm.associatedPartition"
                                           :label-width="formLabelWidth">
                            <el-checkbox label="默认分区">
                                <span>默认分区</span>
                            </el-checkbox>
                            <el-checkbox label="吊装合规性识别">
                                <span>吊装合规性识别</span>
                            </el-checkbox>

                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="描述" prop="groupDescription">
                        <el-input
                                v-model="userGroupDialogForm.groupDescription"
                                maxlength="500"
                                rows="7"
                                placeholder="请输入描述..."
                                show-word-limit
                                type="textarea"
                                style="margin-bottom: 10px"
                        />
                    </el-form-item>

                    <div style="display:flex;justify-content: center;align-items:center;width: 100%;margin-top: 25px">
                        <el-button size="medium" @click="cancelDialog">取 消</el-button>
                        <el-button size="medium" type="primary" @click="openCreateUserGroupMSB">确 定</el-button>
                    </div>

                </el-form>

                <!--                <div class="dialog-footer">-->
                <!--                    <el-button size="medium" @click="cancelDialog(dialogForm)">取 消</el-button>-->
                <!--                    <el-button size="medium" type="primary" @click="confirm(dialogForm)">确 定</el-button>-->
                <!--                </div>-->
            </el-dialog>
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
    import {nanoid} from 'nanoid'
    import {ElMessage, ElMessageBox} from 'element-plus'
    import { useRouter } from "vue-router";

    export default {
        name: "tabs",
        setup() {
            const router = useRouter()
            const createUserGroupRules = reactive({
                userGroupName: [{
                    required: true,
                    message: '用户组名称不能为空',
                    trigger: 'blur'
                }],
                associatedPartition: [{
                    required: true,
                    message: '请选择管理分类',
                    trigger: 'change'
                }],
                userGroupType: [{
                    required: true,
                    message: '请选择用户组类型',
                    trigger: 'change'
                }],
            })
            const formLabelWidth = ref(120)
            const userList = reactive(JSON.parse(localStorage.getItem('userList')) || [])
            const userGroupDialogForm = reactive({
                id:'',
                userGroupName:"",
                userGroupType:"",
                associatedPartition:[],
                groupDescription:"",
                submitTime:"",
            })
            const createUserGroupDialogFormVisible = ref(false)
            const userGroup_search = ref("")
            const input_userGroup_search = ref("")
            const userGroupRadio = ref("")
            const userGroup = reactive(JSON.parse(localStorage.getItem('userGroup')) || [
                {
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
            ])
            const rules = reactive({
                account: [{
                    required: true,
                    message: '请输入子账户名',
                    trigger: 'blur'
                },],
                nick: [{
                    required: true,
                    message: '请输入昵称',
                    trigger: 'blur'
                },],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },]
            })
            const createAccountForm = reactive({
                account: '',
                nick: '',
                phone: '',
                password: '',
                copy_password: '',
                description: '',
                userGroup: '',
                userGroupType: ''
            })

            const userGroupChange = (userGroup) => {
                createAccountForm.userGroup = userGroup.userGroupName
                createAccountForm.userGroupType = userGroup.userGroupType
            }
            watchEffect(() => {
                // console.log("watcheffect")
                localStorage.setItem('userGroup', JSON.stringify(userGroup))
                localStorage.setItem('userList', JSON.stringify(userList))
            })
            const selectUserGroup = (keyword) => {
                userGroup_search.value = keyword
            }
            const userGroupFilter = () => {

                return userGroup.filter((obj, index, arr) => {
                    return obj.userGroupName.includes(userGroup_search.value)
                })
            }
            const openCreateAccountMSB = () => {
                ElMessageBox.confirm(
                    '确定创建子账户吗？',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                    }
                )
                    .then(() => {
                        ElMessage({
                            type: 'success',
                            message: '创建成功',
                        })
                        let copyForm ={
                            id: '',
                            account: "",
                            nick: "",
                            userGroup: "",
                            phone: "",
                            description: "",
                            creationtTme: "2022-07-13 16:20:23",
                            lastLoginTime: "",
                            useState: '启用',
                            userGroupType: ''
                        }
                        copyForm.id = nanoid()
                        copyForm.account = createAccountForm.account
                        copyForm.nick = createAccountForm.nick
                        copyForm.phone = createAccountForm.phone
                        copyForm.description = createAccountForm.description
                        copyForm.userGroup = createAccountForm.userGroup
                        copyForm.userGroupType = createAccountForm.userGroupType

                        userList.push(copyForm)

                        createAccountForm.id = ''
                        createAccountForm.account = ''
                        createAccountForm.nick = ''
                        createAccountForm.phone = ''
                        createAccountForm.description = ''
                        createAccountForm.userGroup = ''
                        createAccountForm.userGroupType = ''

                        router.push({name:'subAccount'})
                    })
                    .catch(() => {

                    })


            };
            const openCreateUserGroupMSB = () => {
                ElMessageBox.confirm(
                    '确定创建用户组吗？',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                    }
                )
                    .then(() => {
                        ElMessage({
                            type: 'success',
                            message: '创建成功',
                        })
                        let copyForm ={}
                        copyForm.id = nanoid()
                        copyForm.userGroupName = userGroupDialogForm.userGroupName
                        copyForm.userGroupType = userGroupDialogForm.userGroupType
                        copyForm.associatedPartition = userGroupDialogForm.associatedPartition
                        copyForm.groupDescription = userGroupDialogForm.groupDescription
                        copyForm.submitTime = '2022-07-14 19:17:01'
                        userGroup.push(copyForm)

                        userGroupDialogForm.id = ''
                        userGroupDialogForm.userGroupName = ''
                        userGroupDialogForm.userGroupType = ''
                        userGroupDialogForm.associatedPartition = []
                        userGroupDialogForm.groupDescription = ''
                        userGroupDialogForm.submitTime = ''
                        console.log(userGroupDialogForm)
                        createUserGroupDialogFormVisible.value = false
                    })
                    .catch(() => {

                    })
            };
            const cancelDialog = () =>{
                createUserGroupDialogFormVisible.value = false
                userGroupDialogForm.id = ''
                userGroupDialogForm.userGroupName = ''
                userGroupDialogForm.userGroupType = ''
                userGroupDialogForm.associatedPartition = []
                userGroupDialogForm.groupDescription = ''
                userGroupDialogForm.submitTime = ''
            }
            return {
                createUserGroupRules,
                rules,
                createAccountForm,
                userGroup,
                userGroupRadio,
                userGroupChange,
                userGroup_search,
                input_userGroup_search,
                selectUserGroup,
                userGroupFilter,
                createUserGroupDialogFormVisible,
                userGroupDialogForm,
                formLabelWidth,
                openCreateUserGroupMSB,
                cancelDialog,
                openCreateAccountMSB
            };

        },

    }


</script>
<style scoped>
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
