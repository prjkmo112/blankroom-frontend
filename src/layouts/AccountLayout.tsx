import { usePageStore } from "@/stores/pageStore"
import { Outlet } from "react-router-dom"

const AccountLayout: React.FC = () => {
  const { baseInfo } = usePageStore()

  return (
    <div className="w-2/5 m-auto">
      <h2 className="text-2xl text-center mb-4">{baseInfo.title}</h2>
      <p className="text-center text-gray-600 mb-6">{baseInfo.description}</p>
      <div className="mt-24">
        <Outlet />
      </div>
    </div>
  )
}

export default AccountLayout