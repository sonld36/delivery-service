import { useState, useEffect } from 'react';
import { useAppDispatch } from '@App/hook';
import { AccountToastPayload } from '@Common/toast.const';
import { openToast } from '@Features/toast/toastSlice';
import { Box, Grid, Typography, TextField } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardContent from '@mui/material/CardContent';

import { CardStyled } from '@Components/Utils';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';


import { saveAvatarSchema, createFormData } from '@Helpers/form.validate';
import { TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseReceived } from '@Common/types';
import UploadImages from '@Components/UploadImages';

import accountService from '@Services/account.service';


type shipperInfo = {
    id: number,
    avatar: string,
    name: string,
    phone: string,
}

export type AvatarSaveForm = TypeOf<typeof saveAvatarSchema>

const UpdateShipperInfo = () => {
    const dispatch = useAppDispatch();

    const [shipperInfo, setShipperInfo] = useState<shipperInfo>();
    const navigate = useNavigate();

    const methods = useForm<AvatarSaveForm>({
        resolver: zodResolver(saveAvatarSchema),
        defaultValues: ({
            image: undefined,
            id: undefined
        })
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = methods;

    const getAccountInfo = async () => {
        try {
            const resp: any = await accountService.getAccountInfo();
            if (resp && resp.data) {
                let shipper = {
                    "id": resp.data.id,
                    "avatar": resp.data.pathAvatar,
                    "name": resp.data.name,
                    "phone": resp.data.phoneNumber,
                }
                setShipperInfo(shipper);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmitForm: SubmitHandler<AvatarSaveForm> = async (values: any) => {
        values.id = shipperInfo?.id;
        const data: FormData = createFormData(values);
        const resp: ResponseReceived<any> = await accountService.updateAccountInfo(data);
        if (resp) {
            dispatch(openToast(AccountToastPayload[resp.code ? resp.code : 4001]));
            return navigate("/shipper/account");
        }
    };

    useEffect(() => {
        getAccountInfo();
    }, [])



    return (
        <Box sx={{
            maxWidth: "414px",
            margin: "0 auto",
            position: "relative",
            textDecoration: "none",
            backgroundColor: "#fff",
        }}>
            <CssBaseline />
            {/* header */}
            <Box component='div' sx={{
                position: "fixed",
                width: "414px",
                top: "0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 0px 10px 0px",
                borderBottom: "1px solid #eaeaea",
                backgroundColor: "#fffdfd",
                zIndex: "1"
            }}>
                <Box>
                    <Link to="/shipper" style={{
                        position: "absolute",
                        left: "0px",
                        top: "22px",
                        color: "#323232",
                    }}>
                        <ArrowBackIcon sx={{
                            fontSize: "22px",
                            fontWeight: "600",
                        }} />
                    </Link>
                    <Typography sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#323232",
                    }}>
                        Sửa thông tin tài khoản
                    </Typography>
                </Box>

            </Box>

            <Box sx={{
                padding: "10px",
                marginTop: "80px",
                position: "relative",
            }}>
                <Box component={"form"} noValidate onSubmit={handleSubmit(handleSubmitForm)}>
                    <Grid item xs={12}>
                        <CardStyled
                            sx={{
                                minHeight: "210px !important"
                            }}
                        >
                            <CardContent>
                                <FormProvider {...methods} >
                                    <Box display={"none"} >
                                        <input {...register("id")} defaultValue={shipperInfo?.id} disabled />
                                    </Box>

                                    <TextField
                                        multiline
                                        fullWidth
                                        defaultValue={shipperInfo?.name}
                                        maxRows={4}
                                        variant="standard"
                                        {...register("name")} sx={{
                                            marginBottom: "20px"
                                        }} />
                                    <TextField
                                        multiline
                                        fullWidth
                                        defaultValue={shipperInfo?.phone}
                                        maxRows={4}
                                        variant="standard"
                                        {...register("phoneNumber")} sx={{
                                            marginBottom: "20px"
                                        }} />
                                    <Box sx={{
                                        // height: "50px"
                                    }}>
                                        <UploadImages />
                                    </Box>

                                    <Box width={"100%"} marginTop="10px" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <input type="submit" style={{
                                            backgroundColor: "#0089ff",
                                            border: "none",
                                            color: "white",
                                            fontSize: "14px",
                                            textTransform: "uppercase",
                                            fontWeight: "500",
                                            lineHeight: "28px",
                                            borderRadius: "8px",
                                            padding: " 5px 10px",
                                            cursor: "pointer"
                                        }} />
                                    </Box>
                                </FormProvider>
                            </CardContent>
                        </CardStyled>
                    </Grid>
                </Box>
            </Box>

            <Menu />

        </Box >
    )
}

export default UpdateShipperInfo;