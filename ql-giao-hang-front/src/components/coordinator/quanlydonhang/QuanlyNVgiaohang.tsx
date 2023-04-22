import Table from '@Components/Table';
import Title from '@Components/Title';
import { CardStyled } from '@Components/Utils';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CardHeader, Divider, FormControl, InputAdornment, TextField, Typography, Container, CardContent } from '@mui/material';
import { GridColumns } from '@mui/x-data-grid';
import * as React from 'react';

function nhanVienGiaoHang(
  id: string,
  name: string,
  sdt: string,
  soDonDaGiao: number,
  congNo: number,
  status: string,) {
  return {
    id, name, sdt, soDonDaGiao, congNo, status
  }
}
const rows = [
  nhanVienGiaoHang("NVGH00001", "Nguyen Van A", "0912345678", 4, 3000000, "Đang hoạt động"),
  nhanVienGiaoHang("NVGH00002", "Nguyen Van B", "0912345678", 3, 4000000, "Đang hoạt động"),
  nhanVienGiaoHang("NVGH00003", "Nguyen Van C", "0912345678", 6, 5000000, "Đang hoạt động"),
  nhanVienGiaoHang("NVGH00004", "Nguyen Van D", "0912345678", 2, 2000000, "Đang hoạt động"),
  nhanVienGiaoHang("NVGH00005", "Nguyen Van E", "0912345678", 1, 7000000, "Đang hoạt động"),
  nhanVienGiaoHang("NVGH00006", "Nguyen Van F", "0912345678", 7, 6000000, "Đang hoạt động"),

]

function QuanlyNVgiaohang() {

  const colums: GridColumns = React.useMemo(() => [
    { field: "accountId", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },
    { field: "name", headerName: "Họ tên", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "totalOfOrder", headerName: "Tổng đơn", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "beingTransported", headerName: "Đơn đang giao", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "pendingAccept", headerName: "Đơn chờ chấp nhận", type: "number", align: "center", flex: 1, headerAlign: "center" },
  ], []);

  React.useEffect(() => {
    const getCarrierData = async () => {

    }
  })

  return (
    <Container>
      <CardStyled>
        <CardHeader title={<Title title='Danh sách nhân viên' />} />
      </CardStyled>
      <CardContent>
        {/* <Table header={colums} data={} /> */}
      </CardContent>
    </Container>
  )


}
export default QuanlyNVgiaohang;