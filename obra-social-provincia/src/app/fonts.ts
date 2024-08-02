import { Noto_Serif, Ubuntu } from "next/font/google";

export const notoSerif = Noto_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif'
});

export const ubuntu = Ubuntu({
  weight: ['400', '300', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu'
});
