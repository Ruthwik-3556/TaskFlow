import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await API.post("/auth/register", {
                name,
                email,
                password
            });

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.error || "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>TaskFlow</h1>
                <h2>Create Account</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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
                        Register
                    </button>
                </form>

                <p>
                    Already have an account?{" "}
                    <button
                        className="link-button"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;