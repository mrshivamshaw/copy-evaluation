import { useNavigate } from "react-router-dom"
import { logout } from "../servies/operations/authOpertaion"
import { useDispatch } from "react-redux"


export default function Header({ userType }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <header className="bg-blue-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Copy Evaluation System</h1>
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs">
            {userType === "admin" ? "Admin" : userType === "teacher" ? "Teacher" : "Student"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-white px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

