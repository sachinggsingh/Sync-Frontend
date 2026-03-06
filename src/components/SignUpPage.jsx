import { SignUp } from '@clerk/clerk-react';

function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-gray-900 to-gray-600 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">SyncEditor</h1>
          <p className="text-gray-300">Create an account to get started</p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
}

export default SignUpPage;
