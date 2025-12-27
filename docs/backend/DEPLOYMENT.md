# Production Checklist - Deployment Guide

Comprehensive checklist for deploying Al-Kahaf LMS backend to production.

## Pre-Deployment (1 week before)

### Code Review & Testing
- [ ] All code reviewed by team lead
- [ ] Unit tests passing (100% critical paths)
- [ ] Integration tests passing
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Security audit completed
- [ ] Database migration tested on staging
- [ ] Rollback procedures tested

### Infrastructure Preparation
- [ ] Production database provisioned (PostgreSQL 12+)
- [ ] Database backups configured (daily automated)
- [ ] CDN/cache configured (Redis)
- [ ] SSL/TLS certificates obtained
- [ ] Domain DNS configured
- [ ] Load balancer provisioned
- [ ] Monitoring/alerting setup (New Relic, DataDog, etc.)

### Security Hardening
- [ ] All JWT secrets changed (unique, 32+ chars)
- [ ] Database passwords changed
- [ ] API keys rotated (Stripe, AWS, SMTP)
- [ ] .env file secured (no version control)
- [ ] CORS whitelist configured
- [ ] Rate limiting tuned for production traffic
- [ ] HTTPS enforced (redirect HTTP → HTTPS)

### Monitoring & Logging
- [ ] Centralized logging setup (ELK, Splunk, CloudWatch)
- [ ] Application performance monitoring (APM)
- [ ] Error tracking setup (Sentry, Rollbar)
- [ ] Uptime monitoring configured
- [ ] Alerting rules created (CPU, memory, errors, latency)
- [ ] Dashboard created for real-time monitoring

## Deployment Day

### Pre-Deployment Verification
- [ ] Development team notified
- [ ] Maintenance window scheduled
- [ ] Backup of production database taken
- [ ] All team members informed of deployment time
- [ ] Rollback plan reviewed with team

### Environment Configuration
```bash
# Production .env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database - Use managed service
DB_HOST=prod-db.aws.rds.amazonaws.com
DB_PORT=5432
DB_NAME=alkahaf_lms_production
DB_USER=db_admin
DB_PASSWORD=<strong-password>
DB_SSL=true

# JWT - Generate new secrets!
JWT_SECRET=<generate-with: openssl rand -base64 32>
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=<generate-with: openssl rand -base64 32>
JWT_REFRESH_EXPIRATION=7d

# Stripe (Real keys, not test)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email - Use production SMTP
SMTP_HOST=smtp.company.com
SMTP_PORT=587
SMTP_USER=noreply@alkahaf.com
SMTP_PASSWORD=<app-password>
SMTP_FROM=noreply@alkahaf.com

# Redis - Use managed service
REDIS_HOST=prod-redis.aws.elasticache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# CORS - Only production domains
CORS_ORIGIN=https://app.alkahaf.com,https://www.alkahaf.com

# Rate Limiting - More restrictive
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# AWS S3 for uploads
AWS_ACCESS_KEY_ID=<production-key>
AWS_SECRET_ACCESS_KEY=<production-secret>
AWS_S3_BUCKET=alkahaf-prod-uploads
AWS_S3_REGION=us-east-1
```

### Database Migration
```bash
# Run migrations in production database
npm run migrate

# Verify schema
npm run migrate:status

# Keep migration logs
npm run migrate > migration-logs-$(date +%Y%m%d-%H%M%S).log
```

### Application Deployment (Docker)

#### Option 1: AWS EC2
```bash
# SSH into production server
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# Pull latest code
cd /app/backend
git pull origin main

# Build and start
docker build -t alkahaf-backend:$(date +%Y%m%d-%H%M%S) .
docker-compose -f docker-compose.prod.yml up -d

# Verify container health
docker-compose ps
docker-compose logs app
```

#### Option 2: Heroku
```bash
# Set environment variables
heroku config:set NODE_ENV=production --app alkahaf-production
heroku config:set JWT_SECRET=<new-secret> --app alkahaf-production
# ... set other variables

# Deploy
git push heroku main

# Check deployment
heroku logs --tail --app alkahaf-production
```

#### Option 3: Kubernetes
```bash
# Update production deployment
kubectl set image deployment/alkahaf-backend \
  app=alkahaf-backend:$(date +%Y%m%d-%H%M%S) \
  -n production

# Verify rollout
kubectl rollout status deployment/alkahaf-backend -n production

# Check logs
kubectl logs -f deployment/alkahaf-backend -n production
```

### Post-Deployment Verification

#### Health Checks
```bash
# API health endpoint
curl https://api.alkahaf.com/api/health

# Database connectivity
curl -H "Authorization: Bearer <admin-token>" \
  https://api.alkahaf.com/api/v1/users

# Response time check
time curl https://api.alkahaf.com/api/v1/courses
```

