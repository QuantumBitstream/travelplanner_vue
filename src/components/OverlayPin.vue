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
        :options="options"
    />

  </tlbs-map>


    <el-button type="primary" @click="updatePin">
      <el-icon><Coordinate /></el-icon>
      <span style="vertical-align: middle"> pinAll </span></el-button>



    <el-button type="primary" @click="updatePin">生成当天行程路线</el-button>


</template>

<script>
export default {
  name: 'PolylineDemo',
  props: {
    geometriesTest: {
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
        { id: 'label_1', styleId: 'label', content: '1',  position: { lat: 40.041117253378246, lng: 116.2722415837743 } },
        { id: 'label_2', styleId: 'label', content: '2',  position: { lat: 40.03942536171407, lng: 116.2726277820093 } },
      ],
      geometries2: [
        { styleId: 'marker', position: { lat: 40.041117253378246, lng: 116.2722415837743 } },
        { styleId: 'marker', position: { lat: 40.03942536171407, lng: 116.2726277820093 } },
        { styleId: 'marker', position: { lat: 40.03970460886076, lng: 116.27483769345417 } },
        { styleId: 'marker', position: { lat: 40.041404706498625, lng: 116.27443003983899 } },
      ],
      geometries: [
        // 普通折线
        {
          id: 'polyline1',
          styleId: 'polyline',
          paths: [
            { lat: 40.041117253378246, lng: 116.2722415837743 },
            { lat: 40.03942536171407, lng: 116.2726277820093 },
            { lat: 40.03970460886076, lng: 116.27483769345417 },
            { lat: 40.041404706498625, lng: 116.27443003983899 },
          ],
          properties: {
            title: 'polyline',
          },
        },
        // // 彩虹折线
        // {
        //   id: 'polyline2',
        //   styleId: 'polyline',
        //   rainbowPaths: [
        //     {
        //       path: [
        //         { lat: 40.03819372750479, lng: 116.26842823488005 },
        //         { lat: 40.03850574866959, lng: 116.27198887995291 },
        //         { lat: 40.038932722719686, lng: 116.27529212938498 },
        //       ],
        //       color: '#ED273D',
        //       borderColor: '#9C1C2A',
        //     },
        //     {
        //       path: [
        //         { lat: 40.038932722719686, lng: 116.27529212938498 },
        //         { lat: 40.039540301341184, lng: 116.27835947187123 },
        //       ],
        //       color: '#2C68FF',
        //       borderColor: '#004EE1',
        //     },
        //   ],
        //   properties: {
        //     title: 'polyline',
        //   },
        // },
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

    };
  },
  methods: {
    onClick(e) {
      console.log(e);
    },
    updatePin() {
      this.geometries2 = this.geometriesTest
      console.log('this.geometriesTest: ', this.geometriesTest)
    }
  },
};
</script>
