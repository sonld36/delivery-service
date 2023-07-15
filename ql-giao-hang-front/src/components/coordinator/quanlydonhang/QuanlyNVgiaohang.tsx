import Table from '@mui/material/Table';
import Title from '@Components/Title';
import { CardStyled } from '@Components/Utils';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CardHeader, Divider, FormControl, InputAdornment, TextField, Typography, Container, CardContent, TableRow, TableCell, IconButton, Collapse, TableHead, TableBody, TableContainer, Paper, Grid, Stack, Chip } from '@mui/material';
import { GridColumns } from '@mui/x-data-grid';
import * as React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CarrierActiveObject, CarrierAvailableObject, CarrierRespType, SocketMessageFormat, UploadImageType } from '@Common/types';
import carrierService, { CarrierDetailType } from '@Services/carrier.service';
import DisplayImage from '@Components/DisplayImage';
import { selectFile } from '@Helpers/image.handle';
import { defaultImageUploadState } from '@Components/UploadImages';
import fileService from '@Services/file.service';
import { useSearchParams } from 'react-router-dom';
import { toInteger } from 'lodash';
import { stompClient } from '@Services/socket.service';
import { SocketTopic } from '@Common/const';
import mapboxgl from 'mapbox-gl';
import MapFollowShipper, { LongLatData } from '@Components/MapFollowShipper';
import mapService from '@Services/map.service';



export interface LocationCarrier {
  userId?: number;
  latitude?: number;
  longitude?: number;
}

mapboxgl.accessToken = "pk.eyJ1IjoiZGF2aWRjYWxob3VuIiwiYSI6ImNraXlxaW8wMTB4MXIyeG02aDZzbnBxcmkifQ.OOxFfzUTBphTe1wEZqhjnw";

const CollapseComponent = (props: {
  carrier: CarrierRespType
}) => {
  const { carrier } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationCarrier, setLocationCarrier] = React.useState<LocationCarrier>({
    latitude: carrier.latitudeNewest,
    longitude: carrier.longtitudeNewest,
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
      stompClient.subscribe(
        `/${SocketTopic.LOCATION}/${carrier?.accountId}`,
        (message) => {
          const body: LocationCarrier = JSON.parse(message.body);
          setLocationCarrier(body);
        }
      );
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
                      <Typography>{carrierDetail?.totalCashNotPayment}</Typography>
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
        longtitude: carrier.longtitudeNewest
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
        <TableCell align="right">{carrier.isActive ? <Chip color={CarrierActiveObject.active.color} label={CarrierActiveObject.active?.label || ""} /> : <Chip color={CarrierActiveObject.inactive.color} label={CarrierActiveObject.inactive.label || ""} />}</TableCell>
        <TableCell align="center">{carrier.available ? <Chip color={CarrierAvailableObject.available?.color || "warning"} label={CarrierActiveObject.available?.label || "Không xác định"} /> : <Chip color={CarrierAvailableObject.inavailable?.color || "warning"} label={CarrierAvailableObject.inavailable?.label || "Không xác định"} />}</TableCell>
      </TableRow>
      <CollapseComponent carrier={carrier} />
    </React.Fragment>
  );
}

function QuanlyNVgiaohang() {
  const [carriers, setCarriers] = React.useState<CarrierRespType[]>([]);
  const [totalPage, setTotalPage] = React.useState<number>(0);



  React.useEffect(() => {
    const getCarrierData = async () => {
      const resp = await carrierService.getAll(1);
      setCarriers(resp.data.listData);
      setTotalPage(resp.data.totalPage);
    }

    getCarrierData();
  }, []);

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
          {carriers.map((carrier) => (
            <Row key={carrier.id} carrier={carrier} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )


}
export default QuanlyNVgiaohang;