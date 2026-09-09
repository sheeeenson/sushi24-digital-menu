import './globals.css';

export const metadata = {
  title: 'Sushi24 Digital Menu',
  description: 'Digital menu boards for Sushi24 powered by Syrve'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
