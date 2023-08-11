import { Box, Chip, CircularProgress, Collapse, Grid, IconButton, Modal, Paper, Stack, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import * as React from 'react';

import { SocketTopic } from '@Common/const';
import { CarrierActiveObject, CarrierAvailableObject, CarrierRespType, UploadImageType } from '@Common/types';
import DisplayImage from '@Components/DisplayImage';
import MapFollowShipper, { LongLatData } from '@Components/MapFollowShipper';
import { defaultImageUploadState } from '@Components/UploadImages';
import { convertNumberToCurrency } from '@Helpers/data.optimize';
import { selectFile } from '@Helpers/image.handle';
import carrierService, { CarrierDetailType } from '@Services/carrier.service';
import fileService from '@Services/file.service';
import mapService from '@Services/map.service';
import stompClient from '@Services/socket.service';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toInteger } from 'lodash';
import mapboxgl from 'mapbox-gl';
import { useSearchParams } from 'react-router-dom';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import Empty from '@Components/Empty';

const additionalOptions = {};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
};

export interface LocationCarrier {
  userId?: number;
  latitude?: number;
  longitude?: number;
}
let map;
mapboxgl.accessToken = "pk.eyJ1IjoiZGF2aWRjYWxob3VuIiwiYSI6ImNraXlxaW8wMTB4MXIyeG02aDZzbnBxcmkifQ.OOxFfzUTBphTe1wEZqhjnw";

const CollapseComponent = (props: {
  carrier: CarrierRespType
}) => {
  const { carrier } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationCarrier, setLocationCarrier] = React.useState<LocationCarrier>({
    latitude: carrier.latitudeNewest,
    longitude: carrier.longitudeNewest,
    userId: carrier.accountId
  });
  const [carrierDetail, setCarrierDetail] = React.useState<CarrierDetailType>();
  const [open, setOpen] = React.useState<boolean>(false);


  React.useEffect(() => {
    const id = toInteger(searchParams.get("id"));
    const fetchCarrierDetail = async (id: number) => {
      const resp = await carrierService.getDetail(id);
      setCarrierDetail(resp.data);
    }
    if (id === carrier.id) {
      fetchCarrierDetail(id);
      setOpen(true);
      stompClient.connect({}, function () {
        stompClient.subscribe(
          `/${SocketTopic.LOCATION}/${carrier?.accountId}`,
          (message) => {
            const body: LocationCarrier = JSON.parse(message.body);
            setLocationCarrier(body);
          }
        );
      });
    } else {
      setOpen(false);

      if (stompClient.connected) {
        stompClient.unsubscribe(`/${SocketTopic.LOCATION}/${carrier?.accountId}`);
      }

    }

  }, [carrier, searchParams]);


  return (
    <>
      {open && <TableRow>
        <TableCell style={{ paddingBottom: 15, paddingTop: 15 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container spacing={6}>
                <Grid item xs={4}>
                  <Typography variant="h6" gutterBottom component="div">
                    Thông tin chi tiết
                  </Typography>
                  <Stack direction={"column"} spacing={3}>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
                      <Typography>Số đơn đang giao</Typography>
                      <Typography>{carrierDetail?.numberOfOrderDelivering}</Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
                      <Typography>Số đơn đã giao</Typography>
                      <Typography>{carrierDetail?.numberOfOrderDelivered}</Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
                      <Typography>Tổng tiền chưa bàn giao</Typography>
                      <Typography>{convertNumberToCurrency(carrierDetail?.totalCashNotPayment || 0)}</Typography>
                    </Stack>

                  </Stack>
                </Grid>
                <Grid item xs={8}>
                  <Box>
                    <Typography variant="h6" gutterBottom component="div" align='center'>
                      Vị trí hiện tại
                    </Typography>
                    <MapFollowShipper data={{
                      latitude: locationCarrier?.latitude || 0,
                      longtitude: locationCarrier?.longitude || 0,
                    }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>}
    </>
  )
}


function Row(props: {
  carrier: CarrierRespType,
}) {
  const { carrier } = props;
  const [avatar, setAvatar] = React.useState<UploadImageType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addressText, setAddressText] = React.useState();


  const open = React.useMemo(() => toInteger(searchParams.get("id")) === carrier.id, [carrier.id, searchParams]);
  React.useEffect(() => {
    const fetchAvatar = async () => {
      const resp = await fileService.getAvatar(carrier.pathAvatar);
      const file = new File([resp], carrier.pathAvatar);
      const imageSelect = selectFile(file, defaultImageUploadState);
      setAvatar(imageSelect);
    }

    fetchAvatar();
  }, [carrier.pathAvatar]);

  React.useEffect(() => {
    const fetchLocation = async (location: LongLatData) => {
      const resp = await mapService.getLocation(location);
      setAddressText(resp);
    }
    if (carrier) {
      fetchLocation({
        latitude: carrier.latitudeNewest,
        longtitude: carrier.longitudeNewest
      })
    }

  }, [carrier]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              if (open) {
                setSearchParams({});
                return;
              }
              setSearchParams({
                id: `${carrier.id}`,
              })
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {carrier.id}
        </TableCell>
        <TableCell align="right">
          <DisplayImage src={avatar?.previewImage ?? ""} style={{
            width: "50px"
          }} />
        </TableCell>
        <TableCell align="right">{carrier.name}</TableCell>
        <TableCell align="right">{addressText}</TableCell>
        <TableCell align="right">{carrier.active ? <Chip color={CarrierActiveObject.active.color} label={CarrierActiveObject.active?.label || ""} /> : <Chip color={CarrierActiveObject.inactive.color} label={CarrierActiveObject.inactive.label || ""} />}</TableCell>
        <TableCell align="right">{carrier.available ? <Chip color={CarrierAvailableObject.available.color} label={CarrierAvailableObject.available.label} /> : <Chip color={CarrierAvailableObject.inavailable.color} label={CarrierAvailableObject.inavailable?.label} />}</TableCell>
      </TableRow>
      <CollapseComponent carrier={carrier} />
    </React.Fragment>
  );
}

function QuanlyNVgiaohang() {
  const [carriers, setCarriers] = React.useState<CarrierRespType[]>([]);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    const getCarrierData = async () => {
      setLoading(true);
      const resp = await carrierService.getAll(currentPage + 1);
      setCarriers(resp.data.listData);
      setTotalPage(resp.data.totalPage);
      setLoading(false);
    }

    getCarrierData();
  }, [currentPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number) => {
    setCurrentPage(newPage);
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Mã nhân viên</TableCell>
            <TableCell align="right">Ảnh đại diện</TableCell>
            <TableCell align="right">Tên nhân viên</TableCell>
            <TableCell align="center">Vị trí hiện tại</TableCell>
            <TableCell align="right">Trạng thái hoạt động</TableCell>
            <TableCell align="right">Trạng thái giao hàng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <Modal component={"center"} open={loading}>
            <Box sx={style}>
              <CircularProgress size={50} />
            </Box>
          </Modal> : (carriers.length > 0 ? carriers.map((carrier) => (
            <Row key={carrier.id} carrier={carrier} />
          )) : <Empty>Không tồn tại nhân viên giao hàng nào</Empty>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={totalPage * 5}
              rowsPerPage={5}
              page={currentPage}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )


}
export default QuanlyNVgiaohang;