import { errorCode } from "../../config/errorCode";

export const checkFileNotExist = (file: any) => {
  if (!file) {
    const error: any = new Error("Invalid File!");
    error.status = 409;
    error.code = errorCode.invalid;
    throw error;
  }
};
