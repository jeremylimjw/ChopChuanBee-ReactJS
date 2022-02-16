
import { useLocation, Navigate } from "react-router-dom";
import { useApp } from "../providers/AppProvider";

export default function RequireAuth({ children, viewAccess }) {
    const { user } = useApp();
    let location = useLocation();
    
    if (!user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If admin no need authorize view access, else check for access rights
    if (viewAccess && user.role.name !== "Admin" && user.access_rights[`${viewAccess}`] == null) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    return children;
}