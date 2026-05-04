#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { execSync } from 'child_process';

// استدعاء path و url لضبط مسارات الملفات
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// إعداد __dirname عشان يشتغل مع ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(chalk.bold.cyan('\n🚀 Welcome to gml-react CLI!\n'));

async function run() {
    // 1. عرض الأسئلة على المستخدم
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: 'my-app',
            validate: (input) => (input ? true : 'Project name cannot be empty.')
        },
        {
            type: 'list',
            name: 'language',
            message: 'Select language:',
            choices: ['JavaScript', 'TypeScript']
        },
        {
            type: 'confirm',
            name: 'quickStart',
            message: 'Use Quick Start? (Tailwind, React-Router, React-Icons, Zustand, DaisyUI, Axios)',
            default: true
        },
        // الأسئلة الجاية هتظهر بس لو المستخدم اختار "No" في الـ Quick Start
        {
            type: 'list',
            name: 'cssFramework',
            message: 'Select CSS Framework:',
            choices: ['Tailwind', 'Bootstrap', 'None'],
            when: (answers) => !answers.quickStart
        },
        {
            type: 'list',
            name: 'icons',
            message: 'Select Icons Library:',
            choices: ['React Icons', 'Lucide Icons', 'Huge Icons', 'None'],
            when: (answers) => !answers.quickStart
        },
        {
            type: 'list',
            name: 'stateManagement',
            message: 'Select State Management:',
            choices: ['Zustand', 'Redux', 'None'],
            when: (answers) => !answers.quickStart
        },
        {
            type: 'list',
            name: 'uiLibrary',
            message: 'Select UI Library:',
            choices: ['DaisyUI', 'Shadcn', 'None'],
            when: (answers) => !answers.quickStart
        },
        {
            type: 'confirm',
            name: 'router',
            message: 'Include React-Router-Dom?',
            default: true,
            when: (answers) => !answers.quickStart
        }
    ]);

    // 2. تحديد نوع الـ Template بناءً على لغة البرمجة
    const template = answers.language === 'TypeScript' ? 'react-ts' : 'react';

    // 3. إنشاء المشروع باستخدام Vite
    console.log(); // سطر فاضي عشان الشكل
    const createSpinner = ora(`Creating Vite project: ${answers.projectName}...`).start();

    try {
        // تشغيل أمر إنشاء المشروع
        execSync(`npm create vite@latest ${answers.projectName} -- --template ${template}`, { stdio: 'ignore' });
        createSpinner.succeed(chalk.green(`Vite project '${answers.projectName}' created successfully!`));
    } catch (error) {
        createSpinner.fail(chalk.red('Failed to create Vite project.'));
        console.error(error);
        process.exit(1); // نوقف الأداة لو حصل مشكلة
    }

    // 4. الدخول لمجلد المشروع وتثبيت الحزم الأساسية
    const installSpinner = ora('Installing base dependencies (this might take a minute)...').start();
    try {
        // بنغير مسار الأوامر لداخل فولدر المشروع الجديد عشان نعمل npm install
        execSync(`npm install`, { cwd: `./${answers.projectName}`, stdio: 'ignore' });
        installSpinner.succeed(chalk.green('Base dependencies installed!'));
    } catch (error) {
        installSpinner.fail(chalk.red('Failed to install base dependencies.'));
        console.error(error);
        process.exit(1);
    }

    console.log(chalk.cyan('\n⚙️  Ready for the next step: Installing your selected packages & structuring!\n'));

    // 5. تجميع المكتبات المطلوبة بناءً على الاختيارات
    const deps = [];
    const devDeps = [];

    if (answers.quickStart) {
        deps.push('react-router-dom', 'react-icons', 'zustand', 'axios');
        devDeps.push('tailwindcss', '@tailwindcss/vite', 'daisyui');
    } else {
        if (answers.router) deps.push('react-router-dom');
        if (answers.stateManagement === 'Zustand') deps.push('zustand');
        if (answers.stateManagement === 'Redux') deps.push('@reduxjs/toolkit', 'react-redux');

        if (answers.icons === 'React Icons') deps.push('react-icons');
        if (answers.icons === 'Lucide Icons') deps.push('lucide-react');
        if (answers.icons === 'Huge Icons') deps.push('hugeicons-react');

        if (answers.cssFramework === 'Tailwind') devDeps.push('tailwindcss', '@tailwindcss/vite');
        if (answers.cssFramework === 'Bootstrap') deps.push('bootstrap');

        if (answers.uiLibrary === 'DaisyUI') devDeps.push('daisyui');
    }

    // 6. تثبيت المكتبات
    if (deps.length > 0 || devDeps.length > 0) {
        const packagesSpinner = ora('Installing selected packages...').start();
        try {
            if (deps.length > 0) {
                execSync(`npm install ${deps.join(' ')}`, { cwd: `./${answers.projectName}`, stdio: 'ignore' });
            }
            if (devDeps.length > 0) {
                execSync(`npm install -D ${devDeps.join(' ')}`, { cwd: `./${answers.projectName}`, stdio: 'ignore' });
            }
            packagesSpinner.succeed(chalk.green('Packages installed successfully!'));
        } catch (error) {
            packagesSpinner.fail(chalk.red('Failed to install some packages.'));
            console.error(error);
        }
    }

    // تعريف المسارات هنا عشان تكون مقروءة في كل الخطوات الجاية
    const projectPath = `./${answers.projectName}`;
    const srcPath = path.join(projectPath, 'src');
    const ext = answers.language === 'TypeScript' ? 'tsx' : 'jsx';

    // 7. هيكلة المشروع (التنظيف وإنشاء المجلدات)
    const structureSpinner = ora('Structuring project folders and files...').start();
    try {
        // أ. إنشاء المجلدات
        const folders = ['components', 'pages', 'layout', 'hooks', 'store'];
        folders.forEach(folder => fs.ensureDirSync(path.join(srcPath, folder)));

        // ب. حذف App.css
        fs.removeSync(path.join(srcPath, 'App.css'));

        // ج. تعديل App.jsx / tsx بناءً على إطار العمل
        const isTailwind = answers.quickStart || answers.cssFramework === 'Tailwind';
        const isBootstrap = !answers.quickStart && answers.cssFramework === 'Bootstrap';

        // التحقق من وجود react-icons عشان الكود ميضربش لو المستخدم مختارهاش
        const hasReactIcons = answers.quickStart || answers.icons === 'React Icons';
        const iconImport = hasReactIcons ? `\nimport { FaWandMagicSparkles } from "react-icons/fa6";` : '';

        let appContent = '';

        if (isTailwind) {
            appContent = `
import { useState } from 'react';
import logo from './assets/logo.png';${iconImport}

const App = () => {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900/95 to-black text-white/90 items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-6 max-w-md">
        {/* Logo with subtle glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
          <img 
            className={\`size-32 relative transition-all duration-500 hover:scale-105 \${isRotating ? 'animate-pulse' : ''}\`} 
            src={logo} 
            alt="Logo" 
          />
        </div>
        
        {/* Divider */}
        <div className="w-12 h-px bg-white/10"></div>
        
        {/* Main text */}
        <p className="text-xl md:text-2xl font-light tracking-wide text-white/80">
          Hello Vite + React + TailwindCSS!
        </p>

        <button 
          onClick={() => setIsRotating(!isRotating)}
          className="flex items-center gap-2 mt-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          {isRotating ? 'Stop Magic' : 'Do Magic'} ${hasReactIcons ? `<FaWandMagicSparkles className='text-yellow-500'/>` : `✨`}
        </button>
        
        {/* Version/Footer text */}
        <p className="text-xs text-white/20 font-mono mt-8">
          v1.0.0 — ready to build
        </p>
      </div>
    </div>
  );
};

export default App;
`;
        } else if (isBootstrap) {
            appContent = `
import { useState } from 'react';
import logo from './assets/logo.png';${iconImport}

const App = () => {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(to bottom right, #000, #111827, #000)', color: 'rgba(255, 255, 255, 0.9)' }}>
      <style>{\`
        @keyframes customPulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .custom-pulse { animation: customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .custom-logo { width: 8rem; height: 8rem; position: relative; transition: all 0.5s ease; }
        .custom-logo:hover { transform: scale(1.05); }
        .custom-btn { transition: all 0.3s ease; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); }
        .custom-btn:hover { background: rgba(255, 255, 255, 0.1); box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
        .custom-btn:active { transform: scale(0.95); }
      \`}</style>
      
      <div className="d-flex flex-column align-items-center" style={{ gap: '1.5rem', maxWidth: '28rem' }}>
        <div className="position-relative">
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" style={{ background: 'rgba(255,255,255,0.05)', filter: 'blur(20px)' }}></div>
          <img 
            className={\`custom-logo \${isRotating ? 'custom-pulse' : ''}\`} 
            src={logo} 
            alt="Logo" 
          />
        </div>
        
        <div style={{ width: '3rem', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        
        <p className="fs-4 fw-light text-center" style={{ letterSpacing: '0.025em', color: 'rgba(255, 255, 255, 0.8)' }}>
          Hello Vite + React + Bootstrap!
        </p>

        <button 
          onClick={() => setIsRotating(!isRotating)}
          className="btn rounded-pill d-flex align-items-center custom-btn px-4 py-2 mt-2"
          style={{ gap: '0.5rem', fontSize: '0.875rem', letterSpacing: '0.05em' }}
        >
          {isRotating ? 'Stop Magic' : 'Do Magic'} ${hasReactIcons ? `<FaWandMagicSparkles style={{ color: '#eab308' }}/>` : `✨`}
        </button>
        
        <p className="mt-4" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.2)', fontFamily: 'monospace' }}>
          v1.0.0 — ready to build
        </p>
      </div>
    </div>
  );
};

export default App;
`;
        } else {
            appContent = `
import { useState } from 'react';
import logo from './assets/logo.png';${iconImport}

const App = () => {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom right, #000, #111827, #000)', color: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <style>{\`
        @keyframes customPulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .custom-pulse { animation: customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .custom-logo { width: 8rem; height: 8rem; position: relative; transition: all 0.5s ease; }
        .custom-logo:hover { transform: scale(1.05); }
        .custom-btn { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; padding: 0.625rem 1.5rem; border-radius: 9999px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; letter-spacing: 0.05em; cursor: pointer; transition: all 0.3s ease; }
        .custom-btn:hover { background: rgba(255, 255, 255, 0.1); box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
        .custom-btn:active { transform: scale(0.95); }
      \`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '28rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
          <img 
            className={\`custom-logo \${isRotating ? 'custom-pulse' : ''}\`} 
            src={logo} 
            alt="Logo" 
          />
        </div>
        
        <div style={{ width: '3rem', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        
        <p style={{ fontSize: '1.25rem', fontWeight: 300, letterSpacing: '0.025em', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
          Hello Vite + React!
        </p>

        <button 
          onClick={() => setIsRotating(!isRotating)}
          className="custom-btn"
        >
          {isRotating ? 'Stop Magic' : 'Do Magic'} ${hasReactIcons ? `<FaWandMagicSparkles style={{ color: '#eab308' }}/>` : `✨`}
        </button>
        
        <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.2)', fontFamily: 'monospace', marginTop: '2rem' }}>
          v1.0.0 — ready to build
        </p>
      </div>
    </div>
  );
};

export default App;
`;
        }

        fs.writeFileSync(path.join(srcPath, `App.${ext}`), appContent.trim());

        // هـ. تفريغ أو تجهيز index.css
        let cssContent = '';
        const useDaisyUI = answers.quickStart || answers.uiLibrary === 'DaisyUI';

        if (answers.quickStart || answers.cssFramework === 'Tailwind') {
            cssContent = '@import "tailwindcss";\n';
            // إضافة DaisyUI بالطريقة الجديدة لـ Tailwind v4
            if (useDaisyUI) {
                cssContent += '@plugin "../node_modules/daisyui/index.js";\n';
            }
        }
        fs.writeFileSync(path.join(srcPath, 'index.css'), cssContent);

        structureSpinner.succeed(chalk.green('Project structured successfully!'));
    } catch (error) {
        structureSpinner.fail(chalk.red('Failed to structure the project.'));
        console.error(error);
    }

    // 8. نسخ الصور والملفات الخاصة (Assets & Favicon) وتعديل index.html
    const assetsSpinner = ora('Copying custom assets and updating index.html...').start();
    try {
        const templatePath = path.join(__dirname, 'template');

        // تفريغ مجلد assets القديم ونسخ الصورة الجديدة
        fs.emptyDirSync(path.join(srcPath, 'assets'));
        if (fs.existsSync(path.join(templatePath, 'logo.png'))) {
            fs.copySync(path.join(templatePath, 'logo.png'), path.join(srcPath, 'assets', 'logo.png'));
        }

        // قراءة ملف index.html عشان نعدل الـ Favicon
        const indexPath = path.join(projectPath, 'index.html');
        let indexContent = '';
        if (fs.existsSync(indexPath)) {
            indexContent = fs.readFileSync(indexPath, 'utf8');
        }

        // نسخ الـ favicon وتعديل السطر في index.html
        if (fs.existsSync(path.join(templatePath, 'favicon.ico'))) {
            fs.copySync(path.join(templatePath, 'favicon.ico'), path.join(projectPath, 'public', 'favicon.ico'));

            if (indexContent) {
                // تعديل مسار واسم الأيقونة لو كانت vite.svg أو favicon.svg
                indexContent = indexContent.replace(/<link rel="icon" [^>]*href="\/[^"]*\.svg" \/>/g, '<link rel="icon" type="image/x-icon" href="/favicon.ico" />');
                // لو السطر مكتوب بشكل مختلف
                indexContent = indexContent.replace(/href="\/favicon\.svg"/g, 'href="/favicon.ico"');
            }
        } else if (fs.existsSync(path.join(templatePath, 'favicon.svg'))) {
            fs.copySync(path.join(templatePath, 'favicon.svg'), path.join(projectPath, 'public', 'favicon.svg'));

            if (indexContent) {
                indexContent = indexContent.replace(/href="\/vite\.svg"/g, 'href="/favicon.svg"');
            }
        }

        // حفظ التعديلات في ملف index.html
        if (indexContent) {
            fs.writeFileSync(indexPath, indexContent);
        }

        assetsSpinner.succeed(chalk.green('Custom assets copied and index.html updated!'));
    } catch (error) {
        assetsSpinner.fail(chalk.yellow('Skipped custom assets (template folder or files not found).'));
    }

    // 9. إعداد Tailwind في Vite وتهيئة Shadcn
    const configSpinner = ora('Configuring tools and libraries...').start();
    try {
        const useTailwind = answers.quickStart || answers.cssFramework === 'Tailwind';

        if (useTailwind) {
            // تحديد مسار ملف vite.config بناءً على اللغة
            const viteConfigPath = path.join(projectPath, answers.language === 'TypeScript' ? 'vite.config.ts' : 'vite.config.js');

            if (fs.existsSync(viteConfigPath)) {
                let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');

                // 1. إضافة الـ Import تحت import react
                viteConfigContent = viteConfigContent.replace(
                    /import react from '@vitejs\/plugin-react'/,
                    "import react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'"
                );

                // 2. إضافة tailwindcss() جوه مصفوفة الـ plugins
                viteConfigContent = viteConfigContent.replace(
                    /plugins:\s*\[\s*react\(\)\s*\]/,
                    "plugins: [react(), tailwindcss()]"
                );

                fs.writeFileSync(viteConfigPath, viteConfigContent);
            }
        }

        // إعداد Shadcn UI
        if (!answers.quickStart && answers.uiLibrary === 'Shadcn') {
            execSync('npx --yes shadcn@latest init -d', { cwd: projectPath, stdio: 'ignore' });
        }

        configSpinner.succeed(chalk.green('Tools configured successfully!'));
    } catch (error) {
        configSpinner.fail(chalk.red('Failed to configure some tools.'));
        console.error(error);
    }

    // رسالة النهاية
    console.log(chalk.bold.cyan(`\n🎉 Project ${answers.projectName} is ready! 🚀`));
    console.log(chalk.white(`\nNext steps:`));
    console.log(chalk.magenta(`  cd ${answers.projectName}`));
    console.log(chalk.magenta(`  npm run dev\n`));
}

run().catch((err) => {
    console.error(chalk.red('An error occurred:'), err);
});