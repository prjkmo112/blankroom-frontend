import { Outlet } from "react-router-dom"
import FooterPart from "./components/FooterPart"
import HeaderPart from "./components/HeaderPart"

const MainLayout = () => {
  return (
    <div className="main-layout">
      <HeaderPart />
      <div style={{ margin: "0 auto", minHeight: '50vh', maxWidth: '85vw' }}>
        <Outlet />
      </div>

      <FooterPart />
    </div>
  )
}

export default MainLayout