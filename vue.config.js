module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessWatch: ['src/util/background'],
      builderOptions: {
        productName: "年度报告生成器",
        appId: "tech.pingx.report",
        asar: false,
        win:{
          icon: "public/favicon.ico"
        },
        nsis:{
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        extraResources: [
          {
            from: "./templates",
            to: "./templates",
            filter: ["**/*"]
          }
        ]
      }
    }
  }
}
