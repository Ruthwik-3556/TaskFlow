import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error || "Login failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>TaskFlow</h1>
                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>
                </form>

                <p>
                    Don't have an account?{" "}
                    <button
                        className="link-button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;