// Aegis - Multilingual Early-Warning Advisory Dispatcher
// Automates multi-channel vernacular broadcasts (Cell Broadcast, SMS, Marine VHF, Voice/Sirens)
// Scales to any country's native languages, regional dialects, and emergency broadcast networks.

export class AdvisoryDispatcher {
  constructor(nationalAdapter = null) {
    this.speechSynth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.isPlayingAudio = false;
    this.nationalAdapter = nationalAdapter;
  }

  getAdvisories(basinId, timeStep, currentLang = "default", basinData = null) {
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
      },
      philippines: {
        Tagalog: {
          langCode: "tl-PH",
          title: "PANGUNAHING BABALA SA DALUYONG NG BAGYO",
          source: "Pambansang Tanggapan sa Pagtugon sa Sakuna (NDRRMC) & PAGASA",
          message: `BABALA SA SAKUNA: Napipintong mag-landfall ang Super Typhoon sa Tacloban at Leyte Coastal Corridor. Inaasahan ang daluyong ng bagyo na aabot sa 4.2 metro. Agarang lumikas sa itinalagang evacuation centers. Manatiling nakatutok sa radio o tumawag sa 911 para sa saklolo.`,
          channelStats: { smsCount: "4,500,000 Sent (RA 10639)", radio: "VHF Marine Ch. 16 Active", voiceCall: "Barangay Sirens Live" }
        },
        Waray: {
          langCode: "war-PH",
          title: "DELIKADO NGA PAHIBARO HIT DAKU NGA BALUD",
          source: "Lokal nga Sangay han Disaster Risk Reduction (Leyte)",
          message: `PAHIBARO: Daku nga balud ngan makusog nga bagyo maigo ha baybayon han Tacloban. Lumakat dayon tipakadto ha lig-on nga evacuation center. Ayaw pagpabilin ha higad han dagat. Tawag ha 911 kon nagkikinahanglan hin bulig.`,
          channelStats: { smsCount: "1,200,000 Sent", radio: "Bombo Radyo Tacloban", voiceCall: "Barangay Megaphones" }
        },
        English: {
          langCode: "en-PH",
          title: "SUPER TYPHOON CATASTROPHIC SURGE ADVISORY",
          source: "NDRRMC National Operations Center",
          message: `CATASTROPHIC STORM SURGE ADVISORY: Peak storm surge up to 4.2m forecast along San Pedro Bay and Tacloban coastal reaches. Pre-emptive forced evacuation enforced under Republic Act 10639. Harbor cranes secured; power de-energized. Dial 911 for emergency dispatch.`,
          channelStats: { smsCount: "6,200,000 Telco Push", radio: "Coast Guard VHF 16", voiceCall: "Coastal Siren Network" }
        }
      },
      usa: {
        English: {
          langCode: "en-US",
          title: "LIFE-THREATENING STORM SURGE WARNING",
          source: "NOAA National Hurricane Center & FEMA IPAWS",
          message: `LIFE-THREATENING EMERGENCY: Major Hurricane landfall imminent along the Tampa Bay and Central Florida Gulf Coast. Inundation levels 3.5m to 4.5m above ground level expected. Evacuate immediately if ordered by local officials. Do not drive through flooded roads. Emergency: 911.`,
          channelStats: { smsCount: "2,800,000 WEA Push (Ch 4370)", radio: "NOAA Weather Radio SAME", voiceCall: "County Siren Grid Active" }
        },
        Spanish: {
          langCode: "es-US",
          title: "AVISO DE MAREJADA CICLÓNICA MORTAL",
          source: "FEMA Centro Nacional de Huracanes",
          message: `EMERGENCIA CRÍTICA: Peligro inminente de inundación de 3.5 a 4.5 metros por marejada ciclónica en la costa de la Bahía de Tampa. Evacúe inmediatamente si se encuentra en zonas de evacuación obligatoria. Manténgase alejado de los cables eléctricos caídos. Llame al 911 en caso de rescate.`,
          channelStats: { smsCount: "1,100,000 WEA Enviados", radio: "Radio Alerta NOAA Español", voiceCall: "Red de Sirenas Activa" }
        }
      },
      mozambique: {
        Portuguese: {
          langCode: "pt-MZ",
          title: "AVISO DE CALAMIDADE: ONDAS DE TEMPESTADE",
          source: "Instituto Nacional de Gestão de Desastres (INGD) & INAM",
          message: `ALERTA VERMELHO: Ciclone tropical de grande intensidade aproximando-se da Baía de Sofala e Porto da Beira. Elevação catastrófica das águas de até 3.4m. Evacuação imediata de todas as zonas ribeirinhas do Búzi e Púnguè. Linha de emergência nacional: 800 112 112.`,
          channelStats: { smsCount: "740,000 SMS Celular", radio: "Rádio Moçambique Beira", voiceCall: "Sirenes Comunitárias" }
        },
        English: {
          langCode: "en-GB",
          title: "SEVERE TROPICAL CYCLONE IMPACT ADVISORY",
          source: "INGD Emergency Operations Center (Beira)",
          message: `CRITICAL ALERT: Tropical Cyclone destructive landfall imminent near Beira Port. Storm surge anomaly up to 3.4m projected. Immediate inland displacement directed for low-lying settlements. Port cargo operations halted. Emergency Hotline: 800 112 112.`,
          channelStats: { smsCount: "450,000 SMS Push", radio: "Marine VHF Ch. 16", voiceCall: "Megaphone Broadcast" }
        }
      }
    };

    let basinAdvisories = advisories[basinId];

    // If custom imported basin or unknown country, dynamically generate valid localized advisory
    if (!basinAdvisories) {
      const countryName = basinData?.country || "Sovereign Coastal Territory";
      const stormName = basinData?.stormName || "Active Severe Surge Event";
      const surgeH = timeStep?.surgeHeightM || 3.0;
      const windK = timeStep?.maxWindSpeedKmph || 120;
      const agency = basinData?.agencyName || "National Disaster Management Agency";

      basinAdvisories = {
        English: {
          langCode: "en-US",
          title: `EMERGENCY COASTAL SURGE ADVISORY: ${stormName}`,
          source: `${agency} & Maritime Meteorological Service`,
          message: `CRITICAL ALERT: ${stormName} approaching coastal corridor with peak storm surge of ${surgeH}m and sustained winds of ${windK} km/h. Mandatory evacuation of low-lying flood perimeters in effect. Vessel movements suspended. Contact national emergency dispatch for evacuation corridors.`,
          channelStats: { smsCount: "Cell Broadcast Active", radio: "Marine VHF Ch. 16 / NAVTEX", voiceCall: "Civil Defense Sirens" }
        }
      };
    }

    const availableLanguages = Object.keys(basinAdvisories);
    const selectedLang = currentLang !== "default" && basinAdvisories[currentLang] ? currentLang : availableLanguages[0];

    return {
      availableLanguages,
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
