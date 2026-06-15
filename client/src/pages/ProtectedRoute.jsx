
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);


    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

   
    return children ? children : <Outlet />;
};

export default ProtectedRoute;