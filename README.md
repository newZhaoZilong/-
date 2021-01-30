# -
考虑到环形进度条的需求很多，所以通过canvas实现了一个简易的环形进度条的组件

组件一共提供了6个属性,分别是

width 环形进度条的宽度,单位是rpx,环形进度条宽度和高度是一样的,这里只用设置width就行了

borderColor 环形进度条的边框颜色

borderWidth 环形进度条的边框宽度,单位是rpx

angle 环形进度条的旋转角度，单位是deg

duration 过渡时间，如果大于0，环形进度条将根据时间进行平滑绘制

startAngle 起点角度,默认为0,就是钟表12点的位置



angle 环形进度条的旋转角度

这个旋转角度的意思是终点角度相对于起点角度的值

如果startAngle为0,angle 为90,相当于绘制从0到90这一段的角度,

如果startAngle为90,angle为90,相当于绘制从90到180这一段的角度,

这样做的好处是可以直接通过angle的值判断绘制方向

angle如果大于0，就进行顺时针绘制

angle如果小于0，就进行逆时针绘制

代码片段:https://developers.weixin.qq.com/s/oEd12Kmx7hnB
微信社区文档 https://developers.weixin.qq.com/community/develop/article/doc/0002226b0f4fa8da16ab563d756413

