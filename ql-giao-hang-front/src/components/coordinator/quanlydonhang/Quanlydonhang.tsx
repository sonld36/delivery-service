import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Typography, createTheme, Tabs, Tab, FormControl, TextField, InputAdornment, Grid, Container, Stack, Modal, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useState } from 'react';
import OrderListResults from '../component/OrderListResults';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getCurrentPath } from '@Helpers/data.optimize';
import { orderManageLinks } from '../CoordinatorSidebar/CoordinatorSidebar';
import { useAppSelector } from '@App/hook';
import { OrderStateType, selectOrder } from '@Features/order/orderSlice';



const theme = createTheme();
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
};

interface LinkTabProps {
  label: string;
  href: string;
}
function TabDetail(props: LinkTabProps) {
  const { href } = props;
  const navigate = useNavigate();
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(href);
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


function Quanlydonhang() {

  const [valueInputSearch, setValueInputSearch] = useState("");

  const [showClearIcon, setShowClearIcon] = useState("none");

  const ordersState: OrderStateType = useAppSelector(selectOrder);
  const location = useLocation();
  const currentStatus = getCurrentPath(location.pathname);
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentKey, setCurrentKey] = useState<number>(0);
  const [status, setStatus] = useState<string>(currentStatus);
  const handleChangeInputSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setValueInputSearch(event.target.value);

  };

  useEffect(() => {
    setStatus(currentStatus);
    setCurrentKey(Object.values(orderManageLinks).indexOf(currentStatus));
  }, [currentStatus])

  useEffect(() => {
    setSearchParams({
      page: `1`
    });
  }, []);

  const handleClickSearchBar = (): void => {
    setValueInputSearch("");
    setShowClearIcon("none");
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', backgroundColor: 'white' }}  >

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentKey}>
              <TabDetail label="Tất cả các đơn" href={orderManageLinks.ALL + "?page=1"} key={orderManageLinks.ALL} />
              <TabDetail label="Yêu cầu vận chuyển" href={orderManageLinks.REQUEST + "?page=1"} key={orderManageLinks.REQUEST} />
              <TabDetail label="Đang lấy hàng" href={orderManageLinks.PICKING + "?page=1"} key={orderManageLinks.PICKING} />
              <TabDetail label="Đang vận chuyển" href={orderManageLinks.DELIVERING + "?page=1"} key={orderManageLinks.DELIVERING} />
              <TabDetail label="Giao thành công" href={orderManageLinks.SUCCESS + "?page=1"} key={orderManageLinks.SUCCESS} />
              <TabDetail label="Hàng hoàn" href={orderManageLinks.DONE + "?page=1"} key={orderManageLinks.DONE} />
            </Tabs >
          </Box>
          <Container sx={{ mt: '16px', padding: "10px 0" }}>
            <Stack spacing={3} direction={"column"}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  placeholder='Tìm kiếm theo  mã vận đơn, tên, SĐT người nhận, NV giao hàng, SĐT nhân viên giao hàng '
                  size="small"
                  variant="outlined"
                  onChange={handleChangeInputSearch}
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
              <OrderListResults status={status} />
            </Stack>
          </Container>

        </Box>
      </Box >
      <Modal component={"center"} open={ordersState.isLoading}>
        <Box sx={style}>
          <CircularProgress size={50} />
        </Box>
      </Modal>
    </ThemeProvider >
  )
}

export default Quanlydonhang;