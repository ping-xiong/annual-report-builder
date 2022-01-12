<template>
    <v-app>
        <v-navigation-drawer permanent app dark width="160" color="primary">
            <v-list-item >
                <v-list-item-content class="drag">
                    <v-list-item-title class="d-flex align-center">
<!--                        菜单-->
                        <v-img
                            class="mr-2"
                            max-width="32"
                            src="@/assets/logo.png"
                        ></v-img>
                        <h6>年度报告生成器</h6>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list
                dense
                nav
            >
                <v-list-item-group
                    v-model="selectedItem"
                    mandatory
                    class="d-flex flex-column"
                >
                    <v-list-item link @click="toPage('/')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>年度报告管理</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link @click="toPage('/qq')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-qqchat</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>QQ 年度报告</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link @click="toPage('/wechat')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-wechat</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>微信年度报告</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link @click="toPage('/setting')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>通用设置</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link @click="toPage('/help')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-help-box</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>使用帮助</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link @click="toPage('/about')">
                        <v-list-item-icon class="mr-0">
                            <v-icon>mdi-information</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="center-text">
                            <v-list-item-title>关于软件</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

            <div class="version d-flex flex-column mb-2">
                <span>免费开源软件</span>
                <span>如果您是购买得到的</span>
                <span>请退款并差评</span>

                <span class="mt-2">版本: v1.0</span>
            </div>

        </v-navigation-drawer>

        <v-app-bar
            app
            class="drag"
            flat
        >
            <div style="width: 100%" v-if="percent > 0 && showLoadingBar">
<!--                <v-img-->
<!--                    class="mr-3"-->
<!--                    width="24"-->
<!--                    height="24"-->
<!--                    src="@/assets/logo.png"-->
<!--                ></v-img>-->
<!--                <v-badge-->
<!--                color="green"-->
<!--                content="1.0"-->
<!--                offset-y="10"-->
<!--                offset-x="-2"-->
<!--                >-->
<!--                    <h4>年度报告生成器</h4>-->
<!--                </v-badge>-->

<!--                进度条-->
                <v-progress-linear
                    v-model="percent"
                    height="25"
                    dark
                >
                    <strong>{{ percent }}%</strong>
                </v-progress-linear>
            </div>

            <v-spacer></v-spacer>

            <v-btn
                @click="openLink('https://github.com/ping-xiong/QQ-report')"
                target="_blank"
                text
                class="no-drag"
            >
                <span class="mr-2">开源地址</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>

            <v-btn
                icon
                class="no-drag"
                @click="winMinimize"
            >
                <v-icon>mdi-window-minimize</v-icon>
            </v-btn>

            <v-btn
                icon
                class="no-drag"
                @click="winMaximize"
            >
                <v-icon>mdi-window-maximize</v-icon>
            </v-btn>

            <v-btn
                icon
                class="no-drag"
                @click="quitApp"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="pa-3 fill-height" style="background: #e6e6e6">
                <keep-alive>
                    <router-view/>
                </keep-alive>
<!--                <router-view/>-->
            </div>
        </v-main>
    </v-app>
</template>

<script>
const { ipcRenderer } = require('electron')
import {mapState} from 'vuex'

export default {
    name: 'App',

    data: () => ({

    }),

    mounted() {
        ipcRenderer.on('update-percent', (e, percent) => {
            this.$store.commit('updatePercent', percent)
        })
        ipcRenderer.on('qq-report-finish', (e, allData) => {
            this.$toast.success('报告生成完成')
            this.$store.commit('InsertQQProject', allData)
            this.$store.commit('updateQQPreviewData', allData)
            this.$store.commit('hideLoadingBar')
            // 前往预览界面
            this.$router.replace('/qq/preview')
        })
    },

    methods:{
        openLink(url){
            ipcRenderer.invoke('open-url', url)
        },
        quitApp(){
            ipcRenderer.invoke('exit-app')
        },
        toPage(url){
            if (this.$route.path !== url){
                this.$router.replace(url)
            }
        },
        winMaximize(){
            ipcRenderer.invoke('max-app')
        },
        winMinimize(){
            ipcRenderer.invoke('min-app')
        }
    },

    computed:{
        ...mapState(['percent', 'showLoadingBar']),
        // 激活的菜单项
        selectedItem:{
            get(){
                return this.$store.state.selectedItem
            },
            set(value){
                this.$store.commit('updateSelectedItem', value)
            }
        }
    }
};
</script>

<style lang="scss">
.drag {
    -webkit-app-region: drag
}

.no-drag{
    -webkit-app-region: no-drag;
}
</style>

<style scoped lang="scss">
.version{
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0;
    color: #dadada;
    font-size: 14px;
}
.center-text{
    text-align: center;
}
</style>