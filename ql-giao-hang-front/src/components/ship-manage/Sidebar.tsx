import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';
import Groups3Icon from '@mui/icons-material/Groups3';
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
  PROD = 'product',
  CUS = 'customer',
  STAFF = 'staff',
  INVENTORY = "inventory"
}

const prefix = "";

function Sidebar() {
  const [open, setOpen] = React.useState('');
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    const id: string = event.currentTarget.id;
    setOpen(id === open ? '' : id);
  };

  return (
    <List>
      <Box>
        <ListItemButton onClick={handleClick} id={key.CUS}>
          <ListItemIcon>
            <Groups3Icon sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Khách hàng" />
          {open === key.CUS ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open === key.CUS} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("danh-sach-khach-hang?page=1")}>
              <ListItemText primary="Danh sách khách hàng" />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      <Box>
        <ListItemButton onClick={handleClick} id={key.STAFF}>
          <ListItemIcon>
            <GroupIcon sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Nhân viên" />
          {open === key.STAFF ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open === key.STAFF} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("danh-sach-nhan-vien")}>
              <ListItemText primary="Danh sách nhân viên" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("them-nhan-vien")}>
              <ListItemText primary="Thêm nhân viên" />
            </ListItemButton>

          </List>
        </Collapse>
      </Box>
    </List>


  )
}

export default Sidebar;