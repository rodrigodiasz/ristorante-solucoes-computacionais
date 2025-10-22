export const checkEnvironmentVariables = () => {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  console.log('All required environment variables are set');
  return true;
};

export const checkDirectories = () => {
  const fs = require('fs');
  const path = require('path');

  const uploadDir = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    } else {
      console.log('Upload directory exists:', uploadDir);
    }
    return true;
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return false;
  }
};
