<template>
  <tlbs-map
      ref="map"
      api-key="OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"
      :center="center"
      :zoom="zoom"
      :control="control"
      @click="onClick"
  >
    <!--    折线-->
    <tlbs-multi-polyline
        :geometries="geometries"
        :styles="styles"
        :options="options"
    />

    <!--    点标记-->
    <tlbs-multi-marker
        :geometries="geometries2"
        :styles="styles2"
        :options="options"
    />

    <tlbs-multi-label
        :geometries="geometriesOfLabel"
        :styles="stylesOfLabel"
        :options="optionsOfLabel"
    />

  </tlbs-map>


    <el-button plain type="primary" @click="updatePin">
      <el-icon><Coordinate /></el-icon>
      <span style="vertical-align: middle"> pinAll </span></el-button>



    <el-button plain type="primary" @click="generateRoute">
      <el-icon><Position /></el-icon>
      <span style="vertical-align: middle"> 生成当天行程路线 </span></el-button>


</template>

<script>
export default {
  name: 'PolylineDemo',
  props: {
    geometriesTest: {
      type: Array,
      required: true
    },
    geometriesRoute: {
      type: Array,
      required: true
    },
    geometriesLabelTest: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      map: null,
      center: { lat: 40.040452, lng: 116.273486 },
      zoom: 16,
      control: {
        scale: {},
        zoom: {
          position: 'topRight',
        },
      },
      geometriesOfLabel: [
        // { id: 'label_1', styleId: 'label', content: '1',  position: { lat: 40.041117253378246, lng: 116.2722415837743 } },
        // { id: 'label_2', styleId: 'label', content: '2',  position: { lat: 40.03942536171407, lng: 116.2726277820093 } },
      ],
      geometries2: [
        // { styleId: 'marker', position: { lat: 40.041117253378246, lng: 116.2722415837743 } },
        // { styleId: 'marker', position: { lat: 40.03942536171407, lng: 116.2726277820093 } },
        // { styleId: 'marker', position: { lat: 40.03970460886076, lng: 116.27483769345417 } },
        // { styleId: 'marker', position: { lat: 40.041404706498625, lng: 116.27443003983899 } },
      ],
      geometries: [
        // 普通折线
        {
          id: 'polyline1',
          styleId: 'polyline',
          paths: [
            // { lat: 40.041117253378246, lng: 116.2722415837743 },
            // { lat: 40.03942536171407, lng: 116.2726277820093 },
            // { lat: 40.03970460886076, lng: 116.27483769345417 },
            // { lat: 40.041404706498625, lng: 116.27443003983899 },
          ],
          properties: {
            title: 'polyline',
          },
        },
      ],
      stylesOfLabel: {
        label: {
          color: '#ff', // 颜色属性
          size: 14, // 文字大小属性
          offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
          angle: 0, // 文字旋转属性
          width: 20, // width 和 height 如果不填的话，背景是看不到的
          height: 20,
          backgroundColor: 'rgb(255, 99, 71)',
          borderWidth: 2,
          borderColor: 'rgb(255, 99, 71)',
          borderRadius: 12,
          alignment: 'center', // 文字水平对齐属性
          verticalAlignment: 'middle', // 文字垂直对齐属性
        },
      },
      styles2: {
        marker: {
          width: 20,
          height: 30,
          anchor: { x: 10, y: 30 },
        },
      },
      styles: {
        polyline: {
          showArrow: true,
          enableBloom: true,
          ArrowOptions: [{animSpeed: 200}],
          lineCap: 'round',
          color: '#2C68FF', // 线填充色
          borderWidth: 2, // 边线宽度
          borderColor: '#004EE1', // 边线颜色
        },
      },
      options2: {
        minZoom: 5,
        maxZoom: 15,
      },
      options: {
        zIndex: 1,
      },
      optionsOfLabel: {
        collisionOptions: {
          sameSource: true, // 是否开启图层内碰撞，优先级按rank进行碰撞
        },
      },

    };
  },
  methods: {
    onClick(e) {
      console.log(e);
    },
    updatePin() {

      this.geometries2 = this.geometriesTest
      console.log('this.geometriesTest: ', this.geometriesTest)

    },
    // 解压并转换为指定格式
    decompressAndFormatPolyline(coors) {
      // array 方案路线坐标点串，可用于在地图中绘制路线（该点串经过压缩，解压请参考：polyline 坐标解压）
      // https://lbs.qq.com/service/webService/webServiceGuide/route/webServiceRoute#8
      const decompressed = [...coors];
      for (let i = 2; i < decompressed.length; i++) {
        decompressed[i] = decompressed[i - 2] + decompressed[i] / 1000000;
      }

      console.log('data.result.routes[0].polyline(decompressed): ', decompressed);

      // 转换为指定格式 [{ lat: xx, lng: xx }, ...]
      const formatted = [];
      for (let i = 0; i < decompressed.length; i += 2) {
        formatted.push({
          lat: decompressed[i],
          lng: decompressed[i + 1],
        });
      }
      console.log('formatted: ', formatted);

      return formatted;
    },
    async generateRoute() {

      this.geometriesOfLabel = this.geometriesLabelTest
      console.log('this.geometriesOfLabel: ', this.geometriesLabelTest)

      console.log('检查 this 是否是 Vue 实例', this ); // 检查 this 是否是 Vue 实例


      console.log('geometries first', this.geometries)
      console.log('this.geometriesRoute: ', this.geometriesRoute)
      // console.log('this.geometriesRoute[0].paths: ', this.geometriesRoute[0].paths)

      try {

        // 显示加载状态
        this.$loading({
          lock: true,
          text: '正在生成路线...',
          spinner: 'el-icon-loading',
        });


        console.log('test user input points - this.geometriesRoute[0].paths: ', this.geometriesRoute[0].paths)

        // 假设 geometriesRoute[0].paths 是一个包含坐标的数组
        const paths = this.geometriesRoute[0].paths;

        // 验证路径数据是否有效
        if (!paths || paths.length < 2) {
          throw new Error('路径数据无效，至少需要两个点');
        }

        // 获取起点、终点和途经点
        const from = `${paths[0].lat},${paths[0].lng}`; // 起点坐标
        const to = `${paths[paths.length - 1].lat},${paths[paths.length - 1].lng}`; // 终点坐标

        // 提取途经点（中间的点）
        const waypoints = paths.slice(1, paths.length - 1) // 去掉第一个和最后一个点
            .map(point => `${point.lat},${point.lng}`) // 转换为字符串格式
            .join(';'); // 用分号分隔多个途经点

        const response = await fetch('/api/ws/direction/v1/driving?' +
            new URLSearchParams({
              from, // 起点
              to,   // 终点
              waypoints, // 途经点
              output: 'json',
              key: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77',
            }),
            {
              method: 'GET',
              credentials: 'include', // 如果需要携带 cookies
              mode: 'cors', // 启用 CORS 模式
              headers: {
                'Content-Type': 'application/json',
              },
            })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log('this.geometries first:', this.geometries);
        console.log(data);
        console.log('data.result.routes[0].polyline: ', data.result.routes[0].polyline)
        // array 方案路线坐标点串，可用于在地图中绘制路线（该点串经过压缩，解压请参考：polyline 坐标解压）
        // https://lbs.qq.com/service/webService/webServiceGuide/route/webServiceRoute#8
        const coors = data.result.routes[0].polyline;
        const formattedData = this.decompressAndFormatPolyline(coors);

        // 更新 geometries
        // 在更新 this.geometries[0].paths 之前，先检查 this.geometries[0] 是否存在。如果不存在，则需要初始化
        if (!this.geometries[0]) {
          this.geometries[0] = {paths: []}; // 初始化第一个元素
        }
        // // 更新路线数据
        // this.geometries[0].paths = formattedData;
        // 更新路线数据
        this.geometries = [{
          id: 'polyline1',
          styleId: 'polyline',
          paths: formattedData,
          properties: { title: 'polyline' },
        }];
        console.log('this.geometries new:', this.geometries);

        // 更新地图视野以包含整条路线
        this.updateMapView(formattedData);

        // this.geometries = this.geometriesRoute

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // 关闭加载状态
        this.$loading().close();
      }

    },

    updateMapView(paths) {
      if (!paths.length) return;

      // 计算路线的边界
      const bounds = paths.reduce(
          (acc, point) => {
            acc.minLat = Math.min(acc.minLat, point.lat);
            acc.maxLat = Math.max(acc.maxLat, point.lat);
            acc.minLng = Math.min(acc.minLng, point.lng);
            acc.maxLng = Math.max(acc.maxLng, point.lng);
            return acc;
          },
          {
            minLat: paths[0].lat,
            maxLat: paths[0].lat,
            minLng: paths[0].lng,
            maxLng: paths[0].lng,
          }
      );

      // 更新地图中心点和缩放级别
      this.center = {
        lat: (bounds.minLat + bounds.maxLat) / 2,
        lng: (bounds.minLng + bounds.maxLng) / 2,
      };

      // 可以根据需要调整缩放级别
      this.zoom = 12;
    },

  },
};
</script>
