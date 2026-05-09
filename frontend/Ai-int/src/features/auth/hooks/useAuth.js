import { useContext } from "react";
import { AuthContext } from "../authContext";
import { registerUser, loginUser, logoutUser } from "../services/authApi";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, loading, setUser, setLoading } = context;

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const response = await registerUser(username, email, password);
            setUser(response.user);
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error?.response?.data?.error || "Registration failed. Please try again.";
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            setUser(response.user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            const msg = error?.response?.data?.error || "Login failed. Check your credentials.";
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        }
        // Always clear user state regardless of API response
        setUser(null);
        setLoading(false);
        return { success: true };
    };

    return { user, loading, handleRegister, handleLogin, handleLogout };
};
