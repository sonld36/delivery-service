import { useAppDispatch } from '@App/hook';
import { ToastPayload } from '@Common/toast.const';
import { UserLogged } from '@Common/types';
import { openToast } from '@Features/toast/toastSlice';
import { login } from '@Features/user/userSlice';
import { MainLogo } from '@Helpers/image.handle';
import { loginSchema } from '@Helpers/form.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import authService from '@Services/auth.service';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { TypeOf } from 'zod';
import Authenication from '.';

type LoginInput = TypeOf<typeof loginSchema>


export default function Login() {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors, isSubmitSuccessful },
        reset,
        handleSubmit
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    });

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);


    const onSubmitHandler: SubmitHandler<LoginInput> = async (values) => {
        setLoading(true);
        const resp = await authService.login(values);
        setLoading(false);
        if (resp.status && resp.status >= 300) {
            dispatch(openToast(ToastPayload[resp.code ? resp.code : 4001]));
        } else {
            const userLogged: UserLogged = resp.data;
            dispatch(login(userLogged));
            return navigate("/redirect");
        }
    };

    return (
        <Authenication>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid
                    sx={{
                        display: { sm: 'none' },
                        height: "100px"
                    }}
                >
                    <img src={MainLogo} alt="logo-sapo" />
                </Grid>
                <Avatar sx={{
                    m: 1, bgcolor: 'secondary.main',
                }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5"
                    sx={{
                        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif',
                        fontSize: '26px',
                        fontWeight: '500',
                        color: '#212b35'
                    }}
                >
                    Đăng nhập
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        // name="email"
                        // autoComplete="email"
                        autoFocus
                        error={!!errors['username']}
                        helperText={errors['username'] ? errors['username'].message : ""}
                        {...register('username')}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        // name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={!!errors['password']}
                        helperText={errors['password'] ? errors['password'].message : ""}
                        {...register('password')}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Nhớ tài khoản"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3, mb: 3,
                                backgroundColor: "#80ECD0",
                                borderRadius: '50px',
                                lineHeight: '40px',
                                fontWeight: '500',
                                fontSize: '20px',
                                padding: '10px 40px',
                                width: 'fit-content',
                                '&:': {
                                    backgroundColor: "#0FD186"
                                }
                            }}
                            startIcon={loading && <CircularProgress color="inherit" size={"1rem"} />}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Link to="#" style={{
                                color: '#08f',
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}>
                                Quên mật khẩu?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/register" style={{
                                color: '#08f',
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}>
                                {"Chưa có tài khoản? Đăng ký"}
                            </Link>
                        </Grid>
                    </Grid>

                </Box>

            </Box>
        </Authenication >
    );
}