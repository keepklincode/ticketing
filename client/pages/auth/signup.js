import { useState} from "react";
//this is called the useState hooks "read more on react hooks"
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const { doRequest, errors} = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email, password
    },

    onSuccess: () => Router.push("/")
  });

 const onSubmit =  async event =>  {
    event.preventDefault();

    

    doRequest();
    
  //  try { 
  //   const response = await axios.post("/api/users/signup", {
  //     email, password
  //   });

  //   console.log(response.data)
  // } catch (err){
  //   setErrors(err.response.data.errors);
  // }

 };
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <lable>Email Address</lable>
        <input 
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-control" />
      </div>
  
      <div className="form-group">
        <lable>Password</lable>
        <input
        value={password}
        onChange={e => setPassowrd(e.target.value)}
        type="password" className="form-control" />
      </div>

      {/* {errors.length > 0 && ()} */}
      {errors}
      
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};