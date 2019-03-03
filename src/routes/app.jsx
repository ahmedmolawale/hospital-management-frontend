import Dashboard from 'views/Dashboard/Dashboard';
import UserProfile from 'views/UserProfile/UserProfile';
import PatientManagement from 'views/PatientManagement/PatientManagement';
import NurseManagement from 'views/NurseManagement/NurseManagement';
import DoctorManagement from 'views/DoctorManagement/DoctorManagement';
import LabAttendantManagement from 'views/LabAttendantManagement/LabAttendantManagement';
import TableList from 'views/TableList/TableList';
import Typography from 'views/Typography/Typography';
import Icons from 'views/Icons/Icons';
import Maps from 'views/Maps/Maps';
import Notifications from 'views/Notifications/Notifications';
import Upgrade from 'views/Upgrade/Upgrade';

const appRoutes = [
    // { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/admin/patient-mgmt", name: "Patient Management", icon: "pe-7s-user", component: PatientManagement },
    { path: "/admin/nurse-mgmt", name: "Nurse Management", icon: "pe-7s-users", component: NurseManagement },
    { path: "/admin/lab-mgmt", name: "Lab Management", icon: "pe-7s-news-paper", component: LabAttendantManagement },
    { path: "/admin/doctor-mgmt", name: "Doctor Management", icon: "pe-7s-news-paper", component: DoctorManagement },
    // { path: "/user", name: "User Profile", icon: "pe-7s-user", component: UserProfile },
    // { path: "/table", name: "Table List", icon: "pe-7s-note2", component: TableList },
    // { path: "/typography", name: "Typography", icon: "pe-7s-news-paper", component: Typography },
    // { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
    // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
    // { path: "/notifications", name: "Notifications", icon: "pe-7s-bell", component: Notifications },
    { redirect: true, path:"/admin", to:"/admin/patient-mgmt", name: "Patient Management" }
];

export default appRoutes;
