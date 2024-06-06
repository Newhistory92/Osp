import MillionLint from '@million/lint';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'i.pinimg.com'
    }, {
      protocol: 'https',
      hostname: 'img.clerk.com'
    }, {
      protocol: 'https',
      hostname: 'assets.pinterest.com'
    }, {
      protocol: 'https',
      hostname: 'img.icons8.com'
    }]
  }
};

const millionConfig = {
  auto: {
    skip: ['/obra-social-provincia/src/app/User3/operador/Notificador/NotificadosList.tsx', 'useState','useEffect'], // Añadir los componentes que quieres excluir de la optimización
  }
};

export default MillionLint.next({rsc: true})(nextConfig, millionConfig);


// import million from 'million/compiler';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'i.pinimg.com' },
//       { protocol: 'https', hostname: 'img.clerk.com' },
//       { protocol: 'https', hostname: 'assets.pinterest.com' },
//       { protocol: 'https', hostname: 'img.icons8.com' }
//     ]
//   }
// };

// const millionConfig = {
//   auto: {
//     skip: ['NotificadosList', 'DenunciasTable', 'GlobalNotFound'], // Componentes a excluir de la optimización
//   }
// };

// export default million.next(nextConfig, millionConfig);
