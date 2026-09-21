import React, { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export interface RouteCalculationResult {
  distanceMeters: number;
  durationSeconds: number;
  formattedDistance: string;
  formattedDuration: string;
  status: 'computed' | 'approximated' | 'failed';
  errorMessage?: string;
  steps?: Array<{
    instruction: string;
    distance?: string;
  }>;
}

interface StamfordRouteRendererProps {
  origin: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
  waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  travelMode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
  strokeColor?: string;
  onRouteCalculated?: (result: RouteCalculationResult) => void;
}

export const StamfordRouteRenderer: React.FC<StamfordRouteRendererProps> = ({
  origin,
  destination,
  waypoints = [],
  travelMode,
  strokeColor = '#00ffff',
  onRouteCalculated,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const geometryLib = useMapsLibrary('geometry');
  const coreLib = useMapsLibrary('core');

  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const glowPolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    // Clean up prior polylines
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (glowPolylineRef.current) {
      glowPolylineRef.current.setMap(null);
      glowPolylineRef.current = null;
    }

    // Helper to calculate haversine distance between 2 points in meters
    const getHaversineDistance = (
      p1: { lat: number; lng: number },
      p2: { lat: number; lng: number }
    ) => {
      const R = 6371e3; // Earth radius in meters
      const phi1 = (p1.lat * Math.PI) / 180;
      const phi2 = (p2.lat * Math.PI) / 180;
      const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
      const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

      const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Calculate fallback path through all waypoints
    const allStops = [origin, ...waypoints, destination];
    let totalApproxMeters = 0;
    for (let i = 0; i < allStops.length - 1; i++) {
      totalApproxMeters += getHaversineDistance(allStops[i], allStops[i + 1]);
    }
    // Road factor approximation ~ 1.25x haversine
    const approxRoadMeters = Math.round(totalApproxMeters * 1.28);
    const speedMps = travelMode === 'DRIVE' ? 11.1 : travelMode === 'BICYCLE' ? 4.5 : 1.35; // m/s
    const approxDurationSecs = Math.round(approxRoadMeters / speedMps);

    const formatDist = (meters: number) => {
      const miles = meters / 1609.34;
      return `${miles.toFixed(2)} mi (${(meters / 1000).toFixed(1)} km)`;
    };

    const formatDur = (secs: number) => {
      const mins = Math.round(secs / 60);
      if (mins < 60) return `${mins} min`;
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return `${hrs} hr ${rem} min`;
    };

    // Render visual polyline function
    const renderPolyline = (path: Array<{ lat: number; lng: number }>) => {
      if (!map) return;

      // Outer glow line
      glowPolylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 0.35,
        strokeWeight: 10,
        map,
      });

      // Sharp inner core line
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map,
      });

      // Fit bounds to path
      const bounds = new google.maps.LatLngBounds();
      path.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 70 });
    };

    // Check if routes library is available
    const rLib = routesLib as any;
    if (rLib && rLib.Route) {
      try {
        const computeFn = rLib.Route.computeRoutes
          ? rLib.Route.computeRoutes.bind(rLib.Route)
          : typeof rLib.Route === 'function' && new rLib.Route().computeRoutes
          ? new rLib.Route().computeRoutes.bind(new rLib.Route())
          : null;

        const sdkTravelMode =
          rLib.TravelMode?.[travelMode] || travelMode || 'DRIVE';

        const request: any = {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: sdkTravelMode,
          fields: ['polyline', 'distanceMeters', 'duration', 'viewport'],
        };

        // If intermediate waypoints are supplied
        if (waypoints.length > 0) {
          request.intermediates = waypoints.map((w) => ({
            location: { latLng: { lat: w.lat, lng: w.lng } },
          }));
        }

        if (computeFn) {
          computeFn(request)
            .then((response: any) => {
              if (response && response.routes && response.routes.length > 0) {
                const route = response.routes[0];
                let path: Array<{ lat: number; lng: number }> = [];

                if (route.polyline?.encodedPolyline) {
                  if (typeof rLib.Route?.decode === 'function') {
                    path = rLib.Route.decode(route.polyline.encodedPolyline);
                  } else if (geometryLib?.encoding?.decodePath) {
                    const decoded = geometryLib.encoding.decodePath(route.polyline.encodedPolyline);
                    path = decoded.map((latlng: any) => ({
                      lat: latlng.lat(),
                      lng: latlng.lng(),
                    }));
                  }
                }

                if (path.length > 0) {
                  renderPolyline(path);
                } else {
                  renderPolyline(allStops);
                }

                const distMeters = route.distanceMeters || approxRoadMeters;
                const durSeconds =
                  typeof route.duration === 'string'
                    ? parseInt(route.duration.replace('s', ''), 10) || approxDurationSecs
                    : route.duration || approxDurationSecs;

                onRouteCalculated?.({
                  distanceMeters: distMeters,
                  durationSeconds: durSeconds,
                  formattedDistance: formatDist(distMeters),
                  formattedDuration: formatDur(durSeconds),
                  status: 'computed',
                });
              } else {
                renderPolyline(allStops);
                onRouteCalculated?.({
                  distanceMeters: approxRoadMeters,
                  durationSeconds: approxDurationSecs,
                  formattedDistance: formatDist(approxRoadMeters),
                  formattedDuration: formatDur(approxDurationSecs),
                  status: 'approximated',
                });
              }
            })
            .catch((err: any) => {
              console.warn('Routes API computeRoutes encountered error, rendering fallback route line:', err);
              renderPolyline(allStops);
              onRouteCalculated?.({
                distanceMeters: approxRoadMeters,
                durationSeconds: approxDurationSecs,
                formattedDistance: formatDist(approxRoadMeters),
                formattedDuration: formatDur(approxDurationSecs),
                status: 'approximated',
                errorMessage: err?.message || 'Routes API fallback engaged.',
              });
            });
        } else {
          renderPolyline(allStops);
          onRouteCalculated?.({
            distanceMeters: approxRoadMeters,
            durationSeconds: approxDurationSecs,
            formattedDistance: formatDist(approxRoadMeters),
            formattedDuration: formatDur(approxDurationSecs),
            status: 'approximated',
          });
        }
      } catch (err: any) {
        console.warn('Error invoking route service, using fallback path:', err);
        renderPolyline(allStops);
        onRouteCalculated?.({
          distanceMeters: approxRoadMeters,
          durationSeconds: approxDurationSecs,
          formattedDistance: formatDist(approxRoadMeters),
          formattedDuration: formatDur(approxDurationSecs),
          status: 'approximated',
        });
      }
    } else {
      // Routes lib not yet loaded or unavailable: render visual straight-line corridor immediately
      renderPolyline(allStops);
      onRouteCalculated?.({
        distanceMeters: approxRoadMeters,
        durationSeconds: approxDurationSecs,
        formattedDistance: formatDist(approxRoadMeters),
        formattedDuration: formatDur(approxDurationSecs),
        status: 'approximated',
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (glowPolylineRef.current) {
        glowPolylineRef.current.setMap(null);
        glowPolylineRef.current = null;
      }
    };
  }, [
    map,
    routesLib,
    geometryLib,
    coreLib,
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng,
    waypoints,
    travelMode,
    strokeColor,
  ]);

  return null;
};
