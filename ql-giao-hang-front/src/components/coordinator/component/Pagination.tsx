import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, IconButton, MenuItem, Select, Typography, styled } from '@mui/material';
import { toInteger } from 'lodash';
import React, { useMemo } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';

const ButtonCustom = styled(IconButton)({


});

function PaginationCustom(props: { totalRecord: number, pageSize: number, pageIndex: number, setPageSize: (params: any) => any }) {
    const { totalRecord, pageSize } = props;
    const [statusPrevButton, setStatusPreButton] = React.useState<boolean>(false)
    const [statusNextButton, setStatusNextButton] = React.useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams({});

    const pageIndex = useMemo(() => toInteger(searchParams.get("page")), [searchParams])
    React.useEffect(() => {
        setStatusPreButton(false)
        setStatusNextButton(false)
        if (pageIndex === 1) setStatusPreButton(true)
        if ((pageIndex) >= (totalRecord / 5)) setStatusNextButton(true)
    }, [pageIndex, pageSize, totalRecord])
    React.useEffect(() => {
        searchParams.set("page", `1`);
    }, [searchParams])

    const handleChangeValueDown = () => {
        setSearchParams((prev) => ({
            ...prev,
            page: `${pageIndex - 1}`
        }))
    }
    const handleChangeValueUp = () => {
        setSearchParams((prev) => ({
            ...prev,
            page: `${pageIndex + 1}`
        }))
    }


    return (
        <React.Fragment>
            <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "right" }}>
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