"use client";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signInAPI } from "@/services/authAPIs";
import { setUserDetails } from "@/redux/Modules/userlogin";
import Image from "next/image";
import ErrorMessagesComponent from "../../Core/ErrorMessagesComponent";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [invalid, setInvalid] = useState<any>();

  const signIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: email,
        password: password,
      };
      let response: any = await signInAPI(payload);

      if (response.success) {
        Cookies.set("user", response?.data?.user_details?.user_type);
        dispatch(setUserDetails(response));
        setInvalid(null);
        router.push("/maps");
      } else if (response.status == 422) {
        setErrorMessages(response.error_data);
        setInvalid(null);
        throw response;
      } else if (response.status === 401) {
        setInvalid(response.message);
        setErrorMessages(null);
      } else {
        toast.error(response.message || "Error while login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <div className="leftContainer">
          <img className="loginImg" alt="" src="/login/login-image.png" />
        </div>
        <form onSubmit={signIn}>
          <div className="rightContainer">
            <div className="formContainer">
              <div className="logoBlock">
                <Image
                  className="logoIcon"
                  alt=""
                  src="/logo.svg"
                  height={100}
                  width={130}
                />
              </div>
              <p className="formTitle">Welcome back</p>
              <p className="formSubTitle">
                Enter email and password to access your account
              </p>
              <div className="formsBlock">
                <div className="InputFeild">
                  <label className="formLabel">Email</label>
                  <TextField
                    autoComplete="new-email"
                    variant="outlined"
                    placeholder="Enter your email"
                    name="email"
                    type={"text"}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessages(null);
                      setInvalid(null);
                    }}
                  />
                  <ErrorMessagesComponent errorMessage={errorMessages?.email} />
                </div>
                <div className="InputFeild">
                  <label className="formLabel">Password</label>
                  <TextField
                    autoComplete="new-password"
                    variant="outlined"
                    placeholder="Enter your password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessages(null);
                      setInvalid(null);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? (
                              <Image
                                src="/login/view-icon.svg"
                                alt=""
                                height={16}
                                width={16}
                              />
                            ) : (
                              <Image
                                src="/login/hide-icon.svg"
                                alt=""
                                height={16}
                                width={16}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages?.password}
                  />
                  <p className="errorComponent">{invalid}</p>
                  {/* <div className="forgotBtnGrp">
                    <Button variant="text" className="forgotBtn">
                      Forgot Your Password ?
                    </Button>
                  </div> */}
                </div>
                <Button
                  type="submit"
                  className="loginBtn"
                  variant="contained"
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={"1rem"} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
