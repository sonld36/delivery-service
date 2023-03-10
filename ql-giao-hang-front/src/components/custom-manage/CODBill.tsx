import { orderStatus, orderStatusColor, orderType, orderTypeColor } from '@Common/const';
import { Backdrop, Box, Button, Paper } from "@mui/material";
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import codService from '@Services/cod.service';
import orderService from '@Services/order.service';
import provinceService from '@Services/province.service';
import shopService from '@Services/shop.service';
import * as React from 'react';
import { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';

const theme = createTheme({
  palette: {
    neutral: {
      main: '#0288d1',
      contrastText: '#fff',
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0288d1',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Shop {
  name: String,
  address: String,
  phonenumber: String
}

interface COD {
  id: number,
  date: String,
  status: number,
  shopId: number
}

interface Order {
  id: number,
  type: String,
  status: String,
  customerName: String,
  customerPhonenumber: String,
  fee: number,
  price: number
}

export default function CODBill() {
  const [searchParams] = useSearchParams();
  const [shop, setShop] = React.useState<Shop>();
  const [cod, setCOD] = React.useState<COD>();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [open, setOpen] = React.useState(false);
  const [money, setMoney] = React.useState(0);

  const getData = async () => {
    setOpen(true)
    let shopId = Number(searchParams.get("shopId"));
    let date = searchParams.get("date");
    let data = await shopService.getShop(shopId);
    let rawAddress = {
      addressDetail: data.data.addresses[0].addressDetail,
      provinceCode: data.data.addresses[0].provinceCode,
      districtCode: data.data.addresses[0].districtCode,
      wardCode: data.data.addresses[0].wardCode
    }
    let address = await provinceService.getAddress(rawAddress);
    setShop({
      name: data.data.account.name,
      address: address,
      phonenumber: data.data.account.phoneNumber
    })
    let cod = await codService.getCODByDateAndShopId({
      shopId: shopId,
      date: date
    })
    console.log(cod);
    setCOD(cod.data);

    let orders = await orderService.getOrdersByDateAndShopId({
      shopId: shopId,
      date: date
    })

    let tempArr: Order[];
    tempArr = [];
    let money = 0
    orders.data.map((item: any) => {
      tempArr.push({
        id: item.id,
        type: item.type,
        status: item.status,
        customerName: item.customer.name,
        customerPhonenumber: item.customer.phoneNumber,
        fee: item.shipFee,
        price: item.paymentTotal
      });
      if (item.status == "DELIVERY_SUCCESSFUL" || item.status == "REFUNDS")
        money = money + item.paymentTotal - item.shipFee
    });
    setOrders(tempArr);
    setMoney(money)
    setOpen(false);
  };

  useEffect(() => {
    getData()
  }, [])

  const payCOD = async () => {
    setOpen(true);
    let shopId = Number(searchParams.get("shopId"));
    let date = searchParams.get("date");
    await codService.payCOD({
      shopId: shopId,
      date: date
    })
    getData();
  }

  function CustomizedTables() {
    return (
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell >ID</StyledTableCell>
              <StyledTableCell align="center">Kiểu giao hàng</StyledTableCell>
              <StyledTableCell align="center">Tên người nhận</StyledTableCell>
              <StyledTableCell align="center">Số điện thoại người nhận</StyledTableCell>
              <StyledTableCell align="center">Trạng thái đơn hàng</StyledTableCell>
              <StyledTableCell align="center">Phí ship</StyledTableCell>
              <StyledTableCell align="center">Tiền hàng</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell align="center"><Chip label={orderType[`${row.type}`]} color={orderTypeColor[`${row.type}`]} variant="outlined" /></StyledTableCell>
                <StyledTableCell align="center">{row.customerName}</StyledTableCell>
                <StyledTableCell align="center">{row.customerPhonenumber}</StyledTableCell>
                <StyledTableCell align="center"><Chip label={orderStatus[`${row.status}`]} color={orderStatusColor[`${row.status}`]} variant="outlined" /></StyledTableCell>
                <StyledTableCell align="center">{row.fee.toLocaleString()}</StyledTableCell>
                <StyledTableCell align="center">{(row.price - row.fee).toLocaleString()}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper sx={{ p: 3 }}>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '30px 0px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>HẠCH TOÁN COD</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '30px' }}>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Cửa hàng: {shop?.name}</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>Địa chỉ: {shop?.address}</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>Số điện thoại: {shop?.phonenumber}</Typography>
          </Box>
          <Box sx={{ marginRight: '100px' }}>
            <Typography sx={{ fontWeight: 'bold' }}>Hóa đơn: #{cod?.id}</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>Ngày: {cod?.date}</Typography>
          </Box>
        </Box>

        <CustomizedTables />

        <Box sx={{ width: '100%', justifyContent: 'flex-end', display: 'flex', margin: '20px 0px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>Tổng cộng: {money.toLocaleString()} VNĐ</Typography>
        </Box>

        <Box sx={{ width: '100%', justifyContent: 'flex-end', display: 'flex', margin: '20px 0px' }}>
          {cod?.status ?
            <ThemeProvider theme={theme}>
              <Button variant="contained" color="neutral" disabled>Đã thanh toán</Button>
            </ThemeProvider>
            : <ThemeProvider theme={theme}>
              <Button variant="contained" disabled={(money == 0)} color="neutral" onClick={payCOD}>Thanh toán</Button>
            </ThemeProvider>
          }
        </Box>
      </Paper>
    </Box>
  )
}