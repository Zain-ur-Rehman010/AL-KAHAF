# Instructor Data Template (Client Submission)

Use this file to request instructor profile data from the client.

## 1) Required Fields (Minimum)

These are the minimum fields needed to create instructor accounts and render list/detail pages.

- `firstName`
- `lastName`
- `email` (must be unique)
- `password` (temporary password; instructor changes later)
- `designation`
- `bio`
- `profileImage` (URL or image file)
- `specialization` (list)
- `experience` (years)
- `status` (`active` / `inactive`)

## 2) Recommended Fields (For Rich Instructor Profiles)

- `phone`
- `isVerified` (true/false)
- `rating` (0.0 to 5.0)
- `languages` (list)
- `teachingMode` (online/live/recorded/hybrid)
- `subjectsTaught` (list)
- `socialLinks.linkedin`
- `socialLinks.facebook`
- `socialLinks.twitter`
- `socialLinks.website`
- `education` (list of degree/institute/year)
- `workExperience` (list of role/org/year)
- `addressCity`
- `addressCountry`
- `introVideoUrl` (optional)
- `certifications` (optional list)

## 3) One Dummy Example Row (Client Reference)

This same row is also available in CSV format at:

- `docs/client/INSTRUCTOR_DATA_TEMPLATE.csv`

```text
firstName: Maulana Anees ur
lastName: Rehman
email: anees.rehman@example.com
password: TempPass@123
phone: +92-300-1234567
designation: Supervisor, Al-Kahaf Online Academy
bio: Experienced Islamic scholar and academic supervisor with strong foundation in classical and contemporary Islamic education.
profileImage: [image file or hosted URL]
specialization: Quran; Tajweed; Dars-e-Nizami; Islamic Studies
experience: 12
status: active
isVerified: true
rating: 4.9
languages: Urdu; Arabic; English
teachingMode: live_online
subjectsTaught: Quran Memorization; Tajweed; Islamic Studies
socialLinks.linkedin: [url]
socialLinks.facebook: [url]
socialLinks.twitter: [url]
socialLinks.website: [url]
education: Shahadat-ul-Alamiyyah|Wifaq ul Madaris|2012|2018; MA Islamic Studies|University X|2019|2021
workExperience: Supervisor|Al-Kahaf Online Academy|2021|Present; Lecturer|Madrasa Y|2017|2021
addressCity: Lahore
addressCountry: Pakistan
introVideoUrl: [url]
certifications: Tajweed Certification (2020); Quran Teaching License (2022)
```

---

## 4) DB Schema Audit (Current State)

### Already Available in DB (`Users` table)

- `firstName`, `lastName`, `email`, `password`
- `phone`, `profileImage`, `bio`
- `designation`, `specialization`, `experience`
- `rating`, `isVerified`, `socialLinks`
- `education`, `workExperience`
- `status`, `emailVerified`, `role`
- `totalCourses`, `totalStudents`

### Missing as Dedicated DB Columns (if needed as separate fields)

- `languages`
- `teachingMode`
- `subjectsTaught`
- `addressCity`
- `addressCountry`
- `introVideoUrl`
- `certifications`
- `featuredInstructor` / `displayOrder` (if homepage ordering is needed)

> These can be added as new columns, or temporarily stored inside existing JSON fields (`specialization`, `socialLinks`, `education`, `workExperience`) until schema expansion.

---

## 5) Important API Note

At the moment, instructor creation through `POST /auth/register` does **not** save all profile fields.

### Saved during register now

- `firstName`, `lastName`, `email`, `password`, `role`
- `phone`, `bio`, `profileImage`, `designation`, `specialization`, `experience`

### Not saved during register (must be updated later via admin update API)

- `rating`, `isVerified`, `socialLinks`, `education`, `workExperience`, `status`, `emailVerified`

So after creating instructor accounts, the admin should run `PUT /admin/instructors/:id` to complete the remaining fields unless registration logic is expanded.
