import React from "react";
import { fetch } from "@/app/utils/fetch.js";

export default function SignUpComponent({ show }) {
  let response = null;

  const [identification, setIdentification] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

  if (!show) return null;

  const body = {
    identification: identification,
    name: name,
    email: email,
    phone: phone,
    password: password,
  };

  const handleSubmit = async () => {
    response = await fetch("/api/client", "POST", "", body);
  };

  return (
    <div className="flip-card__back">
      <div className="title">Sign up</div>
      <form className="flip-card__form" action="">
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
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className={response === 200 ? "flip-card__btn" : ""}
          type="submit"
          onClick={handleSubmit}>
          Confirm!
        </button>
      </form>
    </div>
  );
}
