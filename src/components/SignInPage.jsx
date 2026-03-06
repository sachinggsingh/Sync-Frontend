import { SignIn } from '@clerk/clerk-react';

function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-gray-900 to-gray-600 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">SyncEditor</h1>
          <p className="text-gray-300">Sign in to start collaborating</p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}

export default SignInPage;
