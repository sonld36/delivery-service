import { UploadImageType } from "@Common/types";

export { default as LoginBackgroundImage } from "@Images/background_login_register.png";
export { default as MainLogo } from "@Images/Sapo-logo-tet 1.png";

export const selectFile = (
  file: File,
  currentState: UploadImageType
): UploadImageType => {
  return {
    ...currentState,
    currentFile: file,
    previewImage: URL.createObjectURL(file),
    progress: 0,
    message: "",
  };
};
