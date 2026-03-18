# Client Data Requirements - Al-Kahaf Online Academy

**Document Purpose:** This checklist identifies all placeholder/template data currently on the public-facing pages that needs to be replaced with real client data before launch.

**Website:** alkahafonlineacademy.com
**Date:** February 2026

---

## 1. Organization / Contact Information

These placeholder values appear across **every page** (header topbar, footer, contact page):

| # | Data Needed | Current Placeholder | Where It Appears |
|---|------------|---------------------|------------------|
| 1.1 | Physical Address | "1442 Crosswind Drive Madisonville" / "1364 Still Water Dr, AK 99801" | Header topbar (all pages), Contact Us page, Footer |
| 1.2 | Phone Number | "+1 45887 77874" / "+1 (907) 789-7623" | Header topbar (all pages), Contact Us page |
| 1.3 | Email Address | "contact@example.com" | Contact Us page, Footer |
| 1.4 | Facebook URL | `javascript:void(0);` (no link) | Header topbar, Footer (all pages) |
| 1.5 | Instagram URL | `javascript:void(0);` (no link) | Header topbar, Footer (all pages) |
| 1.6 | Twitter/X URL | `javascript:void(0);` (no link) | Header topbar, Footer (all pages) |
| 1.7 | YouTube URL | `javascript:void(0);` (no link) | Header topbar, Footer (all pages) |
| 1.8 | LinkedIn URL | `javascript:void(0);` (no link) | Header topbar, Footer (all pages) |
| 1.9 | WhatsApp Number (if any) | Not present yet | Can be added if needed |
| 1.10 | Google Maps Embed URL | Not present | Contact Us page (map section) |

**Client Action:** Provide real address, phone, email, and social media links.

---

## 2. SEO & Meta Information

These appear in the `<head>` section of **every HTML page**:

| # | Data Needed | Current Placeholder |
|---|------------|---------------------|
| 2.1 | Site Description | "Dreams LMS is a powerful Learning Management System template..." |
| 2.2 | Keywords | "LMS template, Learning Management System, e-learning software..." |
| 2.3 | Author Name | "Dreams Technologies" |
| 2.4 | Favicon | Generic template favicon |
| 2.5 | Apple Touch Icon | Generic template icon |
| 2.6 | Open Graph Image (og:image) | Not set |

**Client Action:** Provide a short site description (1-2 sentences), relevant keywords for Islamic education, and brand favicon/icons.

---

## 3. Course Data (Most Critical)

Currently all course listings show generic template data. Need real courses for initial launch.

### 3A. Basic Course Info (shown on Course Grid/List pages)

| # | Data Field | Current Placeholder | Required? |
|---|-----------|---------------------|-----------|
| 3.1 | Course Title | "The Complete Web Developer Course 2.0" | YES |
| 3.2 | Short Description (1-2 lines) | "Learn Web Development by building 25 websites..." | YES |
| 3.3 | Category/Tag | "Web Development" (need Islamic categories) | YES |
| 3.4 | Price (or Free) | "$99.00" / "FREE" | YES |
| 3.5 | Original Price (if discounted) | "$99.00" shown as strikethrough | Optional |
| 3.6 | Discount Percentage | "50% off" | Optional |
| 3.7 | Course Thumbnail Image | Generic placeholder images | YES |
| 3.8 | Number of Lessons | "12+ Lesson" | YES |
| 3.9 | Total Duration | "9hr 30min" | YES |
| 3.10 | Students Enrolled Count | "32 students enrolled" | YES |
| 3.11 | Rating (1-5 stars) | "4.0 (15)" | Optional |
| 3.12 | Level | Beginner / Intermediate / Advanced | YES |

### 3B. Course Detail Page - Full Info

