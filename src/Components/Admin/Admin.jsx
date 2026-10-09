import { Outlet } from "react-router-dom";
import Adminstyles from "./Admin.module.css";
import { Sidebar } from "../Sidebar/sidebar";

const Admin = () => {
  return (
    <div className={Adminstyles["adm-page"]}>
      <Sidebar />
      <main className={Adminstyles["adm-main"]}>
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;