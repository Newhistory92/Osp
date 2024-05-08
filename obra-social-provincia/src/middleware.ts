
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isUserRoute = createRouteMatcher([
  '/page/select-user',
  '/page/dashboard',
  '/page/user-profile',
]);

const isAdminRoute = createRouteMatcher([
  '/page/dashboard/admin',
]);

export default clerkMiddleware((auth, req) => {

  if (isUserRoute(req)) auth().protect();

  if (isAdminRoute(req)) {
    auth().protect(has => {
      return (
        has({ permission: 'org:sys_memberships:manage' }) ||
        has({ permission: 'org:sys_domains_manage' })
      )
    })
  }
});
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
