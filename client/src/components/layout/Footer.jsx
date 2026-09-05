export default function Footer() {
  return (
    <footer className="app-footer">
      <span>TradeWise markets</span>
      <span>Data provided by connected market services</span>
      <span>{new Date().getFullYear()} TradeWise</span>
    </footer>
  )
}
