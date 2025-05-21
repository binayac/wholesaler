import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation } from '../redux/features/auth/authApi';

const VerifyEmail = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail({ token }).unwrap();
        setMessage(response.message || 'Email verified successfully! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setMessage(error.data?.message || 'Error verifying email. Please try again.');
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={message.includes('successfully') ? 'text-green-500' : 'text-red-500'}>
          {message}
        </p>
        {message.includes('successfully') && (
          <p className="mt-4">
            Redirecting to login in a few seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;