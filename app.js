'use strict';

const inquirer = require('inquirer');

const fs = require('fs');
const generatePage = require('./src/page-template');

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter your name');
          return false;
        }
      },
    },
    {
      type: 'input',
      name: 'github',
      message: 'Enter your GitHub Username',
      validate: githubUserInput => {
        if (githubUserInput) {
          return true;
        } else {
          console.log('Please enter your GitHub Username');
          return false;
        }
      },
    },
    {
      type: 'confirm',
      name: 'confirmAbout',
      message:
        'Would you like to enter some information about yourself for an "About" section?',
      default: true,
    },
    {
      type: 'input',
      name: 'about',
      message: 'Provide some information about yourself:',
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

const promptProject = portfolioData => {
  console.log(`
=================
Add a New Project
=================
`);

  // If there's no 'projects' array property, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your project?',
        validate: projectName => {
          if (projectName) {
            return true;
          } else {
            console.log('Please enter your Project Name');
            return false;
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Provide a description of the project (Required)',
        validate: projDescription => {
          if (projDescription) {
            return true;
          } else {
            console.log('Please enter your Project Description');
            return false;
          }
        },
      },
      {
        type: 'checkbox',
        name: 'languages',
        message: 'What did you build this project with? (Check all that apply)',
        choices: [
          'JavaScript',
          'HTML',
          'CSS',
          'ES6',
          'jQuery',
          'Bootstrap',
          'Node',
        ],
      },
      {
        type: 'input',
        name: 'link',
        message: 'Enter the GitHub link to your project. (Required)',
        validate: githubLink => {
          if (githubLink) {
            return true;
          } else {
            console.log('Please enter your Github Link');
            return false;
          }
        },
      },
      {
        type: 'confirm',
        name: 'feature',
        message: 'Would you like to feature this project?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'confirmAddProject',
        message: 'Would you like to enter another project?',
        default: false,
      },
    ])
    .then(projectData => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

promptUser()
  .then(promptProject)
  .then(portfolioData => {
    const pageHTML = generatePage(portfolioData);
    fs.writeFile('./index.html', pageHTML, err => {
      if (err) throw new Error(err);
      console.log(
        'Page created! Check out index.html in this directory to see it!'
      );
    });
  });

// const mockData = {
//   name: 'Mark Joseph',
//   github: 'mjos7',
//   confirmAbout: true,
//   about: 'I live in Vancouver and I love to code',
//   projects: [
//     {
//       name: 'Run Buddy',
//       description: `This is a description of Run Buddy`,
//       languages: ['HTML', 'CSS'],
//       link: 'https://github.com/mjos7/run-buddy',
//       feature: true,
//       confirmAddProject: true,
//     },
//     {
//       name: 'Taskinator',
//       description: `This is a description of Taskinator`,
//       languages: ['JavaScript', 'HTML', 'CSS'],
//       link: 'https://github.com/mjos7/taskinator',
//       feature: true,
//       confirmAddProject: true,
//     },
//     {
//       name: 'Taskmaster Pro',
//       description: `This is a description of Taskmaster Pro`,
//       languages: ['JavaScript', 'jQuery', 'CSS', 'HTML', 'Bootstrap'],
//       link: 'https://github.com/mjos7/taskmaster-pro',
//       feature: false,
//       confirmAddProject: true,
//     },
//     {
//       name: 'Robot Gladiators',
//       description: `This is a description of Robot Gladiators`,
//       languages: ['JavaScript'],
//       link: 'https://github.com/mjos7/robot-gladiators',
//       feature: false,
//       confirmAddProject: false,
//     },
//   ],
// };

// const pageHTML = generatePage(mockData);

// console.log(mockData);
