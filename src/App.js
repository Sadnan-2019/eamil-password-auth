// import logo from './logo.svg';
import "./App.css";

import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "./firebase.init";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registred, setRegistred] = useState(false);
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("")
  const [name,setName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistred = (event) => {
    setRegistred(event.target.checked);
  };



    const handleName=(event)=>{
      setName(event.target.value)


    }
  const handleEmail = (event) => {
    // console.log(event.target.value)
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleForm = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("Password should one speacial character ");
      return;
    }

    setValidated(true);
    setError("");

    if (registred) {
      // console.log(email,password)
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail()
          setUserName()
          setSuccess("Register Success")
        })
        .catch((error) => {
          console.error(error);

          const errorMessage = error.message;
          setError(errorMessage);
        });
    }

    event.preventDefault();
    // console.log("submit",email,password)
  };


  const setUserName =()=>{
    updateProfile(auth.currentUser,{

      displayName:name
    })
    .then(()=>{

      console.log("updating name")
    })

    .catch(error=>{

      console.log(error.message)
      setError(error.message)
    })

  }

  const verifyEmail=()=>{
    sendEmailVerification(auth.currentUser)
    .then(() =>{

      console.log("Email sent your mail")
    })

  }

  const handleResetPassword=()=>{
    sendPasswordResetEmail(auth,email)
    .then(()=>{

      console.log("Forgot Password")
    })
    .catch(error=>{

      console.log(error)
      setError(error.message)
    })


  }

  return (
    <div>
      <div className="registration w-50 mx-auto">
        <h3 className="text-primary text-center mt-4">
          Please {registred ? "Login" : "Registration"}!!!!
        </h3>

        <Form noValidate validated={validated} onSubmit={handleForm}>


         { !registred && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onBlur={handleName}
              type="text"
              placeholder="Enter Name"
              required
            />

            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
          </Form.Group>}


          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmail}
              type="text"
              placeholder="Enter email"
              required
            />

            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePassword}
              type="password"
              placeholder="Password"
              required
            />

            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>

            <Form.Group className="mb-3 mt-2" controlId="formBasicCheckbox">
              <Form.Check
                onChange={handleRegistred}
                type="checkbox"
                label="Already Register!!!"
              />
            </Form.Group>
            <p className="text-danger">{error}</p>
            <p className="text-danger">{success}</p>
          </Form.Group>
          {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
      
    </Form.Group> */}
          <Button variant="primary" type="submit">
            {registred ? "Login" : "Registred"}
          </Button>

          <Button onClick={handleResetPassword} variant="link"> Forget Password</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
