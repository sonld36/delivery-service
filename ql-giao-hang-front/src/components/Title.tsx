import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react'

type Props = {
  title: string,
}

function Title(props: Props) {
  const { title } = props;
  return (
    <Box>
      <Typography>{title}</Typography>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Box>
  )
}

export default Title