import { Grid, TextField } from "@mui/material";
import { useFormContext } from 'react-hook-form';

function RegisterAccount() {
  const methods = useFormContext();

  const {
    formState: { errors },
    register
  } = methods;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            // name="email"
            autoComplete="email"
            autoFocus
            error={!!errors['email']}
            helperText={errors['email'] ? errors['email'].message?.toString() : ""}
            {...register('email')}
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên tài khoản"
            // name="username"
            autoFocus
            error={!!errors['username']}
            helperText={errors['username'] ? errors['username'].message?.toString() : ""}
            {...register('username')}
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            type={"password"}
            id="password"
            label="Mật khẩu"
            // name="password"
            autoFocus
            error={!!errors['password']}
            helperText={errors['password'] ? errors['password'].message?.toString() : ""}
            {...register('password')}
            sx={{ mt: 1 }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            type={"password"}
            id="confirm_password"
            label="Nhập lại mật khẩu"
            // name="confirmPassword"
            autoFocus
            error={!!errors['passwordConfirm']}
            helperText={errors['passwordConfirm'] ? errors['passwordConfirm'].message?.toString() : ""}
            {...register('passwordConfirm')}
            sx={{ mt: 1 }}
          />
        </Grid>

      </Grid>
    </>
  )
}

export default RegisterAccount