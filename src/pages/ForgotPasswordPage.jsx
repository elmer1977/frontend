import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../server";

const ForgotPasswordPage = () => {
  const location = useLocation();
  const isShop = location.pathname.startsWith("/shop");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        `${server}/${isShop ? "shop" : "user"}/forgot-password`,
        { email }
      );

      toast.success(res.data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>

              <div className="mt-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] flex justify-center items-center text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;