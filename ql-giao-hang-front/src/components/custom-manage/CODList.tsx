import * as React from 'react';
import Box from '@mui/material/Box';
import { InputAdornment, Paper, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      secondary: {
        main: '#0088FF'
      }
    }
  })

  interface COD {
    id: string,
    shopName: string,
    address: string,
    phonenumber: string,
    money: Number,
    status: string
  }

  function createCOD(
    id: string,
    shopName: string,
    address: string,
    phonenumber: string,
    money: Number,
    status: string
  ): COD {
    return {
        id,
        shopName,
        address,
        phonenumber,
        money,
        status
    };
  }

  const rows=[
    createCOD('1', 'Shop 1', 'Địa chỉ 1', '0123456789', 2000000, 'Chưa thanh toán'),
    createCOD('2', 'Shop 1', 'Địa chỉ 1', '0123456789', 2000000, 'Đã thanh toán'),
    createCOD('3', 'Shop 1', 'Địa chỉ 1', '0123456789', 2000000, 'Chưa thanh toán'),
  ]

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof COD;
    label: string;
    numeric: boolean;
  }

//   const headCells: readonly HeadCell[] = [
//     {
//       id: 'id',
//       numeric: false,
//       disablePadding: true,
//       label: 'Mã COD',
//     },
//     {
//         id: 'staffName',
//         numeric: false,
//         disablePadding: false,
//         label: 'Tên nhân viên',
//       },
//       {
//         id: 'phoneNumber',
//         numeric: false,
//         disablePadding: false,
//         label: 'Số điện thoại',
//       },
//       {
//         id: 'ordersBeingDelivered',
//         numeric: true,
//         disablePadding: false,
//         label: 'Số đơn đang giao',
//       },
//       {
//         id: 'debt',
//         numeric: true,
//         disablePadding: false,
//         label: 'Công nợ',
//       },
//       {
//         id: 'status',
//         numeric: false,
//         disablePadding: false,
//         label: 'Trạng thái giao hàng'
//       }
// ];

export default function CODList() {
    return(
        <Box>

        </Box>
    )
}