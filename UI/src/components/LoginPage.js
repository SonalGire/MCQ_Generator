"use client"

import { useState } from "react"
import { Eye, EyeOff, Sparkles,LayoutDashboard } from "lucide-react"
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@yopmail.com")
  const [password, setPassword] = useState("1234")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // Static login check
    if (email === "admin@yopmail.com" && password === "1234") {
      navigate('/upload-file');
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #404040 80%, #808080 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 12rem;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .left-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%);
          pointer-events: none;
        }
        
        .logo-section {
          position: relative;
          z-index: 2;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          margin-bottom: 2rem;
          color: white;
        }
        
        .welcome-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        
        .welcome-subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 400px;
        }
        
        .copyright {
          position: absolute;
          bottom: 2rem;
          left: 4rem;
          opacity: 0.7;
          font-size: 0.9rem;
        }
        
        .right-panel {
          flex: 1;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
        }
        
        .login-form {
          width: 100%;
          max-width: 400px;
        }
        
        .brand-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .welcome-back {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .signup-prompt {
          color: #6b7280;
          margin-bottom: 3rem;
          font-size: 0.95rem;
        }
        
        .signup-link {
          color: #4f46e5;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          background: transparent;
          font-size: 1rem;
          color: #1f2937;
          transition: border-color 0.3s ease;
          outline: none;
        }
        
        .form-input:focus {
          border-bottom-color: #4f46e5;
        }
        
        .form-input::placeholder {
          color: #9ca3af;
        }
        
        .password-wrapper {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .login-btn {
          width: 100%;
          padding: 1rem;
          background: #1f2937;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 1rem;
        }
        
        .login-btn:hover {
          background: #374151;
        }
        
        .google-btn {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #1f2937;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .google-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }
        
        .google-icon {
          width: 20px;
          height: 20px;
        }
        
        .forgot-password {
          text-align: center;
        }
        
        .forgot-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .forgot-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }
        
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
          
          .left-panel {
            padding: 2rem;
            min-height: 40vh;
          }
          
          .welcome-title {
            font-size: 2rem;
          }
          
          .copyright {
            position: static;
            margin-top: 2rem;
          }
          
          .right-panel {
            padding: 2rem;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="left-panel">
          <div className="logo-section">
            <LayoutDashboard className="logo" />
            <h1 className="welcome-title">
              RAG BASED
              <br />
              MCQ Generator
            </h1>
            <p className="welcome-subtitle">
              Skip repetitive and manual quiz creation tasks. Get highly productive through automation and save tons of
              time!
            </p>
          </div>
          <div className="copyright">© 2025. All rights reserved.</div>
        </div>

        <div className="right-panel">
          <div className="login-form">
            {/* <h2 className="brand-name">Zentixs</h2> */}
            <h3 className="welcome-back">Welcome Back!</h3>
            {/* <p className="signup-prompt">
              Don't have an account?{" "}
              <a href="#" className="signup-link">
                Create a new account now
              </a>
              , it's FREE! Takes less than a minute.
            </p> */}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@yopmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-btn">
                Login Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage



