import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to navigate from one page to another
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInFailure, signInSuccess} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SigIn() {
  // to handle change in form data
  const [formData, setFormData] = useState({});

  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading, error} = useSelector((state)=> state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true); // Set loading as true when the function u s called upon
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), //stringify the form data while posting
      });
      const data = await res.json(); //to get success message

      if (data.success === false) {
        // this success is from index.js ka last part woh middleware
        // setLoading(false);    REPLACE
        // setError(data.message);    REPLACE
        dispatch(signInFailure(data.message));
        return;
      }
      //setLoading(false); // No error occured        REPLACED
      //setError(null); // To remove an error if it was previously there  REPLACED
      dispatch(signInSuccess(data))
      navigate('/');
      console.log(data);
    } 
    catch (error) {
      // setLoading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* mx auto sets the box in center */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email ID"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-75 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
