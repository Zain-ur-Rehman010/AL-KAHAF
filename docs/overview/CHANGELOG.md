# AlKahaf LMS - Development Changes Log

## December 13, 2025

### 🚀 Development Environment Setup

#### Local Development Server
- Installed `live-server` for serving frontend files with auto-reload
- Added `concurrently` to run multiple npm scripts together
- Updated `frontend/package.json` with new scripts:

```json
{
  "scripts": {
    "start": "live-server --port=3000",
    "sass": "sass --watch assets/scss/main.scss:assets/css/style.css",
    "dev": "concurrently \"npm start\" \"npm run sass\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "live-server": "^1.2.2",
    "sass": "^1.96.0"
  }
}
```

#### Available Commands
| Command | Description |
|---------|-------------|
| `npm start` | Start live-server at http://localhost:3000 |
| `npm run sass` | Watch SCSS and compile to assets/css/style.css |
| `npm run dev` | Run both live-server and Sass watch together |

---

### 🔧 SCSS Migration to Dart Sass 3.0

#### Installed Tools
- `sass-migrator` (v2.5.6) - Installed globally via npm for automated migration

#### Migration Summary
Migrated from deprecated `@import` to modern `@use`/`@forward` syntax.

**Files Modified:**

1. **`assets/scss/main.scss`**
   - All `@import` statements converted to `@use`
   - Example: `@import "utils/variables"` → `@use "utils/index" as *`

2. **`assets/scss/utils/_index.scss`** (NEW FILE)
   - Created to forward variables and mixins
   ```scss
   @forward "variables";
   @forward "mixins";
   ```

3. **`assets/scss/utils/_variables.scss`**
   - Added `@use "sass:color";` at the top
   - Replaced deprecated `darken()` with `color.adjust()`:
     - `darken($success, 10%)` → `color.adjust($success, $lightness: -10%)`
     - `darken($info, 10%)` → `color.adjust($info, $lightness: -10%)`
     - `darken($warning, 10%)` → `color.adjust($warning, $lightness: -10%)`
     - `darken($danger, 10%)` → `color.adjust($danger, $lightness: -10%)`
     - `darken($link-color, 10%)` → `color.adjust($link-color, $lightness: -10%)`

4. **`assets/scss/utils/_mixins.scss`**
   - Added `@use "sass:map";` at the top
   - Replaced deprecated map functions:
     - `map-has-key()` → `map.has-key()`
     - `map-get()` → `map.get()`

---

### 📚 Documentation Updates

#### `docs/reference/LMS_DEVELOPMENT_GUIDE.md`
- Added "Local Development Server" section with setup instructions
- Added "Frontend Commands" section with npm scripts
- Added "Dart Sass (No npm)" section with standalone usage
- Updated SCSS compilation commands to target correct output file (`style.css`)
- Added "Available Scripts" table

---

### ✅ Results

- **All `@import` deprecation warnings eliminated**
- **All `darken()` deprecation warnings eliminated**
- **All `map-has-key/map-get` deprecation warnings eliminated**
- **SCSS compiles cleanly with Dart Sass**
- **CSS output:** `assets/css/style.css` (629KB)

---

### 📝 Quick Reference

#### Start Development
```powershell
cd "D:\Client Projects\AlKahaf\frontend"
npm install
npm run dev
```

#### Compile SCSS Once
```powershell
sass assets\scss\main.scss assets\css\style.css
```

#### Compile SCSS (Watch Mode)
```powershell
sass --watch assets\scss\main.scss:assets\css\style.css
```

#### Compile SCSS (Production/Minified)
```powershell
sass assets\scss\main.scss assets\css\style.css --style=compressed
```

---

### 🔗 Related Files Changed
- `frontend/package.json`
- `frontend/assets/scss/main.scss`
- `frontend/assets/scss/utils/_index.scss` (new)
- `frontend/assets/scss/utils/_variables.scss`
- `frontend/assets/scss/utils/_mixins.scss`
- `docs/reference/LMS_DEVELOPMENT_GUIDE.md`

---

## 🎨 Theme Color Scheme Update

### Base Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#522811` | Main brand color (warm brown) |
| **Secondary** | `#d8ac27` | Accent color (gold) |
| **Teal** | `#02a8b5` | Success, info, highlights |

### Updated Color Palette

#### Primary Shades (Brown #522811)
- `$primary-100`: #f5ebe6 (lightest)
- `$primary-500`: #835230
- `$primary-600`: #522811 (base)
- `$primary-900`: #210f07 (darkest)

#### Secondary Shades (Gold #d8ac27)
- `$secondary-100`: #fdf6e4 (lightest)
- `$secondary-500`: #d8ac27 (base)
- `$secondary-900`: #3d3006 (darkest)

#### Teal/Info/Success Shades (#02a8b5)
- `$info-100`: #e6f7f8 (lightest)
- `$info-600`: #02a8b5 (base)
- `$info-900`: #014d52 (darkest)

### Gradients Updated
- `$primary-gradient`: Brown → Teal → Gold
- `$secondary-gradient`: Gold gradient
- `$success-gradient`: Teal gradient
- `$teal-gradient`: Light teal to white

### Transparent Colors Updated
All transparent/overlay colors now use warm tones matching the theme:
- `$primary-transparent`: #f5ebe6
- `$secondary-transparent`: #fdf6e4
- `$teal-transparent`: #e6f7f8

---

##  Logo Replacement (Site-Wide)

### Changes Made
Updated all logo references across **83 HTML files** to use the new branded logo matching the index.html navbar.

### Logo Files Updated
| Original | Replaced With | Size |
|----------|---------------|------|
| `logo.svg` | `white-logo.png` | 150px  110px (header) |
| `logo-white.svg` | `white-logo.png` | 150px  110px (header) |
| Footer logos | `white-logo.png` | 200px  150px (footer) |

### Files Modified
All HTML files in the frontend directory, including:
- Main pages (`index.html`, `index-2.html` through `index-6.html`, `index-rtl.html`)
- Course pages (`course-*.html`)
- Blog pages (`blog-*.html`)
- Instructor pages (`instructor-*.html`)
- Student pages (`student-*.html`)
- Authentication pages (`login.html`, `register.html`, `forgot-password.html`, etc.)
- Utility pages (`about-us.html`, `contact-us.html`, `faq.html`, `pricing-plan.html`, etc.)

### Implementation
```html
<!-- Header Logo -->
<img src="assets/img/white-logo.png" style="width: 150px;height: 110px;" class="logo" alt="Logo">

<!-- Footer Logo -->
<img src="assets/img/white-logo.png" style="width: 200px;height: 150px;" alt="">
```

---

##  Instructor Dashboard Fix

### Issue
Banner background color was not changing with the theme update due to hardcoded gradient values.

### Files Modified
- `frontend/assets/scss/pages/_instructor.scss`

### Changes
| Line | Before | After |
|------|--------|-------|
| ~1085 | `linear-gradient(10.93deg, #392C7D 16.22%, #6850E3 120.13%)` | `utils.$purple-gradient2` |
| ~774 | `#392C7DE5` | `rgba(utils.$primary, 0.9)` |
