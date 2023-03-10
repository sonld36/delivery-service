import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, Box, Typography, Button, Checkbox, Backdrop } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AddressToSave } from '@Common/types';
import provinceService from '@Services/province.service';
import { convertNumberToCurrency } from '@Helpers/data.optimize';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import orderService from '@Services/order.service';

type orderInfo = {
    status: string,
    id: string,
    arrayProduct: any,
    cost: number,
    ship: number,
    addressDeliver: string,
    customerName: string,
    customerPhone: string
}

function Detail() {

    const [orderInfo, setOrderInfo] = useState<orderInfo | undefined>();
    const [check, setChecked] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);

    const { id } = useParams();

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    const getOrderByIdAndShipperId = async (id: number) => {
        try {
            const resp: any = await orderService.getOrderByIdAndShipperId(id);
            if (resp && resp.data) {

                let dataAddress: AddressToSave = resp.data.customer.addresses[0];
                let addressDeliver = await getAddress(dataAddress);
                if (addressDeliver) {
                    setOpen(false);
                }
                let data = {
                    "status": resp.data.status,
                    "id": resp.data.id,
                    "arrayProduct": resp.data.products,
                    "addressDeliver": addressDeliver,
                    "cost": resp.data.paymentTotal,
                    "ship": resp.data.shipFee,
                    "customerName": resp.data.customer.name,
                    "customerPhone": resp.data.customer.phoneNumber
                }
                setOrderInfo(data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getAddress = async (data: AddressToSave) => {
        let address: string = await provinceService.getAddress(data);
        return address;
    }

    const handleChangeStatus = async () => {
        try {
            let status;
            if (orderInfo) {
                if (orderInfo.status === "PICKING_UP_GOODS") {
                    status = "BEING_TRANSPORTED"
                }
                else if (orderInfo.status === "BEING_TRANSPORTED") {
                    if (check === true) {
                        status = "REFUNDS";
                    }
                    else {
                        status = "DELIVERY_SUCCESSFUL"
                    }

                }
                else if (orderInfo.status === "DELIVERY_SUCCESSFUL") {
                    status = "DONE"
                }
                else {
                    status = "REFUNDS";
                }
                const resp: any = status && await orderService.changeStatus(orderInfo.id, status);
                if (resp && resp.code === 2000) {
                    getOrderByIdAndShipperId(Number(id));
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleRefunds = (event: any) => {
        setChecked(event.target.checked)
    }

    useEffect(() => {
        getOrderByIdAndShipperId(Number(id));
    }, []);


    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (

        <Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
        }}>
            <CssBaseline />

            <Backdrop
                sx={{
                    color: '#fff',
                    maxWidth: "420px",
                    margin: "0 auto",
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box component='div' sx={{
                position: "fixed",
                width: "414px",
                top: "0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 0px 10px 0px",
                borderBottom: "1px solid #eaeaea",
                backgroundColor: "#fffdfd",
                zIndex: "1"
            }}>
                <Box>
                    <Link to="/shipper/list-order" style={{
                        position: "absolute",
                        left: "0px",
                        top: "22px",
                        color: "#323232",
                    }}>
                        <ArrowBackIcon sx={{
                            fontSize: "22px",
                            fontWeight: "600",
                        }} />
                    </Link>
                    <Typography sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#323232",
                    }}>
                        Chi tiết đơn hàng
                    </Typography>
                </Box>

            </Box>

            {/* Content */}
            <Box sx={{
                color: "black",
                marginTop: "55px",
                marginBottom: "30px",
                padding: "5px 0px",
                backgroundColor: "#f6f7f9",
                height: "100vh",
                position: "relative"
            }}>

                {/* Thông tin người nhận */}
                <Box sx={{
                    backgroundColor: "white",
                    mb: "10px",
                    borderBottom: "1px solid #eaeaea",
                }}>
                    <ListItemButton sx={{
                        borderBottom: "1px solid #e4e2e2",
                        padding: "10px"
                    }}>
                        <ListItemIcon>
                            <AccountCircleIcon sx={{
                                color: "#8f9095"
                            }} />
                        </ListItemIcon>
                        <Typography color={"#323232"} pr={1} fontWeight={600}
                            ml={-3} fontSize={15}
                        >{orderInfo && orderInfo.customerName} -</Typography>
                        <Typography color={"#0089ff"} pr={1} fontWeight={600}
                            fontSize={15}
                        >{orderInfo && orderInfo.customerPhone}</Typography>
                    </ListItemButton>
                    <Grid container sx={{
                        padding: "10px"
                    }}>
                        <Grid item xs={12}><Typography sx={{
                            fontSize: "15px",
                            fontWeight: "600",
                            textTransform: "uppercase"
                        }}>Địa chỉ giao hàng</Typography></Grid>
                        <Grid item xs={12}><Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                        }}>{orderInfo && orderInfo.customerName} - {orderInfo && orderInfo.customerPhone}</Typography></Grid>
                        <Grid item xs={12} ><Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                        }}>{orderInfo && orderInfo.addressDeliver}</Typography></Grid>
                    </Grid>
                </Box>

                {/* Thông tin sản phẩm */}
                <Box sx={{
                    backgroundColor: "white",
                    mb: "10px",
                    borderTop: "1px solid #eaeaea",
                    borderBottom: "1px solid #eaeaea",
                }}>
                    <Grid container sx={{
                        padding: "10px"
                    }}>
                        <Grid item xs={12} pb={1}><Typography sx={{
                            fontSize: "14px",
                            fontWeight: "600",
                        }}>Sản phẩm({orderInfo?.arrayProduct.length})</Typography></Grid>

                        {orderInfo && orderInfo.arrayProduct && orderInfo.arrayProduct.length > 0 && orderInfo.arrayProduct.map((item: any, index: any) => {
                            return (
                                <Grid item xs={12} container pt={1} key={index}>
                                    <Grid item xs={2} sx={{
                                    }}>
                                        <InsertPhotoIcon sx={{
                                            color: '#929398',
                                            backgroundColor: "#f2f3f8",
                                            padding: "10px",
                                            fontSize: "50px"
                                        }} />
                                    </Grid>
                                    <Grid item xs={10} container>
                                        <Grid item xs={12} sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                            <Typography sx={{
                                                fontSize: "14px"
                                            }}>{item.product.name}</Typography>
                                            <Typography sx={{
                                                fontSize: "14px"
                                            }}>SL: {item.productQuantity}</Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Typography sx={{
                                                color: "#949496",
                                                fontSize: "14px"
                                            }}>{item.productPrice ? convertNumberToCurrency(item.productPrice) : 0}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )

                        })}

                    </Grid>
                </Box>

                {/* Giá tiền */}
                <Grid container sx={{
                    padding: "10px",
                    backgroundColor: "white",
                    mb: "10px",
                    borderTop: "1px solid #eaeaea",
                    borderBottom: "1px solid #eaeaea",
                }}>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            lineHeight: "40px"
                        }}>Tổng tiền hàng</Typography>
                        <Typography sx={{
                            fontSize: "14px"
                        }}>{orderInfo && convertNumberToCurrency(orderInfo.cost - orderInfo.ship)}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            lineHeight: "40px"
                        }}>Thuế</Typography>
                        <Typography sx={{
                            fontSize: "14px"
                        }}>0 VNĐ</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            lineHeight: "40px"
                        }}>Chiết khấu</Typography>
                        <Typography sx={{
                            fontSize: "14px"
                        }}>0 VNĐ</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            lineHeight: "40px"
                        }}>Phí giao hàng</Typography>
                        <Typography sx={{
                            fontSize: "14px"
                        }}>{orderInfo && convertNumberToCurrency(orderInfo.ship)}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            lineHeight: "40px",
                            fontWeight: "600"
                        }}>Khách hàng phải trả</Typography>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "600"
                        }}>{orderInfo && convertNumberToCurrency(orderInfo.cost)}</Typography>
                    </Grid>
                </Grid>

                {/* Chờ thu hộ COD */}
                {orderInfo && orderInfo.status !== "DELIVERY_SUCCESSFUL" && orderInfo.status !== "DONE" &&

                    <Grid container sx={{
                        // padding: "10px",
                        backgroundColor: "white",
                        mb: "10px",
                        borderTop: "1px solid #eaeaea",
                        borderBottom: "1px solid #eaeaea",
                    }}>
                        <Grid item xs={12} sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            borderBottom: "1px solid #eaeaea",
                        }} >
                            <ErrorOutlineIcon sx={{
                                marginLeft: "10px",
                                color: "#db595f"
                            }} />
                            <Typography ml={1} sx={{
                                fontSize: "15px",
                                lineHeight: "40px"
                            }}>Chưa thanh toán</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <Typography sx={{
                                fontSize: "15px",
                                lineHeight: "40px",
                                pl: "42px"
                            }}>Chờ thu hộ COD</Typography>
                            <Typography sx={{
                                fontSize: "15px",
                                pr: "10px"
                            }}>{orderInfo && convertNumberToCurrency(orderInfo.cost - orderInfo.ship)}</Typography>
                        </Grid>
                    </Grid>}

                {/* Trạng thái */}
                <Grid container sx={{
                    // padding: "10px",
                    backgroundColor: "white",
                    borderTop: "1px solid #eaeaea",
                    borderBottom: "1px solid #eaeaea",
                }}>
                    <Grid item xs={12} sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        borderBottom: "1px solid #eaeaea",
                    }} >
                        {orderInfo && orderInfo.status === "PICKING_UP_GOODS" ?
                            <>
                                <PendingActionsIcon sx={{
                                    marginLeft: "10px",
                                    color: "#cb9369"
                                }} />
                                <Typography ml={1} sx={{
                                    fontSize: "15px",
                                    lineHeight: "40px"
                                }}>Chờ lấy hàng</Typography>
                            </>
                            : orderInfo && orderInfo.status === "BEING_TRANSPORTED" ?
                                <>
                                    <LocalShippingIcon sx={{
                                        marginLeft: "10px",
                                        color: "#0089ff"
                                    }} />
                                    <Typography ml={1} sx={{
                                        fontSize: "15px",
                                        lineHeight: "40px"
                                    }}>Đang giao hàng</Typography>
                                </>
                                : orderInfo && orderInfo.status === "DELIVERY_SUCCESSFUL" ?
                                    <>
                                        <FactCheckIcon sx={{
                                            marginLeft: "10px",
                                            color: "#80be86"
                                        }} />
                                        <Typography ml={1} sx={{
                                            fontSize: "15px",
                                            lineHeight: "40px"
                                        }}>Giao hàng thành công</Typography>
                                    </>
                                    : orderInfo && orderInfo.status === "REFUNDS" ?
                                        <>
                                            <FactCheckIcon sx={{
                                                marginLeft: "10px",
                                                color: "red"
                                            }} />
                                            <Typography ml={1} sx={{
                                                fontSize: "15px",
                                                lineHeight: "40px"
                                            }}>Hoàn hàng</Typography>
                                        </>
                                        :
                                        <>
                                            <CheckCircleIcon sx={{
                                                marginLeft: "10px",
                                                color: "#80be86"
                                            }} />
                                            <Typography ml={1} sx={{
                                                fontSize: "15px",
                                                lineHeight: "40px"
                                            }}>Hoàn thành</Typography>
                                        </>
                        }
                        {/* <Typography ml={1} sx={{
                            fontSize: "15px",
                            lineHeight: "40px"
                        }}>{orderInfo && orderInfo.status}</Typography> */}
                    </Grid>
                </Grid>

                {/* Checkbox hoàn hàng */}
                {
                    orderInfo && orderInfo.status === "BEING_TRANSPORTED" &&
                    <FormGroup sx={{
                        mt: "10px",
                        pb: "120px",
                        pl: "10px",
                        backgroundColor: "white",
                    }}>
                        <FormControlLabel control={<Checkbox />} label="Hoàn hàng" onChange={handleRefunds} />
                    </FormGroup>
                }
            </Box>

            {/* button save */}
            {orderInfo && orderInfo.status !== "DONE" && orderInfo.status !== "REFUNDS" &&
                orderInfo.status !== "DELIVERY_SUCCESSFUL" &&
                <Box sx={{
                    position: "fixed",
                    bottom: "0px",
                    maxWidth: "414px",
                    overflow: "hidden",
                    width: "100%",
                    fontSize: "12px",
                    backgroundColor: "#fffdfd",
                    borderTop: "1px solid #e4e2e2",
                }}>
                    <Button variant="contained" size='medium' fullWidth onClick={handleChangeStatus}
                        sx={{
                            lineHeight: "32px",
                            margin: "20px auto",
                        }}
                    >
                        {orderInfo && orderInfo.status === "PICKING_UP_GOODS" ? "Đang giao hàng" :
                            orderInfo && orderInfo.status === "BEING_TRANSPORTED" ? check == true ? "Hoàn hàng" : "Giao hàng thành công" :
                                orderInfo && orderInfo.status === "DELIVERY_SUCCESSFUL" ? "Hoàn thành" : ""
                        }
                    </Button>
                </Box>
            }


        </Box >
    )
}
export default Detail