"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Ensure you import useRouter correctly
import './globals.css'

export default function RootLayout({ children }) {
  const router = useRouter(); // Get router instance

  return (
    <ClerkProvider
      frontendApi="https://equipped-cobra-74.clerk.accounts.dev" // Ensure this is correct
      navigate={(to) => router.push(to)} // Use the router from next/navigation
      appearance={{
        variables: {
          colorPrimary: "#4CAF50", // Customize primary color
        },
        layout: {
          logoPlacement: "inside", // Example customization
        },
      }}
      signInUrl="/sign-in" // Redirect to custom sign-in page
      signUpUrl="/sign-up" // Redirect to custom sign-up page
      afterSignInUrl="/dashboard" // Redirect after signing in
      afterSignOutUrl="/" // Redirect after signing out
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
