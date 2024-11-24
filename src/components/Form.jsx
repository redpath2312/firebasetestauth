import React, { useState } from "react";
import '../styles.css';

function Form(props) {
    const [user, setUser] = useState({
        // email: "",
        // password: "",
        // confirmPassword: ""
    });

    const [isSignUpClicked, setSignUpClicked] = useState(false);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        props.onLoginSubmit(user);
    };

    const handleSignUpClick = (e) => {      
      e.preventDefault();
      setSignUpClicked(!isSignUpClicked);
    }

    const handleSignUpSubmit = (e) => {
      e.preventDefault();
      props.onCreateAccountSubmit(user);
  };
    const handleLogOut = (e) => {
      e.preventDefault();
      props.onLogOut();
    }

  return (    
// Show fields for user to login but don't show when user is trying to create account
<div> 
{!props.isLoggedIn && !isSignUpClicked &&
 (<div><form className="form" onSubmit={handleLoginSubmit}>
 <input type="text" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
 <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
 <button type="submit">Login</button>
 </form></div>)}




{/* //For Showing Account creation fields once sign up buttton is clicked and hidden */}

{!props.isLoggedIn && isSignUpClicked && (<div> 
  <form className="form" onSubmit={handleSignUpSubmit}>
  <input type="text" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
  <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={user.confirmPassword} onChange={handleChange}/>
  <button type="submit">Create Account Now</button>
  </form></div>
)}

{!props.isLoggedIn && (<form className="form"><button onClick= {handleSignUpClick} type="submit">{!isSignUpClicked ? "Sign Up": "Cancel"}</button></form>)}
{props.isLoggedIn && 
(<div><h2>You are Logged In as {user.email}</h2>
<form className="form" onSubmit={handleLogOut}>
<button type="submit">Log Out</button>
</form></div>)}

<div id="error-text"><p>{props.errorInfo}</p></div>
</div>

  );
}
 
export default Form;