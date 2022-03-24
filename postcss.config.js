module.exports = {
  autoprefixer: {},
  "postcss-px-to-Viewport": {
    viewportWidth: 375,  // 视窗的宽度
    viewportHeight: 667, // 视窗的高度
    unitPrecision: 5,    // 指定`px`转换为视窗单位制的小数位数
    viewportUnit: 'vw',   // 指定需要转换成的视窗单位，建议用vm
    selectorBlackList: ['ignore','tab-bar','tab-bar-item'], // 指定哪一些是不用做转换的
    minPixelValue: 1, // 小于或者等于`1px`不用转换视图单位
    mediaQuery: false, // 允许在媒体查询中转换`px`
  }
}