#### Overview Section
| # | Data Field | Current Placeholder | Required? |
|---|-----------|---------------------|-----------|
| 3.13 | Full Course Description (2-3 paragraphs) | Generic AI/ChatGPT course text | YES |
| 3.14 | What You'll Learn (bullet points) | "Become a UX designer", "Build a full website design" etc. | YES |
| 3.15 | Requirements/Prerequisites (bullet points) | "Adobe XD 2019 or above", "No previous design experience" | YES |
| 3.16 | Target Audience | Generic text | Optional |
| 3.17 | Language of Instruction | Not specified (English/Arabic/Urdu?) | YES |

#### Course Features (Right Sidebar)
| # | Data Field | Current Placeholder | Required? |
|---|-----------|---------------------|-----------|
| 3.18 | Hours of on-demand video | "11 hours on-demand video" | YES |
| 3.19 | Downloadable resources count | "69 downloadable resources" | Optional |
| 3.20 | Full lifetime access? | "Full lifetime access" | YES (Yes/No) |
| 3.21 | Access on mobile and TV? | "Access on mobile and TV" | YES (Yes/No) |
| 3.22 | Assignments included? | "Assignments" | YES (Yes/No) |
| 3.23 | Certificate of Completion? | "Certificate of Completion" | YES (Yes/No) |

#### Course Content / Curriculum
| # | Data Field | Current Placeholder | Required? |
|---|-----------|---------------------|-----------|
| 3.24 | Total Lectures Count | "92 Lectures" | YES |
| 3.25 | Total Course Duration | "10:56:11" | YES |
| 3.26 | Module/Chapter Names | "Getting Started", "The Brief", "Wireframing Low Fidelity", "Type, Color & Icon Introduction" | YES |
| 3.27 | Lesson Titles (per module) | "Lecture1.1 Introduction to User Experience Course", "Lecture1.2 Exercise: Your first design challenge" etc. | YES |
| 3.28 | Lesson Duration (per lesson) | "02:53" per lecture | YES |
| 3.29 | Preview Available? (per lesson) | "Preview" link on some lectures | Optional |

#### Promotional Banner (if applicable)
| # | Data Field | Current State | Required? |
|---|-----------|---------------|-----------|
| 3.30 | Course Promotional Banner Image | Green Urdu banner with phone numbers & schedule | Optional |
| 3.31 | Banner Phone Numbers | "0311 1881155", "0307 6660985" | If banner used |
| 3.32 | Class Schedule/Timing | "6:30 سے 2:30" etc. | If banner used |
| 3.33 | Course Start Date | "26 دسمبر 2025" | If banner used |

### 3C. Suggested Course Categories for Al-Kahaf

