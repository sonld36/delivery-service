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
import { Order, OrderDisplayType } from '@Common/types';
import orderService from '@Services/order.service';
import PaginationCustom from './Pagination';
import { orderManageLinks } from '../CoordinatorSidebar/CoordinatorSidebar';
import { useAppDispatch, useAppSelector } from '@App/hook';
import { OrderStateType, fetchAllOrderByDPWithPagination, fetchAllOrderByStatusDPWithPagination, selectOrder } from '@Features/order/orderSlice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toInteger } from 'lodash';


const TableCellCus = styled(TableCell)({
  backgroundColor: "#BBBDBF",
});
// const TableBodyCus = styled(TableBody)({
//   backgroundColor: "#F4F6F8",
// });

const statuses: {
  [key: string]: string
} = {
  [orderManageLinks.ALL]: "all",
  [orderManageLinks.REQUEST]: "REQUEST_SHIPPING",
  [orderManageLinks.PICKING]: "PICKING_UP_GOODS",
  [orderManageLinks.DELIVERING]: "BEING_TRANSPORTED",
  [orderManageLinks.SUCCESS]: "DELIVERY_SUCCESSFUL",
  [orderManageLinks.DONE]: "REFUNDS",
}

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

function Row(props: { row: Order, setReload: (params: any) => any }) {
  const { row } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const id = toInteger(searchParams.get("order"));

    if (id === toInteger(row.maVanDon)) {
      setOpen(true);
    }
    else setOpen(false);
  }, [searchParams, row]);

  return (
    <React.Fragment>
      <TableRowChosen open={open} >
        <TableCell>
          <IconButton
            size="small"
            onClick={() => {
              if (open) {
                setOpen(!open);
                setSearchParams((prev) => ({
                  page: prev.get("page") || `1`,
                }));
                return;
              }
              setSearchParams((prev) => ({
                page: prev.get("page") || `1`,
                order: `${row.maVanDon}`
              }));
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
            {open ? <OrderDetail maVanDon={row.maVanDon} setReload={props.setReload} /> : null}
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

type OrderListResultsProps = {
  status: string;
}
export default function OrderListResults(props: OrderListResultsProps) {
  const [reload, setReload] = React.useState(false)
  const { status } = props;
  //Phan trang
  const [pageSize, setPageSize] = React.useState<number>(5);
  const ordersState: OrderStateType = useAppSelector(selectOrder);
  const [orders, setOrders] = React.useState<Order[] | any>([]);
  const [totalRecord, setTotalRecord] = React.useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams({});

  const pageIndex = React.useMemo(() => toInteger(searchParams.get("page")), [searchParams]);

  React.useEffect(() => {
    const handleChangeParams = async () => {
      const idOrder = toInteger(searchParams.get("order"));
      if (idOrder !== 0 && statuses[status] === "all") {
        const resp = await orderService.getPageByOrderId(idOrder);
        setSearchParams({
          order: `${searchParams.get("order")}`,
          page: `${resp.data}`
        })
      }
    }

    handleChangeParams();
  }, [searchParams, setSearchParams]);



  const dispatch = useAppDispatch();


  //Co thay doi thong tin don hang

  // React.useEffect(() => {
  //   setPageIndex(1);
  // }, [location]);

  React.useEffect(() => {
    setOrders(ordersState.orderDisplayType);
    setTotalRecord(ordersState.totalPage);
  }, [ordersState])


  React.useEffect(() => {
    // //Hàm lấy toàn bộ đơn hàng
    const getAllOrderByDPWithPagination = async () => {
      try {
        const args = {
          page: pageIndex,
        }
        dispatch(fetchAllOrderByDPWithPagination(args))
      }
      catch (e) {
        console.log(e)
      }
    }
    // //Hàm lấy đơn hàng theo trạng thái
    const getAllOrderStatusByDPWithPagination = async (status: string) => {
      try {
        const args = {
          status,
          page: pageIndex,
        }
        dispatch(fetchAllOrderByStatusDPWithPagination(args));
      }
      catch (e) {
        console.log(e)
      }
    }
    if (statuses[status] === "all")
      getAllOrderByDPWithPagination();
    else
      getAllOrderStatusByDPWithPagination(statuses[status]);
  }, [pageSize, pageIndex, status, dispatch]);
  //Reload lai trang khi gan/thay doi shipper cho don hang
  // React.useEffect(() => {
  //   if (reload) {

  //   }
  // }, [reload])

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
            orders.map((row: Order) => (
              <Row row={row} setReload={setReload} />
            ))}
        </TableBody>
        {totalRecord !== 0 &&
          <TableFooter >
            <TableCell colSpan={8} >

              <PaginationCustom totalRecord={totalRecord} pageSize={pageSize} pageIndex={pageIndex} setPageSize={setPageSize} ></PaginationCustom>

            </TableCell>
          </TableFooter>}

      </Table>
    </TableContainer >
  );
}


