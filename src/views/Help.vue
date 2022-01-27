<template>
    <div>

        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何导出QQ聊天记录？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <h3>Windows 系统</h3>
                    <p>方法1：在群聊消息输入框右上角，【发送】按钮上方，打开【聊天记录列表】，点击【聊天记录列表】右下角的【消息管理】</p>
                    <img src="@/assets/how-to-export-qq/2.png" alt="">
                    <p>方法2：在QQ主面板，点击左下角【主菜单】，点击主菜单的右上角【消息管理】</p>
                    <img src="@/assets/how-to-export-qq/1.png" alt="">

                    <h4>后续步骤</h4>
                    <p>打开【消息管理】后，右键你想分析的群，点击【导出消息记录】，然后选择【TXT】格式进行导出，最后就可以用该TXT文件来分析了。</p>
                    <img src="@/assets/how-to-export-qq/3.png" alt="" class="mr-2">
                    <img src="@/assets/how-to-export-qq/4.png" alt="">

                    <p class="mt-4">支持的消息格式：</p>
                    <p>日期时间 QQ昵称(QQ号码) <br> [消息内容] <br> [换行符]</p>

                    <h3>其他系统( Mac OS、Android、iOS )</h3>
                    <p>暂无推荐的导出方法。</p>
                    <p>如果有方法导出，请参考上面的支持的消息格式，或者加群反馈兼容您的导出的格式。</p>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何导出微信聊天记录？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    整理中...
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何分享年度报告？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <p>在您预览作品的时候，您可以选择导出的成品类型：网页版，长图版，文字版等。</p>
                    <h5>网页版</h5>
                    <p>如果您拥有自己的服务器，可以选择该导出类型，把导出的所有文件上传到网站根目录，即可通过域名进行访问查看数据。</p>
                    <p>本地查看方法：双击index.html文件，用自带浏览器打开。</p>
                    <h5>长图版</h5>
                    <p>该类型会打开一个窗口，等待片刻，会提示您保存图片，保存到任意目录，方便分享。</p>
                    <h5>纯文本版</h5>
                    <p>该类型只有文本，生成后，在同界面出现导出结果。可以点击【一键复制】，把内容直接复制到剪切板，方便分享。</p>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何预览已生成的年度报告？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <p>已生成的年度报告会保存在左侧菜单【年度报告管理】页面，点击 <v-icon color="primary" small>mdi-play-circle</v-icon> 按钮即可预览该报告，在预览界面可以导出任意类型的成品。</p>
                    <p>点击 <v-icon color="red" small>mdi-delete-circle</v-icon> 则会删除该报告。</p>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何修改或者添加导出模板？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <p>在软件的根目录，找到 <b>templates</b> 文件夹，里面存放各种模板的文件。</p>

                    <h4 class="mb-1">纯文本模板</h4>
                    <p><b>style1.txt</b> 为默认模板。</p>
                    <h5>修改TXT模板</h5>
                    <p>1. 进入 <b>text</b> 目录，打开对应的txt文件，修改内容即可。</p>
                    <p>注意：<b style="color: red">{{}}</b> 双花括号内为自动替换的内容，您可以移动其位置，但不可修改里面的文本，否则会替换失败。</p>
                    <h5>添加TXT模板</h5>
                    <p>1. 进入 <b>text</b> 目录，新建一个txt文件，编辑文件，参考原有的 <b>style1.txt</b> 文件内容，自行编写文案，排版 <b style="color: red">{{}}</b> 自动替换字段。</p>
                   <p>2. 编辑 <b>templates</b> 文件夹下的 <b>templates.json</b> 文件，参考原有默认text模板，添加一个节点。编辑后，自行校验是否符合json规范，不然会解析出错。</p>

                    <h4 class="mb-1">网页模板</h4>
                    <h5>修改网页模板</h5>
                    <p>1. 进入 <b>web</b> 目录，文案在 <b>index.html</b> 文件寻找对应的中文进行修改，</p>
                    <p>注意：<b style="color: red">{{}}</b> 双花括号内为自动替换的内容，您可以移动其位置，但不可修改里面的文本，否则会替换失败。</p>

                    <h5>添加网页模板</h5>
                    <p>1. 查看默认网页模板中的 <b>index.js</b>，里面的 <b style="color: red">"{{}}"</b> 为替换的内容 (含双引号)，编写的模板使用这些字段可以获得导出的数据。</p>
                    <p>2. 在 <b>web</b> 目录下，新建一个文件夹，里面存放您的模板。</p>
                    <p>如果您的模板不是以 <b>js</b> 目录下的 <b>index.js</b> 为替换数据的文件，在编辑 <b>templates.json</b> 时，将 <b>main</b> 字段修改为您想自动替换数据的文件路径。</p>
                    <p>3. 编辑 <b>templates</b> 文件夹下的 <b>templates.json</b> 文件， 加入您的网页模板。</p>

                    <h4 class="mb-1">图片模板</h4>
                    <h5>修改图片模板</h5>
                    <p>1. 图片模板原理：采用截图网页的方法，所以修改同【修改网页模板】。</p>

                    <h5>添加图片模板</h5>
                    <p>1. 同添加网页模板，不同的是要执行截图操作。</p>
                    <p>2. 当网页渲染完成，执行截图操作，并下载图片。</p>
                    <p>请参考自带图片模板。</p>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    templates.json 字段详解
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <h5>name</h5>
                    <p>对应模板名称。</p>

                    <h5>type</h5>
                    <p>对应报告类型，目前报告归类为群聊报告(group)，个人在群聊的报告(person)，情侣报告(love)，您可以为不同报告类型创建模板。</p>

                    <h5>path</h5>
                    <p>对应目录位置，请使用基于软件根目录的相对目录。</p>

                    <h5>main</h5>
                    <p>网页模板的自动替换数据的文件路径。也是相对路径。</p>

                    <h5>html</h5>
                    <p>图片模板的网页文件路径和名称</p>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    点击生成报告按钮，软件闪退怎么解决？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    软件安装路径不能有中文，请重新安装到非中文路径的文件夹下。
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    如何反馈问题，获取最新版本？
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    点击该软件左侧菜单【关于软件】，加群即可
                </v-expansion-panel-content>
            </v-expansion-panel>

        </v-expansion-panels>
    </div>
</template>

<script>
export default {
    name: "Help"
}
</script>

<style scoped>

</style>