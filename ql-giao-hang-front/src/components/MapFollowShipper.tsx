import React, { useEffect, useMemo, useRef } from 'react';
import { initMap } from '@Helpers/initMap';
import { styled } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import mapService from '@Services/map.service';

export type LongLatData = {
  longtitude: number;
  latitude: number;
}

function MapFollowShipper({ data }: { data?: LongLatData }) {

  const mapRef = useRef<HTMLDivElement>(null);
  const mappingRef = useRef<any>(null);

  const dataChange = useMemo(() => data, [data]);



  useEffect(() => {
    if (mapRef.current && data) {
      const map = initMap(mapRef.current, [data.longtitude, data.latitude]);
      mappingRef.current = map;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (dataChange) {
        const location = await mapService.getLocation(dataChange);

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
          center: [dataChange.longtitude, dataChange.latitude],
        });
      }
    }

    fetchLocation();
  }, [dataChange])

  return (
    <StyledMap ref={mapRef} className='map' />
  )
}

const StyledMap = styled("div")({
  overflow: 'hidden',
  height: "500px !important",
  width: "50% !important",
  margin: "auto",
  display: "flex",

})

export default MapFollowShipper