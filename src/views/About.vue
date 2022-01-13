<template>
    <div class="about">
        <a @click="openLink('https://pingxonline.com/')">开发者博客</a>
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