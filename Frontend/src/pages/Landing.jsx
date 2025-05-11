import { Link, Navigate } from "react-router-dom";

function Landing() {
    return ( 
        <div><Link to='/user/login'>Login</Link> or <Link to='/user/signup'>Signup</Link> as user</div>
     );
}

export default Landing;