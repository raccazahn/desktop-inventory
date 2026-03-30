# 🚀 Getting Started Guide

## For Frontend Developer (@frontend-guy)
1. Work inside the `/frontend` folder
2. Initialize Electron: `npm init -y` then `npm install electron`
3. Create `main.js` and `index.html` as per Issue #1
4. Test locally: `npm start`

## For Database Developer (@database-guy)
1. Work inside the `/database` folder
2. Install TypeORM: `npm install @nestjs/typeorm typeorm sqlite3`
3. Create entity files: `User.ts`, `Item.ts`, `Transaction.ts`
4. Test migrations: `npm run migration:run`

## For Backend Developer (Pending)
1. Work inside the `/backend` folder
2. Initialize Nest.js: `npm install -g @nestjs/cli` then `nest new .`
3. Connect to TypeORM using config from `/database`
4. Test API: `npm run start:dev` then visit `http://localhost:3000`

## General Rules for Everyone
✅ Always create a new branch: `git checkout -b feature/your-task`
✅ Never push directly to `main`
✅ When done, create a Pull Request for review
✅ Comment on your Issue if you have questions

## Need Help?
- Comment on your GitHub Issue
- Message the Project Lead (@you)
- Check our team chat

Happy coding! 💪
