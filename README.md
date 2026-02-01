# AI Chat Manager

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A powerful Chrome Extension built to organize, manage, and persistently store your AI conversations from **Google Gemini** and **ChatGPT**.

Say goodbye to cluttered chat histories. AI Chat Manager brings order to your AI workflow with nested folders, a dedicated side panel, and seamless one-click saving.

---

## 🚀 Features

- **📂 Nested Folders**: Create unlimited nested structures to organize chats by topic, project, or date.
- **💾 One-Click Save**: Automatically extracts the chat title and URL from the active tab.
- **🔘 Floating Action Button**: A convenient floating button on Gemini and ChatGPT pages for instant access.
- **🗄️ Persistence**: All data is stored locally in your browser and survives restarts.
- **🎨 Modern UI**: Clean, responsive interface built with Tailwind CSS and Lucide Icons.
- **🔄 Universal Adapter**: Extensible design support for multiple AI platforms (currently Gemini & ChatGPT).

---

## 🛠️ Tech Stack

- **Extension Framework**: Chrome Manifest V3 (Side Panel API)
- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- Google Chrome (or Chromium-based browser)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-chat-manager.git
cd ai-chat-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Extension

This will compile the TypeScript code and generate the `dist` folder.

```bash
npm run build
```

### 4. Load into Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `dist` folder located inside the project directory.

---

## 📖 Usage Guide

### Opening the Manager
- Click the **Extension Icon** in the browser toolbar.
- OR click the **Floating Folder Button** on the bottom-right of any Gemini or ChatGPT page.

### Organizing Chats
1. **Create Folders**: Click "New Folder" or use the `+` icon on existing folders.
2. **Save Chats**: Navigate to a chat page and click **"Save Chat"** in the sidebar.
3. **Manage**: Use the `⋮` menu to rename or delete items.

---

## 🔮 Roadmap & Future Features

We are constantly working to improve AI Chat Manager. Here's what's coming next:

- **🖱️ Drag & Drop Organization**: Intuitively move chats and folders around. ✅
- **🔍 Global Search**: Quickly find any chat in your library.
- **📤 Export & Import**: Backup your data to JSON and restore it anywhere.
- **🤖 More AI Adapters**: Support for Claude, Perplexity, and HuggingChat.
- **🏷️ Tags & Favorites**: Pin important chats and organize with #tags.
- **🌓 Dark/Light Mode**: User-selectable themes. ✅

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for new AI platform adapters or features, feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
