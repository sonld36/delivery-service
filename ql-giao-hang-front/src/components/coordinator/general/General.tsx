import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Grid, ListItem, Typography, createTheme, CardActions } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreateIcon from '@mui/icons-material/Create';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import ReportIcon from '@mui/icons-material/Report';
import ReplyIcon from '@mui/icons-material/Reply';
import Link from '@mui/material/Link';

//Import API
import getCountOrderAllStatus from '@Services/order.service';
import orderService from '@Services/order.service';

const theme = createTheme();
const heightCard = 500;

const CardStyled = styled(Card)(({ theme }) => ({
    minHeight: heightCard,
}));
const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
    padding: "5px",
    "& .MuiTypography-root": {
        display: "block",

    },
}))

const CarDetail = styled(Card)(({ theme }) => ({
    minHeight: "130px",
    "& .MuiTypography-root": {
        textAlign: 'center',
        margin: '0 auto 12px',
        height: '18px'
    },

    flexFlow: 'column',
    flexDirection: 'column',
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',

}));
const GridDetail = styled(Grid)(({ theme }) => ({

}));
const Num = styled(CardActions)(({ theme }) => ({
    color: '#007BFF',
}));

function General() {
    const [link, setLink] = useState<string>();
    const [listStatus, setListStatus] = useState(
        {
            WAITING_FOR_ACCEPT_NEW_ORDER: 0,
            REQUEST_SHIPPING: 0,
            PICKING_UP_GOODS: 0,
            BEING_TRANSPORTED: 0,
            DELIVERY_SUCCESSFUL: 0,
            REFUNDS: 0,
            DONE: 0,
        }
    );
    const getCountOrderAllStatus = async () => {
        try {
            let resp: any = await orderService.getCountOrderAllStatus();
            if (resp && resp.code === 2000) {
                setListStatus(resp.data);
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getCountOrderAllStatus();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ padding: 0, margin: 0 }} >
                < Typography sx={{ fontWeight: 'bold', mb: '15px', ml: "23px" }} variant='h6'>T??nh h??nh giao h??ng v?? ?????i so??t</Typography>
                <Box sx={{
                    ml: "17px"
                }} >
                    <CardStyled >
                        <CardHeader sx={{ paddingTop: "12px", paddingBottom: "0" }} title={
                            <Box>

                                <Typography sx={{ fontSize: "17px", fontWeight: 700, paddingLeft: "20px", color: "#686868" }}> T??NH H??NH GIAO H??NG</Typography>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600, padding: "10px", paddingLeft: "20px", color: "#686868" }}>D??? li???u ???????c t???ng h???p trong 30 ng??y g???n nh???t</Typography>
                                <Divider />
                            </Box>}
                        />
                        <CardContent>
                            <Grid container spacing={4} sx={{ padddingTop: "10px" }}>
                                <Grid xs={4} item >
                                    <CarDetail>
                                        <CreateIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>??ang ch??? x??? l?? </Typography>
                                        <Link href="" underline="none">
                                            <Num>{listStatus.WAITING_FOR_ACCEPT_NEW_ORDER} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </Grid>
                                <GridDetail item xs={4}>
                                    <CarDetail>
                                        <InventoryIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>????n y??u c???u v???n chuy???n</Typography>
                                        <Link href="#" underline="none">
                                            <Num>{listStatus.REQUEST_SHIPPING} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </GridDetail>
                                <GridDetail item xs={4}>
                                    <CarDetail>
                                        <DirectionsRunIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>??ang ??i l???y h??ng</Typography>
                                        <Link href="#" underline="none">
                                            <Num>{listStatus.PICKING_UP_GOODS} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </GridDetail>
                                <GridDetail item xs={4} >
                                    <CarDetail>
                                        <LocalShippingIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>??ang v???n chuy???n</Typography>
                                        <Link href="#" underline="none">
                                            <Num>{listStatus.BEING_TRANSPORTED} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </GridDetail>
                                <GridDetail xs={4} item >
                                    <CarDetail>
                                        <TaskAltIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>Giao th??nh c??ng</Typography>
                                        <Link href="#" underline="none">
                                            <Num>{listStatus.DELIVERY_SUCCESSFUL} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </GridDetail>
                                <GridDetail item xs={4} >
                                    <CarDetail>
                                        <ReplyIcon sx={{ display: 'flex', margin: 'auto', mb: '0', mt: '0' }} />
                                        <Typography>????n ho??n</Typography>
                                        <Link href="#" underline="none">
                                            <Num>{listStatus.REFUNDS} ????n</Num>
                                        </Link>
                                    </CarDetail>
                                </GridDetail>
                            </Grid>
                        </CardContent>


                    </CardStyled>
                </Box>

            </Box >
        </ThemeProvider >
    )
}

export default General;