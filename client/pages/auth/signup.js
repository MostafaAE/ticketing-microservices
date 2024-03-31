import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => {
      Router.push("/");
    },
  });

  async function submitHandler(e) {
    e.preventDefault();

    await doRequest();
  }
  return (
    <form className="container" onSubmit={submitHandler}>
      <h1>Sign Up</h1>
      <div className="form-group mb-4">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group mb-4">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}

export default signup;
