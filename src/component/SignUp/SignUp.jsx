import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [userError, setUserError] = useState('');
    const [sucess, setSucess] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const auth = getAuth(app)
    const handleSignUp = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const checkbox = e.target.checkbox.checked
        console.log(name, email, password, checkbox)

        if (password.length < 6) {
            setUserError('Password should be at least 6 characters')
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setUserError('Your password must contain at least one uppercase letter')
            return;
        }
        else if (!checkbox) {
            setUserError('please accept terms and condition')
            return;
        }

        // reset error 
        setUserError('')
        setSucess('')

        // user create 
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const userSign = result.user;
                console.log(userSign)
                setSucess('Your Submit Sucess')

                updateProfile(result.user,{
                    displayName: name
                })
                .then(()=>{
                    console.log('profile update')
                })
                .catch((error)=>{
                    console.log(error.message)
                })


                sendEmailVerification(auth.currentUser)
                .then(()=> {
                    alert('please check your email verification')
                })
            })
            .catch(error => {
                const errorTeaxt = error.message;
                console.log(errorTeaxt)
                setUserError('Email-already-in-use')
            })
    }
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Sign Up now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSignUp} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" placeholder="Name" name="name" className="input input-bordered" required />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="email" name="email" className="input input-bordered" required />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                name="password"
                                className="input input-bordered"
                                required />
                            <span className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Show' : 'Hide'}</span>


                            <div className="flex">
                                <input type="checkbox" name="checkbox" id="checkbox" />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">accept terms and condition</a>
                                </label>
                            </div>


                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Sign Up</button>
                        </div>
                    </form>

                    <p>please <Link to="/login">login</Link></p>

                    {
                        userError && <p className="text-red-500">{userError}</p>
                    }
                    {
                        sucess && <p className="text-green-500">{sucess}</p>
                    }
                </div>
            </div>
        </div>
    );
};

export default SignUp;