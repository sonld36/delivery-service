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
import orderService from '@Services/order.service';
import accountService from '@Services/account.service';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#0088FF'
    }
  }
})

interface TransportStaff {
  staffCode: string,
  staffName: string,
  phoneNumber: string,
  ordersBeingDelivered: number,
  debt: number,
  status: string
}

interface Coordinator {
  staffCode: string,
  staffName: string,
  phoneNumber: string
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
  id: keyof TransportStaff;
  label: string;
  numeric: boolean;
}

interface headCellsCoordinator {
  disablePadding: boolean;
  id: keyof Coordinator;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'staffCode',
    numeric: false,
    disablePadding: true,
    label: 'Mã nhân viên',
  },
  {
    id: 'staffName',
    numeric: false,
    disablePadding: false,
    label: 'Tên nhân viên',
  },
  {
    id: 'phoneNumber',
    numeric: false,
    disablePadding: false,
    label: 'Số điện thoại',
  },
  {
    id: 'ordersBeingDelivered',
    numeric: true,
    disablePadding: false,
    label: 'Số đơn đang giao',
  },
  {
    id: 'debt',
    numeric: true,
    disablePadding: false,
    label: 'Công nợ',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái giao hàng'
  }
];

const headCellsCoordinator: readonly headCellsCoordinator[] = [
  {
    id: 'staffCode',
    numeric: false,
    disablePadding: true,
    label: 'Mã nhân viên',
  },
  {
    id: 'staffName',
    numeric: false,
    disablePadding: false,
    label: 'Tên nhân viên',
  },
  {
    id: 'phoneNumber',
    numeric: false,
    disablePadding: false,
    label: 'Số điện thoại',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TransportStaff) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTablePropsCoordinator {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Coordinator) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}


