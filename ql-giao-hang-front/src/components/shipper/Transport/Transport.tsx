import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaymentsIcon from '@mui/icons-material/Payments';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReactApexChart from 'react-apexcharts';
import { convertNumberToCurrency } from '@Helpers/data.optimize';


import orderService from '@Services/order.service';

type countOrder = {
    status: string,
    number: number
}[]

function Transport() {
    const [countOrder, setCountOrder] = useState<countOrder | undefined>();
    const [recieveCOD, setRecieveCOD] = useState<number>();
    const [paidCOD, setPaidCOD] = useState<number>();
    const [recieveShipFee, setRecieveShipFee] = useState<number>();
    const [paidShipFee, setPaidShipFee] = useState<number>();

    const [hideChart, setHideChart] = useState<boolean>(false);
    const [arrayDate, setArrayDate] = useState<Array<string> | undefined>();
    const [valueHorizontal, setValueHorizontal] = useState<Array<string>>();
    const [arrayCountOrder, setArrayCountOrder] = useState<number[] | any>();

    const data = {
        options: {
            chart: {
                id: 'apexchart-example',
                height: 350,
                fontSize: '20px',
                color: "red",
                zoom: {
                    enabled: false
                }
            },
            title: {
                text: 'Số đơn hoàn thành',
                colors: "red !important",
                style: {
                    fontSize: '14px',
                    color: '#0089ff',
                    fontWeight: "600",
                    fontFamily: 'Roboto',
                },
            },
            stroke: {
                show: true,
                colors: undefined,
                width: 2,
                dashArray: 0,
            },
            xaxis: {
                categories: valueHorizontal ? [...valueHorizontal] : [],
            }
        },
        series: [{
            name: 'Số đơn',
            data: arrayCountOrder ? [...arrayCountOrder] : []
        }]
    };

    const getDate7Days = () => {
        // const sevenDaysAgo: Date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        // console.log("day/month/year:", sevenDaysAgo.toLocaleDateString("vi-VN"))

        var date = new Date();
        var finalDate;
        var horizontalDate;
        let array = [];
        let arrayHorizontal = [];
        for (let i = 6; i >= 0; i--) {
            date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            finalDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            horizontalDate = date.getDate() + "/" + (date.getMonth() + 1);
            array.push(finalDate)
            arrayHorizontal.push(horizontalDate)
        }
        setArrayDate(array);
        setValueHorizontal(arrayHorizontal);
    }

    const getCountOrder7Days = async () => {
        try {
            let array = [];
            for (let i = 0; i < 6; i++) {
                if (arrayDate) {
                    const resp: any = await orderService.countOrderDoneByDate(arrayDate[i], arrayDate[i + 1]);
                    if (resp) {
                        if (resp.data === null) {
                            array.push(0);
                        }
                        else {
                            array.push(resp.data)
                        }
                    }
                }
            }

            // get current date
            var date = new Date();
            date.setDate(date.getDate() + 1);
            var nextDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            if (arrayDate) {
                const resp: any = await orderService.countOrderDoneByDate(arrayDate[6], nextDate);
                if (resp) {
                    if (resp.data === null) {
                        array.push(0);
                    }
                    else {
                        array.push(resp.data)
                    }
                }
                setArrayCountOrder(array)
            }
        } catch (e) {
            console.log(e)
        }
    }

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

    const statisticCODByStatus = async () => {
        try {
            const respRecieve: any = await orderService.statisticCODByStatus("DELIVERY_SUCCESSFUL");
            if (respRecieve && respRecieve.data) {
                setRecieveCOD(respRecieve.data)
            }
            const respPaid: any = await orderService.statisticCODByStatus("DONE");
            if (respPaid && respPaid.data) {
                setPaidCOD(respPaid.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const statisticShipFeeByStatus = async () => {
        try {
            const respRecieve: any = await orderService.statisticShipFeeByStatus("DELIVERY_SUCCESSFUL");
            if (respRecieve && respRecieve.data) {
                setRecieveShipFee(respRecieve.data)
            }
            const respPaid: any = await orderService.statisticShipFeeByStatus("DONE");
            if (respPaid && respPaid.data) {
                setPaidShipFee(respPaid.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        countOrderByStatus();
        getDate7Days();
        statisticCODByStatus();
        statisticShipFeeByStatus();
        getCountOrder7Days();
        if (!hideChart) {
            setHideChart(true)
        }
    }, [hideChart]);

    return (
        <Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
            textDecoration: "none",
            backgroundColor: "#fff",
        }}>
            <CssBaseline />
            {/* header */}
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
                    <Link to="/shipper" style={{
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
                        Tổng quan
                    </Typography>
                </Box>

            </Box>

            {/* Content */}
            <Box sx={{
                padding: "10px",
                marginTop: "30px",
                position: "relative",
            }}>
                {/* container */}
                <Box sx={{
                    padding: "10px",
                    backgroundColor: "#fbfbfb",
                    marginTop: "50px"
                }}>
                    {/* title: tình trạng đơn hàng */}
                    <Typography mb={1} color={"#323232"} sx={{
                        fontSize: "15px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                    }}>
                        Tình trạng đơn hàng
                    </Typography>

                    {/* content: tình trạng đơn hàng */}
                    <Card sx={{
                        minWidth: 275,
                    }} >
                        <CardContent sx={{
                            width: "100%",
                            padding: "10px 10px",
                            paddingBottom: '10px !important'
                        }}>
                            <Grid container>
                                <Grid item xs={4} padding={1} sx={{
                                }}>
                                    <Link to={"/shipper/list-order"} style={{
                                        textDecoration: "none",
                                    }}>
                                        <Card sx={{
                                        }} >
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "15px 10px 15px 10px !important"
                                            }}>
                                                <PendingActionsIcon sx={{
                                                    color: "#0089ff"
                                                }} />
                                                <Typography sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                }} >{countOrder && countOrder[0].status === "PICKING_UP_GOODS" ? countOrder[0].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}>Chờ lấy hàng</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>



                                </Grid>
                                <Grid item xs={4} padding={1} sx={{
                                }}>
                                    <Link to={"/shipper/list-order"} style={{
                                        textDecoration: "none",
                                        // color: "#323232",
                                    }}>
                                        <Card sx={{
                                        }} >
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "15px 10px 15px 10px !important"
                                            }}>
                                                <LocalShippingIcon sx={{
                                                    color: "#0089ff"
                                                }} />
                                                <Typography sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                }} >{countOrder && countOrder[1].status === "BEING_TRANSPORTED" ? countOrder[1].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}>Đang giao hàng</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                                <Grid item xs={4} padding={1} sx={{
                                }}>
                                    <Link to={"/shipper/list-order"} style={{
                                        textDecoration: "none",
                                    }}>
                                        <Card sx={{
                                        }} >
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "15px 10px 15px 10px !important"
                                            }}>
                                                <FactCheckIcon sx={{
                                                    color: "#0089ff"
                                                }} />
                                                <Typography sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                }} >{countOrder && countOrder[2].status === "DELIVERY_SUCCESSFUL" ? countOrder[2].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}>Đã giao</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                                <Grid item xs={4} padding={1} sx={{
                                }}>
                                    <Link to={"/shipper/list-order"} style={{
                                        textDecoration: "none",
                                    }}>
                                        <Card sx={{
                                        }} >
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "15px 10px 15px 10px !important"
                                            }}>
                                                <CheckCircleIcon sx={{
                                                    color: "#0089ff"
                                                }} />
                                                <Typography sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                }} >{countOrder && countOrder[4].status === "DONE" ? countOrder[4].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}>Hoàn thành</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                                <Grid item xs={4} padding={1} sx={{
                                }}>
                                    <Link to={"/shipper/list-order"} style={{
                                        textDecoration: "none",
                                    }}>
                                        <Card sx={{
                                        }} >
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "15px 10px 15px 10px !important"
                                            }}>
                                                <AssignmentReturnIcon sx={{
                                                    color: "#0089ff"
                                                }} />
                                                <Typography sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                }} >{countOrder && countOrder[3].status === "REFUNDS" ? countOrder[3].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}>Hoàn hàng</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                                {/* <Typography pt={1} sx={{
                                    color: "#949496",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                }}>
                                    *Dữ liệu được cập nhật theo 7 ngày gần nhất
                                </Typography> */}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* title: thu hộ COD */}
                    <Typography mb={1} mt={3} color={"#323232"} sx={{
                        fontSize: "15px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                    }}>
                        Thu hộ COD
                    </Typography>

                    {/* content: thu hộ COD */}
                    <Card sx={{
                        minWidth: 275,
                    }} >
                        <CardContent sx={{
                            width: "100%",
                            padding: "10px 10px",
                            paddingBottom: '10px !important'
                        }}>
                            <Grid container>
                                {/* <Grid item xs={12} sx={{
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px 10px 15px 10px !important"
                                    }}>
                                        <PaymentsIcon sx={{
                                            padding: "10px",
                                            backgroundColor: "#ddf3ff",
                                            color: "#0094d5",
                                            fontSize: "40px",
                                            borderRadius: "5px"
                                        }} />
                                        <Grid container ml={1.5} pb={1} sx={{
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
                                                    fontWeight: "600",
                                                }}>Đang thu hộ</Typography>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                }}>{recieveCOD && paidCOD && recieveCOD + paidCOD} đ</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Vận đơn: {countOrder && countOrder[4].status === "DONE" &&
                                                    countOrder && countOrder[2].status === "DELIVERY_SUCCESSFUL" ? countOrder[4].number + countOrder[2].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Tổng phí: {recieveShipFee && paidShipFee && recieveShipFee + paidShipFee} đ</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid> */}

                                <Grid item xs={12} sx={{
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px 10px 15px 10px !important"
                                    }}>
                                        <HourglassBottomIcon sx={{
                                            padding: "10px",
                                            backgroundColor: "#ffeef4",
                                            color: "#e76a92",
                                            fontSize: "40px",
                                            borderRadius: "5px"
                                        }} />
                                        <Grid container ml={1.5} pb={1} sx={{
                                            borderBottom: "1px solid #eaeaea",
                                        }} >
                                            <Grid item xs={12} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                }}>Chờ đối soát</Typography>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                }}>{recieveCOD ? convertNumberToCurrency(recieveCOD) : 0}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Vận đơn: {countOrder && countOrder[2].status === "DELIVERY_SUCCESSFUL" ? countOrder[2].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Tổng phí: {recieveShipFee ? convertNumberToCurrency(recieveShipFee) : 0} </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sx={{
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px 10px 15px 10px !important"
                                    }}>
                                        <PaidIcon sx={{
                                            padding: "10px",
                                            backgroundColor: "#f8eef9",
                                            color: "#6a4976",
                                            fontSize: "40px",
                                            borderRadius: "5px"
                                        }} />
                                        <Grid container ml={1.5}>
                                            <Grid item xs={12} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                }}>Đã đối soát</Typography>
                                                <Typography sx={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                }}>{paidCOD ? convertNumberToCurrency(paidCOD) : 0}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Vận đơn: {countOrder && countOrder[4].status === "DONE" ? countOrder[4].number : ''}</Typography>
                                                <Typography sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    color: "#949496",
                                                }}>Tổng phí: {paidShipFee ? convertNumberToCurrency(paidShipFee) : 0} </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* <Typography pt={1} sx={{
                                    color: "#949496",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                }}>
                                    *Dữ liệu được cập nhật theo 7 ngày gần nhất
                                </Typography> */}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* title: chỉ số vận chuyển */}
                    <Typography mb={1} mt={3} color={"#323232"} sx={{
                        fontSize: "15px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                    }}>
                        Chỉ số vận chuyển
                    </Typography>

                    {/*Biểu đồ Thống kê */}
                    <Card sx={{
                        minWidth: 275,
                        marginBottom: "80px"
                    }} >
                        <CardContent sx={{
                            width: "100%",
                            // padding: "10px 10px",
                            paddingBottom: '10px !important'
                        }}>
                            <ReactApexChart
                                options={data.options}
                                series={data.series}
                                type="line"
                                height={350}
                            />
                        </CardContent>
                    </Card>


                </Box>
            </Box>

            <Menu />

        </Box>
    )
}
export default Transport;