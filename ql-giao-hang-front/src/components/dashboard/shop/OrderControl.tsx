import Title from '@Components/Title'
import { CardHeaderStyled, CardStyled } from '@Components/Utils'
import { Grid } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import Table from '@Components/Table';
import codService from '@Services/cod.service';
import Chip from '@mui/material/Chip';
import { CODStatus, CODType } from '@Common/types';
import { orderShopStatus, orderShopStatusColor, productStatusColor } from '@Common/const';
import TransitionsModal from '@Components/TransitionsModal';
import { Backdrop, Box, Button, Paper } from "@mui/material";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import BlockIcon from '@mui/icons-material/Block';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch } from '@App/hook';
import { openToast } from '@Features/toast/toastSlice';
import { OrderControlToastPayload } from '@Common/toast.const';


type CODTableType = {
  id: number;
  forDay: string;
  numberOfOrder: number;
  totalCash: number;
  status: number;
  createdAt: any;
}

type OrderTableType = {
  id: number;
  nameOfReceiver: string;
  phoneNumberOfReceiver: string;
  status: string;
  shipFee: number;
  vat: number;
  totalPayment: number;
  restRefund: number;
}

const colums: GridColumns = [
  { field: "id", headerName: "Mã phiếu", width: 100, editable: false, headerAlign: "center", align: "center" },
  { field: "forDay", headerName: "Ngày", width: 150, headerAlign: "center", align: "center", flex: 1 },
  { field: "numberOfOrder", headerName: "Số đơn hàng", width: 150, headerAlign: "center", align: "center", flex: 1 },
  { field: "totalCash", headerName: "Tổng tiền", type: "number", align: "center", flex: 1, headerAlign: "center" },
  {
    field: "status", headerName: "Trạng thái phiếu", type: "number", align: "center", flex: 1, headerAlign: "center", renderCell(params) {
      const { row: { status, id } } = params;
      return <Chip label={CODStatus[status]} color={status === 1 ? productStatusColor.ACTIVE : productStatusColor.INACTIVE} key={id} variant="outlined" />

    },
  },
  { field: "createdAt", headerName: "Ngày tạo phiếu", width: 150, headerAlign: "center", align: "center", flex: 1 },
];

const columnsForOrder: GridColumns = [
  { field: "id", headerName: "Mã đơn", width: 60, editable: false, headerAlign: "center", align: "center" },
  { field: "nameOfReceiver", headerName: "Tên người nhận", type: "text", align: "center", flex: 1, headerAlign: "center" },
  { field: "phoneNumberOfReceiver", headerName: "Số điện thoại người nhận", width: 150, headerAlign: "center", align: "center", flex: 1 },
  {
    field: "status", headerName: "Trạng thái đơn", align: "center", width: 200, headerAlign: "center", renderCell(params) {
      const { row } = params;
      const status: string = row.status;
      return <Chip label={orderShopStatus[status]} color={orderShopStatusColor[status]} key={row.id} variant="outlined" />
    },
  },
  { field: "shipFee", headerName: "Phí ship", type: "number", align: "center", flex: 1, headerAlign: "center" },
  { field: "vat", headerName: "VAT", type: "number", align: "center", flex: 1, headerAlign: "center" },
  { field: "totalPayment", headerName: "Tổng tiền đơn", type: "number", align: "center", flex: 1, headerAlign: "center" },
  { field: "restRefund", headerName: "Tiền hoàn", type: "number", align: "center", flex: 1, headerAlign: "center" },
]

