const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static assets (css, js, img, plugins, fonts)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Clean URL routing - maps /section/page to /src/pages/section/page.html
const sections = ['auth', 'student', 'instructor', 'courses', 'blog', 'shared', 'admin', 'projects'];

sections.forEach(section => {
  app.get(`/${section}/:page`, (req, res, next) => {
    let page = req.params.page;

    // Redirect .html URLs to clean URLs
    if (page.endsWith('.html')) {
      return res.redirect(301, `/${section}/${page.replace('.html', '')}`);
    }

    const filePath = path.join(__dirname, 'src', 'pages', section, `${page}.html`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    next();
  });
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Backwards compatibility - still serve old /src/pages/... URLs but redirect to clean URLs
app.get('/src/pages/:section/:page', (req, res) => {
  const { section, page } = req.params;
  const cleanPage = page.replace('.html', '');
  res.redirect(301, `/${section}/${cleanPage}`);
});

// Fallback: serve any .html file that exists at the requested path
app.get('*', (req, res, next) => {
  let requestedPath = req.path;

  // Try adding .html extension if no extension present
  if (!path.extname(requestedPath)) {
    const withHtml = path.join(__dirname, `${requestedPath}.html`);
    if (fs.existsSync(withHtml)) {
      return res.sendFile(withHtml);
    }
  }

  // Try the exact path
  const exactPath = path.join(__dirname, requestedPath);
  if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
    return res.sendFile(exactPath);
  }

  // 404
  const error404 = path.join(__dirname, 'src', 'pages', 'shared', 'error-404.html');
  if (fs.existsSync(error404)) {
    return res.status(404).sendFile(error404);
  }
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${__dirname}`);
});
