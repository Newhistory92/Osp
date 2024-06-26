
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isUserRoute = createRouteMatcher([
  '/page/select-user',
  '/page/dashboard',
  '/page/user-profile',
  '/page/dashboard/not-found',
   '/page/dashboard/admin'
]);

// const isAdminRoute = createRouteMatcher([
//   '/page/dashboard/admin',
// ]);

export default clerkMiddleware((auth, req) => {
  // Protege solo las rutas que no sean de la API
  if (!req.url.startsWith('/api')) {
    if (isUserRoute(req)) auth().protect();

    // if (isAdminRoute(req)) {
    //   auth().protect(has => {
    //     return (
    //       has({ permission: 'org:sys_memberships:manage' }) ||
    //       has({ permission: 'org:sys_domains_manage' })
    //     );
      // });
    //}
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};


// middleware.ts
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';

// const isUserRoute = createRouteMatcher(['/page/dashboard', '/page/user-profile']);
// const isSelectUserRoute = createRouteMatcher(['/page/select-user']);

// export default clerkMiddleware(async (auth, req) => {
//   const { sessionClaims } = getAuth(req);

//   if (!sessionClaims) {
//     return NextResponse.redirect('/sign-in');
//   }

//   const userRole = sessionClaims.role;

//   if (isUserRoute(req)) {
//     if (!userRole || userRole === 'USER') {
//       return NextResponse.redirect('/page/select-user');
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };
