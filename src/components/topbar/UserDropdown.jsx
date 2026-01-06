import { useAuth } from "../../context/AuthContext";


const UserDropdown = () => {

    const {logout} = useAuth();

  return (
    <div className='user-dropdown'>
        <span className="user-link" onClick={logout}>Logout</span>
    </div>
  )


}

export default UserDropdown;