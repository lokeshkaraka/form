import React, { useState } from 'react';
import { Button } from "antd";
import { signInWithGoogle } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'
import './HomeStyles.css';
import man1 from '../Images/man.png';
import hand from '../Images/hand.png';
import space from '../Images/space.png';
import google from '../Images/google.png';
import leavesbig from '../Images/leavesbig.png';
import rocket from '../Images/rocket.png';


const Home = () => {
    const [, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const loggedInUser = await signInWithGoogle();
            const userData = {
                email: loggedInUser.email,
                displayName: loggedInUser.displayName,
                photoURL: loggedInUser.photoURL,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            navigate('/product');
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="home-container">
            <div className='text-container'>
                <p>
                    <h1 className='text'>
                        Your next big
                        <br />
                        idea starts here
                    </h1>
                </p>
                <p className='text1'>
                    The ideal framework to learn how to <br />manage all aspects of startup.
                </p>
                <div className='button-container'>
                    <Button onClick={handleLogin}>
                        {/* <FaGoogle style={{ marginRight: '10px' }} /> */}
                        <img src={google} width={18} style={{ marginRight: '5px', marginBottom: '-3px' }} />
                        Login with Google
                    </Button>
                </div>

            </div>

            <div className="image-container">
                <div>
                    <img src={leavesbig} alt="man illustration" className='leavesbig' />
                    {/* <img src={leaves} alt="man illustration" className='leaves' /> */}
                </div>
                <img src={rocket} alt="man illustration" className='rocket' />

                <img src={hand} alt="man illustration" className='imagehand' />
                <img src={space} alt="man illustration" className='imagespace' />
                <img src={man1} alt="man illustration" className='image' />
            </div>
        </div>
    );
};

export default Home;
