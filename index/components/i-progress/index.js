// index/components/progress/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //环形进度条的宽度,单位是rpx,环形进度条宽度和高度是一样的,这里只用设置width就行了
    width: {
      type: Number,
      value: 0
    },
    //环形进度条的边框颜色
    borderColor: {
      type: String,
      value: "#fff"
    },
    //环形进度条的边框宽度,单位是rpx
    borderWidth: {
      type: Number,
      value: 20,
    },
    //环形进度条的旋转角度，单位是deg
    angle: {
      type: Number,
      value: -1
    },
    //过渡时间，如果大于0，环形进度条将根据时间进行平滑绘制
    duration: {
      type: Number,
      value: 0
    },
    //起点角度,默认为0,就是钟表12点的位置
    startAngle: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentAngle: 0 //当前渲染角度位置
  },

  observers: {
    angle(val) {
      if (!this.canvas) return;
      if (val !== 0) {
        this.renderProgress(val);
      }
    }
  },

  lifetimes: {
    async ready() {
      await this.initCanvasAndCtx();

      if (this.data.angle !== 0) {
        this.renderProgress(this.data.angle);
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化canvas和ctx
     */
    async initCanvasAndCtx() {
      return new Promise((resolve, reject) => {
        const query = this.createSelectorQuery();
        query.select('#myCanvas')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            let nodeCanvas = res[0];
            if (nodeCanvas) {
              this.initCanvas(nodeCanvas);
              this.initContext();
              resolve();
            } else {
              reject();
            }
          });
      });
    },

    /**
     * 初始化canvas
     */
    initCanvas(nodeCanvas) {
      let {
        node: canvas,
        width,
        height
      } = nodeCanvas;
      // debugger;
      let systemInfo = wx.getSystemInfoSync();
      let {
        pixelRatio, //设备像素比 = 物理像素/css像素
        screenWidth //屏幕宽度
      } = systemInfo;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      this.canvas = canvas;
      this.data.dpr = pixelRatio;
      this.data.screenWidth = screenWidth;
    },

    /**
     * 初始化canvas context
     */
    initContext() {
      let {
        dpr,
        borderColor,
        borderWidth
      } = this.data;
      let ctx = this.canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = borderColor; //初始化绘制颜色
      ctx.lineWidth = this.canvas.borderWidthPx = this.rpxToPx(borderWidth); //初始化线条宽度
      ctx.lineCap = "round";
      this.ctx = ctx;
    },

    /**
     * rpx转化为px
     */
    rpxToPx(value) {
      return this.data.screenWidth * (value / 750);
    },

    /**
     * 绘制环形进度条
     */
    renderProgress(angle) {
      let {
        duration
      } = this.data;
      if (duration > 0) {
        let currentTime = Date.now();
        this.data.endStamp = currentTime + duration;
        this.loopRender(currentTime);
      } else {
        this.render(angle);
      }
    },

    /**
     * 缓步渲染
     * duration剩余时间
     * endAngle目标角度
     */
    loopRender(currentTime) {
      let {
        angle,
        endStamp,
        currentAngle
      } = this.data;
      let nextStep;
      if (currentTime >= endStamp) {
        nextStep = angle;
        this.canvas.cancelAnimationFrame();
      } else {
        let step = this.getStep(angle - currentAngle, endStamp - currentTime, currentTime - this.lastTime);
        nextStep = currentAngle + step;
        this.canvas.requestAnimationFrame(() => {
          this.loopRender(Date.now());
        });
      }
      this.render(nextStep);
      this.lastTime = currentTime;
    },

    /**
     * 获取步长
     */
    getStep(distance, duration, stepTime) {
      if (isNaN(stepTime)) {
        stepTime = 10;
      }
      return distance / duration * stepTime;
    },

    /**
     * 将角度对应的圆环渲染出来
     */
    render(angle) {
      let ctx = this.ctx;
      let {
        _width,
        _height,
        borderWidthPx
      } = this.canvas;
      ctx.clearRect(0, 0, _width, _height);
      let radius = Math.floor(_width / 2 - borderWidthPx / 2); //这里采用border-box边框盒的模型绘制,宽度 = 边框总宽度 +内边距总宽度 + 内容宽度
      ctx.beginPath();
      let startAngle = this.getAngle(this.data.startAngle) - 0.5 * Math.PI;
      let endAngle = startAngle + this.getAngle(angle);
      if (endAngle < startAngle) {
        let temp = endAngle;
        endAngle = startAngle;
        startAngle = temp;
      }
      ctx.arc(_width / 2, _width / 2, radius, startAngle, endAngle);
      ctx.stroke();
      this.data.currentAngle = angle;
    },

    /**
     * 将角度转化为弧度
     * @param {百分比} percent 
     */
    getAngle(angle) {
      return angle * Math.PI * 2 / 360;
    },
  }
})