import { useAppDispatch } from '@App/hook';
import { orderShopStatus, orderShopStatusColor, orderType, orderTypeColor } from '@Common/const';
import { OrderToastPayload } from '@Common/toast.const';
import { OrderDisplayPagingType, OrderDisplayType, ResponseReceived } from '@Common/types';
import Orders from '@Components/Table';
import { openToast } from '@Features/toast/toastSlice';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DoneIcon from '@mui/icons-material/Done';
import { Backdrop, Box, Divider, Grid, Typography, css } from '@mui/material';
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
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { toInteger } from 'lodash';
import MapToFollowOrder from '@Components/MapToFollowOrder';



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
  const [searchParams, setSearchParams] = useSearchParams();

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useAppDispatch();

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
    event.preventDefault();
    event.stopPropagation();
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
        // const address = await provinceService.getAddress(item.address);
        return {
          ...item,
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


  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        if (open === false) setSearchParams({});

        setOpenDrawer(open);
      };

  useEffect(() => {
    const getOrderById = async () => {
      const orderId = toInteger(searchParams.get("id"));
      if (orderId) {
        const resp = await orderService.getByOrderId(orderId);
        setMasterDetailOrder(resp.data);
      }
    }

    getOrderById();
  }, [searchParams]);

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
      <Orders header={colums} title={"Danh sách đơn hàng"} data={data} totalPage={totalPage} setPage={setPage} onCellClick={toggleDrawer(true)}
        loading={loading}
      />

      <SwipeableDrawerStyled
        anchor={"right"}
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: 500 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
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
                      {masterDetailOrder?.destinationAddress}
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

                <MapToFollowOrder currentLocation={{
                  latitude: masterDetailOrder?.currentLat || 0,
                  longtitude: masterDetailOrder?.currentLong || 0
                }}
                  fromLocation={{
                    latitude: masterDetailOrder?.shop.latitude || 0,
                    longtitude: masterDetailOrder?.shop.longitude || 0
                  }}
                  toLocation={{
                    latitude: masterDetailOrder?.destinationLat || 0,
                    longtitude: masterDetailOrder?.destinationLongitude || 0
                  }}
                />
              </Stack>
            </Paper>
          </Stack>
        </Box>

      </SwipeableDrawerStyled>



    </>
  )
}

const SwipeableDrawerStyled = styled(SwipeableDrawer)`
  .MuiDrawer-paper {
    top: 63px;
  }
`

export default OrderList