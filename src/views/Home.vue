<template>
    <div class="fill-height">
        <empty v-if="QQProject.length === 0 && WechatProject.length === 0"></empty>

        <div v-else>

            <div class="mb-2">
                <v-card flat>
                    <v-card-title>
                        QQ年度报告列表
                    </v-card-title>
                    <v-data-table
                        :headers="QQHeaders"
                        :items="QQProject"
                        :items-per-page="5"
                    >
                        <template v-slot:item.setting.type="{ item }">
                            <v-chip color="#4caf50" small dark v-if="item.setting.type === 'year'">年度</v-chip>
                            <v-chip color="purple" small dark v-if="item.setting.type === 'month'">月度</v-chip>
                            <v-chip color="#ff5722" small dark v-if="item.setting.type === 'ranger'">自定义范围</v-chip>
                        </template>

                        <template v-slot:item.setting="{ item }">
                            <span>{{ getTime(item) }}</span>
                        </template>

                        <template v-slot:item.setting.report="{ item }">
                            <span v-if="item.setting.report === 'group'">群聊年度报告</span>
                            <span v-if="item.setting.report === 'person'">个人年度报告</span>
                            <span v-if="item.setting.report === 'love'">情侣年度报告</span>
                        </template>

                        <template v-slot:item.actions="{ item, index }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        small
                                        color="primary"
                                        class="mr-2"
                                        @click="previewQQProject(item)"
                                    >
                                        mdi-play-circle
                                    </v-icon>
                                </template>
                                <span>预览年度报告</span>
                            </v-tooltip>



                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        left
                                        small
                                        color="red"
                                        @click="deleteQQProject(index)"
                                    >
                                        mdi-delete-circle
                                    </v-icon>

                                </template>
                                <span>删除</span>
                            </v-tooltip>
                        </template>

                    </v-data-table>
                </v-card>

            </div>

            <div>
                <v-card flat>
                    <v-card-title>
                        微信年度报告列表
                    </v-card-title>
                    <v-card-subtitle>正在开发中...</v-card-subtitle>
                </v-card>
            </div>

        </div>

    </div>
</template>

<script>

import empty from "@/components/empty"
import { mapState } from "vuex"

import * as dayjs from 'dayjs'

export default {
    name: 'Home',
    components:{
        empty
    },
    data: () => ({
        QQHeaders: [
            {
                text: '群昵称',
                align: 'start',
                sortable: false,
                value: 'groupName',
            },
            { text: '时间类型', value: 'setting.type' },
            { text: '时间范围', value: 'setting' },
            { text: '报告类型', value: 'setting.report' },
            { text: '操作', value: 'actions', sortable: false },
        ]
    }),
    mounted() {
        console.log(this.QQProject)
    },
    methods:{
        getTime(item){
            switch (item.setting.type ) {
                case 'year':
                    return dayjs(item.setting.year).year() + '年'
                case 'month':
                    return dayjs(item.setting.month).format('YYYY-MM')
                case 'ranger':
                    return dayjs(item.setting.ranger[0]).format('MM-DD') + '至' + dayjs(item.setting.ranger[1]).format('MM-DD')
            }
        },
        previewQQProject(item){
            this.$store.commit('updateQQPreviewData', item)
            // 前往预览界面
            this.$router.replace('/qq/preview')
        },
        deleteQQProject(index){
            this.$store.commit('DelQQProject', index)
        }
    },
    computed:{
        ...mapState(['QQProject', 'WechatProject'])
    }
}
</script>
