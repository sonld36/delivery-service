import * as React from 'react';
import { Paper, Typography, Box, Grid, TextField, IconButton, Collapse, TablePagination, Button, Backdrop } from '@mui/material';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@mui/styles';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {Link, useNavigate, useParams} from 'react-router-dom';
import shopService from '@Services/shop.service';
import provinceService from '@Services/province.service';
import orderService from '@Services/order.service';
import { ProvinceCommonType, AddressToSave } from "@Common/types";
import Chip from '@mui/material/Chip';
import { orderStatus, orderStatusColor, orderType, orderTypeColor } from '@Common/const';
import CircularProgress from '@mui/material/CircularProgress';

const DateToString = (date: Date) => {
    let time = new Date(date)
    let showTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`
    return showTime
}

const useStyles = makeStyles({
    dialog: {
      position: 'absolute',
      right: 0,
      top: 0
    }
  });


export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
  }

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

function SimpleDialog(props: SimpleDialogProps) {
const classes = useStyles();
const { open, onClose } = props;

const handleClose = () => {
    onClose();
  };
return (
    <Dialog open={open} onClose={handleClose}
    TransitionComponent={Transition}
    keepMounted
    PaperProps={{ sx: {
        position: 'absolute',
        top: 0,
        right: 0,
        minHeight: '100%',
        maxHeight: '100%',
        m: 0,
        borderRadius: 0,
        width: '400px',
        display: 'flex',
        alignItems: 'center'
    }}}>
    <DialogTitle>Bộ lọc</DialogTitle>
    <Box>
    </Box>
    </Dialog>
);
}

const theme = createTheme({
    palette: {
      neutral: {
        main: '#616161',
        contrastText: '#fff',
      },
    },
  });
  
  declare module '@mui/material/styles' {
    interface Palette {
      neutral: Palette['primary'];
    }
  
    // allow configuration using `createTheme`
    interface PaletteOptions {
      neutral?: PaletteOptions['primary'];
    }
  }
  
  // Update the Button's color prop options
  declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
      neutral: true;
    }
  }

// function createData(
//     id: string,
//     from: string,
//     to: string,
//     startDate: Date,
//     completeDate: Date,
//     money: number,
//     status: string,
//   ) {
//     return {
//       id,
//       from,
//       to,
//       startDate,
//       completeDate,
//       money,
//       status,
//       orders: [
//         {
//           name: 'Bánh kem gấu',
//           price: 40000,
//           count: 3
//         },
//         {
//           name: 'micro',
//           price: 1000000,
//           count: 2
//         },
//       ],
//     };
//   }

//   const rows = [
//     createData('1', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('2', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('3', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('4', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('5', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('6', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('7', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công'),
//     createData('8', 'Số 1 Tạ Quang Bửu', 'Số 1 Đội Cấn', new Date('22/10/2022'), new Date('22/10/2022'), 1040000, 'thành công')
//   ];

  function Row(props: { row: Order }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.orderCode}
          </TableCell>
          <TableCell align="left">{row.shipFrom}</TableCell>
          <TableCell align="left">{row.shipTo}</TableCell>
          <TableCell align="right">{DateToString(row.dayCreated)}</TableCell>
          <TableCell align="right">{DateToString(row.dayComplete)}</TableCell>
          <TableCell align="right">{row.price.toLocaleString()}</TableCell>
          <TableCell align="center"><Chip label={orderStatus[`${row.status}`]} color={orderStatusColor[`${row.status}`]} variant="outlined" /></TableCell>

        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{ margin: 1, width: '85%' }}>
                    <Typography variant="h6" gutterBottom component="div">
                    Các sản phẩm
                    </Typography>
                    <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {row.product.map((product, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                            {index}
                            </TableCell>
                            <TableCell>{product?.product?.name}</TableCell>
                            <TableCell align="right">{product?.productQuantity}</TableCell>
                            <TableCell align="right">{product?.product?.salePrice.toLocaleString()}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Box>
            </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  
  interface Shop {
    name: String,
    address: String,
    phonenumber: String,
    email: String
  }

  interface ShopInfo {
    totalPay: number,
    totalOrder: number,
    totalGood: number,
    totalBad: number
  }

  interface Order {
    orderCode: String,
    shipFrom: String,
    shipTo: String,
    rawFrom: AddressToSave,
    rawTo: AddressToSave,
    status: String,
    price: number,
    dayCreated: Date,
    dayComplete: Date,
    product: [any],
  }

export default function CustomerInfo() {
    const navigate = useNavigate();
    const params = useParams();
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [shop, setShop] = React.useState<Shop>();
    const [shopInfo, setShopInfo] = React.useState<ShopInfo>();
    const [rows, setRows] = React.useState<Order[]>([]);
    const [openBackDrop, setOpenBackDrop] = React.useState(false);

    const getData = async () => {
        setOpenBackDrop(true);
        let res = await shopService.getShop(Number(params.id));
        let rawAddress = {
            addressDetail: res.data.addresses[0].addressDetail,
            provinceCode: res.data.addresses[0].provinceCode,
            districtCode: res.data.addresses[0].districtCode,
            wardCode: res.data.addresses[0].wardCode
          }
        let address = await provinceService.getAddress(rawAddress);
        setShop({
            name: res.data.account.name,
            email: res.data.email,
            phonenumber: res.data.account.phoneNumber,
            address: address
        })
        let orders = await orderService.getOrdersByShopId(Number(params.id));
        let data: Order[];
        data = [];

        orders.data.map((item: any) => {
            data.push({orderCode: item.id, 
              shipFrom: item.address.addressDetail, 
              shipTo: item.customer.addresses[0].addressDetail, 
              status: item.status, 
              price: item.paymentTotal,
              rawTo: {
                addressDetail: item.customer.addresses[0].addressDetail,
                provinceCode: item.customer.addresses[0].provinceCode,
                districtCode: item.customer.addresses[0].districtCode,
                wardCode: item.customer.addresses[0].wardCode
              },
              rawFrom: {
                addressDetail: item.address.addressDetail,
                provinceCode: item.address.provinceCode,
                districtCode: item.address.districtCode,
                wardCode: item.address.wardCode,
              },
                dayCreated: new Date(item.createdAt),
                dayComplete: new Date(item.modifiedAt),
                product: item.products   
            })
          })

          await Promise.all(data.map(async (item: any) => {
            let shipFrom = await provinceService.getAddress(item.rawFrom)
            let shipTo = await provinceService.getAddress(item.rawTo)
            item.shipFrom = shipFrom
            item.shipTo = shipTo
          }));

          setRows(data)
          setOpenBackDrop(false)

    }

    const changeDate = async (newValue: Dayjs | null) => {
        setOpenBackDrop(true);
        setDate(newValue);
        if (newValue){
        let date = newValue.date() + "/" + (newValue.month() + 1) + "/" + newValue.year();
        let orders = await orderService.getOrdersByDateAndShopId({
            shopId: Number(params.id),
            date: date
          })
        let totalPay = 0;
        let totalOrder = 0;
        let totalBad = 0;
        let totalGood = 0
        orders.data.map((item: any) => {
            totalPay = totalPay + item.paymentTotal - item.shipFee;
            totalOrder = totalOrder + 1;
            if ((item.status == "REFUNDS") || (item.status.equals =="CANCEL")) totalBad = totalBad + 1;
            if ((item.status == "DELIVERY_SUCCESSFUL") || (item.status == "DONE")) totalGood = totalGood + 1;
        })
        setShopInfo({
            totalPay: totalPay,
            totalOrder: totalOrder,
            totalGood: totalGood,
            totalBad: totalBad
        }) 
    }
    setOpenBackDrop(false);
    }

    React.useEffect(() => {
        getData();
        changeDate(date)
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const goToCOD = () => {
        if (date)
            navigate("/ql-giao-hang/hach-toan-COD?shopId=" + params.id+ "&date=" + date.date() + "/" + (date.month() + 1) + "/" + date.year())
    }

    const displayDate = (date: Dayjs | null) => {
        if (date)
            return date.date() + "/" + (date.month() + 1) + "/" + date.year();
        return null;
        } 

    return(
        // <Dashboard title='Danh sách khách hàng'>
        <Box>
        <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
                  >
        <CircularProgress color="inherit" />
      </Backdrop>
        <SimpleDialog
                open={open}
                onClose={handleClose}
            />
            <Box>
                <Typography sx={{fontSize: '24px', fontWeight: '500', margin: '0', padding: '0', mb: 2}}>
                    {shop?.name}</Typography>
            </Box>

            <Paper sx={{mb: 3}}>
                <Box>
                    <Typography sx={{fontWeight: '600', fontSize: '14px', padding: '15px'}}>Thông tin cửa hàng</Typography>
                    <Divider />
                    <Box sx={{padding: '15px'}}>
                        <Grid container sx={{mb: 1}}>
                            <Grid item xs={3}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                    Tên cửa hàng
                                </Typography>
                            </Grid>

                            <Grid item xs={9}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                    : {shop?.name}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{mb: 1}}>
                            <Grid item xs={3}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                    Email: 
                                </Typography>
                            </Grid>

                            <Grid item xs={9}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                    : {shop?.email}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{mb: 1}}>
                            <Grid item xs={3}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                    Số điện thoại
                                </Typography>
                            </Grid>

                            <Grid item xs={9}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                    : {shop?.phonenumber}
                                </Typography>
                            </Grid>
                        </Grid> 

                        <Grid container sx={{mb: 1}}>
                            <Grid item xs={3}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                    Địa chỉ
                                </Typography>
                            </Grid>

                            <Grid item xs={9}>
                                <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                    : {shop?.address}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box> 
            </Paper>

            <Paper sx={{mb: 3}}>
                <Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography sx={{fontWeight: '600', fontSize: '14px', padding: '15px', mr: 3}}>Đơn hàng trong ngày</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={date}
                            inputFormat="DD.MM.YYYY"
                            onChange={(newValue) => {
                            changeDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white'}} 
                                sx={{
                                    input: {
                                        padding : "8px 12px", 
                                        backgroundColor: 'white',
                                        width: '100px'
                                    }, 
                                    svg: {
                                        backgroundColor: 'white'
                                    }}} />}
                        />
                        </LocalizationProvider>
                    </Box>
                    <Divider />
                    <Grid sx={{padding: '15px'}} container>
                        <Grid item xs={6}>
                            <Grid container sx={{mb: 1}}>
                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                        Tổng chi tiêu
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        : {shopInfo?.totalPay.toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{mb: 1}}>
                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                        Tổng số lượng đơn hàng
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        : {shopInfo?.totalOrder}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{mb: 1}}>
                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                        Số đơn giao thành công
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        : {shopInfo?.totalGood}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid item xs={6}>

                            <Grid container sx={{mb: 1}}>
                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-label'>
                                        Số đơn bị hủy
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        : {shopInfo?.totalBad}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{mb: 1}}>
                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        Công nợ trong ngày
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{fontSize: '14px'}} className='customer-text-content'>
                                        : <span style={{fontSize: '14px', color: '#0088FF', cursor: 'pointer',
                                        textDecoration: 'underline'}} className='customer-text-label clickable' onClick={goToCOD}>
                                            {displayDate(date)}</span>
                                    </Typography>
                                </Grid>
                            </Grid> 

                        </Grid>
                    </Grid>
                </Box> 
            </Paper>     

            <Paper>
                <Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography sx={{fontWeight: '600', fontSize: '14px', padding: '15px'}}>Lịch sử giao hàng</Typography>
                        <Box>
                        <ThemeProvider theme={theme}>
                            <Button variant="outlined" color="neutral" endIcon={<FilterAltIcon />} size='medium' sx={{textTransform: 'none', padding: '6px 8px', marginRight: '15px'}} onClick={handleClickOpen}>
                                Bộ lọc
                            </Button>
                        </ThemeProvider>
                        </Box>
                    </Box>
                    <Divider />

                    <Box>
                        <TableContainer>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>Mã đơn</TableCell>
                                    <TableCell align="left" sx={{whiteSpace: 'nowrap'}}>Gửi từ</TableCell>
                                    <TableCell align="left" sx={{whiteSpace: 'nowrap'}}>Gửi tới</TableCell>
                                    <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>Ngày nhận hàng</TableCell>
                                    <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>Ngày hoàn thành</TableCell>
                                    <TableCell align="right" sx={{whiteSpace: 'nowrap'}}>Tổng giá</TableCell>
                                    <TableCell align="center" sx={{whiteSpace: 'nowrap'}}>Trạng thái</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <Row key={index} row={row} />
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Box>
            </Paper>       
        </Box>
        // </Dashboard>

    )
}
