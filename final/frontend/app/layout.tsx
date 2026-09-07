import './globals.css';

export const metadata = {
  title: 'BIS Intelligence — Standards Navigator',
  description: 'Evidence-backed BIS standards discovery and compliance support.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
