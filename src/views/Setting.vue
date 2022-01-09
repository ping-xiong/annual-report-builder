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
        }
    }
}
</script>

<style scoped>

</style>