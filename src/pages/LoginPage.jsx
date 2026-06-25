import React, { useState } from "react";

//routing
import { Link } from "react-router-dom";

//redux
import { connect } from "react-redux";

//action
import { login } from "../store/admin/action";
import { projectName } from "../util/Config";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedStaff, setCopiedStaff] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      const error = {};
      if (!email) error.email = "Email is Required!";
      if (!password) error.password = "Password is Required!";
      return setError({ ...error });
    }
    const data = { email, password };
    sessionStorage.removeItem("isAuth1");
    sessionStorage.removeItem("isAuth2");
    props.login(data);
  };

  // Reusable credentials box
  const CredentialsBox = ({ label, emailVal, passwordVal, copied, onFill }) => (
    <div
      style={{
        marginTop: "12px",
        padding: "12px 14px",
        borderRadius: "10px",
        background: "rgba(255, 45, 122, 0.08)",
        border: "1px solid rgba(255, 45, 122, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <div style={{ fontSize: "13px", lineHeight: "1.7" }}>
        <div
          style={{
            color: "#ff6ca1",
            fontWeight: 600,
            marginBottom: "2px",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </div>
        <div>
          <span style={{ color: "#aaa", marginRight: "6px" }}>Email :</span>
          <span style={{ color: "#fff", fontWeight: 500 }}>{emailVal}</span>
        </div>
        <div>
          <span style={{ color: "#aaa", marginRight: "6px" }}>Password :</span>
          <span style={{ color: "#fff", fontWeight: 500 }}>{passwordVal}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onFill}
        title={`Fill ${label} credentials`}
        style={{
          flexShrink: 0,
          width: "38px",
          height: "38px",
          borderRadius: "8px",
          border: "none",
          background: copied
            ? "linear-gradient(135deg, #00c47d, #00a366)"
            : "linear-gradient(135deg, #ff2d7a, #ff6ca1)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.3s ease",
          boxShadow: copied
            ? "0 0 10px rgba(0,196,125,0.4)"
            : "0 0 10px rgba(255,45,122,0.4)",
        }}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              ry="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="login-page back__style">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-12 col-lg-4">
              <div className="card login-box-container">
                <div className="card-body">
                  <div className="authent-logo mb-4">
                    <span className="text-danger h1 text-capitalize">
                      {projectName}
                    </span>
                  </div>
                  <div className="authent-text">
                    <p>
                      Enter your email address and password to access admin
                      panel.
                    </p>
                  </div>

                  <form autoComplete="off">
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                email: "Email is Required !",
                              });
                            } else {
                              return setError({ ...error, email: "" });
                            }
                          }}
                        />
                        <label htmlFor="floatingInput">Email address</label>
                      </div>
                      <div className="mt-2 ml-2 mb-3">
                        {error.email && (
                          <div className="pl-1 text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                password: "Password is Required !",
                              });
                            } else {
                              return setError({ ...error, password: "" });
                            }
                          }}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                      </div>
                      <div className="mt-2 ml-2 mb-3">
                        {error.password && (
                          <div className="pl-1 text-left pb-1">
                            <span className="text-red">{error.password}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-danger m-b-xs"
                        onClick={handleSubmit}
                      >
                        Sign In
                      </button>
                    </div>
                  </form>

                  <div className="authent-reg">
                    <p>
                      <Link to="/forgot" className="text-info">
                        Forgot password?
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { login })(LoginPage);
