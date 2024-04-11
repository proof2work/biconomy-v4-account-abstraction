const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-screen">
      <div className="my-4 flex justify-center gap-1 text-sm text-white">
        <span>Made with ❤️ by</span>
        <a
          href="https://proof2work.com"
          target="_blank"
          className="font-medium transition-all duration-300 ease-in-out hover:text-indigo-400"
        >
          Proof2work
        </a>
      </div>
    </footer>
  )
}

export default Footer
