import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Typography, createTheme, Tabs, Tab, FormControl, TextField, InputAdornment, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState } from 'react';
import OrderListResults from '../component/OrderListResults';



const theme = createTheme();


const CardStyled = styled(Card)(({ theme }) => ({
}));

interface LinkTabProps {
    label?: string;
    href?: string;
}
function TabDetail(props: LinkTabProps) {
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
            }}
            sx={{
                textTransform: 'none',
                '&:hover': {
                    color: '#40a9ff',
                    opacity: 1,
                },
            }}
            {...props}
        />
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    href?: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}




function Quanlydonhang() {
    const [valueSlide, setValueSlide] = React.useState(1);
    const [valueInputSearch, setValueInputSearch] = useState("");

    const [showClearIcon, setShowClearIcon] = useState("none");

    const handleChangeValueSlide = (event: React.SyntheticEvent, newValue: number) => {
        setValueSlide(newValue);
    };

    const handleChangeInputSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setShowClearIcon(event.target.value === "" ? "none" : "flex");
        setValueInputSearch(event.target.value);
    };

    const handleClickSearchBar = (): void => {
        setValueInputSearch("");
        setShowClearIcon("none");
    };
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', backgroundColor: 'white', width: '1588px' }}  >

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={valueSlide} onChange={handleChangeValueSlide} >
                            <TabDetail label="Tất cả các đơn" />
                            <TabDetail label="Hàng chờ" />
                            <TabDetail label="Yêu cầu vận chuyển" />
                            <TabDetail label="Đang lấy hàng" />
                            <TabDetail label="Đang vận chuyển" />
                            <TabDetail label="Giao thành công" />
                            <TabDetail label="Hàng hoàn" />
                        </Tabs >
                    </Box>
                    <Box sx={{ mt: '16px' }}>
                        <FormControl>
                            <TextField
                                placeholder='Tìm kiếm theo mã vận đơn, tên, SĐT người nhận, NV giao hàng, SĐT nhân viên giao hàng '
                                size="small"
                                variant="outlined"
                                onChange={handleChangeInputSearch}
                                sx={{

                                    minWidth: "50px", width: '830px'
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            style={{ display: showClearIcon, cursor: 'pointer', }}
                                            onClick={handleClickSearchBar}
                                        >
                                            <ClearIcon />
                                        </InputAdornment>
                                    )
                                }}
                                value={valueInputSearch}
                            />
                        </FormControl>

                    </Box>
                    <TabPanel value={valueSlide} index={0} >
                        <OrderListResults status="all" />

                    </TabPanel>
                    <TabPanel value={valueSlide} index={1}>
                        <OrderListResults status="WAITING_FOR_ACCEPT_NEW_ORDER" />
                    </TabPanel>
                    <TabPanel value={valueSlide} index={2}>
                        <OrderListResults status="REQUEST_SHIPPING" />
                    </TabPanel>
                    <TabPanel value={valueSlide} index={3}>
                        <OrderListResults status="PICKING_UP_GOODS" />
                    </TabPanel>
                    <TabPanel value={valueSlide} index={4}>
                        <OrderListResults status="BEING_TRANSPORTED" />
                    </TabPanel>
                    <TabPanel value={valueSlide} index={5}>
                        <OrderListResults status="DELIVERY_SUCCESSFUL" />
                    </TabPanel>
                    <TabPanel value={valueSlide} index={6}>
                        <OrderListResults status="REFUNDS" />
                    </TabPanel>
                </Box>
            </Box >
        </ThemeProvider >
    )
}

export default Quanlydonhang;