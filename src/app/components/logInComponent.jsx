"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignUpComponent from "./signUpComponent";
import { useUser } from "../Providers/userProvider";
import { makeFetch } from "@/app/utils/fetch.js";

export default function LogInComponent() {
  const [chageSignUp, setChangeSignUp] = useState(true);
  const { setUser } = useUser();
  const router = useRouter();

  let response = null;

  const [showLogIn, setShowLogIn] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      identification: id,
      password: password,
    };

    response = await makeFetch("/client", "GET", "", body);

    const user = await response.json();

    console.log("🫏🫏", user);

    if (response.status === 200) {
      setUser(user);
      router.push("/home-page");
    } else {
      setChangeSignUp(false);
    }
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
                <form className="flip-card__form" onSubmit={handleSubmit}>
                  <input
                    className="flip-card__input"
                    name="id"
                    placeholder="Identification"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className={"flip-card__btn"} type="submit">
                    Confirm!
                  </button>
                </form>
              </div>
              <SignUpComponent show={showLogIn} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
