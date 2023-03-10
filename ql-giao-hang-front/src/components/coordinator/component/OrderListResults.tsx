import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Chip, TableFooter, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import * as React from 'react';
import OrderDetail from './OrderDetail';
//Import API
import { orderShopStatus, orderShopStatusColor } from '@Common/const';
import { Order } from '@Common/types';
import orderService from '@Services/order.service';
import PaginationCustom from './Pagination';


const TableCellCus = styled(TableCell)({
  backgroundColor: "#BBBDBF",
});
// const TableBodyCus = styled(TableBody)({
//   backgroundColor: "#F4F6F8",
// });

interface StyledTableRowChosen {
  open: boolean;
}

const TableRowChosen = styled(TableRow,
  {
    shouldForwardProp: (prop) => prop !== 'open',
  }
)<StyledTableRowChosen>(({ open, theme }) => ({
  ...(open && {
    backgroundColor: "#F2F9FF"
  }),
}))

function Row(props: { row: Order, setReload: (params: any) => any, key: number, keyChooseDetail: number, setKeyChooseDetail: (params: any) => any, }) {
  const { row, keyChooseDetail, key } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    open ? props.setKeyChooseDetail(key) : props.setKeyChooseDetail(0)
  }, [open])
  return (
    <React.Fragment>
      <TableRowChosen open={open} >
        <TableCell>
          <IconButton
            size="small"
            onClick={() => {
              setOpen(!open);
            }}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row"> {row.maVanDon} </TableCell>
        <TableCell align="left">{dayjs(row.createdAt).format('DD/MM/YYYY HH:MM')}</TableCell>
        <TableCell align="left">{row.receiverName}</TableCell>
        <TableCell align="left">{row.receiverPhone}</TableCell>
        <TableCell align="left">{row.carrierName}</TableCell>
        <TableCell align="left">{row.carrierPhone}</TableCell>
        <TableCell align="center"><Chip label={orderShopStatus[row.status]} color={orderShopStatusColor[row.status]} key={row.maVanDon} sx={{ width: "155px" }} /></TableCell>
      </TableRowChosen >
      <TableRowChosen open={open}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse sx={{ margin: 1 }} in={open} timeout="auto" unmountOnExit >
            {keyChooseDetail === key ? <OrderDetail maVanDon={row.maVanDon} setReload={props.setReload} /> : null}
          </Collapse>
        </TableCell>

      </TableRowChosen>
      {/* </StyledBoxChosen> */}

    </React.Fragment >
  );
}

// function setReload(value: boolean) {
//   setSuccessAssign(value)
// }

type OrderListResults = {
  status: string;
}
export default function OrderListResults(props: OrderListResults) {
  const [keyChooseDetail, setKeyChooseDetail] = React.useState<number>(0)
  const [reload, setReload] = React.useState(false)
  const { status } = props;
  //Phan trang
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [totalRecord, setSetTotalRecord] = React.useState<number>(0);


  //Co thay doi thong tin don hang


  // //Hàm lấy toàn bộ đơn hàng
  const fetchgetAllOrderByDPWithPagination = async () => {
    try {
      let resp: any = await orderService.getAllOrderByDPWithPagination(`${pageIndex}`, `${pageSize}`);
      if (resp && resp.code === 2000) {
        setOrders(resp.data.orders);
        setSetTotalRecord(resp.data.totalRecord);
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  // //Hàm lấy đơn hàng theo trạng thái
  const getAllOrderStatusByDPWithPagination = async (status: string) => {
    try {
      let resp: any = await orderService.getAllOrderStatusByDPWithPagination(status, `${pageIndex}`, `${pageSize}`);
      if (resp && resp.code === 2000) {
        setOrders(resp.data.orders);
        setSetTotalRecord(resp.data.totalRecord);
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {
    if (status == "all")
      fetchgetAllOrderByDPWithPagination();
    else
      getAllOrderStatusByDPWithPagination(status);
  }, [pageSize, pageIndex])
  //Reload lai trang khi gan/thay doi shipper cho don hang
  React.useEffect(() => {
    if (reload) {
      if (status == "all")
        fetchgetAllOrderByDPWithPagination();
      else
        getAllOrderStatusByDPWithPagination(status);
    }
  }, [reload])

  return (
    <TableContainer component={Paper} >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCellCus width="45px" />
            <TableCellCus >Mã vận đơn</TableCellCus>
            <TableCellCus align="left">Ngày lên đơn</TableCellCus>
            <TableCellCus align="left">Người nhận</TableCellCus>
            <TableCellCus align="left">SĐT người nhận</TableCellCus>
            <TableCellCus align="left">Nhân viên giao hàng</TableCellCus>
            <TableCellCus align="left">SĐT nhân viên giao hàng</TableCellCus>
            <TableCellCus align="center">Trạng thái giao hàng</TableCellCus>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ?
            (<TableCell colSpan={8}>
              <Typography>Không có dữ liệu</Typography>
            </TableCell>)
            :
            orders.map((row) => (
              <Row key={row.maVanDon} row={row} setReload={setReload} keyChooseDetail={keyChooseDetail} setKeyChooseDetail={setKeyChooseDetail} />
            ))}
        </TableBody>
        {totalRecord != 0 &&
          <TableFooter >
            <TableCell colSpan={8} >

              <PaginationCustom totalRecord={totalRecord} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} setPageSize={setPageSize} ></PaginationCustom>

            </TableCell>
          </TableFooter>}

      </Table>
    </TableContainer >
  );
}


