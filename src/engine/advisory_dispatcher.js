// Aegis - Multilingual Early-Warning Advisory Dispatcher
// Automates multi-channel vernacular broadcasts (SMS, WhatsApp, Marine VHF, Voice/Sirens)

export class AdvisoryDispatcher {
  constructor() {
    this.speechSynth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.isPlayingAudio = false;
  }

  getAdvisories(basinId, timeStep, currentLang = "default") {
    const advisories = {
      india: {
        Odia: {
          langCode: "or-IN",
          title: "ଅତ୍ୟନ୍ତ ଜରୁରୀ ବାତ୍ୟା ସତର୍କ ସୂଚନା",
          source: "ଓଡ଼ିଶା ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷ (OSDMA)",
          message: `ସତର୍କ ସୂଚନା! ବାତ୍ୟା ଦାନା ଲ୍ୟାଣ୍ଡଫଲ୍ ପୂର୍ବରୁ ଧାମରା, ଭଦ୍ରକ ଏବଂ ବାସୁଦେବପୁର ଉପକୂଳରେ ୩.୬ ମିଟର ଉଚ୍ଚ ଜୁଆର ମାଡ଼ିଆସିବାର ଆଶଙ୍କା ରହିଛି। ସମସ୍ତ ତଳିଆ ଅଞ୍ଚଳ ବାସିନ୍ଦା ତୁରନ୍ତ ନିକଟସ୍ଥ ବହୁମୁଖୀ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଚାଲିଯାଆନ୍ତୁ। ମତ୍ସ୍ୟଜୀବୀମାନେ ସମୁଦ୍ରକୁ ଯାଆନ୍ତୁ ନାହିଁ। ବିଦ୍ୟୁତ ଖୁଣ୍ଟ ଓ ବନ୍ୟା ଜଳଠାରୁ ଦୂରେଇ ରୁହନ୍ତୁ। ଜରୁରୀ ସହାୟତା ପାଇଁ ୧୦୭୭ ଡାଏଲ କରନ୍ତୁ।`,
          channelStats: { smsCount: "1,450,000 Sent", radio: "VHF Marine 16 Active", voiceCall: "Panchayat IVR Live" }
        },
        Bengali: {
          langCode: "bn-IN",
          title: "জরুরি ঘূর্ণিঝড় সতর্কবার্তা",
          source: "পশ্চিমবঙ্গ ও ওড়িশা দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ",
          message: `জরুরি সতর্কতা! ঘূর্ণিঝড় আঘাত হানার সময় দিঘা এবং উপকূলবর্তী অঞ্চলে ৩ মিটারের বেশি জলোচ্ছ্বাস হতে পারে। নদী বাঁধ সংলগ্ন এলাকার বাসিন্দাদের অবিলম্বে নিকটবর্তী বহুমুখী সাইক্লোন শেল্টারে স্থানান্তরিত হতে নির্দেশ দেওয়া হচ্ছে। বিদ্যুৎ লাইনের ছেঁড়া তার স্পর্শ করবেন না। বিপদে টোল ফ্রি নম্বরে যোগাযোগ করুন।`,
          channelStats: { smsCount: "980,000 Sent", radio: "All India Radio Ch. 4", voiceCall: "Mobile Alert Broadcast" }
        },
        Hindi: {
          langCode: "hi-IN",
          title: "अति गंभीर चक्रवात चेतावनी",
          source: "राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA)",
          message: `आपातकालीन चेतावनी! चक्रवात दाना के प्रभाव से ओडिशा और पश्चिम बंगाल के तटीय जिलों में 3.6 मीटर तक की समुद्री तूफानी लहरें उठने की आशंका है। धामरा, भद्रक और केंद्रपाड़ा के निचले क्षेत्रों के सभी नागरिक तुरंत पक्के चक्रवात आश्रय स्थलों में जाएं। समुद्र तट से दूर रहें। सहायता हेतु 1077 पर संपर्क करें।`,
          channelStats: { smsCount: "2,100,000 Sent", radio: "National Broadcast", voiceCall: "Automated IVR Triggered" }
        },
        English: {
          langCode: "en-IN",
          title: "CRITICAL CYCLONE IMPACT ADVISORY",
          source: "National Disaster Management Authority (NDMA) & OSDMA",
          message: `EMERGENCY ALERT: Severe Cyclonic Storm landfall imminent near Dhamra Port. Storm surge anomaly up to 3.6m projected. Immediate mandatory evacuation of all coastal settlements within 5km of shoreline. Power grid de-energization in effect for Bhadrak & Kendrapara. Dial 1077 for emergency extraction.`,
          channelStats: { smsCount: "3,200,000 Sent", radio: "Marine VHF Active", voiceCall: "Automated Broadcast" }
        }
      },
      south_africa: {
        isiZulu: {
          langCode: "zu-ZA",
          title: "ISEXWAYISO ESIPHUTHUMAYO SESIPHOpho",
          source: "Umasipala weThekwini & Disaster Management",
          message: `Isexwayiso Esibucayi! Isiphepho esinamandla silindeleke ukuthi sihlasele ugu lwaseDurban namatheku aseMngeni. Amanzi olwandle azogcwala afinyelele kumamitha angu-2.8. Abahlali basezindaweni eziphansi kumele basuke ngokushesha baye ezikhungweni zokuphepha. Gwema ukuwela amabhuloho agcwele amanzi. Shayela ku-031 361 0000 uma udinga usizo.`,
          channelStats: { smsCount: "820,000 Sent", radio: "Ukhozi FM Broadcast", voiceCall: "Local Loudhailers Active" }
        },
        English: {
          langCode: "en-ZA",
          title: "Ethekwini Coastal Storm Surge Warning",
          source: "Disaster Management Centre KwaZulu-Natal",
          message: `CRITICAL SURGE WARNING: Combined tidal swell and extreme river runoff expected to exceed 2.8m in Durban Harbor and Umgeni mouth. Immediate evacuation of low-lying informal settlements. Port crane operations suspended. Emergency line: 031 361 0000.`,
          channelStats: { smsCount: "1,200,000 Sent", radio: "East Coast Radio", voiceCall: "Municipal Push Active" }
        }
      },
      brazil: {
        Portuguese: {
          langCode: "pt-BR",
          title: "ALERTA MÁXIMO DE RESSACA E INUNDAÇÃO",
          source: "Defesa Civil do Estado do Rio Grande do Sul",
          message: `ALERTA DE EMERGÊNCIA! Ciclone Extratropical provocando sobre-elevação de maré de 3.2m na Barra de Rio Grande e Lagoa dos Patos. Risco extremo de inundação no Centro Histórico e corte da BR-392. População ribeirinha deve buscar imediatamente os abrigos municipais mapeados. Em emergências, ligue 199 ou 193.`,
          channelStats: { smsCount: "650,000 Enviados", radio: "Rádio Gaúcha AM/FM", voiceCall: "Sirenes Costeiras Ativas" }
        },
        English: {
          langCode: "en-US",
          title: "Emergency Coastal Surge Advisory",
          source: "Defesa Civil Rio Grande do Sul",
          message: `EMERGENCY ALERT: Extratropical cyclone pushing 3.2m water anomaly into Laguna dos Patos. Superporto operations halted; severe flooding on federal highway BR-392. Evacuate low-lying fishing communities immediately. Call 199 for civil defense.`,
          channelStats: { smsCount: "420,000 Sent", radio: "Coastal VHF Alert", voiceCall: "Emergency Sirens Active" }
        }
      },
      china: {
        Mandarin: {
          langCode: "zh-CN",
          title: "超强台风红色预警及防汛紧急指令",
          source: "国家防汛抗旱总指挥部 & 广东省应急管理厅",
          message: `红色紧急预警！超强台风即将在大鹏半岛及深圳沿海登陆，最高风暴潮达4.1米，盐田港及低洼堤防面临严重越浪威胁。全省启动防台风一级应急响应，全面实行停课、停工、停产、停运、停市“五停”。请沿海居民严格转移至避险安置点，非必要切勿外出！救援电话：119 / 12345。`,
          channelStats: { smsCount: "8,900,000 广播发送", radio: "珠江应急广播通道", voiceCall: "全区应急大喇叭已启动" }
        },
        English: {
          langCode: "en-US",
          title: "SUPER TYPHOON RED LEVEL EMERGENCY ORDER",
          source: "Guangdong Emergency Management & National Maritime Bureau",
          message: `RED ALERT: Super Typhoon landfall imminent across Pearl River Delta. Catastrophic storm surge up to 4.1m forecast. Immediate enforcement of Level 1 four-stop emergency protocol. Evacuation to designated inland shelters mandatory. Emergency Hotline: 119.`,
          channelStats: { smsCount: "5,400,000 Sent", radio: "National Maritime VHF", voiceCall: "Loudspeaker Net Active" }
        }
      }
    };

    const basinAdvisories = advisories[basinId] || advisories.india;
    const selectedLang = currentLang !== "default" && basinAdvisories[currentLang] ? currentLang : Object.keys(basinAdvisories)[0];

    return {
      availableLanguages: Object.keys(basinAdvisories),
      currentLang: selectedLang,
      data: basinAdvisories[selectedLang]
    };
  }

  speakAdvisory(text, langCode, onEndCallback) {
    if (!this.speechSynth) {
      alert("Text-to-speech is not supported by your browser.");
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.isPlayingAudio = false;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      this.isPlayingAudio = false;
      if (onEndCallback) onEndCallback();
    };

    this.isPlayingAudio = true;
    this.speechSynth.speak(utterance);
  }

  stopSpeaking() {
    if (this.speechSynth && this.speechSynth.speaking) {
      this.speechSynth.cancel();
      this.isPlayingAudio = false;
    }
  }
}
