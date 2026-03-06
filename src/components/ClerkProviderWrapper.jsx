import { ClerkProvider } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export function ClerkProviderWrapper({ children }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
      appearance={{
        variables: {
          colorPrimary: '#3b82f6', // Bright blue
          colorBackground: '#374151', // Gray 700 (Lighter for contrast)
          colorInputBackground: '#1f2937', // Gray 800
          colorText: '#ffffff', // White
          colorTextSecondary: '#d1d5db', // Gray 300
          borderRadius: '0.5rem',
          fontFamily: 'inherit',
        },
        elements: {
          card: 'bg-gray-700 border border-gray-600 shadow-2xl rounded-xl',
          headerTitle: 'text-white text-xl font-bold',
          headerSubtitle: 'text-gray-300',
          socialButtonsBlockButton: 'bg-gray-600 hover:bg-gray-500 border border-gray-500 text-white transition-all duration-200',
          dividerLine: 'bg-gray-600',
          dividerText: 'text-gray-400',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all duration-200',
          formFieldLabel: 'text-gray-200 font-medium',
          formFieldInput: 'bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200',
          footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium',
          userButtonPopoverCard: 'bg-gray-700 border border-gray-600 shadow-2xl rounded-xl',
          userButtonPopoverActionButton: 'text-white hover:bg-gray-600 transition-colors',
          userButtonPopoverActionButtonIcon: 'text-gray-300',
          userButtonPopoverFooter: 'hidden',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
