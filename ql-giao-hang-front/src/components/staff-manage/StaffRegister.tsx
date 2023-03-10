import React from 'react';
import {Paper, Typography, Box, Button, Select, Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import authService from '@Services/auth.service';

interface ErrorText {
    status: Boolean,
    text: string
}

interface User {
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    role?: string | unknown,
    phoneNumber?: string
}

export default function StaffRegister() {
    const navigate = useNavigate();
    const [error, setError] = React.useState<Map<string, ErrorText>>(new Map());
    const [user, setUser] = React.useState<User>({role: 'ROLE_CARRIER'});
    const [role, setRole] = React.useState<string>('ROLE_CARRIER');

    const handleSubmit = async () => {
        let err = new Map();
        if (user.username == undefined || user.username == null || user.username == '') {
            err.set('username', {status: true, text: 'username không nên để trống'})
        }
        else if (user.username.length < 8) {
            err.set('username', {status: true, text: 'username nên dài hơn 8 kí tự'})
        };
        if (user.password == undefined || user.password == null || user.password == '') {
            err.set('password', {status: true, text: 'Password không nên để trống'})
        }
        else if (user.password.length < 6) {
            err.set('password', {status: true, text: 'Password nên dài hơn 6 kí tự'})
        };
        if (user.firstName == undefined || user.firstName == null || user.firstName == '') {
            err.set('firstName', {status: true, text: 'Firstname không nên để trống'})
        };
        if (user.lastName == undefined || user.lastName == null || user.lastName == '') {
            err.set('lastName', {status: true, text: 'Lastname không nên để trống'})
        };
        setError(err)
        if (err.size > 0) return;
        // const res = await post('/auth/create-account?role=' +  role, {
        //     username: user.username,
        //     password: user.password
        // })
        const res = await authService.createAcc({
            username: user.username,
            password: user.password,
            name: user.lastName + " " + user.firstName,
            phoneNumber: user.phoneNumber
        }, role)
        navigate('/ql-giao-hang/danh-sach-nhan-vien')
    }
    
    return(
        <Box sx={{mt: 3}}>
            <Paper sx={{p: 3}}>
                <Box>
                    <Typography sx={{fontWeight: 'bold', fontSize: '16px', color: "#0d47a1"}}>
                        Tài khoản:
                    </Typography>

                    <Box sx={{mt: 1, mb: 3}}>
                        <Typography sx={{fontSize: '13px'}}>
                            Username
                        </Typography>

                        {error?.get('username')?.status?
                        <TextField fullWidth variant="standard" placeholder="Username"
                        required onChange={(e) => setUser({...user, username: e.target.value})}
                        error
                        helperText={error?.get('username')?.text}
                        />:
                        <TextField fullWidth variant="standard" placeholder="Username"
                        required onChange={(e) => setUser({...user, username: e.target.value})} />
                        }

                    </Box>

                    <Box sx={{mt: 2, mb: 2}}>
                        <Typography sx={{fontSize: '13px'}}>
                            Password
                        </Typography>

                        {error?.get('password')?.status?
                        <TextField fullWidth variant="standard" placeholder="Password" type="password"
                        required onChange={(e) => setUser({...user, password: e.target.value})}
                        error
                        helperText={error?.get('password')?.text}
                        />:
                        <TextField fullWidth variant="standard" placeholder="Password" type="password"
                        required onChange={(e) => setUser({...user, password: e.target.value})} />
                        }       
                    </Box>
                </Box>

                <Box sx={{mt: 6}}>
                    <Typography  sx={{fontWeight: 'bold', fontSize: '16px', mt: 3, color: "#0d47a1"}}>
                        Thông tin chi tiết:
                    </Typography>

                    <Grid sx={{mt: 1, mb: 3}} container columnSpacing={6}>
                        <Grid item xs={6}>
                            <Typography sx={{fontSize: '13px'}}>
                                First name
                            </Typography>
                            {error?.get('firstName')?.status?
                            <TextField fullWidth variant="standard" placeholder="Firstname"
                            required onChange={(e) => setUser({...user, firstName: e.target.value})}
                            error
                            helperText={error?.get('firstName')?.text}
                            />:
                            <TextField fullWidth variant="standard" placeholder="Firstname"
                            required onChange={(e) => setUser({...user, firstName: e.target.value})} />
                            }
                        </Grid>

                        <Grid item xs={6}>
                            <Typography sx={{fontSize: '13px'}}>
                                Last name
                            </Typography>
                            {error?.get('lastName')?.status?
                            <TextField fullWidth variant="standard" placeholder="Lastname"
                            required onChange={(e) => setUser({...user, lastName: e.target.value})}
                            error
                            helperText={error?.get('firstName')?.text}
                            />:
                            <TextField fullWidth variant="standard" placeholder="Lastname"
                            required onChange={(e) => setUser({...user, lastName: e.target.value})} />
                            }
                        </Grid>
                    </Grid>

                    <Box sx={{mt: 1, mb: 3}}>
                        <Typography sx={{fontSize: '13px'}}>
                            Số điện thoại
                        </Typography>

                        <TextField fullWidth variant="standard" placeholder="Số điện thoại"
                        required onChange={(e) => setUser({...user, phoneNumber: e.target.value})} />
                    </Box>

                    <Box sx={{mt: 2, mb: 2}}>
                        <Typography sx={{fontSize: '13px'}}>
                            Chức vụ
                        </Typography>

                        <Select sx={{width: '100%'}} variant="standard"
                        value={role}
                        onChange={(e) => {
                            setUser({...user, role: e.target.value})
                            setRole(e.target.value)}}>
                            <MenuItem value={'ROLE_CARRIER'}>Nhân viên giao hàng</MenuItem>
                            <MenuItem value={'ROLE_COORDINATOR'}>Nhân viên điều phối</MenuItem>
                        </Select>
                    </Box>
                </Box>

                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', mt: 15}}>
                    <Button variant="contained" color="success" size="small" onClick={handleSubmit}>
                        Tạo tài khoản
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}