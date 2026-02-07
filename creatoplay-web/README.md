# Creatoplay Web Platform

A Roblox-like gaming platform built with React and Firebase.

![Creatoplay](https://via.placeholder.com/800x400/191b21/00b06f?text=Creatoplay)

## Features

- 🎮 **Home Page** - Featured games, continue playing, recommendations
- 🔍 **Discover** - Browse and search games by category
- 📄 **Game Details** - Game info, stats, servers, play button
- 👤 **User Profiles** - View creations, friends, favorites
- 🎨 **Avatar Editor** - Customize your R6 character colors
- 👥 **Friends System** - Add friends, accept requests, search users
- 🔐 **Authentication** - Login, register, Firebase auth
- 🌙 **Dark Theme** - Modern Roblox-inspired dark UI

## Tech Stack

- **Frontend**: React 18, React Router 6
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Custom CSS (no frameworks)
- **Icons**: React Icons

## Setup Instructions

### 1. Install Dependencies

```bash
cd creatoplay-web
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Go to Project Settings > General > Your apps > Add Web App
6. Copy your config values

Edit `src/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Up Firestore Rules

In Firebase Console > Firestore > Rules, add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /games/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
creatoplay-web/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js/css
│   │   ├── Sidebar.js/css
│   │   └── GameCard.js/css
│   ├── pages/
│   │   ├── Home.js/css
│   │   ├── Discover.js/css
│   │   ├── GameDetail.js/css
│   │   ├── Profile.js/css
│   │   ├── Avatar.js/css
│   │   ├── Friends.js/css
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Auth.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   ├── firebase.js
│   └── index.js
└── package.json
```

## Desktop Client Integration

When users click "Play" on a game, the website attempts to launch the desktop client via a custom URL protocol:

```
creatoplay://play/{gameId}
```

### Setting Up the Protocol (Windows)

1. Add a registry entry for the `creatoplay://` protocol
2. Point it to your CreatoplayClient.exe

Create a `.reg` file:

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\creatoplay]
@="URL:Creatoplay Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\creatoplay\shell]

[HKEY_CLASSES_ROOT\creatoplay\shell\open]

[HKEY_CLASSES_ROOT\creatoplay\shell\open\command]
@="\"C:\\Creatoplay\\CreatoplayClient.exe\" \"%1\""
```

## Screenshots

### Home Page
- Featured game banner
- Continue playing section
- Popular games grid
- Category cards

### Discover
- Search bar
- Category filters
- Sortable game grid

### Game Detail
- Hero banner with thumbnail
- Play button (launches client)
- Game stats sidebar
- Servers list

### Avatar Editor
- R6 character preview
- Body part color picker
- Color presets + custom colors

## Customization

### Colors (src/styles/global.css)

```css
:root {
  --bg-primary: #191b21;
  --bg-secondary: #232630;
  --accent-green: #00b06f;
  --accent-blue: #0074bd;
}
```

### Adding Games

Games are currently hardcoded in the pages. To use Firebase:

1. Create a `games` collection in Firestore
2. Add game documents with fields: title, description, thumbnail, playing, likes, etc.
3. Fetch games in components using `getDocs()`

## License

MIT License - Feel free to use for your own projects!

---

Built with ❤️ for the Creatoplay community
