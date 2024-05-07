import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
  
    publicRoutes:["/","/api/Publicaciones" ],
    ignoredRoutes:["www.youtube.com/"]
    
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*),"],
};