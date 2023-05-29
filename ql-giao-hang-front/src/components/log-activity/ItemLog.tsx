import { OrderLogType } from '@Common/types'
import MessageLog from '@Features/log/MessageLog';
import { getDateTime, getTodayTime } from '@Helpers/data.optimize';
import TimelineConnector from '@mui/lab/TimelineConnector/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator/TimelineSeparator';
import { Slide, Stack, Typography } from '@mui/material';
import React from 'react'

type Props = {
  logs: OrderLogType[]
}

function ItemLog(props: Props) {
  const { logs } = props;
  return (
    <>
      {logs && logs.map((item, index) => (
        <Slide direction='left' in mountOnEnter unmountOnExit key={index}>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary" >
              <Stack>
                <Typography variant='caption' sx={{
                  fontSize: "10px"
                }}>{getTodayTime(new Date(item.createdAt))}</Typography>
                <Typography variant='caption' sx={{
                  fontSize: "10px"
                }}>{getDateTime(new Date(item.createdAt))}</Typography>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              {index !== logs.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent><MessageLog item={item} /></TimelineContent>
          </TimelineItem>
        </Slide>)) as JSX.Element[]
      }
    </>
  )
}

export default ItemLog