The template currently shows generic tech categories. Need Islamic education categories such as:
- [ ] Quran Studies (Hifz, Tajweed, Tafsir)
- [ ] Arabic Language
- [ ] Islamic Jurisprudence (Fiqh)
- [ ] Hadith Sciences
- [ ] Islamic History
- [ ] Seerah (Prophet's Biography)
- [ ] Aqeedah (Islamic Creed)
- [ ] Dua & Adhkar
- [ ] Islamic Finance
- [ ] Other: _______________

### 3D. Sample Course Data Template

Use this template to fill in data for each course:

```
Course #___:
  Title: _______________
  Short Description: _______________
  Category: _______________
  Price: ___ (Original Price: ___ / Discount: __%)
  Level: [ ] Beginner  [ ] Intermediate  [ ] Advanced
  Language: [ ] English  [ ] Arabic  [ ] Urdu
  Total Duration: ___ hours
  Total Lectures: ___
  Thumbnail Image: (attach file)

  Full Description:
  _______________________________________________
  _______________________________________________

  What Students Will Learn:
  - _______________
  - _______________
  - _______________

  Prerequisites:
  - _______________
  - _______________

  Course Features:
  [ ] On-demand video: ___ hours
  [ ] Downloadable resources: ___ files
  [ ] Lifetime access
  [ ] Mobile/TV access
  [ ] Assignments
  [ ] Certificate of Completion

  Curriculum:
    Module 1: _______________
      - Lesson 1.1: _______________ (duration: __)
      - Lesson 1.2: _______________ (duration: __)
    Module 2: _______________
      - Lesson 2.1: _______________ (duration: __)
      - Lesson 2.2: _______________ (duration: __)
```

**Client Action:** Provide at least 3-5 courses with full details using the template above. More can be added later via admin panel.

---

## 4. Instructor Data

Currently showing fake instructor profiles (e.g., "Nicole Brown - UX/UI Designer").

### 4A. Instructor Profile (shown on Instructor List/Grid pages)
| # | Data Needed | Current Placeholder | Required? |
|---|------------|---------------------|-----------|
| 4.1 | Instructor Full Name | "Nicole Brown" | YES |
| 4.2 | Profile Photo (high quality) | Generic avatar images | YES |
| 4.3 | Title/Designation | "UX/UI Designer" | YES |
| 4.4 | Rating (1-5 stars) | "4.5" | Optional |

### 4B. Instructor Detail (shown on Course Detail page & Instructor Detail page)
| # | Data Needed | Current Placeholder | Required? |
|---|------------|---------------------|-----------|
| 4.5 | Bio/About (2-3 paragraphs) | "UI/UX Designer, with 7+ Years Experience. Guarantee of High Quality Work." | YES |
| 4.6 | Skills/Qualifications (comma-separated) | "Web Design, UI Design, UX/UI Design, Mobile Design, Photoshop, Sketch, HTML, CSS..." | YES |
| 4.7 | Specialization/Expertise | Generic tech skills | YES |
| 4.8 | Experience (years) | "7+ Years" | YES |
| 4.9 | Number of Courses | "5 Courses" | YES |
| 4.10 | Number of Lessons | "12+ Lesson" | Optional |
| 4.11 | Total Teaching Hours | "9hr 30min" | Optional |
| 4.12 | Students Enrolled (total) | "270,886 students enrolled" | Optional |
| 4.13 | Availability | "Full Time Office Work, Remote Work, Freelance, Contract, Worldwide" | Optional |
| 4.14 | Social Media Links | Not linked (`javascript:void(0);`) | Optional |
| 4.15 | Contact Email | Not set | Optional |

### 4C. Sample Instructor Data Template

```
Instructor #___:
  Full Name: _______________
  Photo: (attach file)
  Designation: _______________ (e.g., "Quran Teacher", "Arabic Language Instructor")

  Bio:
  _______________________________________________
  _______________________________________________

  Skills/Qualifications:
  _______________________________________________

  Specialization: _______________
  Experience: ___ years
  Number of Courses Teaching: ___

  Availability:
  [ ] Full Time  [ ] Part Time  [ ] Remote  [ ] Worldwide

  Social Links (optional):
    Facebook: _______________
    Twitter/X: _______________
    LinkedIn: _______________
    YouTube: _______________
```

**Client Action:** Provide details for each instructor who will be teaching on the platform. At minimum: name, photo, bio, designation, and qualifications.

---

## 5. Home Page Content

### 5.1 Hero Slider/Banner
| # | Data Needed | Current State |
|---|------------|---------------|
| 5.1.1 | Hero Headline Text | Custom Al-Kahaf text (already customized) |
| 5.1.2 | Hero Sub-headline | Custom text (already customized) |
| 5.1.3 | Hero Background Images (3-5) | Using custom Al-Kahaf images |
| 5.1.4 | Call-to-Action Button Text | "Enroll Now" / "Donate" (already set) |

### 5.2 Statistics/Counters
| # | Data Needed | Current Placeholder |
|---|------------|---------------------|
| 5.2.1 | Total Students | Generic numbers |
| 5.2.2 | Total Courses | Generic numbers |
| 5.2.3 | Total Instructors | Generic numbers |
| 5.2.4 | Years of Experience / Satisfaction Rate | Generic numbers |

### 5.3 Featured Courses Section
| # | Data Needed | Status |
|---|------------|--------|
| 5.3.1 | Which courses to feature on homepage | Currently showing template courses |
| 5.3.2 | Course images/thumbnails | Template images |

### 5.4 Why Choose Us / Skills Section
| # | Data Needed | Current Placeholder |
|---|------------|---------------------|
| 5.4.1 | Feature 1: Title + Description | Generic LMS features |
| 5.4.2 | Feature 2: Title + Description | Generic LMS features |
| 5.4.3 | Feature 3: Title + Description | Generic LMS features |
| 5.4.4 | Feature 4: Title + Description | Generic LMS features |

### 5.5 How It Works Section
| # | Data Needed | Current State |
|---|------------|---------------|
| 5.5.1 | Step 1: Fill Form | Already customized |
| 5.5.2 | Step 2: Confirm Enrollment | Already customized |
| 5.5.3 | Step 3: Download Zoom | Already customized |
| 5.5.4 | Step 4: Payment | Already customized |

**Client Action:** Provide real statistics (even approximate), confirm featured courses, and review "Why Choose Us" text.

---

## 6. About Us Page

| # | Data Needed | Current Placeholder |
|---|------------|---------------------|
| 6.1 | Main Heading | "Empowering Learning, Inspiring Growth" |
| 6.2 | About Description (2-3 paragraphs) | "At DreamsLMS, we make education accessible to all..." |
| 6.3 | Mission Statement | Not present (generic text) |
| 6.4 | Vision Statement | Not present (generic text) |
| 6.5 | Organization Story/History | Not present |
| 6.6 | About Us Image/Photo | Generic SVG illustration |
| 6.7 | Team Photos (if applicable) | Not present |
| 6.8 | Key Achievements/Milestones | Generic content |
| 6.9 | "Learn from Anywhere" text | Generic LMS text |
| 6.10 | "Expert Mentors" text | Generic LMS text |

**Client Action:** Provide the complete About Us content - who is Al-Kahaf, when was it founded, what is the mission, etc.

---

## 7. FAQ Page

Currently showing **generic LMS template questions** with duplicate answers:

| # | Current Question | Needs Replacement? |
|---|-----------------|-------------------|
| 7.1 | "Is there a 14-days trial?" | Yes - needs real answer |
| 7.2 | "How much time I will need to learn this app?" | Yes - rephrase for Islamic courses |
| 7.3 | "Is there a month-to-month payment option?" | Yes - needs real payment info |
| 7.4 | "What's the benefits of the Premium Membership?" | Yes - needs real membership info |
| 7.5 | "Are there any free tutorials available?" | Yes - needs real answer |
| 7.6 | "How can I cancel my subscription plan?" | Yes - needs real cancellation policy |

**All answers currently show the same text:** "No, we currently do not offer a 14-day trial..."

**Client Action:** Provide 6-10 real FAQs with proper answers relevant to Al-Kahaf's Islamic education platform. Suggested topics:
- How do classes work? (Live via Zoom? Recorded?)
- What age groups do you teach?
- What qualifications do your teachers have?
- How is Quran memorization tracked?
- What is the class schedule?
- What devices/software do students need?
- What is the refund policy?
- Do you offer trial classes?
- How do parents track progress?

---

## 8. Testimonials / Reviews

Currently showing **template testimonials with fake names and stock photos**.

### For Each Testimonial, We Need:
| # | Data Field | Status |
|---|-----------|--------|
| 8.1 | Student/Parent Name | Fake names |
| 8.2 | Photo (optional) | Stock avatars |
| 8.3 | Review Text (2-3 sentences) | Generic template text |
| 8.4 | Rating (1-5 stars) | Generic ratings |
| 8.5 | Course Taken (optional) | Not specified |
| 8.6 | Location/Country (optional) | Not specified |

**Client Action:** Provide 5-10 real testimonials from current/past students or parents. Can use first name + last initial for privacy.

---

## 9. Pricing Structure

Currently showing **generic pricing plans**:

| Plan | Current Price | Current Features |
|------|-------------|-----------------|
| Basic | $10/month | 10 active courses, 1 GB storage, etc. |
| Standard | $50/month | 20 courses, 10 GB storage, etc. |
| Premium | $100/month | Unlimited courses, 100 GB storage, etc. |

**Client Action:** Provide real pricing:
- [ ] Individual course pricing OR subscription model?
- [ ] What are the actual tier names and prices?
- [ ] What features are included in each tier?
- [ ] Is there a free tier / trial period?
- [ ] Accepted payment methods (Stripe, PayPal, bank transfer, etc.)?
- [ ] Currency: USD, GBP, PKR, or multiple?

---

## 10. Legal Pages

| # | Page | Status |
|---|------|--------|
| 10.1 | Terms & Conditions | Template text - needs real legal content |
| 10.2 | Privacy Policy | Template text - needs real legal content |
| 10.3 | Refund Policy | Not present - may be needed |
| 10.4 | Cookie Policy | Not present - may be needed for GDPR |

**Client Action:** Provide or approve legal documents. Consider hiring a legal consultant for these.

---

## 11. Blog Content (Optional for Launch)

Currently showing template blog posts with generic tech content.

| # | Data Needed | Status |
|---|------------|--------|
| 11.1 | Blog Post Titles | Generic (tech-related) |
| 11.2 | Blog Post Content | Lorem ipsum / generic |
| 11.3 | Blog Post Images | Stock photos |
| 11.4 | Author Names | Fake names |
| 11.5 | Categories/Tags | Generic |

**Client Action:** Provide 3-5 initial blog posts if blog is needed at launch. Topics could include:
- Benefits of online Quran learning
- How to choose the right Islamic course
- Student success stories
- Islamic education tips for parents

---

## 12. Images & Media

| # | Asset Needed | Status |
|---|-------------|--------|
| 12.1 | Company Logo (PNG + SVG) | Custom logo already added |
| 12.2 | Favicon (16x16, 32x32) | Custom SVG favicon added (brown + gold diamond) |
| 12.3 | Course Thumbnails | Need real images per course |
| 12.4 | Instructor Photos | Need real photos |
| 12.5 | About Us Photos | Template illustrations |
| 12.6 | Banner/Hero Images | Some custom images added |
| 12.7 | Testimonial Photos | Stock avatars |
| 12.8 | Blog Post Images | Stock photos |
| 12.9 | Building/Campus Photo | Using DJI drone photo |

---

## Priority Summary

### HIGH PRIORITY (Required Before Launch)
1. Contact Information (address, phone, email, social links)
2. At least 3-5 real courses with full details
3. Instructor profiles (name, photo, bio)
4. About Us content
5. FAQ with real questions/answers
6. Pricing structure
7. SEO meta descriptions

### MEDIUM PRIORITY (Should Have)
8. Real testimonials (5-10)
9. Statistics/counters
10. Legal pages (Terms, Privacy Policy)
11. Course categories finalized
12. Real images for courses and instructors

### LOW PRIORITY (Can Add After Launch)
13. Blog content
14. Additional courses
15. App Store / Google Play links (if applicable)
16. Multi-language content (Arabic, Urdu)

---

## Notes for Developer

- All placeholder data is hardcoded in HTML files. Once the backend API is connected, course/instructor/testimonial data will be loaded dynamically from the database.
- The database models are ready to store all this data (Course, User/Instructor, Enrollment, etc.)
- Once client provides the data, it should be seeded into the database and the frontend pages should be connected to the API endpoints.
- Social media links are currently `javascript:void(0);` and need to be updated to real URLs across all 100+ pages (or made dynamic via a shared component/template).

---

**Please fill in the data above and return this document to the development team so we can update the website accordingly.**
