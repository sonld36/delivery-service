import React, { useEffect, useRef } from 'react';
import { initMap } from '@Helpers/initMap';
import { styled } from '@mui/material';
import mapboxgl from 'mapbox-gl';


function Map() {

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = initMap(mapRef.current, [107.339537475899, 16.3154241771087]);
      const marker = new mapboxgl.Marker().setLngLat([105.8544441, 21.0294498]);

    }
  }, []);

  return (
    <StyledMap ref={mapRef} className='map' />
  )
}

const StyledMap = styled("div")({
  overflow: 'scroll',
  height: "100% !important",
  width: "100% !important",
})

export default Map