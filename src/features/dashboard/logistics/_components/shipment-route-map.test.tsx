import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

import { ShipmentRouteMap } from "./shipment-route-map";

it("renders the map land and country borders without a network request", () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<ShipmentRouteMap shipment={null} />);
  const paths = container.querySelectorAll("svg path");
  expect(paths).toHaveLength(2);
  for (const path of paths) {
    expect(path.getAttribute("d")).toMatch(/^M/);
  }
  expect(fetch).not.toHaveBeenCalled();
  fetch.mockRestore();
});
