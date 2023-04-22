import { useAppDispatch } from '@App/hook';
import { ProductToastPayload } from '@Common/toast.const';
import { ResponseReceived } from '@Common/types';
import { openToast } from '@Features/toast/toastSlice';
import { createFormData, saveProductSchema } from '@Helpers/form.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import shopService from '@Services/shop.service';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TypeOf } from 'zod';
import ProductForm from './ProductForm';



export type ProductSaveForm = TypeOf<typeof saveProductSchema>

function CreateNewProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submited, setSubmited] = useState(false);

  const methods = useForm<ProductSaveForm>({
    resolver: zodResolver(saveProductSchema),
    defaultValues: ({
      name: "",
      active: true,
      productCode: "",
      salePrice: 0,
      weight: 0,
      image: undefined
    })
  });

  const {
    formState: { isSubmitSuccessful },
    reset,
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful && submited) {
      reset();
    }
  }, [isSubmitSuccessful, reset, submited]);

  // console.log(useWatch({ name: "image" }));

  const handleSubmitForm: SubmitHandler<ProductSaveForm> = async (values) => {
    const data: FormData = createFormData(values);

    const resp: ResponseReceived<any> = await shopService.createProduct(data);

    if (resp.status && resp.status >= 300) {
      dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(ProductToastPayload[resp.code ? resp.code : 2001]));
      setSubmited(true);
      navigate("/shop/san-pham");
    }
  }

  return (
    <FormProvider {...methods}>
      <ProductForm handleSubmitForm={handleSubmitForm} />
    </FormProvider>
  )
}

export default CreateNewProduct