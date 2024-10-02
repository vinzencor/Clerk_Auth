"use client";

import { useState, useEffect } from "react";
import { useAuth, useSignUp, useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const { user } = useUser();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thirdPartyAuthComplete, setThirdPartyAuthComplete] = useState(false);

  const { userId } = useAuth();

  // Step 1: Email Sign-Up and OTP Verification
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
        strategy: "email_code",
      });

      await signUpAttempt.prepareEmailAddressVerification();
      setOtpSent(true); // Show OTP input form
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp.attemptEmailAddressVerification({ code: otp });
      setOtpVerified(true); // OTP verified
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Third-party Authentication
  const handleThirdPartySignIn = async (provider) => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-up",
        redirectUrlComplete: "/sign-up",
      });
    } catch (error) {
      console.error("Error with third-party sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Sign-Up after Authentication
  const handleCompleteSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Update user with additional information
      await signUp.update({
        firstName,
        lastName,
        phoneNumber,
      });
  
      // Log all the collected data
      console.log({
        emailAddress,
        firstName,
        lastName,
        phoneNumber,
      });
  
      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Error completing sign-up:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (userId && user && !thirdPartyAuthComplete) {
      setThirdPartyAuthComplete(true);
    }
  }, [userId, user]);

  if (userId && thirdPartyAuthComplete) {
    return router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-lg rounded-lg p-8 md:p-12 lg:p-16 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>

        {/* Email and Password Sign-Up */}
        {!otpSent && !otpVerified && !thirdPartyAuthComplete && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
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
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:bg-gray-400"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* OTP Verification */}
        {otpSent && !otpVerified && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:bg-gray-400"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Third-party Authentication */}
        {!otpSent && !otpVerified && !thirdPartyAuthComplete && (
          <div className="space-y-4">
            <button
              onClick={() => handleThirdPartySignIn("oauth_google")}
              className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-semibold"
            >
              Sign in with Google
            </button>

            <button
              onClick={() => handleThirdPartySignIn("oauth_facebook")}
              className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition text-white font-semibold"
            >
              Sign in with Facebook
            </button>

            <button
              onClick={() => handleThirdPartySignIn("oauth_apple")}
              className="w-full py-3 rounded-lg bg-black hover:bg-gray-800 transition text-white font-semibold"
            >
              Sign in with Apple
            </button>
          </div>
        )}

        {/* Additional Information Collection */}
        {(otpVerified || thirdPartyAuthComplete) && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:bg-gray-400"
            >
              {isLoading ? "Completing Sign Up..." : "Complete Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
