<template>
  <tlbs-map
      ref="map"
      api-key="OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"
      :center="center"
      :zoom="zoom"
      :control="control"
      @click="onClick"
  >
    <tlbs-multi-marker
        :geometries="geometries"
        :styles="styles"
        :options="options"
    />
  </tlbs-map>
</template>

<script>
export default {
  name: 'MarkerDemo',
  data() {
    return {
      map: null,
      center: { lat: 39.91799, lng: 116.397027 },
      zoom: 10,
      geometries: [
        { styleId: 'marker', position: { lat: 39.91799, lng: 116.397027 } },
      ],
      styles: {
        marker: {
          width: 20,
          height: 30,
          anchor: { x: 10, y: 30 },
        },
      },
      options: {
        minZoom: 5,
        maxZoom: 15,
      },
      control: {
        scale: {},
        zoom: {
          position: 'topRight',
        },
      }
    };
  },
  methods: {
    onClick(e) {
      console.log(e);
    }
  }
};
</script>
