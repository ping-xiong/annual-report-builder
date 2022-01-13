export default function getActiveHoursChart(QQPreviewData){

    let xAxisData = []
    let seriesData = []

    let data = QQPreviewData.activePeriod

    for (const dataKey in data) {
        xAxisData.push(dataKey + '时')
        seriesData.push(data[dataKey])
    }

    return {
        tooltip: {},
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: seriesData,
                type: 'line',
                label: {
                    show: true,
                    position: 'top'
                },
            }
        ]
    }

}