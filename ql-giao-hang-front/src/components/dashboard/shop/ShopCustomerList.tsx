import { Chip, darken, lighten, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerType, AddressToSave, ResponseReceived } from '@Common/types';
import customerService from '@Services/customer.service';
import Orders from '@Components/Table';
import provinceService from '@Services/province.service';
import DetailsIcon from '@mui/icons-material/Details';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AddressSelection from '@Components/AddressSelection';
import Button from '@mui/material/Button';
import { TypeOf } from 'zod';
import { addAddressSchema } from '@Helpers/form.validate';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { openToast } from '@Features/toast/toastSlice';
import { CustomerToastPayload } from '@Common/toast.const';
import { useAppDispatch } from '@App/hook';
import Tooltip from '@mui/material/Tooltip';

type AddAddressForm = TypeOf<typeof addAddressSchema>;

function ShopCustomerList() {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [customers, setCustomers] = useState<CustomerType<AddressToSave[]>[]>([]);
  const [customerWithAddressText, setCustomerWithAddressText] = useState<CustomerType<string[]>[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [idCustomerHandleAction, setIdCustomerHandleAction] = useState();
  const dispatch = useAppDispatch();

  const [anchorElForAddress, setAnchorElForAddress] = React.useState<null | HTMLElement>(null);
  const openAddress = Boolean(anchorElForAddress);

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  const methodsChild = useForm<AddAddressForm>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      addressDetail: "",
      address: undefined,
    }
  });

  const { control,
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = methodsChild;


  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElForAddress(null);
  };


  const handleClickAddress = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElForAddress(event.currentTarget);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
    setIdCustomerHandleAction(id);
    setAnchorEl(event.currentTarget);
    // setIdProductDelete(id);
  }

  const handleDeleteAddressForCustomer = async (idCustomer: number, idAddress: number) => {
    const resp = await customerService.deleteAddress(idAddress, idCustomer);

    if (resp.status && resp.status >= 300) {
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 2001]));
      setReload(!reload);
    }
  }

  const handleAgreeDeleteCustomer = async () => {
    if (idCustomerHandleAction) {
      const resp = await customerService.deleteCustomer(idCustomerHandleAction);
      if (resp.status && resp.status >= 300) {
        dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 4001]));
      } else {
        dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 2001]));
        setReload(!reload);
      }
      handleClose();
    }

  }

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      const resp = await customerService.getAddress(page);
      const data = resp.data;
      const customersAddressText = await Promise.all(data.customers.map(async (item) => {
        const addressesText = await Promise.all(item.addresses.map(async (address) => {
          return await provinceService.getAddress(address);
        })).then()


        return {
          ...item,
          addresses: addressesText
        }
      })).then();
      setLoading(false);

      setCustomerWithAddressText(customersAddressText);

      setCustomers(data.customers);
      setTotalPage(data.totalPage);
    }

    fetchCustomer();
  }, [page, reload])

  const colums: GridColumns = [
    { field: "id", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },
    { field: "name", headerName: "Tên", width: 150, headerAlign: "center", align: "center", editable: false },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150, align: "center", headerAlign: "center", editable: false },
    {
      field: "addresses.0", headerName: "Địa chỉ 1", width: 200, align: "center", flex: 1, headerAlign: "center", renderCell(params) {
        const { row } = params;
        const index = customers.indexOf(row);

        if (!customerWithAddressText[index].addresses[0]) {
          return <Chip key={row.id} label={"Thêm địa chỉ"}
            onClick={(event) => {
              setIdCustomerHandleAction(row.id);
              handleClickAddress(event);
            }}
            aria-controls={open ? 'add-address' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          />
        }

        return (
          <Tooltip title={customerWithAddressText[index].addresses[0]} placement="top">
            <Chip key={row.id} color="success" variant="outlined" label={customerWithAddressText[index].addresses[0]}
              sx={{
                cursor: "pointer",
              }}
              onDelete={(event) => {
                handleDeleteAddressForCustomer(row.id, row.addresses[0].id);
              }}
            />
          </Tooltip>

        )
      },
    },
    {
      field: "addresses.1", headerName: "Địa chỉ 2", width: 200, align: "center", flex: 1, headerAlign: "center", renderCell(params) {

        const { row } = params;
        const index = customers.indexOf(row);

        if (!customerWithAddressText[index].addresses[1]) {
          return <Chip key={row.id} label={"Thêm địa chỉ"} sx={{

            cursor: "pointer",
            "&:hover": {
              bgcolor: (theme) =>
                getHoverBackgroundColor(theme.palette.info.main, theme.palette.mode),
              color: "#ffffff",

            }
          }}
            onClick={(event) => {
              setIdCustomerHandleAction(row.id);
              handleClickAddress(event);
            }}
            aria-controls={open ? 'add-address' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          />
        }

        return (
          <Tooltip title={customerWithAddressText[index].addresses[1]} placement="top">
            <Chip key={row.id} color="success" variant="outlined" label={customerWithAddressText[index].addresses[1]}
              sx={{
                cursor: "pointer",
              }}
              onDelete={(event) => {
                handleDeleteAddressForCustomer(row.id, row.addresses[1].id);
              }}
            />
          </Tooltip>
        )
      },
    },
    {
      field: "addresses.2", headerName: "Địa chỉ 3", width: 200, align: "center", flex: 1, headerAlign: "center", renderCell(params) {
        const { row } = params;
        const index = customers.indexOf(row);

        if (!customerWithAddressText[index].addresses[2]) {
          return <Chip key={row.id} label={"Thêm địa chỉ"} sx={{

            cursor: "pointer",
            "&:hover": {
              bgcolor: (theme) =>
                getHoverBackgroundColor(theme.palette.info.main, theme.palette.mode),
              color: "#ffffff",

            }
          }}

            onClick={(event) => {
              setIdCustomerHandleAction(row.id);
              handleClickAddress(event);
            }}
            aria-controls={open ? 'add-address' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined} />
        }

        return (
          <Tooltip title={customerWithAddressText[index].addresses[2]} placement="top">
            <Chip key={row.id} color="success" variant="outlined" label={customerWithAddressText[index].addresses[2]}
              sx={{
                cursor: "pointer",
              }}
              onDelete={(event) => {
                handleDeleteAddressForCustomer(row.id, row.addresses[2].id);
              }}
            />
          </Tooltip>
        )
      },
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={(event) => handleDeleteClick(event, id)}
            color="inherit"
          />,
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={handleAgreeDeleteCustomer}
            >
              <ListItemIcon>
                <DoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ fontSize: "15px" }}>Đồng ý</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}><ListItemIcon>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
              <ListItemText sx={{ fontSize: "15px" }}>Từ chối</ListItemText></MenuItem>
          </Menu>
        ];
      }
    }
  ]

  const handleSubmitCreateAddressForm: SubmitHandler<AddAddressForm> = async (values, event) => {
    event?.preventDefault();
    const data: AddressToSave = {
      addressDetail: values.addressDetail,
      ...values.address
    }
    if (idCustomerHandleAction) {
      const resp: ResponseReceived<AddressToSave> = await customerService.addAddress(data, idCustomerHandleAction);
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 2001]));
      reset();
      handleClose();
      setReload(!reload);
    }
  }

  return (
    <>
      <Orders data={customers} title={"Danh sách khách hàng"} setPage={setPage} totalPage={totalPage} header={colums} loading={loading} />
      <Menu
        anchorEl={anchorElForAddress}
        id="add-address"
        open={openAddress}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box
          component={"form"}
          noValidate
          onSubmit={methodsChild.handleSubmit(handleSubmitCreateAddressForm)}
        >
          <MenuItem >
            <TextField
              id="input-with-icon-textfield"
              label="Địa chỉ chi tiết"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DetailsIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              fullWidth
              error={!!errors["addressDetail"]}
              helperText={errors["addressDetail"] ? errors["addressDetail"].message?.toString() : ""}
              {...register("addressDetail")}
            />
          </MenuItem>
          <MenuItem >
            <AddressSelection control={control} />
          </MenuItem>
          <MenuItem sx={{
            float: 'right'
          }}>
            <Button size="small"
              type='submit'
            >Thêm</Button>
          </MenuItem>
        </Box>
      </Menu>
    </>
  )
}

export default ShopCustomerList