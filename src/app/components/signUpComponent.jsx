"use client";
import React, { useState } from "react";
import { makeFetch } from "@/app/utils/fetch.js";
import { useRouter } from "next/navigation";
import { toastHandler } from "../utils/toastHandler";
import toast from "react-hot-toast";


export default function SignUpComponent({ show }) {
  const [changeLogIn, setChangeLogIn] = useState(false); //luego lo quto
  const router = useRouter();

  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      cli_id: identification,
      cli_nombre: name,
      cli_apellido: lastname,
      cli_telefono: phone,
      cli_email: email,
      cli_password: password,
    };

    console.log(body);

    try {
      const response = await makeFetch("/client", "POST", "", body);
      const data = await response.json();
      // if (response.status === 201) {
      //   alert("User created successfully");
      //   setChangeLogIn(true); //luego lo quitp
      // }
      toastHandler(response, data);
    } catch (error) {
      console.log("error", error);
      toast.error("Error ❌");
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
          className="flip-card__input"
          placeholder="Lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
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
        <button className={"flip-card__btn"} type="submit">
          Confirm!
        </button>
      </form>
    </div>
  );
}
