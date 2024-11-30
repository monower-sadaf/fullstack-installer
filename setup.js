const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

// Function to create directories
const createDirectory = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory ${dir} created!`);
    }
};

// Function to create files
const createFile = (filePath, content) => {
    fs.writeFileSync(filePath, content);
    console.log(`File ${filePath} created!`);
};

// Function to initialize a new project
const initProject = (projectName) => {
    const projectDir = `${projectName}`;

    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir);
        console.log(`Project directory ${projectDir} created!`);
    }

    process.chdir(projectDir);

    exec('npm init -y', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error initializing project: ${stderr}`);
            return;
        }
        console.log(stdout);
        installDependencies();
    });
};

// Function to install dependencies
const installDependencies = () => {
    exec('npm install express dotenv', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error installing dependencies: ${stderr}`);
            return;
        }
        console.log(stdout);
        createDirectories();
        createFiles();
        createEnvFile();
        initClientProject();
    });
};

// Function to initialize client project with Vite
const initClientProject = () => {
    exec('npm create vite@latest client -- --template react', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error initializing Vite React app: ${stderr}`);
            return;
        }
        console.log(stdout);
        process.chdir('client');
        installClientDependencies();
    });
};

// Function to install Vite client dependencies and Tailwind CSS
const installClientDependencies = () => {
    exec('npm install', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error installing client dependencies: ${stderr}`);
            return;
        }
        console.log(stdout);
        setupTailwindCss();
    });
};

// Function to set up Tailwind CSS in the client
const setupTailwindCss = () => {
    exec('npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error installing Tailwind CSS: ${stderr}`);
            return;
        }
        console.log(stdout);
        createTailwindConfigFiles();
    });
};

// Function to create and update Tailwind configuration files
const createTailwindConfigFiles = () => {
    // Tailwind content configuration
    const tailwindConfigPath = 'tailwind.config.js';
    const tailwindConfigContent = `
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
    `;
    fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);

    // Tailwind directives in CSS file
    const cssFilePath = 'src/index.css';
    const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
    `;
    fs.writeFileSync(cssFilePath, cssContent);

    console.log('Tailwind CSS setup completed.');

    process.chdir('..');
    addProxyToViteConfig();
    createReadmeFile();
};

// Function to add proxy to vite.config.js
const addProxyToViteConfig = () => {
    const viteConfigPath = 'client/vite.config.js';
    const proxyConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy API requests to backend
    },
  },
});
    `;

    if (fs.existsSync(viteConfigPath)) {
        fs.writeFileSync(viteConfigPath, proxyConfig);
        console.log(`Added proxy configuration to ${viteConfigPath}`);
    } else {
        console.error(`vite.config.js not found at ${viteConfigPath}`);
    }
};

// Function to create README.md file
const createReadmeFile = () => {
    const content = `
# Full-Stack Application (Express + React with Vite + Tailwind CSS)

This project is a full-stack web application using **Express.js** for the backend, **React.js** (with Vite) for the frontend, and **Tailwind CSS** for styling.

---

## Getting Started

Follow the steps below to run the project locally and deploy it for production.

### Prerequisites

Make sure you have the following installed:
- Node.js (>= 14)
- npm (comes with Node.js)

---

## Running the Project Locally

1. Clone the repository and navigate into the project directory:
   \`\`\`bash
   git clone <your-repo-url>
   cd <project-name>
   \`\`\`

2. Install dependencies for both the backend and frontend:
   \`\`\`bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   \`\`\`

3. Set up environment variables:
   - Create a \`.env\` file in the \`server\` directory and add your configurations. Example:
     \`\`\`
     PORT=3000
     DB_URL=mongodb://localhost:27017/myapp
     \`\`\`

4. Start the backend server:
   \`\`\`bash
   cd ../server
   node index.js
   \`\`\`

5. Start the frontend development server:
   \`\`\`bash
   cd ../client
   npm run dev
   \`\`\`

6. Access the application:
   - React (frontend): [http://localhost:5173](http://localhost:5173)
   - Express (API): [http://localhost:3000](http://localhost:3000)

---

## Deploying for Production

1. Build the React frontend:
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

   This will generate a \`dist\` folder in the \`client\` directory.

2. Serve the frontend with the backend:
   - The backend (Express) will automatically serve the React app from the \`dist\` folder.

3. Start the production server:
   \`\`\`bash
   cd server
   node index.js
   \`\`\`

4. Access the application:
   - [http://localhost:3000](http://localhost:3000)

---

## Styling with Tailwind CSS

- Modify styles in \`client/src/index.css\`.
- Tailwind is already configured and ready to use.

---

## Proxy Configuration

In development, API calls from the React app to the backend are proxied via Vite:
- Proxy path: \`/api\`
- Backend URL: \`http://localhost:3000\`

Modify the proxy settings in \`client/vite.config.js\` if necessary.

---

## Project Structure

\`\`\`
<project-name>/
├── client/           # React frontend (Vite + Tailwind CSS)
├── server/           # Express backend
├── README.md         # Documentation
└── .env              # Backend environment variables
\`\`\`

---

## License

This project is licensed under the MIT License.
    `;

    createFile('README.md', content);
    console.log('README.md created with project documentation.');
};

// Function to create directories
const createDirectories = () => {
    const directories = [
        'server/http/controllers',
        'server/http/middleware',
        'server/resources/views',
        'server/resources/routes',
        'server/config',
    ];

    directories.forEach(createDirectory);
};

// Function to create initial backend files
const createFiles = () => {
    createFile('server/index.js', `require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});`);
    createFile('server/config/index.js', `module.exports = {
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
};`);
};

// Function to create .env file
const createEnvFile = () => {
    createFile('server/.env', 'PORT=3000\nDB_URL=mongodb://localhost:27017/myapp');
};

// Prompt for project name and run the script
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the project name: ', (projectName) => {
    initProject(projectName);
    rl.close();
});
