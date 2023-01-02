import React from "react";
import { useSignOut } from "react-auth-kit";

export default function LogoutButton() {
  const signOut = useSignOut();

  return (<button onClick={signOut}>Logout</button>)
}