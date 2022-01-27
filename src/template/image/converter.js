import {ipcRenderer} from "electron"

import {getData} from "@/template/web/converter"

/**
 *
 * @param data 模板数据
 * @param selectedPath 下拉选择的模板路径
 * @param allWebTemplates 所有图片模板列表
 * @param chartData 图表数据
 * @returns {Promise<unknown>}
 */
export default function (data, selectedPath, allWebTemplates, chartData){
    return new Promise((resolve, reject) => {

        let template = null
        for (let i = 0; i < allWebTemplates.length; i++) {
            if (allWebTemplates[i].path === selectedPath){
                template = allWebTemplates[i]
            }
        }

        let webData = getData(data, chartData)

        // 临时文件夹
        ipcRenderer.invoke('get-temp').then( tempPath => {

            ipcRenderer.invoke('copy-dir', selectedPath, tempPath).then( res => {
                if (res){
                    // 修改目录的index文件
                    ipcRenderer.invoke('replace-str', (res + template.main), JSON.parse(JSON.stringify(webData))).then( res2 => {
                        // 截图
                        ipcRenderer.invoke('open-window', res + template.html)
                        resolve(res2)
                    }).catch( e => {
                        alert(e.toString())
                    })
                }else{
                    reject(res)
                }
            }).catch( e => {
                alert(e.toString())
            })

        })

    })
}