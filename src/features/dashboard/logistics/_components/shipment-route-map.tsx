import { geoMercator, geoPath } from "d3-geo";

import type { GeoCoordinate, Shipment } from "./shipment-data";
import { borders, land } from "./world-atlas";

type RoutePoint = {
  coordinates: GeoCoordinate;
  country: string;
  label: string;
};

type ProjectedRoutePoint = RoutePoint & {
  point: [number, number] | null;
};

const WIDTH = 1000;
const HEIGHT = 520;
const SNAPSHOT_PADDING = 72;
const ROUTE_CONTEXT_SCALE = 1.85;
const MIN_LONGITUDE_SPAN = 10;
const MIN_LATITUDE_SPAN = 8;

function roundCoordinate(value: number) {
  return Number(value.toFixed(3));
}

function createRouteLine(shipment: Shipment): GeoJSON.LineString {
  return {
    type: "LineString",
    coordinates: [shipment.origin.coordinates, shipment.destination.coordinates],
  };
}

function createSnapshotFrame(shipment: Shipment): GeoJSON.LineString {
  const [originLongitude, originLatitude] = shipment.origin.coordinates;
  const [destinationLongitude, destinationLatitude] = shipment.destination.coordinates;
  const centerLongitude = (originLongitude + destinationLongitude) / 2;
  const centerLatitude = (originLatitude + destinationLatitude) / 2;
  const longitudeSpan = Math.max(
    Math.abs(destinationLongitude - originLongitude) * ROUTE_CONTEXT_SCALE,
    MIN_LONGITUDE_SPAN,
  );
  const latitudeSpan = Math.max(
    Math.abs(destinationLatitude - originLatitude) * ROUTE_CONTEXT_SCALE,
    MIN_LATITUDE_SPAN,
  );
  const west = centerLongitude - longitudeSpan / 2;
  const east = centerLongitude + longitudeSpan / 2;
  const south = centerLatitude - latitudeSpan / 2;
  const north = centerLatitude + latitudeSpan / 2;

  return {
    type: "LineString",
    coordinates: [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
      [west, south],
    ],
  };
}

type ShipmentRouteMapProps = {
  shipment: Shipment | null;
};

function buildMapGeometry(shipment: Shipment | null) {
  const routeLine = shipment ? createRouteLine(shipment) : null;
  const projection = geoMercator();

  if (shipment) {
    projection.fitExtent(
      [
        [SNAPSHOT_PADDING, SNAPSHOT_PADDING],
        [WIDTH - SNAPSHOT_PADDING, HEIGHT - SNAPSHOT_PADDING],
      ],
      createSnapshotFrame(shipment),
    );
  } else {
    projection
      .center([102, 17])
      .scale(760)
      .translate([WIDTH / 2, HEIGHT / 2]);
  }

  const pathGenerator = geoPath(projection);

  function projectPoint(routePoint: RoutePoint): ProjectedRoutePoint {
    const point = projection(routePoint.coordinates);

    return {
      ...routePoint,
      point: point ? [roundCoordinate(point[0]), roundCoordinate(point[1])] : null,
    };
  }

  return {
    path: pathGenerator,
    routePath: routeLine ? pathGenerator(routeLine) : null,
    routePoints: shipment
      ? [
          projectPoint({
            coordinates: shipment.origin.coordinates,
            country: shipment.origin.country,
            label: "Origin",
          }),
          projectPoint({
            coordinates: shipment.destination.coordinates,
            country: shipment.destination.country,
            label: "Destination",
          }),
        ]
      : [],
  };
}

export function ShipmentRouteMap({ shipment }: ShipmentRouteMapProps) {
  const { path, routePath, routePoints } = buildMapGeometry(shipment);

  return (
    <div className="size-full min-h-0 overflow-hidden bg-[#d4dadc] dark:bg-[#2C353C]">
      <svg
        aria-label="Southeast Asia shipment region map"
        className="block size-full bg-[#d4dadc] dark:bg-[#2C353C]"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect height={HEIGHT} width={WIDTH} className="fill-[#d4dadc] dark:fill-[#2C353C]" />
        <path
          d={path(land) ?? undefined}
          className="fill-[#fafaf8] dark:fill-[#0e0e0e]"
          stroke="#f0dddd"
          strokeWidth={0.8}
        />
        <path d={path(borders) ?? undefined} className="fill-none stroke-[#ebd6d8] dark:stroke-[#2C353C]" />
        {routePath && (
          <path
            d={routePath}
            className="stroke-primary fill-none"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth={3}
          />
        )}
        {routePoints.map(({ country, label, point }) =>
          point ? (
            <g key={label} transform={`translate(${point[0]}, ${point[1]})`}>
              <circle className="fill-background stroke-primary" r={8} strokeWidth={3} />
              <circle className="fill-primary" r={3} />
              <text className="fill-foreground text-[10px] font-medium" dy={-14} textAnchor="middle">
                {country}
              </text>
            </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
