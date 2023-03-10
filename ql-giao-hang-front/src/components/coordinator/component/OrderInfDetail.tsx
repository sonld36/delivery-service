import { OrderInfDetailResponse } from '@Common/types';
import { Box, Divider, Grid, Paper, ThemeProvider, Typography, createTheme } from '@mui/material';
import { styled } from '@mui/styles';
import * as React from 'react';

const theme = createTheme();
const GridTitleCustom = styled(Grid)({
    padding: "6px 0px", color: "#747C87", paddingLeft: "15px"
});
const GridCustom = styled(Grid)({
    padding: "6px 0px", paddingRight: "10px"
});

function OrderInfDetail(props: { maVanDon: number, orderInfDetail?: OrderInfDetailResponse }) {
    const { maVanDon, orderInfDetail } = props;
    const [deliver_name, setDeliver_name] = React.useState("Nguyễn Văn C");
    const [deliver_id, setDeliver_id] = React.useState("GH00001");

    const [COD, setCOD] = React.useState(1234567);
    const [ship_fee, setShip_fee] = React.useState(35000);

    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <Box component={Paper} sx={{ padding: "10px", borderRadius: "8px", backgroundColor: "white", overflow: "auto" }}>
                    <Grid container spacing={0} >
                        <Grid container xs={8} >
                            <Grid container xs={12} direction="row">
                                <Grid container item xs={12} sx={{}} >
                                    <Grid container xs={6} >

                                        <GridTitleCustom item xs={6}  >Tên người gửi hàng</GridTitleCustom>
                                        <GridCustom item xs={6} >{orderInfDetail?.shopName}</GridCustom>
                                    </Grid>
                                    <Grid container xs={6} >
                                        <GridTitleCustom item xs={6}>Tên người nhận hàng</GridTitleCustom>
                                        <GridCustom item xs={6}>{orderInfDetail?.receiverName}</GridCustom>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} sx={{}} >
                                    <Grid container xs={6} >
                                        <GridTitleCustom item xs={6}>Địa chỉ lấy hàng</GridTitleCustom>
                                        <GridCustom item xs={6}>{orderInfDetail?.shopAdd}</GridCustom>
                                    </Grid>
                                    <Grid container xs={6} >
                                        <GridTitleCustom item xs={6} >Địa chỉ giao hàng</GridTitleCustom>
                                        <GridCustom item xs={6}>{orderInfDetail?.receiverAdd}</GridCustom>
                                    </Grid>

                                </Grid>
                                <Grid container item xs={12} sx={{}} >
                                    <Grid container xs={6} >
                                        <GridTitleCustom item xs={6} >SĐT người gửi hàng</GridTitleCustom>
                                        <GridCustom item xs={6}>{orderInfDetail?.shopPhone}</GridCustom>
                                    </Grid>
                                    <Grid container xs={6} >
                                        <GridTitleCustom item xs={6}  >SĐT người nhận hàng</GridTitleCustom>
                                        <GridCustom item xs={6}>{orderInfDetail?.receiverPhone}</GridCustom>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container xs={12} direction="row" columns={24}>
                                <GridTitleCustom item xs={10} >Mã vận đơn</GridTitleCustom>
                                <GridCustom item xs={14} >{maVanDon}</GridCustom>
                            </Grid>
                            <Grid container xs={12} direction="row">

                                <Grid container xs={6}>
                                    <GridTitleCustom item xs={6} >Tên NV giao hàng</GridTitleCustom>
                                    <GridCustom item xs={6}>{orderInfDetail?.deliveryName}</GridCustom>
                                </Grid>
                                <Grid container xs={6}>
                                    <GridTitleCustom item xs={6} >Mã NV giao hàng </GridTitleCustom>
                                    <GridCustom item xs={6}>{orderInfDetail?.deliveryId}</GridCustom>

                                </Grid>
                            </Grid>
                        </Grid>



                        <Grid container xs={4}>
                            <Divider orientation="vertical" flexItem variant="middle" />
                            <Grid>
                                <Typography sx={{ padding: "10px", fontSize: "14px" }} >Ghi chú giao hàng:</Typography>
                                <Typography sx={{ padding: "10px", fontSize: "14px" }}>{orderInfDetail?.note}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider >
        </React.Fragment >
    );
}
export default OrderInfDetail;