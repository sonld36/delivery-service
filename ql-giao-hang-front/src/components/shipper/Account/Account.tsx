import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@App/hook';
import { logout } from '@Features/user/userSlice';
import Menu from '../Menu/Menu';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import { Avatar } from '@Helpers/export.image';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Box, Typography, Button, TextField } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ReactApexChart from 'react-apexcharts';
import EditIcon from '@mui/icons-material/Edit';

import { useForm } from 'react-hook-form';

import { saveAvatarSchema } from '@Helpers/form.validate';
import { TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UploadImages, { defaultImageUploadState } from '@Components/UploadImages';
import { getDate7Days } from '@Helpers/data.optimize';
import { selectFile } from '@Helpers/image.handle';
import { UploadImageType, Date7Days } from '@Common/types';

import orderService from '@Services/order.service';
import accountService from '@Services/account.service';
import fileService from '@Services/file.service';

type shipperInfo = {
    avatar: string,
    name: string,
    phone: string,
}

export type AvatarSaveForm = TypeOf<typeof saveAvatarSchema>

function Account() {
    const [hideChart, setHideChart] = useState<boolean>(false);
    const [arrayDate, setArrayDate] = useState<Array<string> | undefined>();
    const [arrayRevenue, setArrayRevenue] = useState<number[] | any>();
    const [valueHorizontal, setValueHorizontal] = useState<Array<string>>();
    const [shipperInfo, setShipperInfo] = useState<shipperInfo>();
    const [pathImage, setPathImage] = useState<string>();

    const dispatch = useAppDispatch();

    const onLogoutHandler = () => {
        dispatch(logout())
    }

    const data = {
        series: [{
            name: 'Doanh thu',
            data: arrayRevenue ? [...arrayRevenue] : []
        }],
        options: {
            annotations: {
                points: [{
                    x: 'Bananas',
                    seriesIndex: 0,
                    label: {
                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        text: 'Bananas are good',
                    }
                }]
            },
            title: {
                text: 'Doanh thu',
                colors: "red !important",
                style: {
                    fontSize: '14px',
                    color: '#0089ff',
                    fontWeight: "600",
                    fontFamily: 'Roboto',
                },
            },
            chart: {
                height: 350,
                zoom: {
                    enabled: false
                }
                // type: 'bar',
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2
            },

            grid: {
                row: {
                    colors: ['#fff', '#f2f2f2']
                }
            },
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: valueHorizontal ? [...valueHorizontal] : [],
                tickPlacement: 'on'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                },
            }
        },
    };

    const getDate = () => {
        const data: Date7Days = getDate7Days();
        setArrayDate(data.array7days); // ngày để so sánh vs database VD: 2/3/2023
        setValueHorizontal(data.arrayHorizontal); // ngày để trục ngang biểu đồ VD:2/3
    }


    const getRevenue7Days = async () => {
        try {
            let array = [];
            for (let i = 0; i < 6; i++) {
                if (arrayDate) {
                    const resp: any = await orderService.getRevenueByDate(arrayDate[i], arrayDate[i + 1]);
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
                const resp: any = await orderService.getRevenueByDate(arrayDate[6], nextDate);
                if (resp) {
                    if (resp.data === null) {
                        array.push(0);
                    }
                    else {
                        array.push(resp.data)
                    }
                }
                setArrayRevenue(array)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getAccountInfo = async () => {
        try {
            const resp: any = await accountService.getAccountInfo();
            if (resp && resp.data) {
                let shipper = {
                    "avatar": resp.data.pathAvatar || Avatar,
                    "name": resp.data.name,
                    "phone": resp.data.phoneNumber,
                }
                setShipperInfo(shipper);
                loadAvatar(shipper.avatar);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const methods = useForm<AvatarSaveForm>({
        resolver: zodResolver(saveAvatarSchema),
        defaultValues: ({
            image: undefined,
            id: undefined
        })
    });

    const {
        handleSubmit,
        register
    } = methods;

    const loadAvatar = async (pathImage: string) => {
        try {
            if (data) {
                const image: BlobPart = await fileService.getAvatar(pathImage);
                const imageAfter = new File([image], pathImage);
                const imageObject: UploadImageType = selectFile(imageAfter, defaultImageUploadState);
                setPathImage(imageObject.previewImage ? imageObject.previewImage : "");
            }
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getDate();
        getRevenue7Days();
        getAccountInfo();
        if (!hideChart) {
            setHideChart(true)
        }
    }, [hideChart])

    return (

        < Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
        }
        }>
            <CssBaseline />
            <Box sx={{
                padding: "15px",
                position: "relative",
                backgroundColor: "#f6f7f9",
                height: "100%",
            }}>

                <Header />
                {/* header info: image,name,phone */}
                <Card sx={{
                    minWidth: 275,
                    mb: "50px",
                    mt: "45px"

                }} >
                    <CardContent sx={{
                        width: "100%",
                        padding: "10px 10px",
                        paddingBottom: '10px !important'
                    }}>
                        <Grid container
                            alignItems={"center"}
                            flexDirection="column"
                            justifyContent="center"
                            sx={{
                                marginBottom: "10px",
                                fontSize: "20px",
                                fontWeight: "500",
                            }}>

                            {/* Avatar */}
                            <Grid item sx={{
                                width: "60px",
                                marginBottom: "10px",
                                position: "absolute",
                                top: "138px"
                            }}>
                                <img src={shipperInfo && pathImage} alt="" style={{ borderRadius: " 50%", width: "60px", }} />
                            </Grid>

                            {/* Edit */}
                            <Grid item sx={{
                                width: "60px",
                                marginBottom: "10px",
                                position: "absolute",
                                top: "172px",
                                right: "10px",
                                cursor: "pointer",
                            }}>
                                <Link to="/shipper/update">
                                    <EditIcon sx={{
                                        fontSize: "30px",
                                        paddingLeft: "10px"
                                    }} />
                                </Link>

                            </Grid>

                            {/* Tên */}
                            <Grid item sx={{
                                fontSize: "17px",
                                fontWeight: "600",
                                pt: "30px"
                            }}>{shipperInfo && shipperInfo.name}</Grid>

                            {/* Số điện thoại */}
                            <Grid item sx={{
                                fontSize: "14px",
                                marginTop: "2px",
                                lineHeight: "15px",
                            }}>(+84){shipperInfo && shipperInfo.phone}</Grid>

                        </Grid>
                    </CardContent>
                </Card>

                {/* header thống kê */}
                <Typography mb={1} mt={3} color={"#323232"} sx={{
                    fontSize: "15px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                }}>
                    Thống kê
                </Typography>

                {/* Biểu đồ thống kê */}
                <Card sx={{
                    minWidth: 275,
                }} >
                    <CardContent sx={{
                        width: "100%",
                        padding: "10px 10px",
                        paddingBottom: '10px !important'
                    }}>
                        <Card sx={{
                            minWidth: 275,
                            // marginBottom: "80px"
                        }} >
                            <CardContent sx={{
                                width: "100%",
                                // padding: "10px 10px",
                                paddingBottom: '10px !important'
                            }}>
                                <ReactApexChart
                                    options={data.options}
                                    series={data.series}
                                    type="bar"
                                    height={350}
                                />

                                <Typography pt={1} sx={{
                                    color: "#949496",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                }}>
                                    Doanh thu bằng tổng giá trị các đơn hàng hoàn thành đã trừ trả hàng
                                </Typography>
                            </CardContent>

                        </Card>
                    </CardContent>
                </Card>

                {/* Button đăng xuất */}
                <Card sx={{
                    width: "100%",
                    mt: "50px",
                    mb: "150px"
                }} >
                    <Button fullWidth variant="outlined" onClick={onLogoutHandler}
                        sx={{
                            color: "red",
                            textTransform: "none",
                            borderColor: "white"
                        }}>Đăng xuất</Button>
                </Card>


            </Box>
            <Menu />
        </Box >
    )
}
export default Account