import { ShopInfoForManager } from '@Common/types';
import { convertNumberToCurrency } from '@Helpers/data.optimize';
import shopService from '@Services/shop.service';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, styled, tableCellClasses } from '@mui/material'
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { toInteger } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';


function Customer() {
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<ShopInfoForManager[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigator = useNavigate();

  const handleChangePage = (event: any, numberOfPage: number) => {
    console.log(numberOfPage);

    setSearchParams({
      page: `${numberOfPage + 1}`
    });
  };

  const page = useMemo(() => toInteger(searchParams.get("page")), [searchParams]);

  useEffect(() => {
    const getShop = async () => {
      const resp = await shopService.getShopForManager(page);
      setData(resp.data.listData);
      setCount(resp.data.totalPage);
    }

    getShop();
  }, [page]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">Tên khách hàng</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Số điện thoại</StyledTableCell>
            <StyledTableCell align="right">Tổng tiền đã tiêu</StyledTableCell>
            <StyledTableCell align="right">Tổng tiền cần hoàn</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id} onClick={() => {
              navigator(`/ql-giao-hang/thong-tin-khach-hang/${row.id}`);
            }}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.username}</StyledTableCell>
              <StyledTableCell align="right">{row.email}</StyledTableCell>
              <StyledTableCell align="right">{row.phoneNumber}</StyledTableCell>
              <StyledTableCell align="right">{convertNumberToCurrency(row.totalCashPaid)}</StyledTableCell>
              <StyledTableCell align="right">{convertNumberToCurrency(row.totalCashToRefund)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={count}
              rowsPerPage={10}
              page={page - 1}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  ":hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default Customer