import * as React from 'react';
import './CustomerList.scss';
import Dashboard from '@Components/dashboard/Dashboard';
import Box from '@mui/material/Box';
import { InputAdornment, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
import shopService from '@Services/shop.service';
import orderService from '@Services/order.service';
import { totalmem } from 'os';
import { Link, useNavigate } from 'react-router-dom';

interface Data {
  id: number,
  shopName: string,
  phoneNumber: string,
  email: string,
  debt: number,
  totalPay: number,
  totalOrder: number
}
    
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
    id: keyof Data;
    label: string;
    numeric: boolean;
  }

  const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Mã cửa hàng',
      },
      {
          id: 'shopName',
          numeric: false,
          disablePadding: false,
          label: 'Tên cửa hàng',
        },
        {
          id: 'phoneNumber',
          numeric: false,
          disablePadding: false,
          label: 'Số điện thoại',
        },
        {
          id: 'email',
          numeric: false,
          disablePadding: false,
          label: 'Email cửa hàng',
        },
          {
          id: 'debt',
          numeric: true,
          disablePadding: false,
          label: 'Công nợ hiện tại',
          },
          {
              id: 'totalPay',
              numeric: true,
              disablePadding: false,
              label: 'Tổng chi tiêu',
          },
          {
              id: 'totalOrder',
              numeric: true,
              disablePadding: false,
              label: 'Tổng đơn hàng',
          },
  ];
  
  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }
  
  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  interface EnhancedTableToolbarProps {
    numSelected: number;
  }
  
  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Danh sách khách hàng
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  
export default function CustomerList() {

  const [originData, setOriginData] = React.useState<Data[]>([]);
  const [rows, setRows] = React.useState<Data[]>([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await shopService.getShopByStatus("ACCEPTED");
    const res2 = await orderService.getAll();
    let arr:Data[]; 
    arr = [];
    let map = new Map();
    res.data.map((item: any, index: number) => {
      arr.push({
        id: item.id,
        shopName: item.account.name,
        phoneNumber: item.account.phoneNumber,
        email: item.email,
        debt: 0,
        totalPay: 0,
        totalOrder: 0
      });
      map.set(item.id, index)
    })
    res2.data.map((item: any) => {
      if (map.get(item.shop.id)) {
        if ((item.status == "DONE") || (item.status == "CANCEL")){
        arr[map.get(item.shop.id)] = {
          ...arr[map.get(item.shop.id)],
          totalOrder : arr[map.get(item.shop.id)].totalOrder + 1,
          totalPay : arr[map.get(item.shop.id)].totalPay + item.paymentTotal
        }
        } else {
          arr[map.get(item.shop.id)] = {
            ...arr[map.get(item.shop.id)],
            totalOrder : arr[map.get(item.shop.id)].totalOrder + 1,
            totalPay : arr[map.get(item.shop.id)].totalPay + item.paymentTotal,
            debt: arr[map.get(item.shop.id)].debt + item.paymentTotal
          }
        }
      }
    })
    console.log(arr);
    setOriginData(arr);
    setRows(arr);
  }

  const filter1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value.toString();
    setRows(originData.filter(el =>
      el.phoneNumber.includes(s) || el.shopName.includes(s) || el.email.includes(s) || el.id.toString().includes(s)
    ))
  }

  function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
    const [selected, setSelected] = React.useState<readonly Number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Data,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event: React.MouseEvent<unknown>, name: Number) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected: readonly Number[] = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
    };
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    
    const isSelected = (name: Number) => selected.indexOf(name) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    return (
      <Box sx={{ width: '100%' }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <Link to={`/ql-giao-hang/thong-tin-khach-hang/${row.id}`}style={{color: '#0088FF'}}>
                          #{row.id}
                          </Link>
                        </TableCell>
                        <TableCell align="left">{row.shopName}</TableCell>
                        <TableCell align="left">{row.phoneNumber}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="right">{row.debt.toLocaleString()}</TableCell>
                        <TableCell align="right">{row.totalPay.toLocaleString()}</TableCell>
                        <TableCell align="right">{row.totalOrder}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Số lượng hiển thị"}
          />
      </Box>
    );
  }

    return (
        // <Dashboard title='Danh sách khách hàng'>
        <Box>
            <Box>
                <Box sx={{display : 'flex', flexDirection: 'row-reverse', mb: 2}}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<AddIcon />} 
                        sx={{fontSize: '14px', textTransform: 'none', fontWeight: '600', backgroundColor: '#0088FF'}}>
                            Thêm khách hàng
                        </Button>
                    </Stack>
                </Box>

                <Paper>
                    <Box sx={{padding: '15px'}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'}}>Tất cả khách hàng</Typography>
                        <TextField
                            fullWidth
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <SearchIcon />
                                </InputAdornment>
                            ),
                            style: {
                                fontSize: '14px',
                            }
                            }}
                            inputProps = {{
                                style: {
                                    padding: '10px 2px'
                                } 
                            }}
                            variant="outlined"
                            placeholder='Tìm theo mã khách hàng, tên, SĐT khách hàng'
                            sx={{mb: 1}}
                            onChange={filter1}
                        />

                        {/* Table */}
                            <EnhancedTable />
                    </Box>

                </Paper>
            </Box>
          </Box>
        // </Dashboard>
    )
}