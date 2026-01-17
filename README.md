# Wais Wallet

**Wais Pocket** is a personal finance mobile app that digitizes the traditional "envelope budgeting system." It helps users allocate income into specific **“Wais Pockets”** (e.g., Rent, Groceries, Leisure, Savings) and track spending per pocket, promoting better financial discipline.

Many people struggle with financial management not because they lack money, but because they lose track of the purpose of their money. Wais Pocket solves this by immediately dividing income into purposeful pockets, so users always know how much they have for each category.

Built with **React Native** and **Expo**, this app was developed as a school project to demonstrate practical mobile development and personal finance management.

---

## Features

### Dashboard
- Clear overview of your finances at a glance
- Safe-to-spend balance: shows money not yet assigned to a pocket
- Wais Pockets: visual breakdown of remaining money per pocket
- Example pockets: Rent, Bills, Grocery, Pang-Gala, Transportation, Savings

### Budget Planner
- Allocate income into predefined pockets to prevent overspending
- Visual and organized budgeting for Bills, Groceries, Savings, Leisure, etc.
- Ensures users know exactly how much money is allocated to each purpose

### Saving Goals
- Create saving goals and add money to them
- Track progress with visual indicators
- Motivates consistent saving habits and financial planning

---

## Tech Stack

- **React Native**  
- **Expo**  
- **TypeScript** (optional)  
- **React Navigation** (for multi-screen navigation)

---

## Getting Started

Follow these steps to get the project running on your computer:

### 1. Install prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo Go](https://expo.dev/client) on your mobile device (for testing)
- **VS Code** (recommended) or any code editor

### 2. Download the project
You can download the project as a ZIP from GitHub:
1. Go to [Wais_Wallet](https://github.com/Rachiminoff/Wais_Wallet)  
2. Click **Code → Download ZIP**  
3. Extract the ZIP to a folder on your computer

Or, clone the repository directly in VS Code using:  
`https://github.com/Rachiminoff/Wais_Wallet.git`

### 3. Install dependencies
Open the project folder in VS Code and run in the terminal:  
`npm install`

### 4. Start the App
Run the app with:  
`npm start`

**Mobile:** Scan the QR code with Expo Go to preview the app  
**Web:** Press `w` in the terminal to open a browser preview

---

## Collaboration

### 1. Make Your Own Branch
Never work directly on `main`. Create a branch for your **feature**.

> A **feature** is a new addition or change in the project—like a new screen, component, or functionality.

git checkout -b feature/your-feature-name

**Example:**

git checkout -b feature/add-login-screen

### 2. Work on Your Feature
- Open the project in VS Code.  
- Make your changes or add new screens/components.  
- Save your work frequently.  

### 3. Commit Your Changes
Once your work is ready, save it in Git:

git add .
git commit -m "Add login screen"

- `git add .` = mark all your changes to be saved  
- `git commit -m "..."` = actually save a snapshot with a note
  
### 4. Push Your Branch to GitHub

git push origin feature/your-feature-name

### 5. Open a Pull Request
- Go to the GitHub repo in a browser (e.g., `Wais_Wallet`).  
- Click **Compare & Pull Request** on your branch.  
- Give your PR a descriptive title and submit it.  

### 6. Update Your Local Project
Before starting new work, make sure you have the latest `main` branch:

git checkout main
git pull origin main

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full list of changes.




