// /api/telegram-alert.js
const axios = require('axios');

module.exports = async (req, res) => {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, address, message } = req.body;
    
    // 필수 필드 확인
    if (!name || !phone || !message) {
      return res.status(400).json({ status: 'error', message: '필수 정보가 누락되었습니다' });
    }
    
  // 텔레그램 설정
  const telegramToken = '7666913161:AAFqtxGeL5obOdhFLIfbufAGw2Qarw-v03Q'; // 컴닥터 봇 토큰
  const chatId = 593442109; // 귀하의 채팅 ID
    
    // 메시지 구성
    const telegramMessage = ` *새 문의가 접수되었습니다!*\n\n` +
                          ` *이름:* ${name}\n` +
                          ` *연락처:* ${phone}\n` +
                          ` *주소:* ${address || '정보 없음'}\n\n` +
                          ` *문의 내용:*\n${message}\n\n` +
                          ` *접수 시간:* ${new Date().toLocaleString('ko-KR')}`;
    
   // 텔레그램 API 호출
  const telegramResponse = await axios.post(
    `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    {
      chat_id: chatId,
      text: telegramMessage,
      // parse_mode: 'Markdown'
    }
  );
  
  // 로그 추가
  console.log('텔레그램 응답:', telegramResponse.status);
  
  return res.status(200).json({ status: 'success', message: '문의가 접수되었습니다' });
} catch (error) {
  // 더 자세한 오류 로깅
  console.error('오류 세부 정보:', error.message);
  if (error.response) {
    console.error('텔레그램 API 응답:', error.response.data);
  }
  return res.status(500).json({ status: 'error', message: '서버 오류가 발생했습니다: ' + error.message });
}
};
