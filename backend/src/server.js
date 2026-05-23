require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/database");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const freeTrialRoutes = require("./routes/freeTrialRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const instructorStudentRoutes = require("./routes/instructorStudentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const welfareRoutes = require("./routes/welfareRoutes");
const contactRoutes = require("./routes/contactRoutes");
const instructorApplicationRoutes = require("./routes/instructorApplicationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { startTrialEmailJob } = require("./jobs/trialEmailJob");

// Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "AlKahaf LMS API",
    version: "1.0.0",
    description: "API documentation for AlKahaf Learning Management System",
  },
  servers: [
    { url: "http://localhost:5000/api/v1", description: "Development" },
    {
      url: "https://alkahafonlineacademy.com/api/v1",
      description: "Production",
    },
  ],
};

const app = express();

// Security middleware — relax CSP only for the Swagger UI path
app.use((req, res, next) => {
  if (req.path.startsWith("/api-docs")) {
    // swagger-ui needs inline scripts/styles
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
        },
      },
    })(req, res, next);
  }
  return helmet()(req, res, next);
});

// CORS configuration - Allow common local origins + env-configured origins.
// Supports both a single origin and comma-separated values in CORS_ORIGIN.
const envConfiguredOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.ALLOWED_ORIGINS ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:8000",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:55808", // live-server
  ...envConfiguredOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for now, can restrict later
      }
    },
    credentials: true,
  }),
);

// Rate limiting — global
app.use(rateLimitMiddleware);

// Stricter rate limit for auth endpoints (brute-force protection)
const rateLimit = require("express-rate-limit");
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the parent directory (frontend)
const path = require("path");
const staticPath = path.join(__dirname, "../../");
app.use(express.static(staticPath));

// Note: Local /uploads folder removed — images now served via Cloudinary CDN

// ── Swagger UI (/api-docs) ─────────────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition, {
    customSiteTitle: "AlKahaf LMS API Docs",
    swaggerOptions: {
      persistAuthorization: true, // keep the JWT token between page refreshes
      displayRequestDuration: true,
      filter: true,
      docExpansion: "none", // start collapsed — less overwhelming
    },
  }),
);

// Health check (accessible at both /health and /api/health)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// API v1 routes
const apiV1 = express.Router();
apiV1.use("/auth", authRoutes);
apiV1.use("/courses", courseRoutes);
apiV1.use("/enrollments", enrollmentRoutes);
apiV1.use("/users", userRoutes);
apiV1.use("/admin", adminRoutes);
apiV1.use("/notifications", notificationRoutes);
apiV1.use("/blogs", blogRoutes);
apiV1.use("/free-trial", freeTrialRoutes);
apiV1.use("/upload", uploadRoutes);
apiV1.use("/instructor-students", instructorStudentRoutes);
apiV1.use("/payments", paymentRoutes);
apiV1.use("/welfare", welfareRoutes);
apiV1.use("/contact", contactRoutes);
apiV1.use("/instructor-applications", instructorApplicationRoutes);
apiV1.use("/reviews", reviewRoutes);

// Mount routes at both /v1 and /api/v1 for flexibility
app.use("/v1", apiV1);
app.use("/api/v1", apiV1);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Database sync and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Fail fast if critical secrets are missing in production
    if (process.env.NODE_ENV === "production") {
      const required = ["JWT_SECRET", "JWT_REFRESH_SECRET"];
      const missing = required.filter((k) => !process.env[k]);
      if (missing.length) {
        console.error(`Missing required env vars: ${missing.join(", ")}`);
        process.exit(1);
      }
    }

    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ alter: false });
    console.log("Database synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api/v1`);
      startTrialEmailJob();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
