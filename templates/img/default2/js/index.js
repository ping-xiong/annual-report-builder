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
        wordcloudOption: {"title":{"text":"Game生活区-2021年高频关键词","textStyle":{"textBorderColor":"#fff","textBorderWidth":2}},"toolbox":{"feature":{"saveAsImage":{}}},"grid":[{"height":"20%"}],"tooltip":{},"series":[{"type":"wordCloud","sizeRange":[12,60],"rotationRange":[-90,90],"width":"100%","height":"80%","gridSize":2,"shape":"circle","drawOutOfBound":false,"textStyle":{"fontFamily":"sans-serif","fontWeight":"bold"},"data":[{"name":"大师","value":513},{"name":"蛋蛋","value":404},{"name":"知道","value":113},{"name":"没有","value":88},{"name":"喜欢","value":83},{"name":"游戏","value":82},{"name":"短发","value":80},{"name":"看看","value":75},{"name":"上课","value":65},{"name":"视频","value":63},{"name":"现在","value":58},{"name":"真的","value":57},{"name":"10","value":57},{"name":"上班","value":56},{"name":"干嘛","value":53},{"name":"一个","value":52},{"name":"不会","value":49},{"name":"脱单","value":46},{"name":"不能","value":44},{"name":"我要","value":41},{"name":"哈哈哈","value":41},{"name":"作疼","value":39},{"name":"平兄","value":39},{"name":"月影","value":38},{"name":"好看","value":38},{"name":"手机","value":36},{"name":"好像","value":36},{"name":"steam","value":36},{"name":"30","value":36},{"name":"电脑","value":35},{"name":"群里","value":34},{"name":"天天","value":34},{"name":"感觉","value":34},{"name":"这是","value":34},{"name":"恶心","value":32},{"name":"老婆","value":32},{"name":"不想","value":32},{"name":"舒服","value":31},{"name":"一下","value":31},{"name":"不行","value":31},{"name":"有点","value":31},{"name":"下班","value":30},{"name":"是不是","value":30},{"name":"苹果","value":30},{"name":"直接","value":30},{"name":"好玩","value":29},{"name":"公司","value":29},{"name":"便宜","value":29},{"name":"有没有","value":28},{"name":"厉害","value":28},{"name":"不了","value":28},{"name":"100","value":28},{"name":"战地","value":27},{"name":"微信","value":27},{"name":"意思","value":27},{"name":"肯定","value":27},{"name":"图片","value":27},{"name":"不用","value":27},{"name":"资源","value":26},{"name":"2042","value":26},{"name":"垃圾","value":25},{"name":"对象","value":25},{"name":"女朋友","value":25},{"name":"不要","value":25},{"name":"小时","value":25},{"name":"广州","value":25},{"name":"问题","value":25},{"name":"妹子","value":25},{"name":"50","value":25},{"name":"喝茶","value":24},{"name":"抖音","value":24},{"name":"卧槽","value":24},{"name":"辣鸡","value":24},{"name":"试试","value":24},{"name":"光头","value":23},{"name":"不好","value":23},{"name":"韩国","value":23},{"name":"就行了","value":23},{"name":"应该","value":23},{"name":"回家","value":23},{"name":"20","value":23},{"name":"差不多","value":22},{"name":"没事","value":22},{"name":"结婚","value":22},{"name":"看过","value":22},{"name":"可能","value":22},{"name":"东西","value":22},{"name":"苏州","value":22},{"name":"一起","value":21},{"name":"看到","value":21},{"name":"估计","value":21},{"name":"晚上","value":21},{"name":"记得","value":21},{"name":"为啥","value":21},{"name":"小米","value":21},{"name":"抢师","value":20},{"name":"离谱","value":20},{"name":"没意思","value":20},{"name":"正常","value":20},{"name":"表情","value":20},{"name":"1000","value":20},{"name":"500","value":20},{"name":"200","value":20},{"name":"学妹","value":19},{"name":"不玩","value":19},{"name":"减肥","value":19},{"name":"免费","value":19},{"name":"法苏","value":19},{"name":"没用","value":19},{"name":"你好","value":19},{"name":"今天","value":19},{"name":"还行","value":19},{"name":"微软","value":18},{"name":"一个月","value":18},{"name":"玩意","value":18},{"name":"这种","value":18},{"name":"昨天","value":18},{"name":"显卡","value":18},{"name":"买个","value":18},{"name":"不信","value":18},{"name":"不到","value":18},{"name":"会员","value":18},{"name":"马个","value":18},{"name":"不错","value":18},{"name":"进去","value":18},{"name":"12","value":18},{"name":"11","value":18},{"name":"举报","value":17},{"name":"几个","value":17},{"name":"小姐姐","value":17},{"name":"价格","value":17},{"name":"觉得","value":17},{"name":"起来","value":17},{"name":"几把","value":17},{"name":"有钱","value":17},{"name":"玩玩","value":16},{"name":"退款","value":16},{"name":"直播","value":16},{"name":"电影","value":16},{"name":"哈哈哈哈","value":16},{"name":"不看","value":16},{"name":"不去","value":16},{"name":"不买","value":16},{"name":"开车","value":16},{"name":"最近","value":16},{"name":"反正","value":16},{"name":"有人","value":16},{"name":"懒得","value":16},{"name":"300","value":16},{"name":"下载","value":15}],"layoutAnimation":true}],"animationDuration":500},
        wordcloudChart: null,
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
        viewData: "{{viewData}}",

        wordcloudFinished: false
    },
    mounted() {
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
        if (document.body.clientWidth < 400){
            this.wordcloudOption.series[0].sizeRange = [12, 30]
        }



        this.barChartOption.animation = false
        this.barChart = echarts.init(document.getElementById('barChar'))
        this.barChart.setOption(this.barChartOption)

        this.lineChartOption.animation = false
        this.lineChart = echarts.init(document.getElementById('lineChar'))
        this.lineChart.setOption(this.lineChartOption)

        document.title = "请等待弹窗保存截图后，关闭此窗口"

        this.wordcloudChart = echarts.init(document.getElementById('wordcloud'));
        this.wordcloudChart.setOption( this.wordcloudOption)

        let that = this
        this.wordcloudChart.on('finished',_=>{
            that.wordcloudFinished = true
        })
    },
    methods:{
        start(){
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
        wordcloudFinished(){
            this.start()
        }
    }
})