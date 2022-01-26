<template>
    <div class="about">

        <v-card flat class="mb-2">
            <v-card-title>隐私保护</v-card-title>
            <v-card-text>
                <p>保护用户的隐私数据是我们一项重大责任，本隐私协议旨在帮助您了解我们收集哪些信息，收集信息的原因，以及如何管理您的信息。</p>

                <h4>聊天记录，分析结果等数据会不会上传？</h4>
                <p>这些数据全部在本地分析使用，不会上传任何数据到服务器。</p>

                <h4>我们收集什么信息？</h4>
                <p>该应用利用了Google Analytics收集应用访问数据，流量情况。仅用于提升产品和服务，不会披露给第三方。您可以查看Google Analytics的隐私权政策，了解其收集和使用信息的方式。</p>
            </v-card-text>
        </v-card>

        <v-card flat class="mb-2">
            <v-card-title>反馈问题，下载最新版本</v-card-title>

            <v-card-text class="center-text d-flex justify-center">
                <img src="@/assets/qq.png" alt="" width="260"/>
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