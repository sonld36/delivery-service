import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import CreateIcon from '@mui/icons-material/Create';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplyIcon from '@mui/icons-material/Reply';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, CardActions, CircularProgress, createTheme, Grid, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useEffect, useState } from 'react';

//Import API
import orderService from '@Services/order.service';
import { Navigate, useNavigate } from 'react-router-dom';
import { orderManageLinks } from '../CoordinatorSidebar/CoordinatorSidebar';
import LogActivity from '@Components/log-activity/LogActivity';
import { useAppDispatch, useAppSelector } from '@App/hook';
import { fetchAllOrderLog, selectLog } from '@Features/log/logSlice';
import ItemLog from '@Components/log-activity/ItemLog';
import Empty from '@Components/Empty';

const theme = createTheme();
const heightCard = 500;

const CardStyled = styled(Card)(({ theme }) => ({
  minHeight: heightCard,
}));

const prefixOrderManager = "quan-ly-don-hang/";

const CarDetail = styled(Card)(({ theme }) => ({
  minHeight: "130px",
  "& .MuiTypography-root": {
    textAlign: 'center',
    margin: '0 auto 12px',
    height: '18px'
  },
  cursor: "pointer",
  flexFlow: 'column',
  flexDirection: 'column',
  display: 'flex',
  margin: 'auto',
  justifyContent: 'center',
  alignItems: 'center',

}));
const GridDetail = styled(Grid)(({ theme }) => ({

}));
const Num = styled(CardActions)(({ theme }) => ({
  color: '#007BFF',
}));

function General() {
  const [listStatus, setListStatus] = useState(
    {
      WAITING_FOR_ACCEPT_NEW_ORDER: 0,
      REQUEST_SHIPPING: 0,
      PICKING_UP_GOODS: 0,
      BEING_TRANSPORTED: 0,
      DELIVERY_SUCCESSFUL: 0,
      REFUNDS: 0,
      DONE: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const logs = useAppSelector(selectLog);
  const [page, setPage] = useState(1);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllOrderLog(page));
  }, [dispatch, page]);

  const navigate = useNavigate();

  useEffect(() => {
    const getCountOrderAllStatus = async () => {
      try {
        setLoading(true);
        let resp: any = await orderService.getCountOrderAllStatus();
        if (resp && resp.code === 2000) {
          setListStatus(resp.data);
        }
        setLoading(false);
      }
      catch (e) {
        console.log(e)
      }
    }
    getCountOrderAllStatus();
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 0, margin: 0 }} >
        < Typography sx={{ fontWeight: 'bold', mb: '15px', ml: "23px" }} variant='h6'>Tình hình giao hàng và đối soát</Typography>
        <Box sx={{
          ml: "17px"
        }} >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <CardStyled >
                <CardHeader sx={{ paddingTop: "12px", paddingBottom: "0" }} title={
                  <Box>

                    <Typography sx={{ fontSize: "17px", fontWeight: 700, paddingLeft: "20px", color: "#686868" }}> TÌNH HÌNH GIAO HÀNG</Typography>
                    <Typography sx={{ fontSize: "15px", fontWeight: 600, padding: "10px", paddingLeft: "20px", color: "#686868" }}>Dữ liệu được tổng hợp trong 30 ngày gần nhất</Typography>
                    <Divider />
                  </Box>}
                />
                <CardContent>
                  <Grid container spacing={4} sx={{ padddingTop: "10px" }}>
                    <Grid xs={4} item >
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.REQUEST + "?page=1")
                      }}>
                        <CreateIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Đang chờ xử lý </Typography>
                        {loading ? <CircularProgress size={10} /> : (<Link underline="none">
                          <Num>{listStatus.WAITING_FOR_ACCEPT_NEW_ORDER} đơn</Num>
                        </Link>)}
                      </CarDetail>
                    </Grid>
                    <GridDetail item xs={4}>
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.REQUEST + "?page=1")
                      }} >
                        <InventoryIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Đơn yêu cầu vận chuyển</Typography>
                        {loading ? <CircularProgress size={10} style={{
                          margin: "auto"
                        }} /> : <Link underline="none">
                          <Num>{listStatus.REQUEST_SHIPPING} đơn</Num>
                        </Link>}
                      </CarDetail>
                    </GridDetail>
                    <GridDetail item xs={4}>
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.PICKING + "?page=1")
                      }}>
                        <DirectionsRunIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Đang đi lấy hàng</Typography>
                        {loading ? <CircularProgress size={10} style={{
                          margin: "auto"
                        }} /> : (<Link underline="none">
                          <Num>{listStatus.PICKING_UP_GOODS} đơn</Num>
                        </Link>)}
                      </CarDetail>
                    </GridDetail>
                    <GridDetail item xs={4} >
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.DELIVERING + "?page=1")
                      }}>
                        <LocalShippingIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Đang vận chuyển</Typography>
                        {loading ? <CircularProgress size={10} style={{
                          margin: "auto"
                        }} /> : (<Link underline="none">
                          <Num>{listStatus.BEING_TRANSPORTED} đơn</Num>
                        </Link>)}
                      </CarDetail>
                    </GridDetail>
                    <GridDetail xs={4} item >
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.SUCCESS + "?page=1")
                      }}>
                        <TaskAltIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Giao thành công</Typography>
                        {loading ? <CircularProgress size={10} style={{
                          margin: "auto"
                        }} /> : (<Link underline="none">
                          <Num>{listStatus.DELIVERY_SUCCESSFUL} đơn</Num>
                        </Link>)}
                      </CarDetail>
                    </GridDetail>
                    <GridDetail item xs={4} >
                      <CarDetail onClick={(event) => {
                        event.preventDefault();
                        navigate(prefixOrderManager + orderManageLinks.DONE + "?page=1")
                      }}>
                        <ReplyIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                        <Typography>Đơn hoàn</Typography>
                        {loading ? <CircularProgress size={10} style={{
                          margin: "auto"
                        }} /> : (<Link underline="none">
                          <Num>{listStatus.REFUNDS} đơn</Num>
                        </Link>)}
                      </CarDetail>
                    </GridDetail>
                  </Grid>
                </CardContent>


              </CardStyled>
            </Grid>
            <Grid item xs={4}>
              <LogActivity key={1} childrend={logs.logs.length > 0 ? <ItemLog logs={logs.logs} /> : <Empty>Không có hoạt động mới</Empty>} />
            </Grid>
          </Grid>
        </Box>

      </Box >
    </ThemeProvider >
  )
}

export default General;