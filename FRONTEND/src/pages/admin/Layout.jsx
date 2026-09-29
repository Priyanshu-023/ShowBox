import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useContext, useEffect } from "react";
import { AppDataContext } from "../../context/AppContext";
import Loading from "../../components/Loading";


const Layout = () => {

  const {isAdmin , fetchIsAdmin} = useContext(AppDataContext);

  useEffect(()=>{
    fetchIsAdmin()
  },[])
  
  return  isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </>
  ) : < Loading />
};

export default Layout