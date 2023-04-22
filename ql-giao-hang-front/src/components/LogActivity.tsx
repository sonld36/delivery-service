import React, { useEffect, useState } from 'react'
import { CardStyled } from './Utils'
import { CardContent, CardHeader } from '@mui/material'
import Title from './Title'
import { useAppDispatch, useAppSelector } from '@App/hook'
import { fetchAllOrderLog, selectLog } from '@Features/log/logSlice'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

function LogActivity() {
  const logs = useAppSelector(selectLog);
  const [page, setPage] = useState(1);
  console.log(logs);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllOrderLog(page));
  }, [dispatch, page]);

  return (
    <CardStyled>
      <CardHeader title={<Title title='Hoạt động gần đây' />} />
      <CardContent>
        <Timeline>

        </Timeline>
      </CardContent>
    </CardStyled>
  )
}

export default LogActivity