import { Box } from '@mui/material'
import React from 'react';

type Props = {
  src: string;
  style: object;
}

function DisplayImage(props: Props) {
  const { src, style } = props;
  // console.log(src);

  return (
    <>
      <Box>
        <img
          src={src}
          alt="image"
          loading='lazy'
          className='image-display'
          style={style}
        />
      </Box>
    </>
  )
}

export default DisplayImage