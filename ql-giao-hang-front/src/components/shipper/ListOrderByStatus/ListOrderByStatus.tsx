import { Box, Grid, TextField, Typography } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { debounce } from "lodash";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import orderService from '@Services/order.service';

type listOrder = {
    status: string,
    id: string,
    addressRecieve: string,
    addressDeliver: string,
    cost: number,
    ship: number,
    createdAt: string
}[]


function ListOrderByStatus() {

    const [listOrder, setListOrder] = useState<listOrder>();
    const [input, setInput] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [hideContent, setHideContent] = useState<boolean>(false);
    const [selectValue, setSelectValue] = useState<string>('');

    const debouncedSearch = useRef(
        debounce(async (value: any) => {
            setSearchValue(value);
            await getOrderByCustomerNameAndShipperId(value)
            if (value === '') {
                await getAllOrderByShipperId();
            }
        }, 300)
    ).current;

    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
        debouncedSearch(e.target.value)
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSelectValue(event.target.value as string);
    };

    const getAllOrderByShipperId = async () => {
        const resp: any = await orderService.getAllOrderByShipperId();
        let data = resp.data.map((item: any, index: any) => {
            const day = new Date(item.createdAt);
            let createdAt = day.toLocaleDateString("vi-VN");
            return {
                "status": item.status,
                "id": item.id,
                "addressRecieve": "string",
                "addressDeliver": "string",
                "cost": item.paymentTotal,
                "ship": item.shipFee,
                "createdAt": createdAt
            }
        })
        setListOrder([
            ...data,
        ])
        return data;
    }

    const getOrderByStatusAndShipperId = async (status: String) => {
        const resp: any = await orderService.getOrderByStatusAndShipperId(status);
        let data = resp.data.map((item: any, index: any) => {
            const day = new Date(item.createdAt);
            let createdAt = day.toLocaleDateString("vi-VN");
            return {
                "status": item.status,
                "id": item.id,
                "addressRecieve": "string",
                "addressDeliver": "string",
                "cost": item.paymentTotal,
                "ship": item.shipFee,
                "createdAt": createdAt
            }
        })
        setListOrder([
            ...data,
        ])
        return data;
    }

    const getOrderByCustomerNameAndShipperId = async (name: String) => {
        try {
            const resp: any = await orderService.getOrderByCustomerNameAndShipperId(name);
            if (resp && resp.data && resp.data.length > 0) {
                let data = resp.data.map((item: any, index: any) => {
                    const day = new Date(item.createdAt);
                    let createdAt = day.toLocaleDateString("vi-VN");
                    return {
                        "status": item.status,
                        "id": item.id,
                        "addressRecieve": "string",
                        "addressDeliver": "string",
                        "cost": item.paymentTotal,
                        "ship": item.shipFee,
                        "createdAt": createdAt
                    }
                })
                setListOrder([
                    ...data,
                ])
                return data;
            }
            else {
                setListOrder([])
            }
        } catch (error: any) {
            console.log('loi cm rofoi')
        }
    }


    useEffect(() => {
        getAllOrderByShipperId();
    }, []);

    useEffect(() => {
        if (selectValue.toString() === "1") {
            getAllOrderByShipperId();
        }
        else if (selectValue.toString() === "10") {
            getOrderByStatusAndShipperId("REQUEST_SHIPPING")
        }
        else if (selectValue.toString() === "20") {
            getOrderByStatusAndShipperId("PICKING_UP_GOODS")
        }
        else if (selectValue.toString() === "30") {
            getOrderByStatusAndShipperId("DELIVERY_SUCCESSFUL")
        }
        else if (selectValue.toString() === "40") {
            getOrderByStatusAndShipperId("DONE")
        }
        else if (selectValue.toString() === "50") {
            getOrderByStatusAndShipperId("REFUNDS")
        }
    }, [selectValue]);

    return (

        <Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
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
                backgroundColor: "#fffdfd",
                zIndex: "1"
            }}>
                <Box>
                    <Link to="/shipper/transport" style={{
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
                        fontSize: "22px",
                        fontWeight: "600",
                        color: "#323232",
                    }}>
                        Quản lý giao hàng
                    </Typography>
                </Box>

            </Box>


            {/* search */}
            <Box sx={{
                display: 'flex', alignItems: 'flex-end',
                justifyContent: "space-between",
                color: "black",
                marginTop: "80px",
                marginBottom: "30px",
                padding: "0 5px",
                borderRadius: "20px",
            }}>
                <SearchIcon sx={{
                    color: 'action.active', mr: 1, mb: 0.5,
                    margin: "auto 5px",
                    fontSize: "18px"
                }} />
                <TextField placeholder='Nhập vào tên khách hàng...' variant="standard" fullWidth
                    InputProps={{
                        style: {
                            fontSize: "16px",
                            borderBottom: "1px solid #f6f7f9 !important"
                        }
                    }}
                    value={input}
                    onChange={handleOnChangeInput}
                    sx={{
                        borderBottom: "1px solid #f6f7f9 !important",
                    }}
                />
            </Box>

            {!hideContent &&
                <Box sx={{
                    // padding: "10px",
                    marginTop: "30px",
                    position: "relative",
                }}>

                    {/* select trạng thái */}
                    {searchValue === "" &&
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #eaeaea",
                        }}>
                            {/* title: tình trạng đơn hàng */}
                            <Typography color={"#323232"} sx={{
                                padding: "10px",
                                fontSize: "16px",
                                fontWeight: "600",
                                // borderBottom: "1px solid #eaeaea",
                            }}>
                                Tất cả
                            </Typography>

                            <FormControl variant="standard" sx={{
                                width: "35%",
                                fontSize: "10px",
                                color: "#0089ff"
                            }}>
                                <InputLabel id="demo-simple-select-standard-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select"
                                    value={selectValue}
                                    label="Trạng thái"
                                    onChange={handleChange}
                                    sx={{
                                        mb: "10px",
                                        fontSize: "14px",
                                        color: "#0089ff"
                                    }}
                                >
                                    <MenuItem value={1}>Tất cả</MenuItem>
                                    <MenuItem value={10}>Chờ lấy hàng</MenuItem>
                                    <MenuItem value={20}>Đang giao hàng</MenuItem>
                                    <MenuItem value={30}>Đã giao</MenuItem>
                                    <MenuItem value={40}>Hoàn thành</MenuItem>
                                    <MenuItem value={50}>Hoàn hàng</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    }


                    {/* content */}
                    <Box sx={{
                        backgroundColor: "#f6f7f9",
                        height: "100vh"
                    }}>
                        <Typography color={"#949496"} sx={{
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "400",
                        }}>
                            {listOrder?.length} vận đơn
                        </Typography>
                        <Grid container>
                            {listOrder && listOrder.length > 0 && listOrder.map((data, index) => {
                                return (
                                    <Grid item xs={12} mb={0.2} sx={{
                                        backgroundColor: "#ffffff"
                                    }} key={index}>
                                        <Link to={"/shipper/detail/" + data.id} style={{
                                            textDecoration: "none",
                                            color: "black"
                                        }}>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 10px 10px 0px !important"
                                            }}>
                                                <Grid container ml={1.5} >
                                                    <Grid item xs={12} sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                        }}>{data.id}</Typography>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                        }}>COD: {data.cost}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            color: "#949496",
                                                        }}>{data.createdAt ? data.createdAt : "12:04"}</Typography>
                                                        {
                                                            data.status === "PICKING_UP_GOODS" ? <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "500",
                                                                    color: "#2196f3",
                                                                }}
                                                            >Đơn mới</Typography> :
                                                                data.status === "BEING_TRANSPORTED" ? <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "500",
                                                                        color: "#00bcd4",
                                                                    }}
                                                                >Đang giao hàng</Typography> :
                                                                    data.status === "DELIVERY_SUCCESSFUL" ? <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontWeight: "500",
                                                                            color: "#ff9800",
                                                                        }}>Giao hàng thành công</Typography> :
                                                                        data.status === "DONE" ? <Typography sx={{
                                                                            fontSize: "14px",
                                                                            fontWeight: "500",
                                                                            color: "#32ca26",
                                                                        }}>Hoàn thành</Typography> :
                                                                            <Typography sx={{
                                                                                fontSize: "14px",
                                                                                fontWeight: "500",
                                                                                color: "#f33232",
                                                                            }}
                                                                            >Hoàn hàng</Typography>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Link>
                                    </Grid>
                                )

                            })}
                        </Grid>
                    </Box>
                </Box>
            }

            <Menu />
        </Box >
    )
}
export default ListOrderByStatus