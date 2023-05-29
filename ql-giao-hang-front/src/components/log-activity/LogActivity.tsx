import Timeline from '@mui/lab/Timeline'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { Box, CardHeader } from '@mui/material'
import React from 'react'
import Title from '../Title'
import { CardStyled } from '../Utils'


type Props = {
  childrend: React.ReactNode
}

function LogActivity(props: Props) {
  const { childrend } = props;

  return (
    <CardStyled>
      <CardHeader title={<Title title='Hoạt động gần đây' />} />
      <Box>
        <Timeline sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}>
          {childrend}
        </Timeline>
      </Box>
    </CardStyled>
  )
}

export default LogActivity