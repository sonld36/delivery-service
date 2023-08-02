import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Divider, List } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import BarChartIcon from '@mui/icons-material/BarChart';
import Groups3Icon from '@mui/icons-material/Groups3';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

export const orderManageLinks = {
    ALL: "tat-ca",
    REQUEST: "yeu-cau-van-chuyen",
    PICKING: "lay-hang",
    DELIVERING: "van-chuyen",
    SUCCESS: "thanh-cong",
    DONE: "hang-hoan",
}


function Sidebar() {
    const navigate = useNavigate();


    return (
        <List>
            <ListItemButton onClick={() => navigate("/dieu-phoi")}>
                <ListItemIcon>
                    <HomeIcon sx={{ color: "#ffffff" }} />
                </ListItemIcon>
                <ListItemText primary="Tổng quan" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/dieu-phoi/quan-ly-don-hang/tat-ca?page=1")}>
                <ListItemIcon>
                    <ReceiptIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý đơn hàng" />
            </ListItemButton>


            <ListItemButton onClick={() => navigate("/dieu-phoi/quan-ly-nv-giao-hang")}>
                <ListItemIcon>
                    <Groups3Icon sx={{ color: "#ffffff" }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý NV giao hàng" />
            </ListItemButton>


            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon sx={{ color: "#ffffff" }} />
                </ListItemIcon>
                <ListItemText primary="Báo cáo" />
            </ListItemButton>
            <Divider sx={{ bgcolor: '#fff' }} />

            <ListItemButton>
                <ListItemIcon>
                    <SettingsIcon sx={{ color: "#ffffff" }} />
                </ListItemIcon>
                <ListItemText primary="Cấu hình" />
            </ListItemButton>
        </List>


    )
}

export default Sidebar;