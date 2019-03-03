import Dashboard from 'views/Dashboard/Dashboard';
import UserProfile from 'views/UserProfile/UserProfile';
//import PatientManagement from 'views/PatientManagement/PatientManagement';
import AssignedPatientManagement from 'views/nurse/AssignedPatientManagement/AssignedPatientManagement';
import TableList from 'views/TableList/TableList';
import Typography from 'views/Typography/Typography';
import Icons from 'views/Icons/Icons';
import Maps from 'views/Maps/Maps';
import Notifications from 'views/Notifications/Notifications';
import Upgrade from 'views/Upgrade/Upgrade';

const appRoutes = [
    // { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/nurse/patient-assigned", name: "Assigned Patients", icon: "pe-7s-user", component: AssignedPatientManagement },
    // { path: "/user", name: "User Profile", icon: "pe-7s-user", component: UserProfile },
    // { path: "/table", name: "Table List", icon: "pe-7s-note2", component: TableList },
    // { path: "/typography", name: "Typography", icon: "pe-7s-news-paper", component: Typography },
    // { path: "/icons", name: "Icons", con: "pe-7s-science", component: Icons },
    // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
    // { path: "/notifications", name: "Notifications", icon: "pe-7s-bell", component: Notifications },
    { redirect: true, path:"/nurse", to:"/nurse/patient-assigned", name: "Assigned Patients" }
];

export default appRoutes;
