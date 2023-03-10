import { useAppDispatch } from '@App/hook';
import { ProductToastPayload } from '@Common/toast.const';
import { ProductPaging, ProductSaveType, ResponseReceived, UploadImageType } from '@Common/types';
import DisplayImage from '@Components/DisplayImage';
import Orders from '@Components/Table';
import TransitionsModal from '@Components/TransitionsModal';
import { defaultImageUploadState } from '@Components/UploadImages';
import { openToast } from '@Features/toast/toastSlice';
import { createFormData, saveProductSchema } from '@Helpers/form.validate';
import { selectFile } from '@Helpers/image.handle';
import { MappingProduct } from '@Helpers/list.handle';
import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import shopService from '@Services/shop.service';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf } from 'zod';
import ProductForm from './ProductForm';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Chip } from '@mui/material';
import { productStatusColor } from '@Common/const';

export type ProductSaveForm = TypeOf<typeof saveProductSchema>

function ProductList() {

  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductSaveType[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [idProductDelete, setIdProductDelete] = useState<number | null>(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [curDataEdit, setCurDataEdit] = useState<ProductSaveForm>({
    name: "",
    active: false,
    entryPrice: 0,
    productCode: "",
    salePrice: 0,
    weight: 0,
    image: undefined,
    id: "",
  });


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
    setAnchorEl(event.currentTarget);
    setIdProductDelete(id);
  }

  const handleAgreeDelete = async (event: React.MouseEvent<HTMLLIElement>) => {
    if (idProductDelete) {
      const resp: ResponseReceived<number> = await shopService.deleteProduct(idProductDelete);
      if (resp.status && resp.status >= 300) {
        dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 4001]));
      } else {
        dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 2001]));
        setReload(!reload);
      }

      handleClose();
      setIdProductDelete(null);
    }
  }

  const colums: GridColumns = [
    { field: "id", headerName: "ID", width: 60, editable: false, headerAlign: "center", align: "center" },
    {
      field: "image", headerName: "Ảnh sản phẩm", renderCell(params) {
        const { value } = params;
        const imageObject: UploadImageType = selectFile(value, defaultImageUploadState);
        return (
          <DisplayImage style={{
            width: "100px",
            height: "50px"
          }} src={imageObject.previewImage ? imageObject.previewImage : ""} />
        )
      },
      width: 150,
      align: "center", flex: 1,
      headerAlign: "center",
      sortable: false,


    },
    { field: "productCode", headerName: "Mã sản phẩm", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "name", headerName: "Tên", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "salePrice", headerName: "Giá bán", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "entryPrice", headerName: "Giá nhập", type: "number", align: "center", flex: 1, headerAlign: "center" },
    { field: "weight", headerName: "Khối lượng", type: "number", align: "center", flex: 1, headerAlign: "center" },
    {
      field: "active", headerName: "Trạng thái", type: "boolean", align: "center", headerAlign: "center", renderCell(params) {
        const { row: { active, id } } = params;
        return <Chip label={active ? "Đang kinh doanh" : "Ngừng kinh doanh"} color={active ? productStatusColor.ACTIVE : productStatusColor.INACTIVE} key={id} variant="outlined" />

      },
      width: 200
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              setCurDataEdit(row);
              setOpenModalUpdate(true);
            }}
            color="inherit"
          />,
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
            <MenuItem onClick={(event) => handleAgreeDelete(event)}>
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

  const methods = useForm<ProductSaveForm>({
    resolver: zodResolver(saveProductSchema),
    defaultValues: (curDataEdit)
  });

  const {
    formState: { isSubmitSuccessful },
    reset,
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful && !openModalUpdate) {
      reset();
    } else if (openModalUpdate) {
      reset(curDataEdit);
    }
  }, [isSubmitSuccessful, reset, openModalUpdate, curDataEdit]);

  useEffect(() => {
    const getProductList = async () => {
      setLoading(true);
      const resp: ResponseReceived<ProductPaging> = await shopService.getProductList(page);
      setTotalPage(resp.data.totalPage);

      var resultList: ProductSaveType[] = await Promise.all(resp.data.products.map(async (item) => {
        return await MappingProduct(item).then();
      }));

      setLoading(false);
      setData(resultList);
    }

    getProductList();
  }, [page, openModalUpdate, reload]);

  const handleSubmitUpdateForm: SubmitHandler<ProductSaveForm> = async (values, event) => {

    const form: FormData = createFormData(values);

    const resp: ResponseReceived<any> = await shopService.updateProduct(form);

    if (resp.status && resp.status >= 300) {
      dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 2001]));
      setOpenModalUpdate(false);
    }

  }


  return (<>
    <TransitionsModal open={openModalUpdate} setOpen={setOpenModalUpdate}
      content={(
        <FormProvider {...methods}>
          <ProductForm handleSubmitForm={handleSubmitUpdateForm} />
        </FormProvider>
      )} />
    <Orders header={colums} title={"Danh sách sản phẩm"} data={data} totalPage={totalPage} setPage={setPage} loading={loading} />

  </>)
}

export default ProductList;