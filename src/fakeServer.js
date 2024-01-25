import { faker } from "@faker-js/faker";

const generatePoint = function (id = null) {
  id = id ?? faker.string.uuid();
  let label = faker.lorem.word(10);

  return {
    type: "Feature",
    id: id,
    geometry: {
      type: "Point",
      coordinates: [
        faker.location.longitude({ min: 39, max: 40 }),
        faker.location.latitude({ min: 58, max: 59 }),
      ],
    },
    properties: {
      label,
      popup: faker.lorem.text(20),
      color: faker.color.rgb({ prefix: "#", casing: "lower" }),
      online: faker.datatype.boolean(0.5),
    },
  };
};

function updatePoint(point) {
  (point.geometry.coordinates = [
    faker.location.longitude({ min: 39, max: 40 }),
    faker.location.latitude({ min: 58, max: 59 }),
  ]),
    (point.properties.popup = faker.lorem.text(20));
  point.properties.color = faker.color.rgb({ prefix: "#", casing: "lower" });
  point.properties.online = faker.datatype.boolean(0.5);
}

let points = null;

const createPoints = function (countPoints = 10) {
  points = new Map();

  for (let i = 0; i < countPoints; i++) {
    const point = generatePoint();
    points.set(point.id, point);
  }
};

const updatePoints = function () {
  Array.from(points.keys()).forEach((id) => {
    updatePoint(points.get(id));
  });
};

export function fakeServer(countPoints = 10) {
  const count = Math.min(
    Math.floor(Math.random() * 10) + Math.floor(0.7 * countPoints),
    countPoints
  );

  if (points) {
    updatePoints();
    return {
      type: "FeatureCollection",
      features: Array.from(points.values()).slice(0, count),
    };
  }

  createPoints(countPoints);
  return {
    type: "FeatureCollection",
    features: Array.from(points.values()),
  };
}
