import { useEffect, useRef } from 'react';
import { buildMap } from '../plots/buildMap';

function PadMap({ launches, hoveredLaunchId }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const pointsIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { svg, zoomG, projection, zoom } = buildMap(containerRef.current);
    mapRef.current = { svg, zoomG, projection, zoom };

    return () => {
      svg.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const { zoomG, projection } = mapRef.current;

    pointsIdRef.current = new Map();

    for (const launch of launches) {
      const lat = parseFloat(launch.pad?.latitude);
      const lon = parseFloat(launch.pad?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      const projected = projection([lon, lat]);
      if (!projected) continue;

      const padId = launch.pad?.id ?? `${lat},${lon}`;
      const existing = pointsIdRef.current.get(padId);

      if (existing) {
        existing.launchIds.push(launch.id);
      } else {
        pointsIdRef.current.set(padId, {
          id: padId,
          x: projected[0],
          y: projected[1],
          launchIds: [launch.id],
        });
      }
    }

    const points = Array.from(pointsIdRef.current.values());

    const selection = zoomG
      .selectAll('circle.launchpad')
      .data(points, d => d.id);

    selection
      .enter()
      .append('circle')
      .attr('class', 'launchpad')
      .attr('r', 1)
      .merge(selection)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    selection.exit().remove();
  }, [launches]);

  useEffect(() => {
    if (!mapRef.current) return;
    const { zoomG } = mapRef.current;

    zoomG
      .selectAll('circle.launchpad')
      .classed('highlight', d => d.launchIds.includes(hoveredLaunchId))
      .attr('r', d => d.launchIds.includes(hoveredLaunchId) ? 2 : 1);
  }, [launches, hoveredLaunchId]);

  return <div className="mapContainer map" ref={containerRef} />;
}

export { PadMap };