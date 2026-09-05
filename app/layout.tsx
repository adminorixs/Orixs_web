import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/api/QueryProvider'; 
import { CopilotProvider } from '@/components/copilot/CopilotProvider';
import { CopilotClient } from '@/components/copilot/CopilotClient';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Orixs - AI Copilot for Business Excellence',
  description: 'Orixs is your AI Copilot for business automation. Streamline operations and boost productivity.',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <CopilotProvider>
            {children}
            <CopilotClient />
          </CopilotProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
