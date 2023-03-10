import { Box, darken, lighten, Pagination, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import Title from './Title';
import { CardHeaderStyled, CardStyled } from './Utils';
import EditIcon from '@mui/icons-material/Edit';



type Props = {
  header: any[],
  data: any[],
  title?: string,
  totalPage?: number,
  setPage?: any,
  onCellClick?: any,
  hiddeFooter?: boolean,
  loading: boolean,
}


export default function Table(props: Props) {
  const { header, data, title, totalPage, setPage, onCellClick, hiddeFooter, loading } = props;
  const [pageDisplay, setPageDisplay] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setPageDisplay(value);
  };

  return (
    <React.Fragment>
      {/* <Title>Recent Orders</Title> */}
      <CardStyled>
        <CardHeaderStyled
          title={<Title title={title ? title : " "} />}
        />
        <Box sx={{
          // height: 550,
          width: "100%",
        }}>
          <DataGrid
            rows={data}
            columns={header}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            autoHeight={true}
            paginationMode="server"
            sx={{
              margin: "10px"
            }}
            // hideFooterPagination={true}
            loading={loading}
            rowHeight={80}
            editMode={"row"}
            components={{
              Pagination: () => (
                <Box sx={{
                  display: "flex",
                  float: "right",
                  mt: "5px",
                }}>
                  <Typography sx={{
                    margin: "auto 0"
                  }}>Page: {pageDisplay}</Typography>
                  <Pagination count={totalPage} page={pageDisplay} onChange={handleChange} />
                </Box>
              ),
              MoreActionsIcon(props) {
                return <EditIcon />;
              },
            }}
            hideFooter={hiddeFooter}

            onCellClick={onCellClick != null ? (params) => onCellClick(params) : undefined}
          />
        </Box>
      </CardStyled>
    </React.Fragment>
  );
}