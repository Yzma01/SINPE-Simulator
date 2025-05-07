"use client";
import React, { useState } from "react";
import SignUp from "./signUpComponent";

export default function LogInComponent() {
 
  let response = null;

  const [showLogIn, setShowLogIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const body = {
    email: email,
    password: password,
  };

  //!Isma tiene quye definir las rutas de la api
  const handleSubmit = async () => {
    response = await fetch("/api/client", "POST", "", body);
  };

  return (
    <div className="justify-center flex items-center h-screen">
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => setShowLogIn(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form" action="">
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className={
                      response === 200
                        ? router.push("/home-page")
                        : "flip-card__btn"
                    }
                    type="submit"
                    onClick={handleSubmit}>
                    Let's go!
                  </button>
                </form>
              </div>
              <SignUp show={showLogIn} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
