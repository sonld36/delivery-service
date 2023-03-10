import { useAppDispatch } from '@App/hook';
import { ToastPayload } from '@Common/toast.const';
import { ShopRegisterForm } from '@Common/types';
import PartnerRegistrationModal from '@Components/dashboard/shop/PartnerRegistrationModal';
import { openToast } from '@Features/toast/toastSlice';
import { dataShopRegistrationOptimize } from '@Helpers/data.optimize';
import { registerSchema } from '@Helpers/form.validate';
import { MainLogo } from '@Helpers/image.handle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, Step, StepButton, Stepper, Typography } from "@mui/material";
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import authService from '@Services/auth.service';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { TypeOf } from 'zod';
import Authenication from '.';
import RegisterAccount from './RegisterAccount';

type RegisterInput = TypeOf<typeof registerSchema>

const steps = ["Thông tin tài khoản", "Thông tin cửa hàng"];

export default function Register() {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const [currentPage, setCurrentPage] = React.useState<React.ReactNode>(<RegisterAccount />)

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };


  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = methods;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  React.useEffect(() => {
    const switchStep = () => {
      switch (activeStep) {
        case 0: {
          setCurrentPage(<RegisterAccount />);
          break;
        }
        case 1: {
          setCurrentPage(<PartnerRegistrationModal />);
          break;
        }
        default: setCurrentPage(<RegisterAccount />);
      }
    }

    switchStep();
  }
    , [activeStep]);



  const onSubmitHandler: SubmitHandler<RegisterInput> = async (values) => {
    setLoading(true);
    let data: ShopRegisterForm = dataShopRegistrationOptimize(values);
    const resp = await authService.shopRegister(data);

    setLoading(false);
    if (resp.status && resp.status >= 300) {
      dispatch(openToast(ToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(ToastPayload[resp.code ? resp.code : 2002]));
      return navigate("/login");
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
            // height: "100px"
          }}
        >
          <img src={MainLogo} alt="logo-sapo" />
        </Grid>
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5"
          sx={{
            fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif',
            fontSize: '26px',
            fontWeight: '500',
            color: '#212b35'
          }}>
          Đăng ký
        </Typography>

        <Box
          sx={{
            padding: "20px 0"
          }}
        >
          <Stepper nonLinear
            activeStep={activeStep}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 1 }}>
          <FormProvider {...methods}>
            {currentPage}
          </FormProvider>
          <Box
            sx={{
              display: 'flex',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {isLastStep() ? (
              <Box sx={{
                display: "flex",
                justifyContent: "space-around ",
                width: "100%"
              }}>
                <Box
                  sx={{
                    // width: "100%"
                    height: "fit-content",
                    margin: "auto 0",

                  }}
                // startIcon={loading && <CircularProgress color="inherit" size={"1rem"} />}

                >
                  <Chip label="<< Quay lại" variant="outlined" sx={{
                    float: "left",
                    cursor: "pointer"
                  }} onClick={handleBack} />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    // mt: 3, mb: 3,
                    backgroundColor: "#80ECD0",
                    borderRadius: '50px',
                    lineHeight: '40px',
                    fontWeight: '500',
                    fontSize: '20px',
                    padding: '10px 40px',
                    width: 'fit-content',
                    '&:hover': {
                      backgroundColor: "#0FD186"
                    }
                  }}
                  startIcon={loading && <CircularProgress color="inherit" size={"1rem"} />}
                >
                  Đăng ký
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                }}
              // startIcon={loading && <CircularProgress color="inherit" size={"1rem"} />}

              >
                <Chip label="Tiếp theo >>" variant="outlined" sx={{
                  float: "right",
                  cursor: "pointer"
                }} onClick={handleNext} />
              </Box>
            )}

          </Box>
          <Grid container>
            <Grid item>
              <Link to="/login"
                style={{
                  color: '#08f',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}>
                {"Bạn đã có tài khoản? Đăng nhập"}
              </Link>
            </Grid>
          </Grid>

        </Box>

      </Box>
    </Authenication >
  )
}