import {getSelectedTime} from "@/util/tool"

export default function getWordcloud (QQPreviewData) {

    let formatData = []
    let data = QQPreviewData.topCutWords
    for (const dataKey in data) {
        formatData.push({
            name: data[dataKey][0],
            value: data[dataKey][1]
        })
    }

    let time = getSelectedTime(QQPreviewData.setting)

    return {
        title:{
            text: QQPreviewData.groupName + '-' + time + '高频关键词',
            textStyle:{
                textBorderColor: '#fff',
                textBorderWidth: 2
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid:[
            {
                height: "20%"
            }
        ],
        tooltip: {},
        series: [{
            type: 'wordCloud',
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            // rotationStep: 1,
            width: '100%',
            height: '80%',
            gridSize: 2,
            shape: 'circle',
            drawOutOfBound: false,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                // Color can be a callback function or a color string
                color: function () {
                    // Random color
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            data: formatData,
            layoutAnimation: true,
        }],
        animationDuration: 500
    }
}