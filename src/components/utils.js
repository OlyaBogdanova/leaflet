export function createMarker(feature) {
  const [longitude, latitude] = feature.geometry.coordinates;

  let marker = L.marker(new L.LatLng(latitude, longitude));

  const icon = createIcon(
    feature.properties.label,
    feature.properties.color,
    feature.properties.online
  );

  marker.setIcon(icon);

  marker.bindPopup(feature.properties.popup, {
    minWidth: "300",
  });

  return marker;
}

export function updateMarker(marker, feature) {
  const [longitude, latitude] = feature.geometry.coordinates;

  marker.setLatLng(new L.LatLng(latitude, longitude));

  const icon = createIcon(
    feature.properties.label,
    feature.properties.color,
    feature.properties.online
  );

  marker.setIcon(icon);

  marker.setPopupContent(feature.properties.popup);
}

function createIcon(label, color, online) {
  const html = `<div class="camera-marker__container">
                    <div class="camera-marker">
                    <div class="camera-marker__icon" style="background-color:${color}"></div>
                    <div class="camera-marker__info">
                        <div class="camera-marker__title">${label} [${
    online ? "online" : "offline"
  }]</div>
                    </div>
                    </div>
                </div>`;

  return L.divIcon({
    popupAnchor: [6, -4],
    className: "",
    html,
  });
}
