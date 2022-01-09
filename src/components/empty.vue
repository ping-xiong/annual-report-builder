<template>
    <div class="d-flex align-center justify-center fill-height flex-column">
        <v-img src="@/assets/empty.png" max-height="200"></v-img>
        <h3>暂无历史年度报告，点击下面按钮快速跳转生成界面</h3>
        <div class="mt-4">
            <v-btn color="primary" class="mr-2" @click="toPage('/qq', 1)">前往合成 QQ 年度报告</v-btn>
            <v-btn color="success" disabled class="ml-2">前往合成微信年度报告</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "empty",
    methods:{
        toPage(url, index){
            this.$store.commit('updateSelectedItem', index)
            this.$router.replace(url)
        }
    }
}
</script>

<style scoped>

</style>