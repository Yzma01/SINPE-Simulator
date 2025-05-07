"use client";
import React, { useState } from "react";
import { makeFetch } from "@/app/utils/fetch.js";
import { useRouter } from "next/navigation";

export default function SignUpComponent({ show }) {
  const [changeLogIn, setChangeLogIn] = useState(false); //luego lo quto
  const router = useRouter();

  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      identification,
      name,
      email,
      phone,
      password,
    };

    console.log(body);

    const response = await makeFetch("/api/client", "POST", "", body);
    if (response.status === 201) {
      setChangeLogIn(true); //luego lo quitp
    } 
  };

  return (
    <div className="flip-card__back">
      <div className="title">Sign up</div>
      <form className="flip-card__form" onSubmit={handleSubmit}>
        <input
          className="flip-card__input"
          placeholder="Identification"
          type="text"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />
        <input
          className="flip-card__input"
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="flip-card__input [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="Phone"
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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
          className={"flip-card__btn"}
          type="submit">
          Confirm!
        </button>
      </form>
    </div>
  );
}
