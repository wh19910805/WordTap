// 测试人名自动填充逻辑
console.log('Testing name auto-fill logic...');

// 模拟数据
const lessonData = {
  nameList: ['Mr. Blake', 'Miss Sophie', 'Mrs. Dupont'],
  sentences: [
    { text: 'MR. BLAKE: Good morning.' },
    { text: 'MISS SOPHIE: Good morning, Mr. Blake.' },
    { text: 'Good morning, Mrs. Dupont.' }
  ]
};

// 测试正则匹配
function testRegex() {
  console.log('=== Testing Regex Matching ===');
  const nameList = lessonData.nameList;
  
  lessonData.sentences.forEach((sentence, index) => {
    const sentenceText = sentence.text.trim();
    console.log(`\nSentence ${index + 1}: ${sentenceText}`);
    
    for (const name of nameList) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`^${escapedName}`, "i");
      const match = sentenceText.match(regex);
      
      console.log(`  Checking name: "${name}" -> Regex: /^${escapedName}/i -> Match: ${match ? match[0] : 'null'}`);
      
      if (match) {
        console.log(`  ✅ Found match: ${match[0]}`);
        break;
      }
    }
  });
}

testRegex();