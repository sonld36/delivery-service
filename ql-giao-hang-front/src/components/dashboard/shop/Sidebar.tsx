import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Groups3Icon from '@mui/icons-material/Groups3';
import HomeIcon from '@mui/icons-material/Home';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { List } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const enum key {
  ORDER = 'order',
  PROD = 'product'
}

const prefix = "";

export enum shopLink {
  CREATE_ORDER = "tao-don-hang",
  CREATE_PROD = "tao-san-pham",
  PRODUCT_LIST = 'san-pham',
  ORDER_LIST = "don-hang",
  CUSTOMER_LIST = "khach-hang",
  PROFILE = "profile",
  CONTROL_COD = "doi-soat"
}

function Sidebar() {
  const [open, setOpen] = React.useState('');
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    const id: string = event.currentTarget.id;
    setOpen(id === open ? '' : id);
  };

  return (
    <List>
      <ListItemButton onClick={() => navigate(`${prefix}`)}>
        <ListItemIcon>
          <HomeIcon sx={{ color: "#ffffff" }} />
        </ListItemIcon>
        <ListItemText primary="Tổng quan" />
      </ListItemButton>

      <Box>
        <ListItemButton onClick={handleClick} id={key.ORDER}>
          <ListItemIcon>
            <ReceiptIcon sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Đơn hàng" />
          {open === key.ORDER ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open === key.ORDER} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`${prefix}${shopLink.ORDER_LIST}`)}>
              <ListItemText primary="Danh sách đơn hàng" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`${prefix}${shopLink.CREATE_ORDER}`)}>
              <ListItemText primary="Tạo đơn hàng" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`${prefix}${shopLink.CONTROL_COD}`)}>
              <ListItemText primary="Đối soát đơn hàng COD" />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      <ListItemButton onClick={() => navigate(`${prefix}${shopLink.CUSTOMER_LIST}`)}>
        <ListItemIcon>
          <Groups3Icon sx={{ color: "#ffffff" }} />
        </ListItemIcon>
        <ListItemText primary="Khách hàng" />
      </ListItemButton>

      <Box>
        <ListItemButton onClick={handleClick} id={key.PROD}>
          <ListItemIcon>
            <MarkunreadMailboxIcon sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Sản phẩm" />
          {open === key.PROD ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open === key.PROD} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`${prefix}${shopLink.PRODUCT_LIST}`)}>
              <ListItemText primary="Danh sách sản phẩm" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`${prefix}${shopLink.CREATE_PROD}`)}>
              <ListItemText primary="Thêm sản phẩm" />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>
    </List>


  )
}

export default Sidebar;