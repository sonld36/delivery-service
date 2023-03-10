import { useAppDispatch } from '@App/hook';
import { orderShopStatus, orderShopStatusColor, orderType, orderTypeColor } from '@Common/const';
import { OrderToastPayload } from '@Common/toast.const';
import { OrderDisplayPagingType, OrderDisplayType, ResponseReceived } from '@Common/types';
import Orders from '@Components/Table';
import { openToast } from '@Features/toast/toastSlice';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DoneIcon from '@mui/icons-material/Done';
import { Backdrop, Divider, Grid, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SwipeableDrawer from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import { DataGrid } from '@mui/x-data-grid/DataGrid/DataGrid';
import { GridColumns } from '@mui/x-data-grid/models';
import orderService from '@Services/order.service';
import provinceService from '@Services/province.service';
import React, { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';



const columsProduct: GridColumns = [
  {
    field: "name", headerName: "Tên sản phẩm", width: 180, editable: false, headerAlign: "center", align: "center", flex: 1, valueGetter(params) {
      return params.row.product.name;
    },
  },
  { field: "productPrice", headerName: "Giá sản phẩm", type: "number", width: 200, editable: false, headerAlign: "center", align: "center", flex: 1 },
  { field: "productQuantity", headerName: "Số lượng", type: "number", width: 150, editable: false, headerAlign: "center", align: "center", flex: 1 },
]


function OrderList() {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OrderDisplayType[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [masterDetailOrder, setMasterDetailOrder] = useState<OrderDisplayType>();
  const [orderIdToHandleAction, setOrderIdToHandleAction] = useState();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useAppDispatch();

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
    setAnchorEl(event.currentTarget);
    setOrderIdToHandleAction(id);

  }

  const handleAgreeDelete = async (event: React.MouseEvent<HTMLLIElement>) => {
    if (orderIdToHandleAction) {
      const resp = await orderService.cancelOrder(orderIdToHandleAction);
      if (resp.status && resp.status > 300) {
        dispatch(openToast(OrderToastPayload[4001]))
      } else {
        dispatch(openToast(OrderToastPayload[resp.code ? resp.code : 2001]));
        handleClose();
        setReload(!reload);

      }
    }
  }

  useEffect(() => {
    const fetchDataOrder = async () => {
      setLoading(true);
      const resp: ResponseReceived<OrderDisplayPagingType> = await orderService.getOrderWithPaging(page);
      const orders = resp.data.orders;
      const optimizeAddressForOrder = await Promise.all(orders.map(async (item) => {
        const address = await provinceService.getAddress(item.address);
        return {
          ...item,
          address: address,
        }
      }));
      setLoading(false);
      // console.log(optimizeAddressForOrder);

      setData(optimizeAddressForOrder);
      setTotalPage(resp.data.totalPage);
      // console.log(resp);
    };

    fetchDataOrder();
  }, [page, reload]);

  const handleOpenDrawer = (params: any) => {
    if (params.field !== "actions") {
      setOpenDrawer(true);
      setMasterDetailOrder(params.row);
    }
  }

  const colums: GridColumns = [
    { field: "id", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },
    {
      field: "type", headerName: "Kiểu giao hàng", width: 150, headerAlign: "center", align: "center", renderCell(params) {
        const { row } = params;
        const type: string = row.type;
        return <Chip label={orderType[type]} color={orderTypeColor[type]} key={row.id} variant="outlined" />
      }
    },
    {
      field: "customer.name", headerName: "Tên người nhận", width: 150, headerAlign: "center", align: "center", valueGetter(params) {
        return params.row.customer.name;

      },
    },
    {
      field: "customer.phoneNumber", headerName: "SĐT người nhận", align: "center", flex: 1, headerAlign: "center", valueGetter(params) {
        return params.row.customer.phoneNumber;
      },
    },
    // {
    //   field: "address", headerName: "Địa chỉ", align: "center", flex: 1, headerAlign: "center", width: 400
    // },
    {
      field: "status", headerName: "Trạng thái đơn hàng", align: "center", headerAlign: "center", width: 200, renderCell(params) {
        const { row } = params;
        const status: string = row.status;
        return <Chip label={orderShopStatus[status]} color={orderShopStatusColor[status]} key={row.id} variant="outlined" />
      },
    },
    { field: "shipFee", headerName: "Phí ship", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "paymentTotal", headerName: "Tổng tiền đơn hàng", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "note", headerName: "Ghi chú", align: "center", flex: 1, headerAlign: "center" },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hủy đơn',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [

          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Hủy Đơn"
            onClick={(event) => {
              event.preventDefault();
              handleDeleteClick(event, id);
            }}
            color="inherit"
          />,
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={(event) => handleAgreeDelete(event)}>
              <ListItemIcon>
                <DoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ fontSize: "15px" }}>Đồng ý</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}><ListItemIcon>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
              <ListItemText sx={{ fontSize: "15px" }}>Từ chối</ListItemText></MenuItem>
          </Menu>
        ];
      }
    }
  ]
  return (
    <>
      <Orders header={colums} title={"Danh sách đơn hàng"} data={data} totalPage={totalPage} setPage={setPage} onCellClick={handleOpenDrawer}
        loading={loading}
      />
      <Backdrop
        sx={{
          color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,
          "& .MuiDrawer-paper": {
            width: "50%"
          }
        }}
        open={openDrawer}
        onClick={() => setOpenDrawer(false)}
      >
        <SwipeableDrawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
          // sx={{ w: "64px" }}
          variant="permanent"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Stack
            sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
            direction="column"
          >
            <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
              <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                <Typography variant="h6">{`Đơn hàng #${masterDetailOrder?.id}`}</Typography>
                <Grid container rowGap={2}>
                  <Grid item md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Thông tin khách hàng
                    </Typography>
                    <Typography variant="body1">{masterDetailOrder?.customer.name}</Typography>
                    <Typography variant="body1">{masterDetailOrder?.customer.phoneNumber}</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="body2" align="right" color="textSecondary">
                      Địa chỉ giao hàng
                    </Typography>
                    <Typography variant="body1" align="right">
                      {masterDetailOrder?.address}
                    </Typography>
                  </Grid>
                  <Grid item md={12}>
                    <Divider />
                  </Grid>

                  <Grid item md={12}>
                    <Typography variant="body2" color="textSecondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body1" >
                      {masterDetailOrder?.note}
                    </Typography>
                  </Grid>

                  <Grid item md={12}>
                    <Divider />
                  </Grid>
                </Grid>
                <DataGrid
                  rows={masterDetailOrder ? masterDetailOrder?.products : []}
                  columns={columsProduct}
                  getRowId={(row) => {
                    return row.product.id;
                  }
                  }
                  hideFooter
                  autoHeight={true}
                />
              </Stack>
            </Paper>
          </Stack>
        </SwipeableDrawer>
      </Backdrop>

    </>
  )
}

export default OrderList