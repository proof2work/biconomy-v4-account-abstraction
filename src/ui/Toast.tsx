import { Toaster } from "react-hot-toast"

const Toast = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "bg-white text-black rounded-sm w-80",
        duration: 4000,

        style: {
          minWidth: "400px",
        },

        // Default options for specific types
        success: {
          className: "bg-green-500 text-white w-80",
        },
        loading: {
          duration: Infinity,
        },
      }}
    />
  )
}

export default Toast