#### Functional Testing
- [ ] User registration working
- [ ] Login and JWT token generation
- [ ] Course creation (instructor)
- [ ] Course enrollment (student)
- [ ] Progress tracking
- [ ] Certificate issuance
- [ ] Email notifications sending
- [ ] Payment processing (test with Stripe)
- [ ] File uploads working
- [ ] Search functionality working

#### Smoke Tests (Automated)
```bash
# Run smoke test suite
npm run test:smoke

# Expected: All 50+ critical tests passing
```

### Monitoring Verification
- [ ] Application metrics showing in monitoring dashboard
- [ ] Log aggregation receiving events
- [ ] Alert notifications test (send test alert)
- [ ] Error tracking test (trigger test error)
- [ ] Performance baseline established

## Post-Deployment (Ongoing)

### First 24 Hours
- [ ] Monitor error rates (should be < 0.1%)
- [ ] Monitor API response times (p95 < 500ms)
- [ ] Monitor database connections
- [ ] Check for unusual traffic patterns
- [ ] Review user feedback channels
- [ ] Verify automated backups running
- [ ] Check alert notifications working

### First Week
- [ ] Run load testing against production
- [ ] Review security logs
- [ ] Verify disaster recovery procedures
- [ ] Test failover mechanisms
- [ ] Performance optimization (if needed)
- [ ] Update documentation with prod URLs

### Ongoing
- [ ] Daily health checks
- [ ] Weekly backup verification
- [ ] Monthly security audits
- [ ] Quarterly disaster recovery drills
- [ ] Performance trend analysis
- [ ] Dependency security updates

## Rollback Procedures

### Quick Rollback (if critical issues)
```bash
# Docker rollback to previous image
docker pull alkahaf-backend:previous-build
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Heroku rollback
heroku rollback -a alkahaf-production

# Kubernetes rollback
kubectl rollout undo deployment/alkahaf-backend -n production
```

### Database Rollback
```bash
# Rollback migrations
npm run migrate:rollback

# Restore from backup (last resort)
pg_restore --clean --if-exists -d <db-name> backup.dump
```

## Scaling Checklist

When handling increased load:

### Horizontal Scaling
- [ ] Load balancer configured (round-robin or least connections)
- [ ] Session management (Redis for shared sessions)
- [ ] Database read replicas setup
- [ ] Static asset caching (CDN)
- [ ] Database connection pooling tuned
- [ ] Horizontal scaling tested

### Vertical Scaling
- [ ] Increase server RAM (if needed)
- [ ] Increase CPU cores
- [ ] Database resource upgrades
- [ ] Redis memory increase
- [ ] Monitor performance improvements

## Security Maintenance

### Weekly
- [ ] Review error logs for suspicious patterns
- [ ] Check failed login attempts
- [ ] Verify rate limiting effectiveness

### Monthly
- [ ] Rotate database backups
- [ ] Review user access logs
- [ ] Check for SQL injection attempts
- [ ] Verify HTTPS certificate validity

### Quarterly
- [ ] Update dependencies (security patches)
- [ ] Run OWASP security scan
- [ ] Penetration testing (if resources available)
- [ ] Review access control policies

## Production Performance Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (p95) | < 500ms | > 1000ms |
| Database Query Time (p95) | < 100ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| CPU Usage | 40-60% | > 80% |
| Memory Usage | 50-70% | > 85% |
| Disk Usage | 50-70% | > 85% |
| API Availability | 99.9% | < 99.9% |
| Cache Hit Rate | > 80% | < 70% |

## Disaster Recovery Plan

### RTO (Recovery Time Objective): 1 hour
### RPO (Recovery Point Objective): 15 minutes

### Procedures
1. **Database failure**: Restore from latest backup (automated)
2. **Application crash**: Restart container/service
3. **Complete data loss**: Restore from daily backups
4. **Security breach**: Rotate all credentials, backup data

## Compliance & Audit

- [ ] GDPR compliance (if EU customers)
- [ ] Data retention policies defined
- [ ] User data privacy policies
- [ ] Regular security audits
- [ ] Audit logging enabled
- [ ] Compliance documentation updated

## Communication Plan

- **Status Page**: Update status.alkahaf.com during maintenance
- **Email Notification**: Send to users 24 hours before
- **Slack Channel**: #production-deployments
- **Post-Deployment**: Send summary to stakeholders

## Success Criteria

- ✅ All tests passing
- ✅ Error rate < 0.1%
- ✅ API response time < 500ms (p95)
- ✅ Database accessible and responsive
- ✅ All external services connected (Stripe, email, etc.)
- ✅ Monitoring and alerting functional
- ✅ User feedback positive (if in beta)
- ✅ No critical bugs reported in 24 hours

## Sign-Off

- [ ] DevOps Engineer: _____________ Date: _______
- [ ] QA Lead: _____________ Date: _______
- [ ] Product Manager: _____________ Date: _______
- [ ] CTO: _____________ Date: _______

---

**Remember**: "Slow down to move fast. Take time to test thoroughly; rushing deployments causes production issues that cost far more time to fix."
