<template>
  <div class="map__container">
    <div id="map"></div>
    <div class="map__panel">
      <input
        type="text"
        v-model="filters.search"
        placeholder="Поиск..."
        class="map__input"
      />
      <select v-model="filters.state" class="map__input">
        <option value="0">Все устройства</option>
        <option value="1">Online</option>
        <option value="2">Offline</option>
      </select>
      <button @click="clearIntervalF">Stop</button>
    </div>
    <app-statistics ref="statisticsRef" :features="features" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick, reactive } from "vue";
import { createMarker, updateMarker } from "./utils";
import { fakeServer } from "../fakeServer.js";
import AppStatistics from "./AppStatistics.vue";
let map = null;
let mapMarkers = {};
let features = ref([]);
let clusterLayerMarkers = null;
const filters = ref({
  state: 0,
  search: "",
});
const statisticsRef = ref(null);

onMounted(() => {
  createMap();
  fetchGeoData();
  addControlStatisticsToMap();
  addControllZoomToMap();
});

function addControllZoomToMap() {
  const zoom = L.control.zoom({
    position: "bottomleft",
  });
  zoom.addTo(map);
}

function clearIntervalF() {
  clearInterval(interval.value);
}
function fetchGeoData() {
  try {
    let geoJson = fakeServer();
    features.value = geoJson.features;
    renderClusterLayerMarkers();

    const bounds = clusterLayerMarkers.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
    setInterval(() => {
      let geoJson = fakeServer();
      features.value = geoJson.features;

      renderClusterLayerMarkers();
    }, 3000);
  } catch (error) {
    console.log(error);
  }
}

function createMap() {
  map = L.map("map", { zoomControl: false }).setView([59.2239, 39.884], 8);

  let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {});
  osm.addTo(map);
}

function filterFeatures(features) {
  return features
    .filter((feature) =>
      feature.properties.label.toLowerCase().includes(filters.value.search)
    )
    .filter((feature) => {
      switch (+filters.value.state) {
        case 1:
          return feature.properties.online;
        case 2:
          return !feature.properties.online;
        default:
          return true;
      }
    });
}

function renderClusterLayerMarkers() {
  let removeMarkers = [];
  let filteredFeatureIds = [];

  if (!clusterLayerMarkers) {
    clusterLayerMarkers = L.markerClusterGroup({
      maxClusterRadius: 20,
    });

    clusterLayerMarkers.addTo(map);
  }

  filterFeatures(features.value).forEach((feature) => {
    if (mapMarkers[feature.id]) {
      updateMarker(mapMarkers[feature.id], feature);
    } else {
      addMarkerToCluster(feature);
    }

    filteredFeatureIds.push(feature.id);
  });

  Object.entries(mapMarkers).forEach(([id, marker]) => {
    if (!filteredFeatureIds.includes(id)) {
      removeMarkers.push(marker);
      delete mapMarkers[id];
    }
  });

  clusterLayerMarkers.removeLayers(removeMarkers);
}

function addMarkerToCluster(feature) {
  if (!clusterLayerMarkers) {
    return;
  }

  const marker = createMarker(feature);

  mapMarkers[feature.id] = marker;

  clusterLayerMarkers.addLayer(marker);
}

// Создание собственного пользовательского контрола
function addControlStatisticsToMap() {
  L.Control.Statistics = L.Control.extend({
    onAdd: function (map) {
      // в this._container помещается любой HTML-элемент
      // (можно создать через document.createElement() и т.п.)
      this._container = statisticsRef.value.$el;

      L.DomEvent.on(this._container, "mousewheel", L.DomEvent.stopPropagation);
      L.DomEvent.disableClickPropagation(this._container);

      return this._container;
    },
    onRemove: function (map) {},
  });

  L.control.statistics = function (opts) {
    return new L.Control.Statistics(opts);
  };

  L.control
    .statistics({
      position: "topleft",
    })
    .addTo(map);
}

watch(filters.value, (newFilters) => {
  renderClusterLayerMarkers();
});

function createMarkerIcon(feature) {
  const color = feature.properties.color;
  const caption = feature.properties.label;

  const markerHtml = `<div class="marker__container">
        <div class="icon__container" style="background-color:${color}">
       <img src='./camera1.png' style="width:80%; height:80%, object-fit:cover"/>
       </div>
        <div class="captions__container">
          <div class="marker__caption">${caption}</div>
        </div>
        </div>`;

  let markerIcon = L.divIcon({
    className: "custom__marker",
    html: markerHtml,
  });

  return markerIcon;
}

function pointToLayer(feature, latlng) {
  let markerIcon = createMarkerIcon(feature, latlng);
  let marker = L.marker(latlng)
    .setIcon(markerIcon)
    .bindPopup(feature.properties.popup);
  mapAllMarkersList[feature.id] = marker;
  return markers.addLayer(marker);
}
</script>

<style scoped>
.map__container {
  width: 100%;
  height: 700px;
  position: relative;
  display: flex;
}
#map {
  width: 90%;
  height: 100%;
}
.map__panel {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
