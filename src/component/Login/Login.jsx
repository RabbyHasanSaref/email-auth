import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [loginError, setLoginError] = useState('')
    const [sucess, setSucess] = useState('')
    const emailRef = useRef(null)
    const auth = getAuth(app)

    const handleLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password)

        if(password.length < 6){
            setLoginError('Password should be at least 6 characters')
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setLoginError('Your password must contain at least one uppercase letter')
            return;
        }

        // reset error 
        setLoginError('')
        setSucess('')
        signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loginUser = result.user
            console.log(loginUser)
            if(result.user.emailVerified){
                setSucess('currect password login sucess')
            }
            else{
                alert('please check your email verification')
            }
        })
        .catch(error => {
            const loginError = error.message
            console.log(loginError)
            setLoginError(loginError)
        })
    }

    // forget handle 
    const handleForgetPassword = () => {
        const email = emailRef.current.value
        if(!email){
            console.log('please provide email', emailRef.current.value)
            return;
        }
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
            console.log('please vailid email')
            return;
        }

        // send email reset 
        sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('please check your email')
        })
        .catch(error => {
            console.log(error.message)
        })
    }
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleLogin} className="card-body">

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                            ref={emailRef}
                            type="email" 
                            placeholder="email" 
                            name="email" 
                            className="input input-bordered" 
                            required />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                             type="password"
                              placeholder="password"
                               name="password"
                               className="input input-bordered"
                                required />
                            <label className="label">
                                <a onClick={handleForgetPassword} href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                    </form>

                    <p>please <Link to="/sign">sign up</Link></p>

                    {
                        loginError && <p>{loginError}</p>
                    }
                    {
                        sucess && <p>{sucess}</p>
                    }
                </div>
            </div>
        </div>
    );
};

export default Login;