// import UserList from "./components/UserList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from "./pages/Login";
import { Navigate, Outlet } from "react-router-dom";
import { UTIL_CONST } from "./utils";
import Import from "./pages/Import";
import LayoutFront from "./pages/front-office/LayoutFront";
import { LoginFront } from "./pages/front-office/LoginFront";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from "react";
import Article from "./pages/Article";
import DashBoardParc from "./pages/DashBoardParc";
import DashBoardTicket from "./pages/DashBoardTicket";
import { Tickets } from "./pages/tickets/Tickets";
import TicketFiche from "./pages/TicketFiche";
import Item from "./pages/front-office/Item";
import TicketSaisie from "./pages/front-office/TicketSaisie";
import TicketStatus from "./pages/front-office/TicketStatus";
import StatusColor from "./pages/StatusColor";
import StatusLang from "./pages/StatusLang";
import ItemTypeCosts from "./pages/front-office/ItemTypeCosts";

// Définition des composants de protection en dehors de App pour éviter la recréation à chaque render
const ProtectedFrontOfficeceRoute = () => {
  // const storage = localStorage.getItem(FRONT_OFFICE.user);
  // const customer = storage ? JSON.parse(storage) : null;
  // if (!customer) {
  //   return <Navigate to="/" replace />;
  // }
  return <Outlet />;
};

const ProtectedBackOfficeRoute = () => {
  const storage = localStorage.getItem(UTIL_CONST.user);
  const employee = storage ? JSON.parse(storage) : null;
  if (!employee) {
    return <Navigate to="/backoffice" replace />;
  }
  return <Outlet />;
};

export function App() {
  const [darkMode, setDarkMode] = useState(true);





  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes  >

        {/* backoffice */}
        <Route path="/backoffice" element={<Login />} />
        <Route element={<ProtectedBackOfficeRoute />} >
          <Route path="/backoffice/admin" element={<Layout />} >
            <Route path="imports" element={<Import />} ></Route>
            {/* tickets */}
            <Route path="ticket" element={<Tickets />} ></Route>
            <Route path="ticket/:idTicket" element={<TicketFiche />} ></Route>


            {/* stats */}
            <Route path="dashboard-parc" element={<DashBoardParc />} ></Route>
            <Route path="dashboard-ticket" element={<DashBoardTicket />} ></Route>

            {/* config */}
            <Route path="status-color" element={<StatusColor />} ></Route>
            <Route path="status-lang" element={<StatusLang />} ></Route>


            <Route path="articles" element={<Article />} ></Route>
          </Route>
        </Route>


        {/* front */}
        <Route path="/" element={<LoginFront />} />
        {/* <Route element={<ProtectedFrontOfficeceRoute />} > */}
        <Route path="/frontoffice" element={<LayoutFront />} >
          <Route path="item" element={<Item />} ></Route>
          <Route path="ticket-saisie" element={<TicketSaisie />} ></Route>
          <Route path="ticket-status" element={<TicketStatus />} ></Route>
          <Route path="itemType-cost" element={<ItemTypeCosts />} ></Route>

        </Route>
        {/* </Route> */}

      </Routes>
    </BrowserRouter>

  )
}
