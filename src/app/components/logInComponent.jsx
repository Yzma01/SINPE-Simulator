'use client';
import React, { useState } from "react";
import SignUp from "./signUpComponent";

export default function LogInComponent() {
  const [showLogIn, setShowLogIn] = useState(false);

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
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  <button className="flip-card__btn" type="submit">
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