function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TransportStaff) => (event: React.MouseEvent<unknown>) => {
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

function EnhancedTableHeadCoordinator(props: EnhancedTablePropsCoordinator) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Coordinator) => (event: React.MouseEvent<unknown>) => {
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
        {headCellsCoordinator.map((headCell) => (
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
          Danh sách NV giao hàng
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

function EnhancedTableToolbarCoordinator(props: EnhancedTableToolbarProps) {
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
          Danh sách NV điều phối
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
  const [value, setValue] = React.useState(0);
  const [originData, setOriginData] = React.useState<TransportStaff[]>([]);
  const [originData2, setOriginData2] = React.useState<Coordinator[]>([]);
  const [rowsTransportStaff, setRowsTransportStaff] = React.useState<TransportStaff[]>([]);
  const [rowsCoordinator, setRowsCoordinator] = React.useState<Coordinator[]>([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await accountService.getAllAccount();
    const res2 = await orderService.getAll();
    console.log(res)
    console.log(res2)
    let arr: TransportStaff[];
    arr = [];
    let map = new Map();
    let carrierList = res.data.filter((item: any) => item.role == "ROLE_CARRIER")
    let coordinatorList = res.data.filter((item: any) => item.role == "ROLE_COORDINATOR")
    carrierList.map((item: any, index: number) => {
      if (!item.name) item.name = "";
      if (!item.phoneNumber) item.phoneNumber = "";
      arr.push({
        staffCode: item.id,
        staffName: item.name,
        phoneNumber: item.phoneNumber,
        ordersBeingDelivered: 0,
        debt: 0,
        status: "Đang hoạt động"
      });
      map.set(item.id, index)
    })
    res2.data.map((item: any) => {
      if (item.carrier) {
        if (map.get(item.carrier.id)) {
          if (item.status == "BEING_TRANSPORTED") {
            arr[map.get(item.carrier.id)] = {
              ...arr[map.get(item.carrier.id)],
              ordersBeingDelivered: arr[map.get(item.carrier.id)].ordersBeingDelivered + 1
            }
          }
          if (item.status == "DELIVERY_SUCCESSFUL") {
            arr[map.get(item.carrier.id)] = {
              ...arr[map.get(item.carrier.id)],
              debt: arr[map.get(item.carrier.id)].debt + item.paymentTotal
            }
          }
        }
      }
    })
    console.log(arr);
    setOriginData(arr);
    setRowsTransportStaff(arr);

    let arr2: Coordinator[];
    arr2 = [];

    coordinatorList.map((item: any, index: number) => {
      if (!item.name) item.name = "";
      if (!item.phoneNumber) item.phoneNumber = "";
      arr2.push({
        staffCode: item.id,
        staffName: item.name,
        phoneNumber: item.phoneNumber
      });
    })
    setOriginData2(arr2);
    setRowsCoordinator(arr2);
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const filter1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value.toString();
    setRowsTransportStaff(originData.filter(el => {
      return el.staffCode.toString().includes(s) || el.staffName.toString().includes(s) ||
        el.phoneNumber.toString().includes(s)
    }
    ))
  }

  const filter2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value.toString();
    setRowsCoordinator(originData2.filter(el => {
      return el.staffCode.toString().includes(s) || el.staffName.toString().includes(s) ||
        el.phoneNumber.toString().includes(s)
    }
    ))
  }

  function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof TransportStaff>('staffCode');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof TransportStaff,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rowsTransportStaff.map((n) => n.staffCode);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];

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

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsTransportStaff.length) : 0;

    return (
      <Box sx={{ width: '100%' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
            style={{ tableLayout: 'fixed' }}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowsTransportStaff.length}
            />
            <TableBody>
              {stableSort(rowsTransportStaff, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.staffCode);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.staffCode)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.staffCode}
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
                        align="left"
                      >
                        <Link to={`/ql-giao-hang/tien-hang/${row.staffCode}`} style={{ color: '#0088FF' }}>
                          #{row.staffCode}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{row.staffName}</TableCell>
                      <TableCell align="left">{row.phoneNumber}</TableCell>
                      <TableCell align="right">{row.ordersBeingDelivered}</TableCell>
                      <TableCell align="right">{row.debt.toLocaleString()}</TableCell>
                      <TableCell align="left">
                        <Chip label={row.status} color="success" variant="outlined" /></TableCell>
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
          count={rowsTransportStaff.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"Số lượng hiển thị"}
        />
      </Box>
    );
  }

  function EnhancedTableCoordinator() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Coordinator>('staffCode');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Coordinator,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rowsCoordinator.map((n) => n.staffCode);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];

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

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsCoordinator.length) : 0;

    return (
      <Box sx={{ width: '100%' }}>
        <EnhancedTableToolbarCoordinator numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
            style={{ tableLayout: 'fixed' }}
          >
            <EnhancedTableHeadCoordinator
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowsCoordinator.length}
            />
            <TableBody>
              {stableSort(rowsCoordinator, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.staffCode);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.staffCode)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.staffCode}
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
                        align="left"
                      >
                        #{row.staffCode}
                      </TableCell>
                      <TableCell align="left">{row.staffName}</TableCell>
                      <TableCell align="left">{row.phoneNumber}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowsCoordinator.length}
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
            <Tab label={<span style={{ fontSize: '14px', textTransform: 'none' }}>Nhân viên giao hàng</span>} {...a11yProps(0)} />
            <Tab label={<span style={{ fontSize: '14px', textTransform: 'none' }}>Nhân viên điều phối</span>} {...a11yProps(1)} />
          </Tabs>
        </ThemeProvider>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ padding: '15px' }}>
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
            inputProps={{
              style: {
                padding: '10px 2px'
              }
            }}
            variant="outlined"
            placeholder='Tìm theo mã nhân viên, tên, số điện thoại'
            sx={{ mb: 1 }}
            onChange={filter1}
          />

          <EnhancedTable />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ padding: '15px' }}>
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
            inputProps={{
              style: {
                padding: '10px 2px'
              }
            }}
            variant="outlined"
            placeholder='Tìm theo mã nhân viên, tên, số điện thoại'
            sx={{ mb: 1 }}
            onChange={filter2}
          />

          <EnhancedTableCoordinator />
        </Box>
      </TabPanel>
    </Box>
  );
}

export default function StaffList() {
  return (
    <Paper>
      <Box>
        <BasicTabs />
      </Box>
    </Paper>
  )
}