import React, { useState } from 'react';
import { useUser,SignOutButton} from '@clerk/clerk-react';
import { ClerkLoading } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch } from "../../hooks/StoreHook";
import { clearState } from '../../redux/Slice/userSlice';
const ButtonUser = () => {
  const { user } = useUser();
  const dispatch = useAppDispatch ();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    // Despacha la acción para limpiar el estado
    dispatch(clearState());
   
  };

  if (!user) {
return <ClerkLoading>
     <div>Cargando Usuario...</div>
     </ClerkLoading>
    
  }
  return (
    <div className="relative inline-block">
      <Image
        id="avatarButton"
        className="w-10 h-10 rounded-full cursor-pointer"
        src={user.imageUrl}
        alt="User dropdown"
        onClick={handleToggleDropdown}
        width={100} height={100}
      />
      {isDropdownOpen && (
        <div className="origin-top-right z-70 drop-shadow-lg absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3 text-sm bg-gray-300/50 text-gray-900 dark:text-white">
            <div>{user.firstName}</div>
            <div className="font-medium truncate">{user.emailAddresses[0].emailAddress}</div>
          </div>
          <div className="py-2 text-sm text-gray-700 dark:text-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="avatarButton">
            <Link href="/page/dashboard">
              <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Panel de Usuario</p>
            </Link>
            <Link href="/user-profile">
              <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Perfil</p>
            </Link>
            <Link href="/">
              <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Inicio</p>
            </Link>
            <div className="py-1">
            <SignOutButton >
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Cierre de Sesion</button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonUser;



