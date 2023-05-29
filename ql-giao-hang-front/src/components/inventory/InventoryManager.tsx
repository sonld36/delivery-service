import inventoryService from '@Services/inventory.service'
import { Button, CardContent, CardHeader, Grid, Popover, Typography } from '@mui/material'
import { GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import Table from "@Components/Table";
import { Inventory } from '@Common/types';
import { CardStyled } from '@Components/Utils';
import Title from '@Components/Title';
import Map from '@Components/Map';
import mapboxgl from 'mapbox-gl';
import mapService from '@Services/map.service';

const colums: GridColumns = [
  { field: "id", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },

  { field: "name", headerName: "Tên kho", align: "center", flex: 1, headerAlign: "center" },
  { field: "address", headerName: "Địa chỉ", align: "center", flex: 1, headerAlign: "center" },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Xóa kho',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      return [

        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Hủy Đơn"
          // onClick={(event) => {
          //   event.preventDefault();
          //   handleDeleteClick(event, id);
          // }}
          color="inherit"
        />,
        // <Menu
        //   id="basic-menu"
        //   anchorEl={anchorEl}
        //   open={open}
        //   onClose={handleClose}
        //   MenuListProps={{
        //     'aria-labelledby': 'basic-button',
        //   }}
        // >
        //   <MenuItem onClick={(event) => handleAgreeDelete(event)}>
        //     <ListItemIcon>
        //       <DoneIcon fontSize="small" />
        //     </ListItemIcon>
        //     <ListItemText sx={{ fontSize: "15px" }}>Đồng ý</ListItemText>
        //   </MenuItem>
        //   <MenuItem onClick={handleClose}><ListItemIcon>
        //     <CloseIcon fontSize="small" />
        //   </ListItemIcon>
        //     <ListItemText sx={{ fontSize: "15px" }}>Từ chối</ListItemText></MenuItem>
        // </Menu>
      ];
    }
  }
]

function InventoryManager() {

  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [createAnchorEl, setCreateAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(createAnchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleOpenCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCreateAnchorEl(event.currentTarget);
  }

  const handleCloseCreate = () => {
    setCreateAnchorEl(null);
  }

  useEffect(() => {
    const fetchAllInventory = async () => {
      const resp = await inventoryService.getAll();
      setInventories(resp.data);
    }

    fetchAllInventory();
  }, []);

  useEffect(() => {
    const getCoordinates = async () => {
      inventories.forEach(async (item) => {
        const data = await mapService.getCoordinate(item.address);
        console.log(data);
      });
    }

    getCoordinates();
  }, [inventories])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleOpenCreate}>Thêm kho</Button>
          <Popover
            id={id}
            open={open}
            anchorEl={createAnchorEl}
            onClose={handleCloseCreate}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
          </Popover>
        </Grid>
        <Grid item xs={8}>
          <Table header={colums} data={inventories} loading={false} title='Danh sách kho hiện tại' />
        </Grid>
        <Grid item xs={4}>
          <Map />
        </Grid>
      </Grid>
    </>
  )
}

export default InventoryManager