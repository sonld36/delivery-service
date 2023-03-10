import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Badge } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function Menu() {
    const [notify, setNotify] = useState<number>(6);
    return (
        <Box component='div'
            sx={{
                position: "fixed",
                bottom: "0px",
                maxWidth: "414px",
                overflow: "hidden",
                width: "100%",
                fontSize: "12px",
                backgroundColor: "#fffdfd",
                borderTop: "1px solid #e4e2e2",
            }}
        >
            <CssBaseline />
            <Box component='div' sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
            }}>

                <Link className="menu__item" to="/shipper" style={{ textDecoration: "none" }}>
                    <Box sx={{
                        color: "#686870 !important",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "12px",
                    }}>
                        <HomeIcon sx={{ fontSize: "28px" }} />
                        <Typography sx={{
                            lineHeight: "28px",
                            fontSize: " 12px",
                        }}>Trang chủ</Typography>
                    </Box>

                </Link>
                <Link className="menu__item" to="/shipper/transport" style={{ textDecoration: "none" }}>
                    <Box sx={{
                        color: "#686870 !important",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "12px",
                    }}>
                        <LocalShippingIcon sx={{ fontSize: "28px" }} />
                        <Typography sx={{
                            lineHeight: "28px",
                            fontSize: " 12px",
                        }}>Vận chuyển</Typography>
                    </Box>

                </Link>
                <Link className="menu__item" to="/shipper/account" style={{ textDecoration: "none" }}>
                    <Box sx={{
                        color: "#686870 !important",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "12px",
                    }}>
                        <PersonIcon sx={{ fontSize: "28px" }} />
                        <Typography sx={{
                            lineHeight: "28px",
                            fontSize: " 12px",
                        }}>Tài khoản</Typography>
                    </Box>

                </Link>
            </Box>
        </Box>
    )
}
export default Menu