<template>
    <div>
        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>分词统计设置</span>
            </v-card-subtitle>
            <v-card-text>
                <v-text-field
                    v-model="extractNum"
                    label="每条聊天记录提取的关键词数量"
                    outlined
                    hide-details
                    dense
                ></v-text-field>
            </v-card-text>
        </v-card>

        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>词云统计设置</span>
            </v-card-subtitle>
            <v-card-text>
                <v-text-field
                    v-model="maxKeywords"
                    label="显示的关键词数量"
                    outlined
                    hide-details
                    dense
                ></v-text-field>
            </v-card-text>
        </v-card>

        <v-card class="mb-2" flat outlined>
            <v-card-subtitle class="d-flex">
                <span>排除QQ号设置</span>
                <v-spacer></v-spacer>
                <span>已排除QQ数：{{excludeQQCount}}</span>
            </v-card-subtitle>
            <v-card-text>
                <v-textarea
                    v-model="excludeQQ"
                    label="输入QQ号码，用逗号隔开，用于排除统计机器人等号码, 10000和1000000为系统消息号"
                    outlined
                    hide-details
                    dense
                ></v-textarea>
            </v-card-text>
        </v-card>

        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>复读机统计设置</span>
            </v-card-subtitle>
            <v-card-text>
                <v-text-field
                    v-model="maxRepeaters"
                    label="显示复读次数前N名的信息"
                    outlined
                    hide-details
                    dense
                ></v-text-field>
            </v-card-text>
        </v-card>

        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>模板列表</span>
            </v-card-subtitle>
            <v-card-text>
                <span>在软件运行时，添加了模板，除了重启软件载入新模板，还可以点击下面按钮载入新模板</span>
                <v-btn color="success" @click="reloadConfig">重新载入模板列表</v-btn>
            </v-card-text>
        </v-card>

        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>调试模式</span>
            </v-card-subtitle>
            <v-card-text>
                <v-btn color="red" dark @click="openDevTool">打开控制台</v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {ipcRenderer} from "electron"

export default {
    name: "Setting",
    data: () => ({

    }),
    mounted() {

    },
    methods:{
        reloadConfig(){
            ipcRenderer.invoke('read-config').then( res => {
                this.$store.commit('updateTemplatesConfig', res)
                this.$toast.success('加载成功！')
            })
        },
        openDevTool(){
            ipcRenderer.invoke('open-dev-tool')
        }
    },
    computed: {
        maxKeywords: {
            get () {
                return this.$store.state.setting.maxKeywords
            },
            set (value) {
                this.$store.commit('updateSettingMaxKeywords', value)
            }
        },
        extractNum:{
            get () {
                return this.$store.state.setting.extractNum
            },
            set (value) {
                this.$store.commit('updateSettingExtractNum', value)
            }
        },
        excludeQQ:{
            get(){
                return this.$store.state.setting.excludeQQ.join(',')
            },
            set(value){
                this.$store.commit('updateSettingExcludeQQ', value)
            }
        },
        excludeQQCount:{
            get(){
                return this.$store.state.setting.excludeQQ.length
            }
        },
        maxRepeaters:{
            get(){
                return this.$store.state.setting.maxRepeaters
            },
            set(value){
                this.$store.commit('updateSettingMaxRepeaters', value)
            }
        }
    }
}
</script>

<style scoped>

</style>