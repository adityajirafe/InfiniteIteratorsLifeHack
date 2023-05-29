import isPointWithinRadius from "geolib";

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
    console.log("DONE", coords);
    return coords;
  } catch {
    console.log("ERROR getting coords");
    return;
  }
};

// export checkWithinRadius = async(address) => {
//     getCoords(address).then(result => isPointWithinRadius())
// }

export const googleLibraries = ["places", "geometry"];

export const TOWNSHIPS = {
  Woodlands: {
    latitude: 1.4382067504531035,
    longitude: 103.78900322357609,
  },
  Serangoon: {
    lat: 1.35592,
    lng: 103.867752,
  },
};
