import toast from "react-hot-toast";

export function toastHandler(response, data) {
  if (response.ok) {
    toast.success(response.status + " " + data.message);
  } else {
    toast.error(data.message);
  }
}
