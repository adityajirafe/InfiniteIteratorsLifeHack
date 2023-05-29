import { isPointWithinRadius, getDistance } from "geolib";

export const getCoords = async (address) => {
  // eslint-disable-next-line no-undef
  const geocoder = new google.maps.Geocoder();

  const originPromise = new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      // eslint-disable-next-line no-undef
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        resolve(results[0].geometry.location);
      } else {
        reject(new Error("Geocoding failed for origin address."));
      }
    });
  });
  try {
    const coords = await Promise.all([originPromise]);
    return { latitude: coords[0].lat(), longitude: coords[0].lng() };
  } catch {
    console.log("ERROR getting coords");
    return;
  }
};

export const checkWithinRadius = async (address) => {
  const RADIUS = 5000;
  try {
    const coords = await getCoords(address);
    const results = Object.entries(TOWNSHIPS).map(([township, coordinates]) => {
      const result = isPointWithinRadius(coords, coordinates, RADIUS);
      let dist = RADIUS + 1;
      if (result) {
        dist = getDistance(coords, coordinates);
      }
      return { township, dist };
    });
    const minDistanceTownship = results.reduce((min, curr) => {
      return curr.dist < min.dist ? curr : min;
    });

    if (minDistanceTownship.dist <= RADIUS) {
      return minDistanceTownship;
    } else {
      return {
        township: null,
        dist: null,
        message: "No townships within radius",
      };
    }
  } catch (error) {
    console.error(error);
    return { township: null, dist: null, message: "Error occurred" };
  }
};

export const googleLibraries = ["places", "geometry"];

export const TOWNSHIPS = {
  Woodlands: {
    latitude: 1.4382067504531035,
    longitude: 103.78900322357609,
  },
  Serangoon: {
    latitude: 1.3511900115134075,
    longitude: 103.87272098357418,
  },
  ChoaChuKang: {
    latitude: 1.3839934318633005,
    longitude: 103.74695939751963,
  },
  JurongEast: {
    latitude: 1.3373653271372559,
    longitude: 103.74034625117747,
  },
  BoonLay: {
    latitude: 1.3383552752044043,
    longitude: 103.70449763261821,
  },
  Commonwealth: {
    latitude: 1.3021153682428142,
    longitude: 103.79766206075463,
  },
  BukitTimah: {
    latitude: 1.3302063225181238,
    longitude: 103.79889196956002,
  },
  AngMoKio: {
    latitude: 1.369066356081684,
    longitude: 103.84555504281762,
  },
  Yishun: {
    latitude: 1.4304175642555346,
    longitude: 103.83538300773749,
  },
  Sengkang: {
    latitude: 1.3893478187381858,
    longitude: 103.89215656277612,
  },
  Siglap: {
    latitude: 1.3146802869906613,
    longitude: 103.93348505888616,
  },
  Tampines: {
    latitude: 1.3495649548160504,
    longitude: 103.94937905437696,
  },
};

export const WORK = [
  {
    lat: 1.2805182897109721,
    lng: 103.85430153739446,
  },
];

const driver = [
  {
    lat: 1.430353468178358,
    lng: 103.78573705283941,
  },
];

const passengers = [
  {
    lat: 1.4404865606459663,
    lng: 103.79780752591975,
  },
  //   {
  //     lat: 1.4449562454354568,
  //     lng: 103.79048497059544,
  //   },
  //   {
  //     latitude: 1.4445869699498342,
  //     longitude: 103.80507396760258,
  //   },
];

export const PERMUTATIONS = {
  1: [[0, 1]],
  2: [[0, 1, 2]],
  3: [
    [0, 1, 2, 3],
    [0, 2, 1, 3],
  ],
  4: [
    [0, 1, 2, 3, 4],
    [0, 1, 3, 2, 4],
    [0, 2, 3, 1, 4],
    [0, 2, 1, 3, 4],
    [0, 3, 1, 2, 4],
    [0, 3, 2, 1, 4],
  ],
  5: [[0, 1, 2, 3, 4, 5]],
  6: [[0, 1, 2, 3, 4, 5, 6]],
  7: [[0, 1, 2, 3, 4, 5, 6, 7]],
};

export const findRoute = async () => {
  // eslint-disable-next-line no-undef
  const directionService = new google.maps.DirectionsService();

  const route = WORK.concat(passengers, driver);
  console.log(route);
  const numStops = passengers.length + 1;
  const routeResult = {};

  const numPermutations = PERMUTATIONS[numStops].length;
  console.log(numPermutations);

  for (var i = 0; i < numPermutations; i++) {
    for (var j = 0; j < numStops - 1; j++) {
      const results = await directionService.route({
        origin: route[PERMUTATIONS[numStops][i][j]],
        destination: route[PERMUTATIONS[numStops][i][j + 1]],
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (routeResult.hasOwnProperty(i)) {
        routeResult[i][0] += parseFloat(
          results.routes[0].legs[0].distance.text.split(" ")
        );
        routeResult[i][1].push(results);
      } else {
        routeResult[i] = [
          parseFloat(results.routes[0].legs[0].distance.text.split(" ")),
          [results],
        ];
      }
    }
  }
  let minDistance = Infinity;
  let minPair = null;

  for (const pair in routeResult) {
    const distance = routeResult[pair][0];
    if (distance < minDistance) {
      minDistance = distance;
      minPair = routeResult[pair][1];
    }
  }
  console.log(minPair);
  return minPair[0];
};
