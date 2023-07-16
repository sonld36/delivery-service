import { initMap } from '@Helpers/initMap';
import { styled } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react'
import { LongLatData } from './MapFollowShipper';
import mapService from '@Services/map.service';
import { Map } from 'mapbox-gl';

export type Props = {
  fromLocation: LongLatData,
  toLocation: LongLatData,
  currentLocation: LongLatData,
}

function MapToFollowOrder(props: Props) {
  const { currentLocation, fromLocation, toLocation } = props;
  const mapRef = useRef<HTMLDivElement>(null);
  const mappingRef = useRef<Map | any>(null);

  const dataChange = useMemo(() => currentLocation, [currentLocation]);



  useEffect(() => {
    if (mapRef.current && currentLocation) {
      const map = initMap(mapRef.current, [fromLocation.longtitude, fromLocation.latitude]);
      mappingRef.current = map;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (dataChange) {
        const location = await mapService.getDirection(fromLocation, toLocation);
        const route = location.geometry.coordinates;
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };

        if (mappingRef.current.getSource('route')) {
          mappingRef.current.getSource('route').setData(geojson);
        } else {
          mappingRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
        }

        mappingRef.current.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: fromLocation
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        });

        mappingRef.current?.getSource("iss")?.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [dataChange.longtitude, dataChange.latitude],
              },
              properties: {
                'description': `<strong>${location}</strong>`
              },
            },
          ],
        },);

        mappingRef.current.flyTo({
          center: [fromLocation.longtitude, fromLocation.latitude],
        });
      }
    }

    fetchLocation();
  }, [dataChange, fromLocation, toLocation])

  return (
    <StyledMap ref={mapRef} className='map' />
  )
}

const StyledMap = styled("div")({
  overflow: 'hidden',
  height: "500px !important",
  width: "100% !important",
  margin: "auto",
  display: "flex",

})

export default MapToFollowOrder