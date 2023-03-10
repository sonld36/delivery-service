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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import shopService from '@Services/shop.service';

const theme = createTheme({
    palette: {
      secondary: {
        main: '#0088FF'
      }
    }
  })

interface Data {
    id: number,
    shopName: string,
    phoneNumber: string,
    address: string
  }

  function createData(
    id: number,
    shopName: string,
    phoneNumber: string,
    address: string
  ): Data {
    return {
        id,
        shopName,
        phoneNumber,
        address
    };
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
        numeric: true,
        disablePadding: true,
        label: 'id',
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
          id: 'address',
          numeric: false,
          disablePadding: false,
          label: 'Địa chỉ',
        }
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

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function BasicTabs() {
    const [originData, setOriginData] = React.useState<Data[]>([]);
    const [originData2, setOriginData2] = React.useState<Data[]>([]);
    const [data, setData] = React.useState<Data[]>([]);
    const [data2, setData2] = React.useState<Data[]>([]);

    React.useEffect( () => {
      try {
          const getData = async () => {
            const res = await shopService.getShopByStatus("REGISTERING");
            // const res = await get('/shop?status=REGISTERING');
            console.log(res)
            const map = new Map();
            let arr:Data[]; 
            arr = [];
            res.data.map((item: any) => {
                map.set(item.id, false)
                arr.push({
                  id: item.id,
                  shopName: item.account.name,
                  address: item.addresses[0].addressDetail,
                  phoneNumber: item.account.phoneNumber
                })
            })
            setOriginData(arr);
            setData(arr);

            const res2 = await shopService.getShopByStatus("ACCEPTED");
            const map2 = new Map();
            arr = [];
            res2.data.map((item: any) => {
                map2.set(item.id, false)
                arr.push({
                  id: item.id,
                  shopName: item.account.name,
                  address: item.addresses[0].addressDetail,
                  phoneNumber: item.account.phoneNumber
                })
            })
            setOriginData2(arr);
            setData2(arr);
          }
          getData();
      } catch (e) {
        console.log(e)
      }
    }, [])

    const filter1 = (e: React.ChangeEvent<HTMLInputElement>) => {
      let s = e.target.value.toString();
      setData(originData.filter(el =>
        el.address.includes(s) || el.shopName.includes(s) || el.shopName.includes(s) || el.id.toString().includes(s)
      ))
    }

    const filter2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      let s = e.target.value.toString();
      setData2(originData2.filter(el =>
        el.address.includes(s) || el.shopName.includes(s) || el.shopName.includes(s) || el.id.toString().includes(s)
      ))
    }

    function EnhancedTable() {
      const [order, setOrder] = React.useState<Order>('asc');
      const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
      const [selected, setSelected] = React.useState<readonly Number[]>([]);
      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
      const [status, setStatus] = React.useState<Map<String, Boolean>>(new Map());
    
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
          const newSelected = data.map((n) => n.id);
          setSelected(newSelected);
          return;
        }
        setSelected([]);
      };
    
      const handleClick = (event: React.MouseEvent<unknown>, id: Number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly Number[] = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
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
      
      const isSelected = (id: Number) => selected.indexOf(id) !== -1;
    
      // Avoid a layout jump when reaching the last page with empty rows.
      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    
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
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
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
                            align="right"
                            sx={{
                              color: '#0088FF',
                              textDecoration: 'underline'
                            }}
                          >
                            <Link to={`/ql-giao-hang/khach-hang-dang-ky/${row.id}`}style={{color: '#0088FF'}}>#{row.id}</Link>
                          </TableCell>
                          <TableCell align="left">{row.shopName}</TableCell>
                          <TableCell align="left">{row.phoneNumber}</TableCell>
                          <TableCell align="left">{row.address}</TableCell>
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
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"Số lượng hiển thị"}
            />
        </Box>
      );
    }
  
  function EnhancedTable2() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
    const [selected, setSelected] = React.useState<readonly Number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [status, setStatus] = React.useState<Map<String, Boolean>>(new Map());
  
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
        const newSelected = data2.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event: React.MouseEvent<unknown>, id: Number) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly Number[] = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
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
    
    const isSelected = (id: Number) => selected.indexOf(id) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data2.length) : 0;
  
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
                rowCount={data2.length}
              />
              <TableBody>
                {stableSort(data2, getComparator(order, orderBy))
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
                          align="right"
                          sx={{
                            color: '#0088FF',
                            textDecoration: 'underline'
                          }}
                        >
                          #{row.id}
                        </TableCell>
                        <TableCell align="left">{row.shopName}</TableCell>
                        <TableCell align="left">{row.phoneNumber}</TableCell>
                        <TableCell align="left">{row.address}</TableCell>
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
            count={data2.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Số lượng hiển thị"}
          />
      </Box>
    );
  }    

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', color: 'blue' }}>
        <ThemeProvider theme={theme}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor='secondary'
            TabIndicatorProps={{
                style: {
                  backgroundColor: '#0088FF'
                }
              }}
          >
            <Tab label={<span style={{fontSize: '14px', textTransform: 'none'}}>Đang chờ duyệt</span>} {...a11yProps(0)}/>
            <Tab label={<span style={{fontSize: '14px', textTransform: 'none'}}>Đã duyệt</span>} {...a11yProps(1)}/>
          </Tabs>
        </ThemeProvider>
        </Box>
        <TabPanel value={value} index={0}>
          <Box sx={{padding: '15px'}}>
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

            <EnhancedTable />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Box sx={{padding: '15px'}}>
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
                onChange={filter2}
            />

            <EnhancedTable2 />
          </Box>
        </TabPanel>
      </Box>
    );
  }
  
export default function CustomerRegisterList() {
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
                    <Box>
                        <BasicTabs />
                    </Box>

                </Paper>
            </Box>
        </Box>
    )
}