import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return <main><h1>Loading...</h1></main>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default Protected;
