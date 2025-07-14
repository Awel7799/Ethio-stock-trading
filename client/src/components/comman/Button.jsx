function Button({children ,variant="primary",type="button", onClick }) {
  const baseStyle = "rounded px-4 py-2 font-semibold";
  const variants ={
    primary : "bg-green-600 text-white hover:bg-green-700",
    secondary : "bg-gray-200 text-black hover:bg-gray-300",
    danger : "bg-red-500 text-white hover:bg-red-600"
  }
  
    return (
    <button type={type} className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {children }
    </button>
  );
}

export default Button;