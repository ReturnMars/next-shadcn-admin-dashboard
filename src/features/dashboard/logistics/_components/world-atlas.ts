import { feature, mesh } from "topojson-client";
import { z } from "zod";

import atlasData from "./map-data/countries-110m.json";

// Validate the vendored dataset once at the module boundary. Geometry then has
// the exact types expected by topojson-client, without assertions or a CDN fetch.
const ring = z.array(z.number().int());
const geometry = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Polygon"), arcs: z.array(ring) }),
  z.object({ type: z.literal("MultiPolygon"), arcs: z.array(z.array(ring)) }),
]);
const collection = z.object({ type: z.literal("GeometryCollection"), geometries: z.array(geometry) });
const point = z.tuple([z.number(), z.number()]);
const topology = z
  .object({
    type: z.literal("Topology"),
    arcs: z.array(z.array(point)),
    transform: z.object({ scale: point, translate: point }),
    objects: z.object({ land: collection, countries: collection }),
  })
  .parse(atlasData);

export const land = feature(topology, topology.objects.land);
export const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
