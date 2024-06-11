import { Noto_Serif, Maven_Pro, Sedan, Source_Serif_4} from "next/font/google";


export const notoSerif = Noto_Serif({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-noto-serif'
  });
  
  export const mavenPro = Maven_Pro({
    weight: ['400', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-maven-pro'
  });
  


  export const sourceSerifPro =  Source_Serif_4({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-source-serif-pro'
  });