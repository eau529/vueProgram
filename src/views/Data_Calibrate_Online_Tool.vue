<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header height="40px">
        <el-page-header content="测试数据集V1" @back="goBack" />
      </el-header>

      <el-main>
        <div id="main">
          <!-- 图片列表 -->
          <div class="album-container">
              <div class="album-list">
                <div id="album-title">
                  <span>图片列表</span>
                </div>
                <el-scrollbar class="scrollbar">
                  <div class="album-item-container">
                    <el-image fit="contain" v-for="(img, index) in imgUrlList" :src="img.url"
                              :key="index" :index="index" :style="{ '--display': allLayers.isMarked[index] > 0 ? '' : 'none' }"
                              :class="{border: borderIndex === index, albumImage: true}"
                              @click="addBorder(index);picClick(img.url, index)">
                    </el-image>
                  </div>
                </el-scrollbar>
                <!-- 分页组件 -->
                <el-pagination
                    class="pagination"
                    background
                    :current-page="page"
                    :total="total"
                    :page-size="limit"
                    layout="prev, pager, next, total"
                    @current-change="fetchData"
                />
              </div>
          </div>

          <!-- 标记区域 -->
          <div id="mark-container">
            <div class="button-wrap">
              <el-button type="text" class="el-icon-mouse" style="border: none; margin-left: 8px;"
                @click="setMode('PAN')">
                平移 </el-button>
              <el-button type="text" class="el-icon-zoom-in" style="border: none; margin-left: 8px;" @click="zoomIn()">
                放大 </el-button>
              <el-button type="text" class="el-icon-zoom-out" style="border: none; margin-left: 8px;"
                @click="zoomOut()">缩小 </el-button>
              <el-button type="text" class="el-icon-full-screen" style="border: none; margin-left: 8px;"
                @click="setMode('RECT')">矩形 </el-button>
              <el-button type="text" class="el-icon-refresh-left" style="border: none; margin-left: 8px;"
                @click="Revoke()">撤销 </el-button>
              <el-button type="text" class="el-icon-download" style="border: none; margin-left: 8px;"
                @click="getFeatures()">获取标注数据</el-button>
            </div>
            <div id="map"></div>
          </div>

          <!-- 标签区域 -->
          <div class="label-container">
            <div class="label-manage-right">
              <div class="label-manage">
                <div>
                  <div class="ai-tabs_mid">
                    <div class="album-content-opt">
                      <span>检测标签</span>
                    </div>
                  </div>
                </div>
                <div class="label-list">
                  <div class="label-manage-wrap">
                    <div class="label-search">
                      <el-button style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                        @click="createLabel()">添加标签 </el-button>
                      <el-button type="danger" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; "
                        @click="deleteLabel()">删除标签 </el-button>
                    </div>
                     <el-radio-group class="radio-group" style="margin: 15px 0 0 10px;border-left: 2px dashed #409eff" v-model="chooseLabelId">
                      <el-radio class="radio-line" style="display: block;padding: 7px 0 7px 8px" :label="index" v-for="(l,index) in labelData">{{l.name}}</el-radio>
                     </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-main>
    </el-container>

    <!-- 对话框 -->
    <el-dialog v-model="dialogFormVisible" title="选择标签">
      <el-form :model="form">
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-radio-group>
            <el-radio-group v-model="chooseLabelId">
              <el-radio :label="index" v-for="(l,index) in labelData">{{l.name}}</el-radio>
            </el-radio-group>
          </el-radio-group>
        </el-form-item>
        <div style="margin-top:50px">
          <el-button type="primary" @click="chooseLabel()">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import AILabel from "ailabel";
  export default {
    name: "OnlineTool",
    // 返回定义的数据模型
    data() {
      return {
        imgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0186f0570f33d132f875a83991e34b.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650076295&t=c0b8a135c2f9298d1d714703f5d30423",
        drawingStyle: { fill: true },
        mode: "",
        itemName: "",
        editId: "", //待填充图形id
        deleteIconId: "delete01",
        gMap: null, //AILabel实例
        initMap: null, //图片图层实例
        imgUrlList: [{
			url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%3A%2F%2Fcms-bucket.ws.126.net%2F2020%2F0211%2Fd954a235j00q5jage03d1c0042a02pjc.jpg%26thumbnail%3D660x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448439&t=b09c6f888123eb59ce2926fc561c4b74",
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.fogang.gov.cn%2Fqyfgzjj%2Fimg%2F0%2F204%2F204162%2F1356572.png&refer=http%3A%2F%2Fwww.fogang.gov.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=adb55432965a6e236bfb817b41a2a9a6"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg01.lanfw.com%2Festate%2Fqz%2Forigin%2F201912%2F16%2F5df6fc7096eda.jpg&refer=http%3A%2F%2Fimg01.lanfw.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=68a2e98d0ff1f4a197df7c2847d90ed8"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic65.nipic.com%2Ffile%2F20150504%2F4938437_151739239000_2.jpg&refer=http%3A%2F%2Fpic65.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=c3038eaebe574e60a1d3736cadc8a4aa"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.shxmhjs.com%2Fd%2Ffile%2F2017-10-27%2Fc45885d9bafc84d116afb5132dc94c27.jpg&refer=http%3A%2F%2Fwww.shxmhjs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=4debc007edeb8ca1e26297e4942c6e82"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1001.pocoimg.cn%2Fimage%2Fpoco%2Fworks%2F61%2F2017%2F0217%2F22%2F18432568620170217221403019_184325686.jpg&refer=http%3A%2F%2Fimg1001.pocoimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=30f72c2a2e81982a3dc93102e5c130bc"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180806%2Fe424ba16d7134a0894c755e08f66f303.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=78e43484c8bb1927f6779dd2fb8b61ff"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190809%2F6cf8742b83f24a20b9c2cce837705c3a.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=77943f3eeb526392e576db6a81f6b68b"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdingyue.nosdn.127.net%2FN8JNuLhRk3Qg6iQotXVoFJqpvLiGq9c4y%3Dw9DfEjgYIOw1532504110576compressflag.jpg&refer=http%3A%2F%2Fdingyue.nosdn.127.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=5eaf31fc51ba37039cba4d3349fbde2c"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51wendang.com%2Fpic%2F10e9e778fdff11945dc5c5d9%2F15-810-jpg_6-1080-0-0-1080.jpg&refer=http%3A%2F%2Fimg.51wendang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660448469&t=822222674576c36bb16d5c18705817f1"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Flf%2F9w%2FQJ6713921682.jpg%3Fx-oss-process%3Dstyle%2Fshow&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=935acd4babfebc261423f87f6ce33faf"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.miluo.gov.cn%2Fuploadfiles%2F201705%2F20170525153022992.jpg&refer=http%3A%2F%2Fwww.miluo.gov.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=d226a44bae9b8e1193ad0d356ea4b898"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyaothai.com%2Fuploads%2Fueditor%2F20200222%2F3-200222164239360.jpg&refer=http%3A%2F%2Fyaothai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=c2293992f84026ea1c719ddd0d9afa7b"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.hncj.com.cn%2FUserFiles%2Fimage%2F20120613%2F20120613081047784778.jpg&refer=http%3A%2F%2Fwww.hncj.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=db659ea17941f3e14d60d2881e4ca540"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.cmol.com%2Fimages%2Fuploadfile%2Fnews%2F2012%2F0301%2F20120301032740845.jpg&refer=http%3A%2F%2Fimg.cmol.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=c629676ab8de55db96431f83859e1766"
          },
          {
            url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimgpolitics.gmw.cn%2Fattachement%2Fjpg%2Fsite2%2F20210209%2Ff44d305ea1af218cb8f20a.jpg&refer=http%3A%2F%2Fimgpolitics.gmw.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660452742&t=e8b4027160ebd55df92271b3bb2eddc6"
          }
        ],
        labelData: [{
          name: "安全帽"
        }, {
          name: "反光衣"
        }, {
          name: "灭火器"
        }],
        dialogFormVisible: false,
        chooseLabelId: "",
        shapeData: null,
        labeledData: [],

        // 新增 by gzw
        // 图片选中高亮标识
        borderIndex: 0,
        // 数据库中的总记录数
        total: 0,
        // 默认页码
        page: 1,
        // 每页记录数
        limit: 10,

        allLayers: {
          // 当前图片 index
          curIndex: 0,
          // 是否标记
          isMarked: {},
          // // 当前图片的 featureLayer：矢量图层实例(矩形，多边形等矢量)
          // gFirstFeatureLayer: null,
          // // 当前图片的 textLayer：文本图层实例
          // gFirstTextLayer: null,
          // // 当前图片的所有 features
          // allFeatures: null,
          // 图层组：所有图层信息
          group: {
            /**
             * 以下数据均是动态添加，所以留空
             * index: {
             *   flag: true,
             *   display: 'none',
             *   width: width,
             *   height: height,
             *   layers: {
             *     imageLayer: gFirstImageLayer,
             *     featureLayer: gFirstFeatureLayer,
             *     textLayer: gFirstTextLayer,
             *     featureList: {
             *       'featureId': {
             *         feature: rectFeature,
             *         text: gFirstText
             *       }
             *     }
             *   }
             * }
             */
          },
        },
      };
    },

    // 用于监听data里面的数据是否被修改，一旦修改就可以执行一些其他的操作
    watch: {
      mode(mode) {
        this.gMap.setMode(mode);
        this.setDrawingStyle(mode);
      }
    },

    // 实例被挂载后调用
    mounted() {
      const gMap = new AILabel.Map("map", {
        zoom: 1000,
        mode: "RECT", // 绘制线段
        refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
        zoomWhenDrawing: true,
        panWhenDrawing: true,
        zoomWheelRatio: 5, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
        withHotKeys: false, // 关闭快捷键
      });
      this.setMap(gMap);
      this.addEvent();

      this.initMap = (imgUrl, index = 0) => {
        // this.gMap.removeAllLayers();
        console.log("init map...")

        let width = 600;
        let height = 400;
        // 动态调整图片，防止图片拉伸或挤压，但是有时第一张图片会加载不出来，刷新后才行
        // let image = new Image();
        // image.src = imgUrl;
        // let width = image.width;
        // let height = image.height;
        // let ratio = width / height;
        // height = height > this.gMap.getSize().height ? this.gMap.getSize().height : height;
        // width = ratio * height;
        this.setCenter(width, height);

        // 图片层添加
        const gFirstImageLayer = new AILabel.Layer.Image(
            "first-layer-image", // id
            {
              src: imgUrl,
              // width: 500,
              // height: 300,
              width: width,
              height: height,

              crossOrigin: false, // 如果跨域图片，需要设置为true
              position: {
                // 左上角相对中心点偏移量
                x: 0,
                y: 0,
              }
            }, // imageInfo
            {
              name: "第一个图片图层"
            }, // props
            {
              zIndex: 5
            } // style
        );

        // 添加到gMap对象
        this.addLayer(gFirstImageLayer);
        // 添加矢量图层
        const gFirstFeatureLayer = new AILabel.Layer.Feature(
            "first-layer-feature", // id
            {
              name: "第一个矢量图层"
            }, // props
            {
              zIndex: 10
            } // style
        );
        const gFirstTextLayer = new AILabel.Layer.Text(
            'first-layer-text', // id
            {
              name: '第一个文本图层'
            }, // props
            {
              zIndex: 12,
              opacity: 1
            } // style
        );

        // 存储当前图片的所有图层
        this.allLayers.group[index] = {
          // index: index,
          flag: true,
          display: 'none',
          width: width,
          height: height,
          layers: {
            imageLayer: gFirstImageLayer,
            featureLayer: gFirstFeatureLayer,
            textLayer: gFirstTextLayer,
            featureList: {}
          }
        };

        // this.gFirstFeatureLayer = gFirstFeatureLayer;
        // this.gFirstTextLayer = gFirstTextLayer;
        this.addLayer(gFirstFeatureLayer);
        this.addLayer(gFirstTextLayer);
        this.refreshMap();

        window.onresize = function () {
          this.gMap && this.gMap.resize();
        };
      }

      this.fetchData();
      this.initMap(this.imgUrlList[0].url);
    },

    // 实例被销毁前调用
    beforeDestroy() {
      this.gMap.destroy();
    },

    // 定义方法组合，以便调用
    methods: {
      // 设置 map
      setMap(map) {
        this.gMap = map;
      },

      // 放大
      zoomIn() {
        this.gMap.zoomIn();
      },

      // 缩小
      zoomOut() {
        this.gMap.zoomOut();
      },

      // 设置 mode
      setMode(mode) {
        this.mode = mode;
      },

      // 获取当前图片的所有 features
      getFeatures() {
        const featureRECT = this.getCurLayerGroup().layers.featureLayer.getAllFeatures()[0];
        this.labeledData.push({
          id: featureRECT.id
        });
      },

      // 选择标签
      chooseLabel() {
        this.dialogFormVisible = false;
        console.log(this.labelData[this.chooseLabelId].name);
        this.addFeature(this.shapeData, 'RECT', this.labelData[this.chooseLabelId].name);
      },

      // 创建标签
      createLabel() {
        return this.$prompt("请输入填写名字", {
          confirmButtonText: "确定",
          showCancelButton: false,
        })
            .then(({value}) => {
              this.labelData.push({
                name: value
              });
              this.itemName = value;
              return value;
            })
            .catch(() => {
              return null;
            });
      },

      // 删除标签
      deleteLabel() {
        this.labelData.splice(this.chooseLabelId, 1);
      },

      // 删除 删除按钮
      deIcon() {
        this.gMap.markerLayer.removeAllMarkers();
      },

      // 设置中心
      setCenter(width, height) {
        this.gMap.setCenter({
          x: width / 2,
          y: height / 2
        });
      },

      // 移除所有图层
      removeAllLayers() {
        this.gMap.removeAllLayers();
      },

      // 设置当前选中图片
      curPic(index) {
        this.allLayers.curIndex = index;
      },

      // 添加图层
      addLayer(layer) {
        this.gMap.addLayer(layer);
      },

      // 刷新 map
      refreshMap() {
        this.gMap.refresh();
      },

      // 根据 index 获取图层组
      getLayerGroup(index) {
        return this.allLayers.group[index];
      },

      // 获取当前图片的图层组
      getCurLayerGroup() {
        return this.getLayerGroup(this.getCurIndex());
      },

      // 获取当前图片的 index
      getCurIndex() {
        return this.allLayers.curIndex;
      },

      // 初始样式
      setDrawingStyle(mode) {
        let drawingStyle = {};
        this.drawingStyle = {
          strokeStyle: "#0f0",
          lineWidth: 1
        };
        this.gMap.setDrawingStyle(drawingStyle);
        switch (mode) {
            //平移
          case "PAN": { break; }
            //矩形
          case "RECT": { break;}
          default:
            break;
        }
      },

      // 获取第 index 个图片的 feature 数，以此判断图片是否被标记
      getFeatureSum(index) {
        return Object.keys(this.getLayerGroup(index).layers.featureList).length;
      },

      // 设置图片标记数
      setMarkSum(index) {
        this.allLayers.isMarked[index] = this.getFeatureSum(index);
        console.log("current marked sum: " + this.allLayers.isMarked[index])
      },

      // 设置当前图片的标记数
      setCurMarkSum() {
        this.setMarkSum(this.getCurIndex());
      },

      // 获取当前图片的所有图层
      getCurLayers() {
        return this.getCurLayerGroup().layers;
      },

      // 获取当前图片最后一个添加的 feature，用于撤销操作
      getCurLastFeature() {
        let featureList = this.getCurLayerGroup().layers.featureLayer.getAllFeatures();
        let featureArr = Object.keys(featureList);
        let lastNum = featureArr.length - 1;
        let lastObjectKey = featureArr[lastNum];
        return featureList[lastObjectKey];
      },

      /**
       * 切换图片
       * item 的结构为：
       * index: {
       *   flag: true,
       *   display: 'none',
       *   width: width,
       *   height: height,
       *   layers: {
       *     imageLayer: gFirstImageLayer,
       *     featureLayer: gFirstFeatureLayer,
       *     textLayer: gFirstTextLayer,
       *     featureList: {
       *        'featureId': {
       *          feature: rectFeature,
       *          text: gFirstText
       *        };
       *     }
       *   }
       * }
       */
      picClick(url, index) {
        // 设置当前选中的图片是第 index 个
        this.curPic(index);
        // 移除所有图层，否则会叠加
        this.removeAllLayers();
        // 取出图层组
        let group = this.allLayers.group;
        // 根据 index 取出选中图片的所有数据
        let item = group[index];
        // 如果先前加载过就直接将保存的数据重新显示，否则初始化图片到 map
        if (item) {
          // 取出当前图片的所有图层
          let layers = item.layers;
          // 设置图片的中心
          this.setCenter(item.width, item.height);
          this.addLayer(layers.imageLayer);
          this.addLayer(layers.featureLayer);
          this.addLayer(layers.textLayer);
          // 取出当前图片的所有 feature
          let features = layers.featureList;
          // 遍历当前图片下的所有 feature 并添加到 featureLayer 图层中，即显示之前的标记结果
          for (let key in features) {
            layers.featureLayer.addFeature(features[key].feature);
            layers.featureLayer.addFeature(features[key].text);
          }
          this.refreshMap();
          return;
        } else {
          this.initMap(url, index);
        }
      },

      // 添加图形
      addFeature(data, type, id) {
        let that = this;
        let drawingStyle = this.drawingStyle;
        //矩形
        if (type === "RECT") {
          const uuid = this.guid();
          const { x: ltx, y: lty } = data;
          // 标记框
          const rectFeature = new AILabel.Feature.Rect(
            // id
            uuid,
            // shape
            data,
            // props
            { name: id},
            // style
            {strokeStyle: '#808080', lineWidth: 1}
          );

          // 标记文字
          const gFirstText = new AILabel.Text(
            uuid,
            {
              text: id,
              position: { x: ltx, y: lty },
              offset: { x: 0, y: 0 }
            },
            // props
            { name: '第一个文本对象' },
            // style
            {
              fillStyle: '#F4A460',
              strokeStyle: '#D2691E',
              background: true,
              globalAlpha: 1,
              fontColor: '#0f0'
            }
          )

          // 获取当前图片的所有图层
          let layers = this.getCurLayerGroup().layers;
          // 添加标记
          layers.featureLayer.addFeature(rectFeature);
          layers.textLayer.addText(gFirstText);
          // 存储标记
          layers.featureList[rectFeature.id] = {
            feature: rectFeature,
            text: gFirstText
          };
          // 设置当前图片的标记数，用于判断是否要加上已标记提示
          this.setCurMarkSum();
          this.refreshMap();
        }
        this.getFeatures();
      },

      // 获取坐标 需要自行添加
      getPoints(feature) {
        switch (feature.type) {
          case "RECT":
            return feature.getPoints();
          default:
            return [];
        }
      },

      //填充事件
      Fill() {
        console.log("填充事件");
        let fill = this.gFirstFeatureLayer.getFeatureById(this.editId);
        console.log("--填充对象--", fill);
        fill.style.fillStyle = "#FFDAB9";
        fill.style.fill = true;
        //刷新map
        this.refreshMap();
      },

      //撤销
      Revoke() {
        console.log("撤销");
        // 获取当前图片添加的最后一个 feature
        let lastFeature = this.getCurLastFeature();
        // 根据 id 删除该 feature
        this.deleteFeature(lastFeature.id);
        //刷新map
        this.refreshMap();
      },

      // 生成 id
      guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },

      // 根据 featureId 删除 feature
      deleteFeature(featureId) {
        // 删除对应 text
        this.getCurLayers().textLayer.removeTextById(featureId);
        // 删除对应 feature
        this.getCurLayers().featureLayer.removeFeatureById(featureId);
        // 删除存储数据中对应的 featrue
        Reflect.deleteProperty(this.getCurLayerGroup().layers.featureList, featureId);
        // 设置当前图片的标记数，用于判断是否要加上已标记提示
        this.setCurMarkSum();
      },

      // 增加删除图标
      addDeleteIcon(feature, shape) {
        let gMap = this.gMap;
        let that = this;
        // 添加delete-icon
        // let points = that.getPoints(feature);
        console.log(shape, "shape");
        const gFirstMarker = new AILabel.Marker(
          that.deleteIconId, // id
          {
            src: "https://s1.aigei.com/src/img/png/45/45aabfc232a34e5b9bfaf75412973c08.png?|watermark/3/image/aHR0cHM6Ly9zMS5haWdlaS5jb20vd2F0ZXJtYXJrLzUwMC0xLnBuZz9lPTE3MzU0ODgwMDAmdG9rZW49UDdTMlhwemZ6MTF2QWtBU0xUa2ZITjdGdy1vT1pCZWNxZUpheHlwTDpjYWQ1NHVoRlhGUUViSGR3Vm02aXctVTJoWVE9/dissolve/40/gravity/NorthWest/dx/18/dy/21/ws/0.0/wst/0&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:C11LKqsRLbAqQo2uVPETYDya0QU=",
            position: {
              x: shape.x + shape.width,
              y: shape.y - 15
            }, // 矩形右上角 根据图形动态调整
            offset: {
              x: -20,
              y: -4,
            },
          }, // markerInfo
          {
            name: "delete"
          } // props
        );
        gFirstMarker.events.on("click", (marker) => {
          console.log("gFirstMarker click...")
          // 首先删除当前marker
          gMap.markerLayer.removeMarkerById(marker.id);
          // 删除指定的 feature
          that.deleteFeature(feature.id);
        });
        gMap.markerLayer.addMarker(gFirstMarker);
      },

      // 增加事件
      addEvent() {
        let that = this;
        let gMap = this.gMap;
        gMap.events.on("drawDone", (type, data) => {
          console.log("--type, data--", type, data);
          this.dialogFormVisible = true;
          this.shapeData = data;
          // that.chooseLabel().then((id) => {
          //   that.addFeature(data, type, id);
          // });
        });
        gMap.events.on("boundsChanged", (data) => {
          console.log("--map boundsChanged--", data);
          return "";
        });
        // 双击编辑 在绘制模式下双击feature触发选中
        gMap.events.on("featureSelected", (feature) => {
          this.editId = feature.id;
          console.log("--map featureSelected--", feature, "双击编辑");
          //设置编辑feature
          gMap.setActiveFeature(feature);
          if (feature.type != "POINT") {
            // 增加删除按钮
            that.addDeleteIcon(feature, feature.shape);
          }
        });
        //右键 目前只针对点双击选中右键触发
        gMap.events.on("featureDeleted", (feature) => {
          if (feature.type == "POINT") {
            // 根据 id 删除对应 feature
            console.log("featureDeleted....")
            that.getCurLayerGroup().layers.featureLayer.removeFeatureById(feature.id);
            Reflect.deleteProperty(that.getCurLayerGroup().layers.featureList, feature.id);
            // 设置当前图片的标记数，用于判断是否要加上已标记提示
            this.setCurMarkSum();
          }
        });
        // 单机空白取消编辑
        gMap.events.on("featureUnselected", () => {
          // 取消featureSelected
          that.editId = "";
          that.deIcon();
          gMap.setActiveFeature(null);
        });
        // 更新完
        gMap.events.on("featureUpdated", (feature, shape) => {
          console.log(feature);
          // 更新或者移动需要重新设置删除图标
          that.deIcon();
          feature.updateShape(shape);
          if (feature.type != "POINT") {
            that.addDeleteIcon(feature, shape);
          }
        });

        // 删除
        gMap.events.on("FeatureDeleted", () => {
          console.log(2222222);
          // that.gFirstFeatureLayer.removeFeatureById(that.editId);
        });

      },

      // 设置图片选中框
      addBorder(index) {
        this.borderIndex = index;
      },

      // 获取分页
      fetchData(page = 1) {
        console.log("获取图片列表");
        // 测试数据，因为没有使用 mock 所以暂时用以下方法代替
        this.page = page;
        this.total = 16;
        // let that = this;
        // // 由于没有用 mock，所以用以下方法测试
        // this.imgPromise(this.page, this.limit).then(function (data) {
        //   that.imgUrlList = data;
        // })
      },
      imgPromise(page, limit) {
        let that = this;
        return new Promise(function (resolve, reject) {
          let data = [];
          let index = 0;
          that.imgUrlList.map(item => {
            data.push(item)
          });
          resolve(data);
        });
      }
      
    }
  };
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: row;
    margin: 50px;
    justify-content: center;
  }

  .button-wrap {
    /* display: flex; */
    /*flex-direction: column;*/
    display: flex;
    position: relative;
    flex-direction: row;
    z-index: 99;
  }

  .zoom-icon-wrapper {
    position: absolute;
    top: 0;
    /* left: 20px; */
    /* top: 20px; */
    z-index: 1000;
  }

  .zoom-icon-plus {
    width: 30px;
    height: 30px;
    line-height: 20px;
    text-align: center;
    border: 3px solid #6495ed;
    font-size: 20px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #ff8c00;
    cursor: pointer;
  }

  .zoom-icon-plus:hover {
    border-color: #4169e1;
  }

  .zoom-icon-minus {
    margin-top: 6px;
    width: 30px;
    height: 30px;
    line-height: 20px;
    text-align: center;
    border: 3px solid #6495ed;
    font-size: 25px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    color: #ff8c00;
    cursor: pointer;
  }

  .zoom-icon-minus:hover {
    border-color: #4169e1;
  }

  /* 删除图标 */
  #delete01 {
    width: 5px !important;
    height: 5px !important;
  }

  .el-button+.el-button {
    margin-left: 0px;
  }

  .left {
    /*width: 284px;*/
    height: 540px;
    /*z-index: 1;*/
    box-shadow: 0 0 25px -5px rgb(0 0 0 / 10%);
  }

  .album-content-left {
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: 540px;*/
    position: relative;
    flex-direction: column;
  }

  .album-content-opt {
    display: flex;
    justify-content: space-between;
  }

  .opt {
    display: flex;
    align-items: center;
  }

  .label-manage-right {
    width: 260px;
    box-shadow: 0 0 25px -5px rgb(0 0 0 / 10%); 
    display: flex;
    padding: 15px 0 0 15px;
    height: 100%;
    position: relative;
    flex-direction: column;
  }

  .label-manage {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .label-tabs {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ai-tabs_mid, .ai-tabs-item {
    height: 32px;
  }

  .label-list {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .label-manage-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .label-search {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .label-search button {
    margin-right: 10px;
  }

  /*  新增 by gzw  */
  #main {
    display: flex;
  }
  :deep(.el-row) {
    flex-wrap: nowrap;
  }
  :deep(.el-image):active {
    background-color: #ffffff;
    z-index: 999;
  }
  :deep(.el-image__inner) {
    transition: all .1s ease-in-out;
  }
  :deep(.el-image__inner):hover {
    transform: scale(1.1);
  }
  .border {
    box-sizing: border-box;
    border: 3px solid #72b6fd
  }
  #mark-container {
    flex: 1;
    margin: 0 20px;
    /*background-color: #2c3142;*/
    overflow: hidden;
    min-width: 700px;
    min-height: 500px;
  }
  #map {
    position: relative;
    flex: 1;
    width: 100%;
    height: calc(100% - 40px);
    border: 1px dashed #ccc;
    box-sizing: border-box;
  }
  .album-container, .label-container {
    min-width: 284px;
    width: 248px;
  }
  .album-list {
    display: flex;
    padding: 15px 0px 0px 15px;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 0 0 25px -5px rgb(0 0 0 / 10%);
  }
  .scrollbar {
    margin-top: 10px;
    height: 525px;
    overflow-y: visible;
  }
  .album-item-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-items: left;
    width: 100%;
  }
  .album-item-container:hover {
    cursor: pointer;
  }
  .albumImage {
    position: relative;
    flex: 0 0 45%;
    height: 120px;
    background-color: #f3f5fc;
    margin: 10px 10px 0px 0px;
    border-radius: 5px;
    box-shadow: 0 0 25px -5px rgb(0 0 0 / 10%);
  }
  .albumImage:before {
    content: '已标记';
    position: absolute;
    text-align: center;
    color: #ffffff;
    z-index: 999;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
    width: 60%;
    height: 20px;
    line-height: 20px;
    opacity: 0.8;
    background-color: #2c3142;
    border: 2px solid #2c3142;
    pointer-events: inherit;
    font-size: 10px;
    border-radius: 0 0 5px 5px;
    display: var(--display);
  }
  .pagination {
    margin-left: -10px;
  }
  .radio-group, .radio-line {
    position: relative;
  }
  .radio-line:before {
    content: '';
    border: 1px solid #409eff;
    width: 8px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
  }
  .radio-group:before {
    content: '';
    border: 1px solid #409eff;
    width: 15px;
    position: absolute;
    top: -1px;
    left: -10px;
  }
</style>