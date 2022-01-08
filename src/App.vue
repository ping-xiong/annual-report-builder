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
                            <v-list-item-title>首页</v-list-item-title>
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

            <p class="version">版本: v1.0</p>
        </v-navigation-drawer>

        <v-app-bar
            app
            class="drag"
            flat
        >
            <div style="width: 100%" v-if="percent > 0">
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
            <div class="pa-3">
<!--                <keep-alive>-->
<!--                    <router-view/>-->
<!--                </keep-alive>-->
                <router-view/>
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
        selectedItem: 0
    }),

    mounted() {
        ipcRenderer.on('update-percent', (e, percent) => {
            this.$store.commit('updatePercent', percent)
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
        ...mapState(['percent'])
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