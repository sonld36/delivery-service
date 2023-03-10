import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, IconButton, MenuItem, Select, Typography, styled } from '@mui/material';
import React from "react";

const ButtonCustom = styled(IconButton)({


});

function PaginationCustom(props: { totalRecord: number, pageSize: number, pageIndex: number, setPageIndex: (params: any) => any, setPageSize: (params: any) => any }) {
    const { totalRecord, pageIndex, pageSize } = props;
    const [statusPrevButton, setStatusPreButton] = React.useState<boolean>(false)
    const [statusNextButton, setStatusNextButton] = React.useState<boolean>(true)
    React.useEffect(() => {
        setStatusPreButton(false)
        setStatusNextButton(false)
        if (pageIndex === 1) setStatusPreButton(true)
        if ((pageIndex) > (totalRecord / pageSize)) setStatusNextButton(true)
    }, [pageIndex, pageSize])
    React.useEffect(() => {
        props.setPageIndex(1)
    }, [pageSize])
    const handleChangeValueDown = () => {
        props.setPageIndex(pageIndex - 1);
    }
    const handleChangeValueUp = () => {
        props.setPageIndex(pageIndex + 1);

    }
    return (
        <React.Fragment>
            <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "right" }}>
                <Select sx={{ width: "74px", height: "35px", display: "flex" }}
                    value={pageSize}
                    onChange={(event: any) => {
                        event.preventDefault();
                        props.setPageSize(event.target.value)
                    }}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Typography sx={{ display: "flex", paddingLeft: "12px", color: "black" }}>kết quả</Typography>
                <Typography sx={{ display: "flex", paddingLeft: "16px", color: "black" }}>Từ {(pageIndex - 1) * pageSize + 1} đến {(pageIndex * pageSize) > totalRecord ? totalRecord : (pageIndex * pageSize)} trên tổng {totalRecord}  </Typography>

                <IconButton size="medium" disabled={statusPrevButton} onClick={() => handleChangeValueDown()}>
                    <NavigateBeforeIcon fontSize="inherit" />
                </IconButton>
                <Typography sx={{ width: "30px", height: "30px", justifyContent: "center", alignItems: "center", display: "flex", backgroundColor: "#0088FF", borderRadius: "15px" }}>{pageIndex}</Typography>
                <IconButton size="medium" disabled={statusNextButton} onClick={() => handleChangeValueUp()}><NavigateNextIcon fontSize="inherit" /></IconButton>
            </Box>
        </React.Fragment >

    )
}
export default PaginationCustom