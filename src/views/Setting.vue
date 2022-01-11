<template>
    <div>
        <v-card class="mb-2" flat outlined>
            <v-card-subtitle>
                <span>分词设置</span>
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
                <span>词云设置</span>
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
                <span>年度报告成品设置</span>
            </v-card-subtitle>
            <v-card-text>
                <v-radio-group
                    v-model="product"
                    row
                    dense
                    hide-details
                    class="mt-0"
                >
                    <v-radio
                        label="网页文件"
                        value="web"
                    ></v-radio>
                    <v-radio
                        label="长图版"
                        value="img"
                    ></v-radio>
                    <v-radio
                        label="纯文本"
                        value="txt"
                    ></v-radio>
                </v-radio-group>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Setting",
    data: () => ({

    }),
    mounted() {

    },
    methods:{

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
        product:{
            get(){
                return this.$store.state.setting.product
            },
            set(value){
                this.$store.commit('updateSettingProduct', value)
            }
        }
    }
}
</script>

<style scoped>

</style>