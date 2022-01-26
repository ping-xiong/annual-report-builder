<template>
    <div class="about">

        <v-card flat class="mb-2">
            <v-card-title>隐私保护</v-card-title>
            <v-card-text>
                <h4>聊天记录，分析结果等数据会不会上传？</h4>
                <p>这些数据全部在本地分析使用，不会上传任何数据到服务器。</p>

                <h4>我们收集什么信息？</h4>
                <p>该应用使用了Google Analytics第三方平台收集应用访问数据，流量情况。仅用于提升产品和服务，不会披露给第三方。您可以查看Google Analytics的隐私权政策，了解其收集和使用信息的方式。</p>

                <h4>因该项目开源，请在正规渠道（Github，码云，博客）下载该应用。或者自行下载源码进行打包。</h4>
                <h4>有任何问题请加群反馈！</h4>
            </v-card-text>
        </v-card>

        <v-card flat class="mb-2">
            <v-card-title>反馈问题，下载最新版本</v-card-title>

            <v-card-text class="center-text d-flex justify-center flex-column align-center">
                <img src="@/assets/qq.png" alt="" width="260"/>
                <p>群号：142815653</p>
            </v-card-text>
        </v-card>

        <v-card flat class="mb-2">
            <v-card-title>博客</v-card-title>
            <v-card-text>
                <a @click="openLink('https://pingxonline.com/')">开发者博客</a>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

import {ipcRenderer} from "electron";

export default {
    name: 'About',
    methods:{
        openLink(url){
            ipcRenderer.invoke('open-url', url)
        },
    }
}

</script>