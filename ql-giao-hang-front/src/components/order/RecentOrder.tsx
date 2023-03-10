import { orderShopStatus, orderShopStatusColor, orderType, orderTypeColor } from '@Common/const';
import { OrderDisplayPagingType, OrderDisplayType, ResponseReceived } from '@Common/types';
import Orders from '@Components/Table';
import { Backdrop, Divider, Grid, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SwipeableDrawer from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import { DataGrid } from '@mui/x-data-grid/DataGrid/DataGrid';
import { GridColumns } from '@mui/x-data-grid/models';
import orderService from '@Services/order.service';
import provinceService from '@Services/province.service';
import React, { useEffect, useState } from 'react';



const columsProduct: GridColumns = [
  {
    field: "name", headerName: "Tên sản phẩm", width: 180, editable: false, headerAlign: "center", align: "center", flex: 1, valueGetter(params) {
      return params.row.product.name;
    },
  },
  { field: "productPrice", headerName: "Giá sản phẩm", type: "number", width: 200, editable: false, headerAlign: "center", align: "center", flex: 1 },
  { field: "productQuantity", headerName: "Số lượng", type: "number", width: 150, editable: false, headerAlign: "center", align: "center", flex: 1 },
]


function RecentOrder() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OrderDisplayType[]>([]);
  const [totalPage, setTotalPage] = useState(2);
  const [masterDetailOrder, setMasterDetailOrder] = useState<OrderDisplayType>();
  const [loading, setLoading] = useState(false);


  const [openDrawer, setOpenDrawer] = useState(false);



  useEffect(() => {
    const fetchDataOrder = async () => {
      setLoading(true);
      const resp: ResponseReceived<OrderDisplayPagingType> = await orderService.getOrderNewest(page);
      const orders = resp.data.orders;
      const optimizeAddressForOrder = await Promise.all(orders.map(async (item) => {
        const address = await provinceService.getAddress(item.address);
        return {
          ...item,
          address: address,
        }
      }));

      setLoading(false);

      setData(optimizeAddressForOrder);

    };

    fetchDataOrder();
  }, [page]);

  const handleOpenDrawer = (params: any) => {
    if (params.field !== "actions") {
      setOpenDrawer(true);
      setMasterDetailOrder(params.row);
    }
  }

  const colums: GridColumns = [
    { field: "id", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },
    {
      field: "type", headerName: "Kiểu giao hàng", width: 150, headerAlign: "center", align: "center", flex: 1, renderCell(params) {
        const { row } = params;
        const type: string = row.type;
        return <Chip label={orderType[type]} color={orderTypeColor[type]} key={row.id} variant="outlined" />
      }
    },
    {
      field: "customer.name", headerName: "Tên người nhận", width: 150, headerAlign: "center", align: "center", flex: 1, valueGetter(params) {
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
      field: "status", headerName: "Trạng thái đơn hàng", align: "center", flex: 1, headerAlign: "center", width: 200, renderCell(params) {
        const { row } = params;
        const status: string = row.status;
        return <Chip label={orderShopStatus[status]} color={orderShopStatusColor[status]} key={row.id} variant="outlined" />
      },
    },
    { field: "shipFee", headerName: "Phí ship(VNĐ)", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "paymentTotal", headerName: "Tổng tiền đơn hàng(VNĐ)", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "note", headerName: "Ghi chú", align: "center", flex: 1, headerAlign: "center" },
  ]
  return (
    <>
      <Orders header={colums}
        title={"Đơn hàng gần đây"}
        data={data} totalPage={totalPage} setPage={setPage} onCellClick={handleOpenDrawer}
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

export default RecentOrder