import * as React from 'react';
import { Button, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import shopService from '@Services/shop.service';

interface Data {
    id?: number,
    name?: string,
    phoneNumber?: string,
    address?: string,
    applyDate: Date,
    owner?: string
}

function date_TO_String(date_Object: Date): string {
    // get the year, month, date, hours, and minutes seprately and append to the string.
    let date_String: string =
      date_Object.getDate() +
      "/" +
      (date_Object.getMonth() + 1) +
      "/" +
      +date_Object.getFullYear()
    return date_String;
  }

export default function CustomerRegisterApply() {
    const navigate = useNavigate();
    const [data, setData] = React.useState<Data>({applyDate: new Date()});

    const params = useParams();
    React.useEffect(() => {
        const getData = async () => {
            console.log(params.id);
            // const res = await get("/shop/" + params.id);
            const res = await shopService.getShop(Number(params.id));

            const resData = res.data;
            setData({
                id: resData.id,
                name: resData.account.name,
                phoneNumber: resData.account.phoneNumber,
                address: resData.addresses[0].addressDetail,
                applyDate: new Date(resData.account.createdAt),
                owner: resData.account.username
            });
        }
        getData();
    }, []);

    const acceptRegister = async () => {
        await shopService.changeStatus(Number(params.id), "ACCEPTED");
        navigate('/ql-giao-hang/ds-khach-hang-dang-ky')
    }

    const pendRegister = async () => {
        await shopService.changeStatus(Number(params.id), "PENDING");
        navigate('/ql-giao-hang/ds-khach-hang-dang-ky')
    }

    return(
        <Box sx={{mt: 3}}>
            <Paper sx={{p: 3}}>

                <Box sx={{width:'100%', display: 'flex', justifyContent: 'center', pt:3, pb: 5}}>
                    <Typography sx={{fontWeight: 'bold', fontSize: '20px'}}>????N ????NG K?? ?????I T??C</Typography>
                </Box>

                {data&&<Box>
                    <Box sx={{pl: 20}}>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>M?? ????n: </Typography>
                            <Typography>#{data.id}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>T??n c???a h??ng: </Typography>
                            <Typography>{data.name}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>S??? ??i???n tho???i: </Typography>
                            <Typography>{data.phoneNumber}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>?????a ch???: </Typography>
                            <Typography>{data.address}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>Ng??y ????ng k??: </Typography>
                            <Typography>{date_TO_String(data.applyDate)}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', m: 2}}>
                            <Typography sx={{fontWeight: 'bold', width: '150px'}}>Ch??? c???a h??ng: </Typography>
                            <Typography>{data.owner}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{mt: 10, width: '100%', justifyContent: 'center', display: 'flex'}}>
                        <Button variant="contained" color="success" sx={{mr: 7}} onClick={acceptRegister}>X??c nh???n</Button>
                        <Button variant="contained" color="error" onClick={pendRegister}>T??? ch???i</Button>
                    </Box>
                </Box>}
            </Paper>
        </Box>
    )
}