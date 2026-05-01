module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,

  jazzcashMerchantId: process.env.JAZZCASH_MERCHANT_ID,
  jazzcashPassword: process.env.JAZZCASH_PASSWORD,
  jazzcashIntegrationKey: process.env.JAZZCASH_INTEGRATION_KEY,
  jazzcashEnv: process.env.JAZZCASH_ENV || 'sandbox',
  
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpFrom: process.env.SMTP_FROM,
  
  redisUrl: process.env.REDIS_URL,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsS3Bucket: process.env.AWS_S3_BUCKET,
  awsS3Region: process.env.AWS_S3_REGION,
};
