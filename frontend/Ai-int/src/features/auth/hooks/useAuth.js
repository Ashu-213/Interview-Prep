import { useContext } from "react";
import { AuthContext } from "../authContext";
import { registerUser, loginUser, logoutUser } from "../services/authApi";
import { getMe } from "../services/authApi";
import { useEffect } from "react";

// custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, Loading, setUser, setLoading } = context;

    // handle register
    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const response = await registerUser(username, email, password);
            setUser(response.user);
        }
        catch (error) {
            console.error("Registration error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    // handle login
    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            setUser(response.user);
        }
        catch (error) {
            console.error("Login error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    // handle logout
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        }
        catch (error) {
            console.error("Logout error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    // return user, loading state and auth functions
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, Loading, handleRegister, handleLogin, handleLogout };

}
