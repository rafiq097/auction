# 🏏 IPL Auction - MERN + TypeScript + WebSockets

A real-time, interactive **IPL-style auction platform** where cricket fans can experience the thrill of building their dream team.  
Supports **single-player mode against AI** and **multi-player online auctions** with up to 10 teams per room.  
Features 500+ players with detailed stats, purse management, live bidding, and more!

---

## 🚀 Features

### 🎮 Game Modes
- **Against Computer (AI Mode)** - Play solo as your chosen team while the computer automatically bids for other teams.
- **Online Multiplayer Mode** - Room-based system with **up to 10 teams and 10 players** per room. Players join a room, select a team, and participate in live auctions.

### 📊 Auction Mechanics
- **Real-Time Bidding** powered by **WebSockets** for instant updates.
- **Purse Limitations** to ensure strategic bidding.
- **Player Sets** with different base prices based on player stats.
- View **your own team** and **opponents’ squads** during bidding to plan your strategy.

### 🏏 Player Database
- 500+ players with **detailed statistics** (batting, bowling, strike rates, etc.).
- Categorized by performance and auction sets.
- Search and view individual player profiles before bidding.

### 🔥 Live Experience
- Seamless updates without page refresh.
- Instant display of highest bids, winning teams, and remaining purse.
- Engaging UI for auction rounds and player stats.

---

## 🛠️ Tech Stack

**Frontend**
- React.js + TypeScript
- Tailwind CSS
- WebSockets (Socket.IO client)

**Backend**
- Node.js + Express.js
- Socket.IO
- MongoDB (Mongoose)

**Other**
- REST API for player stats and auction data
- Room management for multiplayer games

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rafiq097/auction.git
cd auction
````

### 2️⃣ Install dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3️⃣ Configure Environment Variables

Create `.env` files for both **server** and **client**.

**Server `.env`**

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
```

**Client `.env`**

```
VITE_BRO="admin email"
VITE_BRO2="admin email 2"
VITE_IMAGE_URL="https://raw.githubusercontent.com/your-github-account-name/auction/master/images"
```

### 4️⃣ Run the project

```bash
# Start server
cd server
npm start

# Start client
cd ../client
npm run dev
```

---

## 🎯 How to Play

### **Against Computer**

1. Choose your team.
2. The AI will automatically bid for other teams.
3. Outbid the AI to form your dream squad within the purse limit.

### **Online Multiplayer**

1. Join or create a room.
2. Select your team (first come, first serve).
3. Wait for all players to be ready.
4. Start bidding live with others.
5. Monitor your team and others to plan your strategy.

---

## 🌟 Future Enhancements

* Leaderboards for top-performing teams.
* Private rooms with password protection.
* Advanced player filtering & sorting.
* Mobile app support.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a pull request.

---

**Live Demo:** [iplauction.onrender.com](https://iplauction.onrender.com)
**GitHub Repo:** [github.com/rafiq097/auction](https://github.com/rafiq097/auction)

```
