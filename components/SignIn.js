import React, { useContext } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, app } from "../config/firebase";



function SignInModal() {

  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={uiConfig()}
        firebaseAuth={app.auth}
      />
      <style jsx>
        {`
        background: white;
        padding: 50px 0;
        text-align: center;
        `}
      </style>
    </div>
  );
}
export default SignInModal;
