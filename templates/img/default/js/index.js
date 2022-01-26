var app = new Vue({
    el: '#app',
    components: {
        QrcodeVue,
    },
    data: {
        url: 'https://pingxonline.com/2022/01/26/%e3%80%90%e5%bc%80%e6%ba%90%e3%80%91%e5%b9%b4%e5%ba%a6%e6%8a%a5%e5%91%8a%e7%94%9f%e6%88%90%e5%99%a8/',
        urlSize: 300,
        wordcloudFinished: false,
        barChartFinished: false,
        lineChartFinished: false,
        isScreenShot: false,
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
        var that = this

        this.wordcloudOption.series[0].layoutAnimation = false
        this.wordcloudOption.series[0].keepAspect = true
        this.wordcloudOption.series[0].textStyle.color = function () {
            // Random color
            return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')';
        }
        this.wordcloudChart = echarts.init(document.getElementById('wordcloud'));
        this.wordcloudChart.setOption( this.wordcloudOption)

        this.wordcloudChart.on('finished',_=>{
            that.wordcloudFinished = true
        })

        this.barChartOption.animation = false
        this.barChart = echarts.init(document.getElementById('barChar'))
        this.barChart.setOption(this.barChartOption)

        this.barChart.on('finished',_=>{
            that.barChartFinished = true
        })

        this.lineChartOption.animation = false
        this.lineChart = echarts.init(document.getElementById('lineChar'))
        this.lineChart.setOption(this.lineChartOption)

        this.lineChart.on('finished',_=>{
            that.lineChartFinished = true
        })

        document.title = this.viewData.name + '-' + this.viewData.title

    },
    methods:{
        start(){
            // this.$refs.fullpage.$fullpage.moveNext()
            var that = this
            html2canvas(document.body).then(function(canvas) {
                var imgData = canvas.toDataURL("image/jpeg");
                that.fileDownload(imgData);
            });
        },
        fileDownload(downloadUrl) {
            var aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = downloadUrl;
            aLink.download = "报告截图.png";
            // 触发点击-然后移除
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
        }
    },
    computed:{
        fullHeight(){
            return "height: " + window.innerHeight + "px;"
        },
        sizeForChart(){
            var w = document.getElementById('app').clientWidth
            return "height: 500px;" +'width: ' + w + 'px;'
        },
        sizeForBarChart(){
            var w = document.getElementById('app').clientWidth
            return 'height: 300px; width: ' + w + 'px;'
        }
    },
    watch:{
        wordcloudFinished(newVal){
            this.start()
        }
    }
})