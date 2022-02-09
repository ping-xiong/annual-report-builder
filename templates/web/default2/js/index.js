const page = Vue.observable({ page: {} });
Object.defineProperty(Vue.prototype, '$page', {
    get() { return page.page; },
    set(value) { page.page = value; }
});


var app = new Vue({
    el: '#app',
    data: {
        opts: {
            start: 0,
            dir: 'v',
            loop: false,
            duration: 300,
            beforeChange: function (prev, next) {
                console.log('before', prev, next)
                Vue.set(Vue.prototype, '$page', next)
            },
            afterChange: function (prev, next) {
                console.log('after', prev, next)
                Vue.set(Vue.prototype, '$page', next)
            }
        },
        // 自动填充数据
        wordcloudOption: "{{wordcloudOption}}",
        wordcloudChart: null,
        // 自动填充数据
        barChartOption: "{{barChartOption}}",
        barChart: null,
        // 自动填充数据
        lineChartOption: "{{lineChartOption}}",
        lineChart: null,
        // 自动填充数据
        viewData: "{{viewData}}"
    },
    mounted() {
        this.wordcloudOption.series[0].keepAspect = true
        this.wordcloudOption.series[0].textStyle.color = function () {
            // Random color
            return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')';
        }
        if (document.body.clientWidth < 400){
            this.wordcloudOption.series[0].sizeRange = [12, 30]
        }

        this.wordcloudChart = echarts.init(document.getElementById('wordcloud'));
        this.wordcloudChart.setOption( this.wordcloudOption)


        this.barChart = echarts.init(document.getElementById('barChar'))
        this.barChart.setOption(this.barChartOption)


        this.lineChart = echarts.init(document.getElementById('lineChar'))
        this.lineChart.setOption(this.lineChartOption)

        document.title = this.viewData.name + '-' + this.viewData.title
    },
    methods:{
        start(){
            this.$refs.fullpage.$fullpage.moveNext()
        }
    },
    computed:{
        fullHeight(){
            return "height: " + window.innerHeight + "px;"
        },
        sizeForChart(){
            var w = document.getElementsByClassName('fullpage-container')[0].clientWidth
            return this.fullHeight +'width: ' + w + 'px;'
        },
        sizeForBarChart(){
            var w = document.getElementById('barChartBox').clientWidth
            return 'height: 200px; width: ' + (w - 40) + 'px;'
        },
        chartBoxSize(){
            var chartBox = document.getElementById("chartBox")
            return 'height: '+ (chartBox.clientWidth) +'px; width: ' + (chartBox.clientWidth - 40) + 'px;'
        }
    },
    watch: {
        '$page'(newValue) {
            switch (newValue) {
                case 2:
                    this.wordcloudChart.clear()
                    this.wordcloudChart.setOption( this.wordcloudOption, true)
                    break;
                case 5:
                    this.barChart.clear()
                    this.barChart.setOption(this.barChartOption, true)
                    break;
                case 6:
                    this.lineChart.clear()
                    this.lineChart.setOption(this.lineChartOption, true)
                    break;
            }
        }
    }
})