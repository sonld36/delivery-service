/* eslint-disable react-hooks/exhaustive-deps */
import { UploadImageType } from '@Common/types'
import { selectFile } from '@Helpers/image.handle'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { Badge, Box, ButtonBase, FormHelperText, IconButton, Link, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import DisplayImage from './DisplayImage'

// type Props = {
//   control: Control<any>
// }

export const defaultImageUploadState: UploadImageType = {
  currentFile: undefined,
  previewImage: undefined,
  progress: 0,

  message: "",
  isError: false,
  imageInfos: [],
}

function UploadImages() {
  // const { control } = props;

  const { register, watch, setValue, getValues } = useFormContext();
  const imageEdit = getValues("image");

  const [image, setImage] = useState<UploadImageType>(defaultImageUploadState);

  const watchImage = watch("image", false);

  useEffect(() => {
    if (imageEdit) {
      setImage(selectFile(imageEdit, defaultImageUploadState));
    }
  }, [])

  useEffect(() => {
    const subcription = watch((value, { name }) => {
      if (name === "image" && value.image) {
        const imageCurrent = value.image[0];
        setImage(selectFile(imageCurrent, defaultImageUploadState));
      }
    });
    return () => subcription.unsubscribe();
  }, [watch]);

  return (
    <>
      {
        image.currentFile && watchImage ? (
          <Box sx={{
            height: "100%",
            width: "fit-content",
            margin: "auto",
            mt: "10px"
          }}>

            <Badge
              badgeContent={<ButtonBase onClick={() => {
                setImage(defaultImageUploadState);
                setValue("image", undefined);
              }}>
                <FormHelperText sx={{
                  cursor: "pointer",
                  color: "white",
                }}
                >X</FormHelperText>
              </ButtonBase>} color="secondary">
              <DisplayImage style={{
                width: "200px"
              }} src={image.previewImage ? image.previewImage : ""} />
            </Badge>
          </Box>
        ) : (
          <IconButton color="primary" aria-label="upload picture" component="label"
            sx={{
              // height: "inherit",
              width: "100%",
              borderRadius: "0",
              border: "1px darkgray dotted",
              height: "150px"
            }}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              // name='image'
              {...register("image")}
            // onChange={(event) => {
            //   onImageChange(event);
            // }}
            />
            <PhotoCamera color="disabled" />
            <FormHelperText>
              <Link sx={{
                textDecoration: "none"
              }}>Tải lên ảnh</Link>
            </FormHelperText>
          </IconButton>
        )
      }
    </>
  )
}

export default UploadImages