'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LogIn, LogOut, User, UserPlus } from 'lucide-react'; // Icons
import { useEffect, useState } from 'react';

export default function BottomBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const pathname = usePathname();

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || '';
    const user = storedUser ? JSON.parse(storedUser) : {};
    console.log('user0', user);

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    if (user.username) {
      console.log('user', user);
      setUsername(user.username);
    } else {
      setUsername('');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuthentication();
  };

  return (
    <div className='fixed bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around py-3'>
      {/* Login Button */}
      {pathname === '/' ? (
        <>
          {!isAuthenticated ? (
            <Link
              href='/login'
              className={`flex flex-col items-center font-bold text-green-500`}
            >
              <LogIn className='w-6 h-6' />
              <span className='text-sm'>Login</span>
            </Link>
          ) : (
            <div
              className={`flex flex-col items-center font-bold text-green-500`}
              onClick={handleLogout}
            >
              <LogOut className='w-6 h-6' />
              <span className='text-sm'>Logout</span>
            </div>
          )}

          {username ? (
            <div
              className={`flex flex-col items-center font-bold text-green-500`}
            >
              <User className='w-6 h-6' />
              <span className='text-sm'>{username}</span>
            </div>
          ) : (
            <Link
              href='/signup'
              className={`flex flex-col items-center font-bold text-green-500`}
            >
              <UserPlus className='w-6 h-6' />
              <span className='text-sm'>Signup</span>
            </Link>
          )}
        </>
      ) : (
        <Link
          href='/'
          className={`flex flex-col items-center font-bold text-blue-500`}
        >
          <Home className='w-6 h-6' />
          <span className='text-sm'>Home</span>
        </Link>
      )}
    </div>
  );
}
