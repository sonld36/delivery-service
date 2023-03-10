import { Deliverier, OrderInfDetailResponse, ResponseReceived } from '@Common/types';
import accountService from '@Services/account.service';
import orderService from '@Services/order.service';
import provinceService from '@Services/province.service';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Divider, Grid, Link, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from "@mui/material/Modal";
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import * as React from 'react';
import OrderInfDetail from './OrderInfDetail';
import OrderProdcutDetail from './OrderProdcutDetail';
// interface deltailInf


const TypoInfModalLabel = styled(Typography)({
    fontSize: "14px",
    fontFamily: "Segoe UI",
    paddingBottom: "4px"

});
const TypoInfModalContent = styled(TypoInfModalLabel)({
    color: "#A3A8AF",
    padding: "10px 12px",
    border: "1px solid #A3A8AF",
    borderRadius: "5px",
});

function OrderDetail(props: { maVanDon: number, setReload: any }) {
    const [orderInfDetail, setOrderInfDetail] = React.useState<OrderInfDetailResponse>();

    const { maVanDon } = props;

    //Khai báo để danh sach nhân viên
    const [deliverierInfCur, setDeliverierInfCur] = React.useState<Deliverier | null>();
    const [deliverierInfTemp, setDeliverierInfTemp] = React.useState<Deliverier | null>();

    //Dong mo modal
    const [open, setOpen] = React.useState(false);
    const handleClickButtonNVDieuPhoiOpen = () => {
        setOpen(true);
        setOpenSave(true)
        props.setReload(false);
    };
    const handleClickButtonNVDieuPhoiClose = () => {
        setDeliverierInfTemp(deliverierInfCur);
        setOpen(false);
    };
    //Button save new delivery
    const [openSave, setOpenSave] = React.useState(false)

    //API lấy data
    ///Lấy thông tin người gửi, giao, shipper
    const fetchOrderInfDetail = async (orderId: Number) => {
        try {
            let resp: ResponseReceived<OrderInfDetailResponse> = await orderService.getOrderInfDetail(orderId);
            if (resp && resp.code === 2000) {
                const fetchData = resp.data;
                fetchData.shopAdd = await provinceService.getAddress(fetchData.shopAdd);
                fetchData.receiverAdd = await provinceService.getAddress(fetchData.receiverAdd);
                setOrderInfDetail(fetchData)
                const deliverierInf: Deliverier = {
                    deliveryId: fetchData.deliveryId,
                    deliveryName: fetchData.deliveryName,
                    deliveryPhone: fetchData.deliveryPhone
                }
                setDeliverierInfCur(deliverierInf)
                setDeliverierInfTemp(deliverierInf)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    //Gán nhân viên giao và đổi trạng thái
    const assignCarrier = async (orderId: Number, carrierId: String) => {
        try {
            let resp: ResponseReceived<any> = await orderService.assignCarrier(orderId, carrierId)
            if (resp && resp.code === 2000) {
                setOpen(false)
                fetchOrderInfDetail(maVanDon)
                props.setReload(true);
            }
            // navigate('/ql-giao-hang/ds-khach-hang-dang-ky')
        }
        catch (e) {
            console.log(e)
        }
    }
    React.useEffect(() => {
        fetchOrderInfDetail(maVanDon);
        fetchDeliverierList();
    }, [])

    //Check deliverier gan moi khac voi deliverier cu thi moi cho luu
    React.useEffect(() => {
        setOpenSave(true)
        if ((deliverierInfTemp?.deliveryId != deliverierInfCur?.deliveryId) && (deliverierInfTemp != null)) setOpenSave(false)
    }, [deliverierInfTemp])

    //Check lưu gán nhân viên
    const checkAssignCarrier = (orderId: Number, carrierNew: Deliverier | null | undefined) => {
        if (carrierNew || carrierNew != null)
            assignCarrier(orderId, carrierNew.deliveryId)
    }

    //Lay danh sach nhan vien van chuyen
    const [deliverierList, setDeliverierList] = React.useState<Deliverier[]>([]);
    const fetchDeliverierList = async () => {
        try {
            let resp: ResponseReceived<Deliverier[]> = await accountService.getDeliverierList();
            if (resp && resp.code === 2000) {
                setDeliverierList(resp.data)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <React.Fragment>
            <Box sx={{ padding: "15px 0" }}>
                <Grid container xs={10} direction="column">
                    <Grid container xs={12} direction="row">
                        <Grid container xs={10} sx={{ padding: "5px" }}>
                            <OrderInfDetail maVanDon={maVanDon} orderInfDetail={orderInfDetail} ></OrderInfDetail>
                        </Grid>
                        <Grid container xs={2} sx={{ padding: "8px" }} direction="column" >
                            {orderInfDetail?.status === "WAITING_FOR_ACCEPT_NEW_ORDER" ?
                                <Button onClick={handleClickButtonNVDieuPhoiOpen} variant="contained" color="success" sx={{
                                    borderRadius: "5px",
                                    height: "40px",
                                    top: "30%",
                                }}>
                                    Gán NV vận chuyển
                                </Button >
                                : <></>}
                            {orderInfDetail?.status === "REQUEST_SHIPPING" ?
                                <Button onClick={handleClickButtonNVDieuPhoiOpen} variant="contained" color="secondary" sx={{
                                    borderRadius: "5px",
                                    height: "40px",
                                    top: "30%",
                                }}>
                                    Đổi NV vận chuyển
                                </Button>
                                : <></>}
                            <Modal
                                open={open}
                                sx={{ overflow: "auto", width: "650px", top: "20%", left: "32%" }}>
                                <Box sx={{ borderRadius: "8px", backgroundColor: "white", }}>
                                    <Grid container>
                                        <Grid container xs={11}>
                                            <Typography sx={{ pl: "10px", fontSize: "20px", fontWeight: "600", p: "20px" }} >Gán nhân viên giao hàng</Typography>
                                        </Grid>
                                        <Grid container xs={1} sx={{ alignItems: 'center', justify: 'center' }} >
                                            <CloseIcon onClick={handleClickButtonNVDieuPhoiClose} />
                                        </Grid>
                                    </Grid>

                                    <Divider ></Divider>

                                    <Grid container sx={{ p: "10px 20px" }}>
                                        <Grid container direction="row">
                                            <Grid container direction="row" sx={{ pb: "16px" }} >
                                                <Grid container xs={6} direction="column" sx={{ pr: "6px" }}>
                                                    <TypoInfModalLabel > Mã vận đơn</TypoInfModalLabel>
                                                    <TypoInfModalContent >{maVanDon}</TypoInfModalContent>
                                                </Grid>
                                                <Grid container xs={6} direction="column" sx={{ pl: "6px" }}>
                                                    <TypoInfModalLabel> Ngày lên đơn</TypoInfModalLabel>
                                                    <TypoInfModalContent >{dayjs(orderInfDetail?.createdAt).format('DD/MM/YYYY HH:MM')}</TypoInfModalContent>                                                </Grid>

                                            </Grid>
                                            <Grid container direction="row" sx={{ pb: "8px" }} >
                                                <Grid container xs={6} direction="column" sx={{ pr: "6px" }}>
                                                    <TypoInfModalLabel> Tên người gửi</TypoInfModalLabel>
                                                    <TypoInfModalContent >{orderInfDetail?.shopName}</TypoInfModalContent>
                                                </Grid>
                                                <Grid container xs={6} direction="column" sx={{ pl: "6px" }}>
                                                    <TypoInfModalLabel>SĐT người gửi</TypoInfModalLabel>
                                                    <TypoInfModalContent >{orderInfDetail?.shopPhone}</TypoInfModalContent>
                                                </Grid>

                                            </Grid>

                                            <Grid container xs={12} direction="column" sx={{ pb: "16px" }}>
                                                <TypoInfModalLabel> Địa chỉ người gửi</TypoInfModalLabel>
                                                <TypoInfModalContent >{orderInfDetail?.shopAdd}</TypoInfModalContent>
                                            </Grid>

                                            <Grid container direction="row" sx={{ pb: "8px" }} >
                                                <Grid container xs={6} direction="column" sx={{ pr: "6px" }}>
                                                    <TypoInfModalLabel> Tên người nhận</TypoInfModalLabel>
                                                    <TypoInfModalContent >{orderInfDetail?.receiverName}</TypoInfModalContent>
                                                </Grid>
                                                <Grid container xs={6} direction="column" sx={{ pl: "6px" }}>
                                                    <TypoInfModalLabel> SĐT người nhận</TypoInfModalLabel>
                                                    <TypoInfModalContent >{orderInfDetail?.receiverPhone}</TypoInfModalContent>
                                                </Grid>

                                            </Grid>

                                            <Grid container xs={12} direction="column" sx={{ pb: "16px" }}>
                                                <TypoInfModalLabel>Địa chỉ người nhận</TypoInfModalLabel>
                                                <TypoInfModalContent >{orderInfDetail?.receiverAdd}</TypoInfModalContent>
                                            </Grid>
                                            <Grid container sx={{ pb: "16px" }} columns={24} >
                                                <Grid item xs={12} direction="column" sx={{ pr: "28px" }}>
                                                    <TypoInfModalLabel>Tên nhân viên giao hàng</TypoInfModalLabel>
                                                    <Autocomplete
                                                        onChange={(event: any, newValue: Deliverier | null) => {
                                                            setDeliverierInfTemp(newValue);
                                                        }}
                                                        onInputChange={() => {
                                                            setDeliverierInfTemp(deliverierInfTemp)
                                                        }}
                                                        value={deliverierInfTemp}
                                                        getOptionLabel={(options) => options.deliveryName}
                                                        options={deliverierList}
                                                        sx={{ padding: "0px" }}
                                                        renderInput={(params) =>
                                                            <TextField sx={{ padding: "0px", borderRadius: "5px" }} {...params} />} />
                                                </Grid>
                                                <Grid item xs={6} direction="column" sx={{ pr: "28px" }}>
                                                    <TypoInfModalLabel> Mã NV giao hàng </TypoInfModalLabel>
                                                    <TypoInfModalContent sx={{ height: "50px" }} >{deliverierInfTemp?.deliveryId}</TypoInfModalContent>
                                                </Grid>
                                                <Grid item xs={6} direction="column">
                                                    <TypoInfModalLabel> SĐT nhân viên</TypoInfModalLabel>
                                                    <TypoInfModalContent sx={{ height: "50px" }} >{deliverierInfTemp?.deliveryPhone}</TypoInfModalContent>
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ p: "10px 20px 20px 23px" }} >
                                        <Grid container xs={8}>
                                            <Link href="/dieu-phoi/quan-ly-nv-giao-hang" >
                                                <Typography sx={{ color: '#007BF', fontStyle: 'italic' }}>Danh sách nhân viên giao hàng</Typography>
                                            </Link>
                                        </Grid>
                                        <Grid container xs={4} >
                                            <Grid container xs={6}>
                                                <Button onClick={handleClickButtonNVDieuPhoiClose} variant="outlined" sx={{ width: "82px" }}>Thoát</Button>
                                            </Grid>
                                            <Grid container xs={6}>
                                                <Button disabled={openSave} variant="contained" sx={{ width: "82px" }} onClick={() => checkAssignCarrier(maVanDon, deliverierInfTemp)}>Lưu</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>


                                </Box>
                            </Modal>
                            <Button variant="outlined" sx={{
                                borderRadius: "5px",
                                height: "40px",
                                top: "40%",
                                backgroundColor: "white",
                                borderColor: "#0088FF"
                            }}
                            > In vận đơn
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid sx={{ pt: "15px" }} >
                        <OrderProdcutDetail maVanDon={maVanDon} ></OrderProdcutDetail>
                    </Grid>
                </Grid>
            </Box>

        </React.Fragment >
    );
}
export default OrderDetail;


