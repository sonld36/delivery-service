import { ProductSaveType, ProductType, UploadImageType } from '@Common/types';
import DisplayImage from '@Components/DisplayImage';
import Orders from '@Components/Table';
import { defaultImageUploadState } from '@Components/UploadImages';
import { selectFile } from '@Helpers/image.handle';
import { MappingProduct } from '@Helpers/list.handle';
import InfoIcon from '@mui/icons-material/Info';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Chip, IconButton, ImageList, ImageListItem, ImageListItemBar, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Typography from '@mui/material/Typography';


function ProductDisplay() {
  // const { products } = props;
  const methods = useFormContext();
  const { watch, register, control } = methods;

  const productWatch: ProductType[] = watch("products", []);

  const [productFetched, setProductFetched] = useState<ProductSaveType[]>([]);
  const [loading, setLoading] = useState(false);

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
      align: "center",
      headerAlign: "center",
      sortable: false,


    },
    { field: "productCode", headerName: "Mã sản phẩm", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "name", headerName: "Tên", width: 150, headerAlign: "center", align: "center", flex: 1 },
    { field: "salePrice", headerName: "Giá(VNĐ)", align: "center", type: "number", headerAlign: "center", flex: 1 },
    { field: "weight", headerName: "Khối lượng(kg)", align: "center", headerAlign: "center", flex: 1 },
    {
      field: "quantity", headerName: "Số lượng", align: "center", headerAlign: "center", renderCell(params) {
        const { row } = params;

        const index = productFetched.indexOf(row);
        return (
          <TextField size='small' id="outlined-number"
            // label="Số lượng"
            type="number"
            InputProps={{ inputProps: { min: "1", step: "1" } }}
            defaultValue={1}
            fullWidth
            sx={{
              padding: "0 5px !important",

            }}
            // variant="outlined"
            {...register(`products.${index}.quantity`)}
          />
        )
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hủy bỏ',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [

          <Controller
            control={control}
            name={"products"}
            render={({ field: { onChange } }) => (
              <GridActionsCellItem
                icon={<RemoveCircleIcon />}
                label="Hủy"
                onClick={(event) => {
                  const product = productWatch.filter((v, i) => v.id !== id);
                  onChange(product);
                }
                }
                color="inherit"
              />
            )}

          />

        ]
      }
    }
  ]

  useEffect(() => {
    const fetchProduct = async () => {


      if (productWatch.length > productFetched.length) {
        setLoading(true);
        const productsOptimize = await MappingProduct(productWatch[productWatch.length - 1]);
        setLoading(false);
        setProductFetched([
          ...productFetched,
          productsOptimize
        ]);
      } else if (productWatch.length < productFetched.length) {
        const currentIds = productWatch.map(item => item.id);
        const currentProduct = productFetched.filter((item: ProductSaveType) => item.id && currentIds.includes(item.id));
        setProductFetched(currentProduct);
      }


    }

    fetchProduct();

  }, [productWatch]);


  return (
    <>
      <Controller
        name='products'
        control={control}
        render={({ field: { onChange } }) => (
          <Orders header={colums} data={productFetched} hiddeFooter={true} loading={loading} />
        )}
      />

    </>
  )
}
export default ProductDisplay