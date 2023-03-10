import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, CardHeader, Divider, FormControl, InputAdornment, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { functionsIn } from 'lodash';
import { CardStyled } from '@Components/Utils';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
// const TableCellCus = styled(TableCell)({
//     backgroundColor: "#BBBDBF",
// });

function QuanlyNVgiaohang() {
    const [valueInputSearch, setValueInputSearch] = React.useState("");
    const [showClearIcon, setShowClearIcon] = React.useState("none");


    const handleChangeInputSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setShowClearIcon(event.target.value === "" ? "none" : "flex");
        setValueInputSearch(event.target.value);
    };

    const handleClickSearchBar = (): void => {
        setValueInputSearch("");
        setShowClearIcon("none");
    };

    return (
        < Box sx={{ padding: 0, margin: 0 }}   >
            < Typography sx={{ fontWeight: 'bold', mb: '15px', ml: "23px" }} variant='h6'>Tình hình giao hàng</Typography>
            <Box sx={{
                ml: "17px"
            }} >
                <CardStyled >
                    <CardHeader sx={{ paddingTop: "12px", paddingBottom: "0" }} title={
                        <Box>
                            <Typography sx={{ fontSize: "17px", fontWeight: 700, paddingLeft: "20px", color: "#686868" }}> TÌNH HÌNH GIAO HÀNG</Typography>
                            <Typography sx={{ fontSize: "15px", fontWeight: 600, padding: "10px", paddingLeft: "20px", color: "#686868" }}>Dữ liệu được tổng hợp trong 30 ngày gần nhất</Typography>
                            <Divider />
                            <Box sx={{ mt: '16px' }}>
                                <FormControl>
                                    <TextField
                                        placeholder='Tìm kiếm theo ID NV giao hàng, tên, SĐT'
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
                        </Box>}
                    />
                </CardStyled>
                {/* <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>

                                <TableCell align="left">Mã nhân viên</TableCell>
                                <TableCell align="right">Tên nhân viên</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">{row.id}</TableCell>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>

                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </Box>
        </Box >
    )


}
export default QuanlyNVgiaohang;