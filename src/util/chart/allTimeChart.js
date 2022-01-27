export default function getAllTimeChart(QQPreviewData){

    let xAxisData = []
    let seriesData = []
    let data = QQPreviewData.chartData
    for (const dataKey in data) {
        xAxisData.push( (parseInt(dataKey) + 1) + '月')
        seriesData.push( data[dataKey] )
    }

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxisData,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '消息数',
                type: 'bar',
                barWidth: '60%',
                data: seriesData,
                label: {
                    show: true,
                    position: 'top'
                },
            }
        ]
    };

}