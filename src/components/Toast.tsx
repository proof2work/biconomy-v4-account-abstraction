import { Toaster } from "react-hot-toast"

export const Toast = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "bg-white text-black rounded-sm",
        duration: 5000,

        // Default options for specific types
        success: {
          className: "bg-green-500 text-white",
        },
        loading: {
          duration: Infinity
        }
      }}
    />
  )
}
