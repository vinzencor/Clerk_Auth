"use client";

// app/sign-in/page.jsx
import React, { useState,useEffect  } from "react";
import { SignedOut, useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function SignInPage() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signOut, userId } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      console.error("Sign-in is not loaded yet.");
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      console.log("Sign-In Response:", completeSignIn); // Log the response

      // Check if sign-in is complete
      if (completeSignIn.status === "complete") {
        console.log("Sign-in successful, redirecting to home page.");
        router.push("/"); // Redirect to the home page
      } else {
        console.error("Sign-in not complete:", completeSignIn.status);
        setError("An error occurred while signing in.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err); // Log any errors
      setError(err.errors ? err.errors[0].message : err.message);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    if (!isLoaded) {
      console.error("Sign-in is not loaded yet.");
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-in",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Error during OAuth sign-in:", err);
      setError(err.errors ? err.errors[0].message : err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(); // Sign out the user
    router.push("/"); // Redirect to the home page after logging out
  };

  useEffect(() => {
    if (userId) {
      router.push("/"); // Redirect once user is signed in
    }
  }, [userId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-lg rounded-lg p-8 md:p-12 lg:p-16 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h1>
        <h1
          className="text-md text-center text-red-500 cursor-pointer mb-4"
          onClick={handleLogout}
        >
          Sign out
        </h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            Sign In
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">or sign in with</div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleOAuthSignIn("oauth_apple")}
            className="w-full py-3 rounded-lg bg-black hover:bg-gray-900 transition text-white font-semibold"
          >
            Sign in with Apple
          </button>
          <button
            onClick={() => handleOAuthSignIn("oauth_google")}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-semibold"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("oauth_facebook")}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            Sign in with Facebook
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
