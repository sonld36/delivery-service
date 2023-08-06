import React, { useEffect } from 'react';
import { Typography, TextField, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import Divider from '@mui/material/Divider';
import accountService from '@Services/account.service';
import { useParams } from 'react-router-dom';
import orderService from '@Services/order.service';
import shopService from '@Services/shop.service';
import provinceService from '@Services/province.service';
import { orderStatus, orderStatusColor } from '@Common/const';
import Chip from '@mui/material/Chip';
import { ProvinceCommonType, AddressToSave } from "@Common/types";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import carrierService from '@Services/carrier.service';

interface Data {
  orderCode: String;
  shopName: String;
  shipFrom: String;
  shipTo: String;
  rawFrom?: AddressToSave;
  rawTo?: AddressToSave;
  status: String;
  price: number;
  isPaid: Boolean;
  pay: Boolean;
  shopId: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'orderCode',
    numeric: false,
    disablePadding: true,
    label: 'Mã đơn hàng',
  },
  {
    id: 'shopName',
    numeric: false,
    disablePadding: false,
    label: 'Tên cửa hàng',
  },
  {
    id: 'shipFrom',
    numeric: false,
    disablePadding: false,
    label: 'Giao từ',
  },
  {
    id: 'shipTo',
    numeric: false,
    disablePadding: false,
    label: 'Giao đến',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái đơn hàng',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Giá',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Thanh toán',
  },
];

export default function OrderMoneyManagement() {
  const params = useParams();
  const [staff, setStaff] = React.useState<string>('');
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [rows, setRows] = React.useState<Data[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<readonly String[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [paying, setPaying] = React.useState<number>(0);
  const [check, setCheck] = React.useState<boolean | undefined>(false);

  useEffect(() => {
    const getData = async () => {
      let res = await carrierService.getById(Number(params.id));
      setStaff(res.data.name);
    };
    getData();
    changeDate(date);
  }, [])

  useEffect(() => {
    let paying = 0;
    rows.forEach(item => {
      if (selected.includes(item.orderCode) && item.status !== "REFUNDS")
        paying += item.price;
    })
    setPaying(paying)
  }, [selected])

  const changeDate = async (newValue: Dayjs | null) => {
    setOpen(true)

    setDate(newValue);
    let res = await orderService.getOrdersByDateAndCarrierId(newValue?.toDate().toLocaleDateString(), Number(params.id))

    let data: Data[];
    data = [];

    data = res.data.map((item: any) => ({
      orderCode: item.id,
      shopName: "",
      shipFrom: item.fromAddress,
      shipTo: item.destinationAddress,
      status: item.status,
      price: item.paymentTotal,
      isPaid: item.isPaid,
      shopId: item.shop.id,
      pay: false,
    }))

    // await Promise.all(data.map(async (item: any) => {
    //   let shop = await shopService.getShop(item.shopId)
    //   item.shopName = shop.data.account.name
    //   let shipFrom = await provinceService.getAddress(item.rawFrom)
    //   let shipTo = await provinceService.getAddress(item.rawTo)
    //   item.shipFrom = shipFrom
    //   item.shipTo = shipTo
    // }));

    setRows(data)
    let total = 0;
    data.forEach(item => {
      if (!item.isPaid && item.status !== "REFUNDS")
        total = total + item.price;
    })
    setTotal(total);
    setOpen(false)
  }

  const handlePay = async () => {
    setOpen(true)
    let res = await orderService.paidOrder({
      carrierId: Number(params.id),
      createdAt: date,
      listId: selected
    })
    setSelected([])
    changeDate(date);
    setPaying(0);
    setCheck(false);
  }

  function EnhancedTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!check) {
        const newSelected = rows.filter(n => !(n.isPaid)).map((n) => n.orderCode);
        setSelected(newSelected);
        setCheck(true);
        return;
      }
      setSelected([]);
      setCheck(false)
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: String) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected: readonly String[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };

    const isSelected = (name: String) => selected.indexOf(name) !== -1;

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  Đơn
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  Cửa hàng
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  Giao từ
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  Giao đến
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  Trạng thái
                </TableCell>
                <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                  Tổng tiền
                </TableCell>
                <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                  Thanh toán
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={7} align='right'>
                  <Checkbox color='primary' sx={{ pt: 0, mt: 0, pb: 0, mb: 0 }}
                    checked={check}
                    onChange={handleSelectAllClick} />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.orderCode);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {row.orderCode}
                      </TableCell>

                      <TableCell align='left'>
                        {row.shopName}
                      </TableCell>
                      <TableCell align='left'>
                        {row.shipFrom}
                      </TableCell>
                      <TableCell align='left'>
                        {row.shipTo}
                      </TableCell>
                      <TableCell align='left'>
                        <Chip label={orderStatus[`${row.status}`]} color={orderStatusColor[`${row.status}`]} variant="outlined" />
                      </TableCell>
                      <TableCell align='right'>
                        {row.status === "REFUNDS" ? 0 : row.price.toLocaleString()}
                      </TableCell>
                      <TableCell align='right'>
                        {row.isPaid ? <Checkbox
                          color="primary"
                          checked
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          disabled
                        />
                          :
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />}
                      </TableCell>
                    </TableRow>
                  )
                }
                )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"Số lượng hiển thị"}
        />

        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Cần thanh toán: {total.toLocaleString()}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Số tiền thanh toán: {paying.toLocaleString()}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Còn thiếu: {(total - paying).toLocaleString()}</Typography>

          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row-reverse', mt: 5 }}>
            <Button variant="contained" disabled={paying == 0} onClick={handlePay}>Thanh toán</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography sx={{ fontWeight: 'bold', fontSize: '18px', mt: 2, mb: 2 }}>
        {staff}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mb: 2 }}>
        <DatePicker
          value={date}
          inputFormat="DD.MM.YYYY"
          onChange={(newValue) => {
            changeDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} style={{ backgroundColor: 'white' }}
            sx={{
              input: {
                padding: "8px 12px",
                backgroundColor: 'white',
              },
              svg: {
                backgroundColor: 'white'
              }
            }} />}
        />
      </LocalizationProvider>

      <Paper sx={{ mt: 3 }}>
        <EnhancedTable />
      </Paper>
    </Box>
  )
}