// chatbot.js - 高效能模組化聊天機器人
// 作者：劉文正（優化版）

// === 狀態管理 === //
let userName = '';
let conversationHistory = [];

// === DOM 快取 === //
let inputField, sendButton, messagesDiv;

// === 啟動 === //
document.addEventListener('DOMContentLoaded', () => {
  inputField = document.getElementById('chatbot-input');
  sendButton = document.getElementById('chatbot-send');
  messagesDiv = document.getElementById('chatbot-messages');

  if (!inputField || !sendButton || !messagesDiv) {
    console.error("找不到聊天機器人的 HTML 元素。請檢查 index.html。");
    return;
  }

  // 載入歷史紀錄
  loadConversation();

  // 綁定事件
  sendButton.addEventListener('click', handleUserMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });

  console.log('✅ Chatbot 已啟動');
});

// === 工具函式 === //
function getGreeting() {
  const hour = luxon.DateTime.now().hour;
  if (hour < 12) return '早安！';
  if (hour < 18) return '午安！';
  return '晚安！';
}

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${sender}：</strong> ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function saveConversation(question, response) {
  conversationHistory.push({ question, response });
  localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

function loadConversation() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    conversationHistory = JSON.parse(saved);
    conversationHistory.forEach(({ question, response }) => {
      appendMessage('你', question);
      appendMessage('機器人', response);
    });
  }
}

// === 回應規則 === //
const responses = new Map([
  ['你好', () => `你好！${getGreeting()} 有什麼想聊的嗎？`],
  ['你的名字是什麼', () => '我是你的聊天夥伴，一直都在這裡陪你！'],
  ['你能做什麼', () => '我能回答問題、給建議、幫你找靈感，或只是單純聊聊天。'],
  ['再見', () => '希望很快再見到你！'],
]);

// === 主邏輯 === //
async function getResponse(message) {
  // 模擬思考延遲
  await new Promise(r => setTimeout(r, 300));

  // 動態設定名字
  if (message.includes('我的名字是')) {
    userName = message.replace('我的名字是', '').trim();
    return `很高興認識你，${userName}！`;
  }

  for (let [key, handler] of responses) {
    if (message.includes(key)) return handler(message);
  }

  return '抱歉，我還不懂這個問題，請再試一次。';
}

async function handleUserMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage('你', userMessage);
  inputField.value = '';

  // 顯示「思考中」動畫
  const thinking = document.createElement('div');
  thinking.innerHTML = '<strong>機器人：</strong> ...思考中';
  messagesDiv.appendChild(thinking);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  const response = await getResponse(userMessage);

  // 替換思考文字
  thinking.innerHTML = `<strong>機器人：</strong> ${response}`;
  saveConversation(userMessage, response);
}
