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
            getOrderByStatusAndShipperId("PICKING_UP_GOODS")
        }
        else if (selectValue.toString() === "20") {
            getOrderByStatusAndShipperId("BEING_TRANSPORTED")
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
                        Qu???n l?? giao h??ng
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
                <TextField placeholder='Nh???p v??o t??n kh??ch h??ng...' variant="standard" fullWidth
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

                    {/* select tr???ng th??i */}
                    {searchValue === "" &&
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #eaeaea",
                        }}>
                            {/* title: t??nh tr???ng ????n h??ng */}
                            <Typography color={"#323232"} sx={{
                                padding: "10px",
                                fontSize: "16px",
                                fontWeight: "600",
                                // borderBottom: "1px solid #eaeaea",
                            }}>
                                T???t c???
                            </Typography>

                            <FormControl variant="standard" sx={{
                                width: "35%",
                                fontSize: "10px",
                                color: "#0089ff"
                            }}>
                                <InputLabel id="demo-simple-select-standard-label">Tr???ng th??i</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select"
                                    value={selectValue}
                                    label="Tr???ng th??i"
                                    onChange={handleChange}
                                    sx={{
                                        mb: "10px",
                                        fontSize: "14px",
                                        color: "#0089ff"
                                    }}
                                >
                                    <MenuItem value={1}>T???t c???</MenuItem>
                                    <MenuItem value={10}>Ch??? l???y h??ng</MenuItem>
                                    <MenuItem value={20}>??ang giao h??ng</MenuItem>
                                    <MenuItem value={30}>???? giao</MenuItem>
                                    <MenuItem value={40}>Ho??n th??nh</MenuItem>
                                    <MenuItem value={50}>Ho??n h??ng</MenuItem>
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
                            {listOrder?.length} v???n ????n
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
                                                            >????n m???i</Typography> :
                                                                data.status === "BEING_TRANSPORTED" ? <Typography
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "500",
                                                                        color: "#00bcd4",
                                                                    }}
                                                                >??ang giao h??ng</Typography> :
                                                                    data.status === "DELIVERY_SUCCESSFUL" ? <Typography
                                                                        sx={{
                                                                            fontSize: "14px",
                                                                            fontWeight: "500",
                                                                            color: "#ff9800",
                                                                        }}>Giao h??ng th??nh c??ng</Typography> :
                                                                        data.status === "DONE" ? <Typography sx={{
                                                                            fontSize: "14px",
                                                                            fontWeight: "500",
                                                                            color: "#32ca26",
                                                                        }}>Ho??n th??nh</Typography> :
                                                                            <Typography sx={{
                                                                                fontSize: "14px",
                                                                                fontWeight: "500",
                                                                                color: "#f33232",
                                                                            }}
                                                                            >Ho??n h??ng</Typography>
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