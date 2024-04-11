const Button = ({ title, onClick }: { title: string; onClick: () => void }) => {
  return (
    <button
      onClick={() => onClick()}
      className="rounded-lg bg-indigo-500 px-3 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-indigo-400"
    >
      {title}
    </button>
  )
}

export default Button
