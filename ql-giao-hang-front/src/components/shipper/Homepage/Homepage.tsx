import { useState, useEffect } from 'react';
import Menu from '../Menu/Menu';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { convertNumberToCurrency } from '@Helpers/data.optimize';

import CssBaseline from '@mui/material/CssBaseline';
import { Grid } from '@mui/material';
import { Box, TextField, Typography, Button } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import orderService from '@Services/order.service';

type countOrder = {
    status: string,
    number: number
}[]

function Homepage() {
    const [openStatus, setopenStatus] = useState<string>('');
    const [countOrder, setCountOrder] = useState<countOrder | undefined>();
    const [revenue, setRevenue] = useState<number>();

    const countOrderByStatus = async () => {
        try {
            const resp: any = await orderService.countOrderByStatus();
            if (resp && resp.data && resp.data.length > 0) {
                setCountOrder(resp.data)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const getRevenueToday = async () => {
        try {
            const resp: any = await orderService.getRevenueToday();
            if (resp && resp.data) {
                setRevenue(resp.data)
            }
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        countOrderByStatus();
        getRevenueToday();
    }, []);



    return (

        <Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
            textDecoration: "none",
            backgroundColor: "#fff",
        }}>
            <CssBaseline />

            {/* Header logo */}
            <Header />

            {/* Content */}
            <Box p={3}>
                <Card sx={{
                    minWidth: 275,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start"
                }} >
                    <CardContent sx={{
                        width: "100%",
                        padding: "1px",
                        paddingBottom: '10px !important'
                    }}>
                        {/* Doanh thu title */}
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between !important",
                            padding: "10px 15px 0px 15px"
                        }}>
                            <Typography color={'#949496'} sx={{
                                fontSize: "12px",
                                textTransform: "uppercase"
                            }}>
                                Doanh thu ngày
                            </Typography>
                            <Box color={'#0089ff'} sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography pr={1} fontSize={14} sx={{
                                }}>
                                    <Link to={"/shipper/account"} style={{
                                        textDecoration: "none",
                                        color: "#0089ff"
                                    }}>
                                        Xem chi tiết
                                    </Link>

                                </Typography>
                                <ChevronRightIcon sx={{
                                    fontSize: "20px"
                                }} />
                            </Box>
                        </Box>

                        {/* Số tiền */}
                        <Typography color={"#323232"} fontSize={19} fontWeight={700} sx={{
                            // mb: 1.5,
                            borderBottom: "1px solid #e4e2e2",
                            padding: "0px 15px 10px 15px"
                        }}>
                            {revenue ? convertNumberToCurrency(revenue) : 0}
                        </Typography>

                        {/* Số đơn hàng mỗi loại */}
                        <Grid container sx={{ padding: "10px 15px 0px 15px" }}>
                            <Grid item xs={4} sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography color={'#949496'} sx={{ fontSize: "13px" }}>
                                    Đơn hàng mới
                                </Typography>
                                <Typography fontSize={18} fontWeight={600}>{countOrder && countOrder[0].status === "PICKING_UP_GOODS" ? countOrder[0].number : ''}</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography color={'#949496'} sx={{ fontSize: "13px" }}>
                                    Đơn hủy
                                </Typography>
                                <Typography fontSize={18} fontWeight={600}>0</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography color={'#949496'} sx={{ fontSize: "13px" }}>
                                    Đơn trả hàng
                                </Typography>
                                <Typography fontSize={18} fontWeight={600}>{countOrder && countOrder[3].status === "REFUNDS" ? countOrder[3].number : ''}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Typography mt={6} mb={2} color={"#323232"} sx={{
                    fontSize: "20px",
                    fontWeight: "600"
                }}>
                    Đơn hàng chờ xử lý
                </Typography>
                <Card sx={{
                    minWidth: 275,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start"
                }} >
                    <CardContent sx={{
                        width: "100%",
                        padding: "1px 10px",
                        paddingBottom: '5px !important'
                    }}>
                        <Link to={"/shipper/list-order"} style={{
                            textDecoration: "none",
                            color: "#323232",
                        }}>
                            <ListItemButton sx={{
                                borderBottom: "1px solid #e4e2e2",
                            }}>
                                <ListItemIcon>
                                    <WatchLaterIcon sx={{
                                        color: "#0089ff"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Chờ lấy hàng" sx={{
                                    marginLeft: "-20px",
                                }} />
                                <Typography color={"#323232"} pr={1} fontWeight={600}>{countOrder && countOrder[0].status === "PICKING_UP_GOODS" ? countOrder[0].number : ''}</Typography>
                                <ChevronRightIcon sx={{
                                    color: "#949496"
                                }} />
                            </ListItemButton>
                        </Link>
                        <Link to={"/shipper/list-order"} style={{
                            textDecoration: "none",
                            color: "#323232"
                        }}>
                            <ListItemButton sx={{
                                borderBottom: "1px solid #e4e2e2",
                            }}>
                                <ListItemIcon>
                                    <LocalShippingIcon sx={{
                                        color: "#0089ff"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Đang giao hàng" sx={{ marginLeft: "-20px" }} />
                                <Typography color={"#323232"} pr={1} fontWeight={600}>{countOrder && countOrder[1].status === "BEING_TRANSPORTED" ? countOrder[1].number : ''}</Typography>
                                <ChevronRightIcon sx={{
                                    color: "#949496"
                                }} />
                            </ListItemButton>
                        </Link>
                        <Link to={"/shipper/list-order"} style={{
                            textDecoration: "none",
                            color: "#323232"
                        }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FactCheckIcon sx={{
                                        color: "#0089ff"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Giao hàng thàng công" sx={{ marginLeft: "-20px" }} />
                                <Typography color={"#323232"} pr={1} fontWeight={600}>{countOrder && countOrder[2].status === "DELIVERY_SUCCESSFUL" ? countOrder[2].number : ''}</Typography>
                                <ChevronRightIcon sx={{
                                    color: "#949496"
                                }} />
                            </ListItemButton>
                        </Link>
                        <Link to={"/shipper/list-order"} style={{
                            textDecoration: "none",
                            color: "#323232"
                        }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <CheckCircleIcon sx={{
                                        color: "#0089ff"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Hoàn thành" sx={{ marginLeft: "-20px" }} />
                                <Typography color={"#323232"} pr={1} fontWeight={600}>{countOrder && countOrder[4].status === "DONE" ? countOrder[4].number : 0}</Typography>
                                <ChevronRightIcon sx={{
                                    color: "#949496"
                                }} />
                            </ListItemButton>
                        </Link>
                        <Link to={"/shipper/list-order"} style={{
                            textDecoration: "none",
                            color: "#323232"
                        }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AssignmentReturnIcon sx={{
                                        color: "#0089ff"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Hoàn hàng" sx={{ marginLeft: "-20px" }} />
                                <Typography color={"#323232"} pr={1} fontWeight={600}>{countOrder && countOrder[3].status === "REFUNDS" ? countOrder[3].number : ''}</Typography>
                                <ChevronRightIcon sx={{
                                    color: "#949496"
                                }} />
                            </ListItemButton>
                        </Link>
                    </CardContent>
                </Card>
            </Box>

            {/* Menu */}
            < Menu />
        </Box >


    )
}

export default Homepage;