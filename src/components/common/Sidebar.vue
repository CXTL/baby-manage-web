<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'report',
                    title: '报表管理',
                    subs: [
                        {
                            index: 'assetReport',
                            title: '收支报表'
                        },
                        {
                            index: 'investReport',
                            title: '投资报表'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'finance',
                    title: '财务管理',
                    subs: [
                        {
                            index: 'invest',
                            title: '投资管理',
                            subs: [
                                {
                                    index: 'investor',
                                    title: '投资人管理',

                                },
                                {
                                    index: 'investFlow',
                                    title: '投资流水管理'
                                }
                            ]

                        },
                        {
                            index: 'account',
                            title: '帐套管理'
                        },
                        {
                            index: 'subject',
                            title: '会计科目'
                        },
                        {
                            index: 'asset',
                            title: '收支管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'system',
                    title: '系统管理',
                    subs: [
                        {
                            index: 'user',
                            title: '用户管理'
                        },
                        {
                            index: 'menu',
                            title: '菜单管理'
                        },
                        {
                            index: 'role',
                            title: '角色管理'
                        },
                        {
                            index: 'dict',
                            title: '字典管理'
                        },
                        {
                            index: 'loginLog',
                            title: '登陆日志'
                        },
                        {
                            index: 'businessLog',
                            title: '业务日志'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-global',
                    index: 'i18n',
                    title: '国际化功能'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
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
