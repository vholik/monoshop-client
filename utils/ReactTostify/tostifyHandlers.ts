import { toast } from "react-toastify";

export const showSuccesToast = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    toastId: Math.random(),
    closeOnClick: true,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    toastId: Math.random(),
    closeOnClick: true,
  });
};

export const showLoadingToast = (message: string) => {
  toast.loading(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    toastId: Math.random(),
    closeOnClick: true,
  });
};
