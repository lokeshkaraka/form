import React, { useState } from 'react';
import { Button, Alert } from "antd";
import { signInWithGoogle } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './HomeStyles.css';
import man1 from '../Images/man.png';
import hand from '../Images/hand.png';
import space from '../Images/space.png';
import google from '../Images/google.png';
import leavesbig from '../Images/leavesbig.png';
import rocket from '../Images/rocket.png';


const Home = () => {
    const [, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
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
            setMessage('Login successful');
            setAlertVisible(true)

            setTimeout(() => {
                setAlertVisible(false);
                navigate('/product');
            }, [1000])
            // navigate('/product');
        } catch (error) {
            setAlertVisible(true);
            setMessage('Login Crendentials are Wrong');
            console.error("Login failed", error);
            setTimeout(() => setAlertVisible(false), 3000);
        }
    };

    return (
        <div className="home-container">
            {alertVisible && (
                <Alert
                    message={message}
                    type="success"
                    showIcon
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        // width: '240px',
                        width: message === 'Login Crendentials are Wrong' ? '240px' : '180px',
                        textAlign: 'center',
                        color: 'black',
                    }}
                />
            )}

            <div className='text-container'>
                <p>
                    <h1 className='text'>
                        Effortless PaySlip
                        <br />
                        Management Bot
                    </h1>
                </p>
                <p className='text1'>
                    Automate Payroll with ease, delivering accurate<br /> Payslips directly to employee's Inboxes
                </p>
                <div className='button-container'>
                    <Button onClick={handleLogin}>
                        <img src={google} width={18} alt='login with google' style={{ marginRight: '5px', marginBottom: '-3px' }} />
                        <span className='login-google'>Login with Google</span>
                    </Button>
                </div>

            </div>

            <div className="image-container">
                <div>
                    <img src={leavesbig} alt="man illustration" className='leavesbig' />
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