function OrderControl() {

  const [dataPendingDisplay, setDataPendingDisplay] = useState<CODTableType[]>([]);
  const [totalPending, setTotalPending] = useState<number>(0);
  const [pagePending, setPagePending] = useState<number>(1);
  const [loadPending, setLoadPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dataFetched, setDataFetched] = useState<CODType[]>([]);
  const [dataInPaper, setDataInPaper] = useState<OrderTableType[]>([]);
  const [currOrderControl, setCurrOrderControl] = useState<CODType>();
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
  const [dataHistory, setDataHistory] = useState<CODTableType[]>([]);
  const [totalHistory, setTotalHistory] = useState<number>(0);
  const [pageHistory, setPageHistory] = useState<number>(1);
  const [loadHistory, setLoadHistory] = useState(false);
  const [reload, setReload] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCODPending = async () => {
      setLoadPending(true);
      const allCOD = await codService.getCODByShopAndStatus(1, pagePending);
      setTotalPending(allCOD.data.totalPage);
      const data = allCOD.data.cods;
      setDataFetched(data);

      const optimize: CODTableType[] = data.map(item => {
        const totalCash = item.orders.reduce((prev, curr) => prev + curr.paymentTotal, 0);
        return {
          id: item.id,
          forDay: item.date,
          numberOfOrder: item.orders.length,
          status: item.status,
          totalCash: totalCash,
          createdAt: new Date(item.createdAt).toLocaleString(),
        }
      });

      setDataPendingDisplay(optimize);

      setLoadPending(false);

    }



    fetchCODPending();
  }, [pagePending, reload]);

  useEffect(() => {
    const fetchCODHistory = async () => {
      setLoadPending(true);
      const allCOD = await codService.getDoneOrderControl(pageHistory);
      setTotalHistory(allCOD.data.totalPage);
      const data = allCOD.data.cods;


      const optimize: CODTableType[] = data.map(item => {
        const totalCash = item.orders.reduce((prev, curr) => prev + curr.paymentTotal, 0);
        return {
          id: item.id,
          forDay: item.date,
          numberOfOrder: item.orders.length,
          status: item.status,
          totalCash: totalCash,
          createdAt: new Date(item.createdAt).toLocaleString(),
        }
      });

      setDataHistory(optimize);

      setLoadHistory(false);

    }

    fetchCODHistory();
  }, [pageHistory, reload])

  const handleOpenPaper = (params: any) => {
    const { row } = params;
    const index = dataPendingDisplay.indexOf(row);
    const data = dataFetched[index];
    const { orders } = data;
    const optimize: OrderTableType[] = orders.map(item => {
      const totalPriceProduct = item.products.reduce((prev, curr) => prev + curr.productPrice * curr.productQuantity, 0);
      const vat = totalPriceProduct * 0.1;
      return {
        id: item.id,
        nameOfReceiver: item.customer.name,
        phoneNumberOfReceiver: item.customer.phoneNumber,
        status: item.status,
        shipFee: item.shipFee,
        vat: vat,
        totalPayment: item.paymentTotal,
        restRefund: totalPriceProduct - vat,
      }
    });
    // console.log(optimize);
    setCurrOrderControl(data);
    setDataInPaper(optimize);
    setOpenModal(true);
  }

  const handleAcceptOrderControl = async () => {
    if (currOrderControl) {
      setLoadingChangeStatus(true);
      const resp = await codService.setStatusForCod(currOrderControl.id, 3);
      setLoadingChangeStatus(false);
      if (resp.status && resp.status >= 300) {
        dispatch(openToast(OrderControlToastPayload[4001]));
      } else {
        dispatch(openToast(OrderControlToastPayload[2005]));
      }
      setReload(!reload);
      setOpenModal(false);
    }

  }

  const handleDeclineOrderControl = async () => {
    if (currOrderControl) {
      setLoadingChangeStatus(true);
      const resp = await codService.setStatusForCod(currOrderControl.id, 2);
      setLoadingChangeStatus(false);
      if (resp.status && resp.status >= 300) {
        dispatch(openToast(OrderControlToastPayload[4001]));
      } else {
        dispatch(openToast(OrderControlToastPayload[2005]));
      }
      setReload(!reload);
      setOpenModal(false);
    }
  }



  return (
    <>
      <TransitionsModal
        open={openModal}
        setOpen={setOpenModal}
        content={
          <>
            <Box>
              <CardHeaderStyled
                title={<Stack direction={"column"}>
                  <Title title={`Phiếu đối soát mã #${currOrderControl?.id}`} />
                  <Stack direction={"row"} spacing={2}>
                    <Typography variant="body2" color="textSecondary">
                      Đối soát đơn hàng của ngày:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currOrderControl?.date}
                    </Typography>
                  </Stack>

                </Stack>
                }
              />
              <Table
                header={columnsForOrder}
                data={dataInPaper}
                loading={false}
                hiddeFooter={true}
              />

              <Stack direction="row" spacing={2} justifyContent={"flex-end"} sx={{
                mt: "5px"
              }}>
                <Button variant="outlined" color="error" size='small' startIcon={<BlockIcon />}
                  endIcon={loadingChangeStatus && <CircularProgress color="inherit" size={"1rem"} />}
                  onClick={handleDeclineOrderControl}
                >
                  Từ chối
                </Button>
                <Button variant="contained" size='small' endIcon={<SendIcon />}
                  startIcon={loadingChangeStatus && <CircularProgress color="inherit" size={"1rem"} />}
                  onClick={handleAcceptOrderControl}
                >
                  Đồng ý
                </Button>
              </Stack>
            </Box>
          </>
        }

      />
      <Grid container direction={"row"} spacing={4}>

        <Grid item xs={12}>
          <Table
            data={dataPendingDisplay}
            header={colums}
            setPage={setPagePending}
            title="Phiếu chờ đối soát"
            totalPage={totalPending}
            loading={loadPending}
            onCellClick={handleOpenPaper}
          />

        </Grid>

        <Grid item xs={12}>
          <Table
            data={dataHistory}
            header={colums}
            loading={loadHistory}
            setPage={setPageHistory}
            totalPage={totalHistory}
            title="Lịch sử đối soát"

          />

        </Grid>

      </Grid>
    </>
  )
}

export default OrderControl