// chatbot.js - 資訊技師練題模式版
let userName = '';
const conversationHistory = [];

function saveConversation(question, response) {
  conversationHistory.push({ question, response });
}

function getGreeting() {
  const hour = luxon.DateTime.now().hour;
  if (hour < 12) return '早安！';
  if (hour < 18) return '午安！';
  return '晚安！';
}

const chatbotResponses = {
  '你好': () => `你好！${getGreeting()} 請問要練哪一科？`,
  '你的名字是什麼？': () => '我是你的資訊技師考前練題機器人！',
  '你能做什麼？': () => '我可以陪你背考題、複習關鍵字，還能聊天放鬆一下～',
  '再見': () => '加油！記得放鬆心情。',
  '我的名字是': (message) => {
    userName = message.replace('我的名字是', '').trim();
    return `很高興認識你，${userName}！準備好背題了嗎？`;
  },

  // 🧠 資訊技師重點問答
  'OSI七層': () => '應用層、表示層、會議層、傳輸層、網路層、資料鏈結層、實體層。',
  'ACID': () => 'Atomicity、Consistency、Isolation、Durability — 交易四大特性。',
  'SDLC': () => '需求分析 → 系統設計 → 實作 → 測試 → 維護。',
  'CIA': () => '資訊安全三要素：機密性（Confidentiality）、完整性（Integrity）、可用性（Availability）。',
  'Deadlock': () => '死結的四要件：互斥、占有且等待、不可搶奪、循環等待。',
  'Big O': () => '時間複雜度常見為 O(1)、O(n)、O(n log n)、O(n²)。',
  'SQL': () => '結構化查詢語言，用於資料庫操作 SELECT / INSERT / UPDATE / DELETE。',
  'Normalization': () => '正規化分為 1NF、2NF、3NF，減少資料重複與異常。',
  'TCP/IP': () => '四層模型：應用層、傳輸層、網際層、網路存取層。',
  '技師法': () => '技師須經國家考試合格並登錄，方得執業。',

  '幫我抽題': () => {
    const keys = Object.keys(chatbotResponses).filter(k => !['你好','再見','我的名字是','你能做什麼？','你的名字是什麼？','幫我抽題'].includes(k));
    const random = keys[Math.floor(Math.random() * keys.length)];
    return `隨機題目：「${random}」\n👉 ${chatbotResponses[random]()}`;
  }
};

function getResponse(message) {
  for (const key in chatbotResponses) {
    if (message.includes(key)) {
      const response = chatbotResponses[key](message);
      saveConversation(message, response);
      return response;
    }
  }
  const response = '抱歉，我還不懂這題。請再試一次或輸入「幫我抽題」。';
  saveConversation(message, response);
  return response;
}

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('chatbot-send');
  const inputField = document.getElementById('chatbot-input');
  const messagesDiv = document.getElementById('chatbot-messages');

  sendButton.addEventListener('click', () => {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    const userDiv = document.createElement('div');
    userDiv.innerHTML = `<strong>你：</strong> ${userMessage}`;
    messagesDiv.appendChild(userDiv);

    const response = getResponse(userMessage);

    const botDiv = document.createElement('div');
    botDiv.innerHTML = `<strong>機器人：</strong> ${response}`;
    messagesDiv.appendChild(botDiv);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    inputField.value = '';
  });
});
