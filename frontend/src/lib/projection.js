// Map lat/lng to plane coordinates for the stylized USA.
// Bounds chosen for continental USA.
export const USA_BOUNDS = {
  minLat: 24,
  maxLat: 49,
  minLng: -125,
  maxLng: -66,
};

// The scene plane spans x=[-PLANE_W/2, PLANE_W/2], z=[-PLANE_H/2, PLANE_H/2]
export const PLANE_W = 120;
export const PLANE_H = 70;

export function project(lat, lng) {
  const { minLat, maxLat, minLng, maxLng } = USA_BOUNDS;
  const nx = (lng - minLng) / (maxLng - minLng); // 0..1 west→east
  const ny = (lat - minLat) / (maxLat - minLat); // 0..1 south→north
  const x = (nx - 0.5) * PLANE_W;
  // In three.js, north should be -z (forward), so invert
  const z = (0.5 - ny) * PLANE_H;
  return [x, z];
}

// Hand-drawn USA mainland outline (roughly, counterclockwise) in [lng, lat]
export const USA_OUTLINE = [
  [-124.7, 48.4],
  [-124.0, 40.4],
  [-122.5, 37.7],
  [-120.5, 34.5],
  [-117.3, 32.6],
  [-114.7, 32.7],
  [-111.0, 31.3],
  [-108.2, 31.8],
  [-106.5, 31.7],
  [-104.5, 29.5],
  [-101.0, 29.4],
  [-99.0, 26.4],
  [-97.4, 26.0],
  [-95.5, 28.8],
  [-93.8, 29.7],
  [-91.0, 29.2],
  [-89.0, 30.0],
  [-87.5, 30.3],
  [-85.0, 29.7],
  [-83.3, 27.8],
  [-81.5, 24.6],
  [-80.5, 25.2],
  [-80.0, 27.0],
  [-80.5, 30.5],
  [-81.5, 31.2],
  [-79.5, 33.0],
  [-77.0, 34.5],
  [-75.5, 35.3],
  [-75.0, 37.0],
  [-75.0, 38.8],
  [-74.0, 40.0],
  [-71.5, 41.2],
  [-70.0, 41.7],
  [-70.5, 43.0],
  [-69.0, 44.0],
  [-67.0, 44.7],
  [-67.3, 45.3],
  [-69.0, 46.5],
  [-69.2, 47.4],
  [-71.0, 45.0],
  [-74.5, 45.0],
  [-77.0, 43.6],
  [-79.0, 43.6],
  [-82.5, 41.6],
  [-83.0, 42.0],
  [-83.0, 45.8],
  [-84.5, 46.0],
  [-87.5, 46.0],
  [-89.0, 47.6],
  [-92.0, 47.0],
  [-94.5, 49.3],
  [-95.2, 49.0],
  [-104.0, 49.0],
  [-111.0, 49.0],
  [-117.0, 49.0],
  [-122.8, 49.0],
  [-124.7, 48.4],
];
