<template>
    <div>
        <div v-if="!downloading" class="d-flex flex-column">
            <span>版本: {{version}}</span>
            <span style="color: #52ea2d; cursor: pointer;" @click="checkUpdate" v-if="!newVersion">检查更新</span>
            <span style="color: #52ea2d; cursor: pointer;" @click="startDownload" v-if="hasNewVersion">有新版：{{newVersion}}, 点击更新</span>
        </div>

        <div v-if="downloading" class="d-flex flex-column">
            <span>下载进度：{{downloadPercent}}%</span>
            <span>速度：{{downloadSpeed}}</span>
            <v-progress-linear
                color="white"
                :buffer-value="downloadPercent"
                stream
            ></v-progress-linear>
        </div>
    </div>
</template>

<script>

import { mapState } from "vuex"
import { ipcRenderer } from "electron"

export default {
    name: "updater",
    data: () => ({
        hasNewVersion: false,
        newVersion: '',
        downloading: false,
        downloadPercent: 0,
        downloadSpeed: 0,
        releaseNotes: ''
    }),
    mounted() {
        // 监听一些更新事件
        ipcRenderer.on('new-version', async (event, version) => {
            this.newVersion = version.version
            this.releaseNotes = version.releaseNotes

            this.$toast.info( "<h4>检测到新版本</h4>" + this.releaseNotes)

            this.hasNewVersion = true
        })

        ipcRenderer.on('update-process', async (event, process) => {

            console.log(process)

            this.downloading = true
            this.downloadPercent = process.percent
            this.downloadSpeed = process.speed
        })

        ipcRenderer.on('no-update', async (event, info) => {
            console.log(info)
            this.$toast.info('暂无更新')
        })

        this.checkUpdate()
    },
    methods:{
        startDownload(){
            ipcRenderer.invoke('start-update')
        },
        checkUpdate(){
            // 检测更新
            ipcRenderer.invoke('check-update')
        }
    },
    computed:{
        ...mapState(['version'])
    }
}
</script>

<style scoped>

</style>