import {
	createRouter,
	createWebHashHistory
} from "vue-router";
import Home_Data from "../views/Home_Data.vue";
import Home_Model from "../views/Home_Model.vue";
import Home_Guide from "../views/Home_Guide.vue";
import Home_Account from "../views/Home_Account.vue";

const routes = [{
	path: '/',
	redirect: '/model/guide'
}, {
	path: "/model",
	name: "Home_Guide",
	component: Home_Guide,
	children:[{
		path: "guide",
		name: "guide",
		meta: {
			title: '模型选择'
		},
		component: () => import( /* webpackChunkName: "dashboard" */ "../views/Model_Guide.vue")
	}],
}, {
	path: "/data",
	name: "Home_Data",
	component: Home_Data,
	children: [{
		path: "overall",
		name: "overall",
		meta: {
			title: '数据总览'
		},
      component: () => import( /* webpackChunkName: "dashboard" */ "../views/Data_Overall.vue")
	}, {
		path: "annotated",
		name: "annotated",
		meta: {
			title: '在线标注工具'
		},
		component: () => import( /* webpackChunkName: "dashboard" */ "../views/Data_Calibrate_Online_Tool.vue"),
	}, {
		path: "onedata",
		name: "onedata",
		meta: {
			title: '数据集版本管理'
		},
		component: () => import( /* webpackChunkName: "dashboard" */ "../views/Data_Overall_one.vue"),
	},{
		path: "calibrate-online",
		name: "calibrate-online",
		meta: {
			title: '在线标注'
		},
		component: () => import( /* webpackChunkName: "table" */ "../views/Data_Calibrate_Online.vue")
	}, {
		path:"team-manage",
		name:"team-manage",
		meta: {
			title: '团队管理'
		},
		component: () => import( /* webpackChunkName: "charts" */ "../views/Data_Team_Manage.vue")
	}, {
		path: "task-manage",
		name: "task-manage",
		meta: {
			title: '任务管理'
		},
		component: () => import( /* webpackChunkName: "form" */ "../views/Data_Task_Manage.vue")
	}, {
		path: "task-manage/details",
		name: "details",
		meta: {
			title: '任务详情'
		},
		component: () => import( /* webpackChunkName: "details" */ "../views/Data_Details.vue")
	}, {
		path: "recommendation",
		name: "recommendation",
		meta: {
			title: '图片推荐'
		},
		component: () => import( /* webpackChunkName: "tabs" */ "../views/Data_Recommendation.vue")
	}, {
		path: "pre-calibrate",
		name: "pre-calibrate",
		meta: {
			title: '预标注'
		},
		component: () => import( /* webpackChunkName: "donate" */ "../views/Data_Pre_Calibrate.vue")
	}, 
	{
		path: "pre-calibrate-create",
		name: "pre-calibrate-create",
		meta: {
			title: '预标注任务创建'
		},
		component: () => import( /* webpackChunkName: "donate" */ "../views/Data_Pre_Calibrate_create.vue")
	},{
		path: "collect",
		name: "collect",
		meta: {
			title: '回传管理'
		},
		component: () => import( /* webpackChunkName: "permission" */ "../views/Data_Collect.vue")
	}, {
		path: "clean-task",
		name: "clean-task",
		meta: {
			title: '数据诊断'
		},
		component: () => import( /* webpackChunkName: "i18n" */ "../views/Data_Clean_Task.vue")
	}]
}, {
	path: "/model",
	name: "Home_Model",
	component: Home_Model,
	children: [{
		path: "mymodel",
		name: "mymodel",
		meta: {
			title: '我的模型'
		},
		component: () => import( /* webpackChunkName: "dashboard" */ "../views/Model_Mymodel.vue")
	},
	{
		path: "mymodel/:modelId",
		name: "modelDetail",
		meta: {
			title: '模型详情'
		},
			component: () => import( /* webpackChunkName: "dashboard" */ "../views/Model_Modeldetail.vue")
	},{
		path: "train",
		name: "train",
		meta: {
			title: '训练模型'
		},
		component: () => import( /* webpackChunkName: "table" */ "../views/Model_Train.vue")
	},{
		path: "train/create",
		name: "createTraining",
		meta: {
			title: '创建训练'
		},
		component: () => import( /* webpackChunkName: "table" */ "../views/Model_Train_Create.vue")
	},{
		path: "train/report",
		name: "report",
		meta: {
			title: '评估报告'
		},
		component: () => import( /* webpackChunkName: "table" */ "../views/Model_Train_Report.vue")
	},{
		path: "verify",
		name: "verify",
		meta: {
			title: '校验模型'
		},
		component: () => import( /* webpackChunkName: "charts" */ "../views/Model_Verify.vue")
	}, {
        path: "addCheck",
        name: "addCheck",
        meta: {
            title: '创建校验'
        },    
        component: () => import ( /* webpackChunkName: "Model_AddCheck" */ "../views/Model_AddCheck.vue")
    },{
        path: "addTempCheck",
        name: "addTempCheck",
        meta: {
            title: '创建临时校验'
        },    
        component: () => import ( /* webpackChunkName: "Model_AddTempCheck" */ "../views/Model_AddTempCheck.vue")
    },{
        path: "tempCheckDetail",
        name: "tempCheckDetail",
        meta: {
            title: '临时校验详情'
        },    
                component: () => import ( /* webpackChunkName: "addTempCheck" */ "../views/Model_TempCheckDetail.vue")
    },{
        path: "checkDetail",
        name: "checkDetail",
        meta: {
            title: '校验详情'
        },    
        component: () => import ( /* webpackChunkName: "addTempCheck" */ "../views/Model_CheckDetail.vue")
    },{
		path: "publish",
		name: "publish",
		meta: {
			title: '发布/导出模型'
		},
		component: () => import( /* webpackChunkName: "form" */ "../views/Model_Publish.vue")
	}]
}, {
	path: "/account-center",
	name: "Home_Account",
	component: Home_Account,
	children: [{
		path: "account",
		name: "account",
		meta: {
			title: '帐号资料'
		},
		component: () => import( /* webpackChunkName: "Account_Main.vue" */ "../views/Account_Main.vue")
	},
	{
		path: "modify-phone",
		name: "modify-phone",
		meta: {
			title: '修改手机号'
		},
		component: () => import( /* webpackChunkName: "Account_Modify_Phone.vue" */ "../views/Account_Modify_Phone.vue")
	},
	{
		path: "modify-password",
		name: "modify-password",
		meta: {
			title: '修改密码'
		},
		component: () => import( /* webpackChunkName: "Account_Modify_Password.vue" */ "../views/Account_Modify_Password.vue")
	},
	{
		path: "partition",
		name: "partition",
		meta: {
			title: '数据分区管理'
		},
			component: () => import( /* webpackChunkName: "Account_Partition" */ "../views/Account_Partition.vue")
	},{
		path: "subAccount",
		name: "subAccount",
		meta: {
			title: '子账号管理'
		},
		component: () => import( /* webpackChunkName: "Account_SubAccount" */ "../views/Account_SubAccount.vue")
	},
		{
			path: "subAccount/create",
			name: "subAccountCreate",
			meta: {
				title: '创建子账号'
			},
			component: () => import( /* webpackChunkName: "Account_SubAccount" */ "../views/Account_SubAccountCreate.vue")
		},
		{
		path: "userGroup",
		name: "userGroup",
		meta: {
			title: '用户组管理'
		},
		component: () => import( /* webpackChunkName: "Account_UserGroup" */ "../views/Account_UserGroup.vue")
	}]
}, {
	path: "/login",
	name: "Login",
	meta: {
		title: '用户登录'
	},
	component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
}

];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	document.title = `${to.meta.title} | AI一体化训练平台`;
	const role = localStorage.getItem('ms_username');
	if (!role && to.path !== '/login') {
		next('/login');
	} else if (to.meta.permission) {
		// 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
		role === 'admin' ?
			next() :
			next('/403');
	} else {
		next();
	}
});

export default router;
