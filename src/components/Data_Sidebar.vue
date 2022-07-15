<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
    setup() {
        const items = [
            {
                icon: "el-icon-lx-home",
                index: "/data/overall",
                title: "数据总览",
            },
            {
                icon: "el-icon-lx-cascades",
                index: "/data/calibrate-online",
                title: "数据标注",
				subs: [
				    {
						index: "/data/calibrate-online",
				        title: "在线标注",
				    },
				    {
				        title: "多人标注",
				        subs: [
				            {
				                index: "/data/team-manage",
				                title: "团队管理",
				            },
							{
							    index: "/data/task-manage",
							    title: "任务管理",
							},
				        ],
				    },
					{
					    index: "5",
					    title: "智能标注",
					    subs: [
					        {
					            index: "/data/recommendation",
					            title: "图片推荐",
					        },
							{
							    index: "/data/pre-calibrate",
							    title: "预标注",
							},
					    ],
					},
				],
            },
            {
                icon: "el-icon-lx-copy",
                index: "/data/collect",
                title: "回传管理",
            },
            {
                icon: "el-icon-lx-emoji",
                index: "/data/clean-task",
                title: "数据诊断",
            },
        ];

        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);

        return {
            items,
            onRoutes,
            collapse,
        };
    },
};
</script>

<style>
	.sidebar {
	    display: block;
	    position: absolute;
	    left: 0;
	    top: 70px;
	    bottom: 0;
	    overflow-y: scroll;
	}
	.sidebar::-webkit-scrollbar {
	    width: 0;
	}
	.sidebar-el-menu:not(.el-menu--collapse) {
	    width: 250px;
	}
	.sidebar > ul {
	    height: 100%;
	}
</style>