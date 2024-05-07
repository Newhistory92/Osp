import React, { useState } from 'react';
import { useUser,SignOutButton} from '@clerk/clerk-react';
import { ClerkLoading } from '@clerk/nextjs';

const ButtonUser = () => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!user) {
return <ClerkLoading>
     <div>Cargando Usuario...</div>
     </ClerkLoading>
    
  }
  return (
    <div className="relative inline-block">
      <img
        id="avatarButton"
        className="w-10 h-10 rounded-full cursor-pointer"
        src={user.imageUrl}
        alt="User dropdown"
        onClick={handleToggleDropdown}
      />
      {isDropdownOpen && (
        
        <div className="origin-top-right z-70 drop-shadow-lg absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3 text-sm  bg-gray-300/50 text-gray-900 dark:text-white">
              <div>{user.firstName}</div>
              <div className="font-medium truncate">{user.emailAddresses[0].emailAddress}</div>
    </div>
          <div className="py-2 text-sm text-gray-700 dark:text-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="avatarButton" >
            <a href="/page/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Panel de Usuario</a>
            <a href="/user-profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Perfil</a>
            <div className="py-1">
            <SignOutButton>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cierre de Sesion</a>
            </SignOutButton>
            </div>
          </div>
        </div>
     
      )}
    </div>
  );
};

export default ButtonUser;



