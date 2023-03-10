import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Divider, List } from '@mui/material';
import { Box } from '@mui/system';
import ReceiptIcon from '@mui/icons-material/Receipt';

import Groups3Icon from '@mui/icons-material/Groups3';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';



function Sidebar() {
    const [open, setOpen] = React.useState('');
    const navigate = useNavigate();



    return (
        <List>
            <ListItemButton href='/dieu-phoi'>
                <ListItemIcon>
                    <HomeIcon sx={{ color: "#ffffff" }} />
                </ListItemIcon>
                <ListItemText primary="Tổng quan" />
            </ListItemButton>

            <ListItemButton href='/dieu-phoi/quan-ly-don-hang' >
                <ListItemIcon>
                    <ReceiptIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý đơn hàng" />
            </ListItemButton>


            <ListItemButton href='/dieu-phoi/quan-ly-nv-giao-hang'>
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