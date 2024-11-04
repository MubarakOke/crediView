import { CheckCircle, XCircle } from 'lucide-react'

export const VerificationOverlay: React.FC<{ isVerified: boolean | null }> = ({ isVerified }) => {
    if (isVerified === null) return null;
  
    return (
      <div className="absolute inset-x-0 bottom-16 flex justify-center items-center">
        <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
          isVerified 
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}>
          {isVerified ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isVerified ? "Credential Verified" : "Verification Failed"}
          </span>
        </div>
      </div>
    );
  };