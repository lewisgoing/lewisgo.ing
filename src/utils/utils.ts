// Add to a utils file
function validateEnvVars() {
    const requiredVars = [
      'NEXT_PUBLIC_LANYARD_USER_ID',
      'NEXT_PUBLIC_VERCEL_BLOB_URL',
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }