<template>
    <div>

        <v-card flat class="mb-2">
            <v-card-title class="d-flex">
                <span>导出选项</span>
                <v-spacer></v-spacer>
                <v-btn dark small color="red" @click="toHomepage">退出预览模式</v-btn>
            </v-card-title>

            <v-card-text>

                <div class="d-flex mb-2">
                    <v-text-field
                        dense
                        hide-details
                        label="群昵称"
                        outlined
                        readonly
                        v-model="QQPreviewData.groupName"
                    ></v-text-field>

                    <v-text-field
                        dense
                        hide-details
                        label="时间类型"
                        outlined
                        class="mr-2 ml-2"
                        readonly
                        v-model="timeType.name"
                    ></v-text-field>

                    <v-text-field
                        dense
                        hide-details
                        label="时间区间"
                        outlined
                        readonly
                        v-model="timeType.time"
                    ></v-text-field>
                </div>

                <div class="d-flex">
                    <v-text-field
                        dense
                        hide-details
                        label="报告类型"
                        outlined
                        readonly
                        v-model="productType"
                    ></v-text-field>

                    <v-text-field
                        dense
                        hide-details
                        label="个人报告QQ号"
                        outlined
                        class="mr-2 ml-2"
                        readonly
                        :disabled="QQPreviewData.setting.targetQQ === null"
                        v-model="QQPreviewData.setting.targetQQ"
                    ></v-text-field>

                    <v-text-field
                        dense
                        hide-details
                        label="群聊活跃成员数"
                        outlined
                        readonly
                        v-model="QQPreviewData.members.length"
                    ></v-text-field>
                </div>

            </v-card-text>

            <div class="d-flex">
                <h5 class="ml-3 grey--text">选择导出的类型(用于分享)</h5>
            </div>

            <v-card-actions class="d-flex">
                <div class="productType">
                    <v-radio-group
                        v-model="product"
                        row
                        dense
                        hide-details
                        class="mt-0"
                    >
                        <v-radio
                            label="网页版"
                            value="web"
                        ></v-radio>
                        <v-radio
                            label="长图版"
                            value="img"
                            disabled
                        ></v-radio>
                        <v-radio
                            label="视频版"
                            value="video"
                            disabled
                        ></v-radio>
                        <v-radio
                            label="纯文本"
                            value="txt"
                        ></v-radio>
                    </v-radio-group>
                </div>
                <v-spacer></v-spacer>
                <v-btn color="primary">导出</v-btn>
            </v-card-actions>
        </v-card>

        <v-card flat class="mb-2">
            <v-card-title class="d-flex">
                <span>数据预览</span>
            </v-card-title>

            <div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>成员数据统计</v-card-subtitle>
                    <v-data-table
                        :headers="memberHeaders"
                        :items="QQPreviewData.members"
                        :items-per-page="5"
                    ></v-data-table>
                </div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>词云</v-card-subtitle>

                </div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>24小时活跃图</v-card-subtitle>

                </div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>每月/日消息数</v-card-subtitle>

                </div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>复读排行</v-card-subtitle>

                </div>

                <v-divider></v-divider>

                <div>
                    <v-card-subtitle>最长消息内容</v-card-subtitle>

                </div>
            </div>
        </v-card>
    </div>
</template>

<script>

import { mapState } from "vuex"
import * as dayjs from 'dayjs'

export default {
    name: "QQPreview",
    data: () => ({
        product: 'web',
        memberHeaders: [
            {
                text: 'QQ号',
                align: 'start',
                sortable: false,
                value: 'qq',
            },
            { text: '昵称', sortable: false, value: 'name' },
            { text: '消息数', value: 'msgs' },
            { text: '发图数', value: 'imgs' },
            { text: '活跃天数', value: 'actives' },
            { text: '总字数', value: 'words' },
        ]
    }),
    mounted() {
        console.log(this.QQPreviewData)
    },
    methods:{
        toHomepage(){
            this.$router.replace('/')
            this.$store.commit('updateSelectedItem', 0)
        }
    },
    computed:{
        ...mapState(['QQPreviewData']),
        timeType(){
            switch (this.QQPreviewData.setting.type) {
                case 'year':
                    return {
                        name: '年度',
                        time: dayjs(this.QQPreviewData.setting.year).year() + '年'
                    }
                case 'month':
                    return {
                        name: '月度',
                        time: dayjs(this.QQPreviewData.setting.month).format('YYYY-MM')
                    }
                case 'ranger':
                    return {
                        name: '自定义范围',
                        time: dayjs(this.QQPreviewData.setting.ranger[0]).format('MM-DD') + '至' + dayjs(this.QQPreviewData.setting.ranger[1]).format('MM-DD')
                    }
                default:
                        return {}
            }
        },
        productType(){
            switch (this.QQPreviewData.commonSetting.product) {
                case 'group':
                    return '群聊年度报告'
                case 'person':
                    return '群聊个人年度报告'
                case 'love':
                    return '情侣年度报告'
            }
            return '年度报告'
        }
    }
}
</script>

<style scoped>

</style>