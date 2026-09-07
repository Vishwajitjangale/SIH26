/* BIS Intelligence — centralized English/Hindi translation system. */
(function () {
  'use strict';

  var STORAGE_KEY = 'bisLanguage';
  var DICT = {
    'Skip to content':'सामग्री पर जाएँ',
    'Standards Navigator':'मानक नेविगेटर',
    'Home':'होम', 'Find Standards':'मानक खोजें', 'Compliance Assistant':'अनुपालन सहायक',
    'Evidence':'साक्ष्य', 'Laboratories':'प्रयोगशालाएँ', 'About':'हमारे बारे में', 'FAQ':'अक्सर पूछे जाने वाले प्रश्न',
    'English':'अंग्रेज़ी', 'हिन्दी':'हिन्दी', 'Try BIS Intelligence':'BIS Intelligence आज़माएँ',
    'Find Standard':'मानक खोजें', 'Compliance':'अनुपालन', 'Trust & Safety':'विश्वास और सुरक्षा',
    'Official BIS website':'आधिकारिक BIS वेबसाइट', 'Built for':'के लिए निर्मित',
    'Smart India Hackathon':'स्मार्ट इंडिया हैकाथॉन', 'Problem SIH26107':'समस्या SIH26107',
    'Made for the Smart India Hackathon':'स्मार्ट इंडिया हैकाथॉन के लिए निर्मित',
    'Evidence-first AI':'साक्ष्य-आधारित AI',
    'From product description':'उत्पाद विवरण से', 'to BIS compliance.':'BIS अनुपालन तक।',
    'AI-powered BIS standards intelligence that helps you discover relevant standards, understand compliance requirements, and trace every answer back to supporting evidence.':'AI-संचालित BIS मानक इंटेलिजेंस आपको प्रासंगिक मानक खोजने, अनुपालन आवश्यकताओं को समझने और प्रत्येक उत्तर को सहायक साक्ष्य से जोड़कर देखने में मदद करती है।',
    'Describe your product or ask a BIS question':'अपने उत्पाद का विवरण दें या BIS से संबंधित प्रश्न पूछें',
    'Analyze':'विश्लेषण करें', 'What BIS standard applies to my electrical appliance?':'मेरे विद्युत उपकरण पर कौन-सा BIS मानक लागू होता है?',
    'What certification is required?':'कौन-सा प्रमाणन आवश्यक है?', 'Food-contact plastics standards':'खाद्य-संपर्क प्लास्टिक के मानक',
    'Explore How It Works':'यह कैसे काम करता है देखें', 'High confidence':'उच्च विश्वास',
    'Safety of Household and Similar Electrical Appliances':'घरेलू एवं समान विद्युत उपकरणों की सुरक्षा',
    'Bureau of Indian Standards · Page 14 · Clause 7.1':'भारतीय मानक ब्यूरो · पृष्ठ 14 · खंड 7.1',
    "Appliances must be marked with rated voltage, rated input, and the manufacturer's name or trademark.":'उपकरण पर निर्धारित वोल्टेज, निर्धारित इनपुट तथा निर्माता का नाम या ट्रेडमार्क अंकित होना चाहिए।',
    'Evidence-first RAG':'साक्ष्य-आधारित RAG', 'Source & page references':'स्रोत और पृष्ठ संदर्भ',
    'Confidence indication':'विश्वास स्तर', 'Insufficient-evidence protection':'अपर्याप्त-साक्ष्य सुरक्षा',
    'Everything you need to navigate a standard':'मानक को समझने और नेविगेट करने के लिए आवश्यक सब कुछ',
    'Five capabilities, built around one rule: never answer without evidence.':'पाँच क्षमताएँ, एक सिद्धांत के साथ: साक्ष्य के बिना कभी उत्तर न दें।',
    'AI-Powered Compliance Assistant':'AI-संचालित अनुपालन सहायक',
    'Describe your product in plain language. The assistant identifies category and intended use, then surfaces potentially applicable BIS standards — without inventing requirements when evidence is unavailable.':'अपने उत्पाद का सरल भाषा में वर्णन करें। सहायक श्रेणी और इच्छित उपयोग को समझकर संभावित रूप से लागू BIS मानकों को सामने लाता है और साक्ष्य उपलब्ध न होने पर आवश्यकताओं की कल्पना नहीं करता।',
    'BIS Standard Recommendation':'BIS मानक अनुशंसा',
    'Every recommendation shows the standard number, title, category, version, current/obsolete status, and verification state, so you know exactly what you’re looking at.':'हर अनुशंसा में मानक संख्या, शीर्षक, श्रेणी, संस्करण, वर्तमान/अप्रचलित स्थिति और सत्यापन स्थिति दिखाई जाती है, ताकि आपको स्पष्ट रूप से पता रहे कि आप क्या देख रहे हैं।',
    'Evidence-Based Answers':'साक्ष्य-आधारित उत्तर',
    'Every important answer is backed by retrieved document evidence — source, section, page, and text — clearly labeled Verified, Retrieved, or Insufficient.':'हर महत्वपूर्ण उत्तर प्राप्त दस्तावेज़ी साक्ष्य—स्रोत, खंड, पृष्ठ और पाठ—पर आधारित होता है तथा सत्यापित, प्राप्त या अपर्याप्त के रूप में स्पष्ट रूप से चिह्नित होता है।',
    'Compliance Roadmap & Checklist':'अनुपालन रोडमैप और चेकलिस्ट',
    'Once a standard is identified, get a practical nine-step path from verifying the version through to maintaining compliance evidence.':'मानक की पहचान होने के बाद संस्करण सत्यापन से लेकर अनुपालन साक्ष्य बनाए रखने तक नौ चरणों का व्यावहारिक मार्ग प्राप्त करें।',
    'AI Document Intelligence':'AI दस्तावेज़ इंटेलिजेंस',
    'Upload BIS-related PDFs. The system extracts, chunks, and indexes them so they can be retrieved as evidence for future queries.':'BIS-संबंधित PDF अपलोड करें। सिस्टम उन्हें निकालकर, खंडित करके और इंडेक्स करके भविष्य के प्रश्नों के लिए साक्ष्य के रूप में उपलब्ध कराता है।',
    'Laboratory Discovery':'प्रयोगशाला खोज',
    'Find laboratories by testing capability and product category to take the next step toward certification.':'परीक्षण क्षमता और उत्पाद श्रेणी के आधार पर प्रयोगशालाएँ खोजें और प्रमाणन की दिशा में अगला कदम उठाएँ।',
    'How it works':'यह कैसे काम करता है',
    'A retrieval-first pipeline — the model only speaks from what it can point to.':'रिट्रीवल-फर्स्ट प्रक्रिया—मॉडल केवल उसी जानकारी के आधार पर उत्तर देता है जिसे वह स्रोत सहित दिखा सकता है।',
    'Describe your product':'अपने उत्पाद का विवरण दें', 'AI understands the query':'AI प्रश्न को समझता है',
    'Retrieve relevant BIS evidence':'प्रासंगिक BIS साक्ष्य प्राप्त करें', 'NVIDIA NIM generates the explanation':'NVIDIA NIM व्याख्या तैयार करता है',
    'Evidence shown with the answer':'उत्तर के साथ साक्ष्य दिखाया जाता है', 'Take action':'कार्रवाई करें',
    'See it in action':'इसे कार्य करते हुए देखें', 'A real example of the evidence-first flow, end to end.':'साक्ष्य-आधारित प्रक्रिया का एक संपूर्ण उदाहरण।',
    'Demo scenario':'डेमो परिदृश्य', 'Source: Bureau of Indian Standards · Page 14 · Clause 7.1':'स्रोत: भारतीय मानक ब्यूरो · पृष्ठ 14 · खंड 7.1',
    "Every appliance shall be marked with its rated voltage, rated input, and the manufacturer's name or trademark.":'हर उपकरण पर उसका निर्धारित वोल्टेज, निर्धारित इनपुट तथा निर्माता का नाम या ट्रेडमार्क अंकित होना चाहिए।',
    'Followed by a nine-step compliance roadmap — not a final legal certification decision.':'इसके बाद नौ चरणों का अनुपालन रोडमैप है—यह अंतिम कानूनी प्रमाणन निर्णय नहीं है।',
    'Try it yourself':'स्वयं आज़माएँ', 'Built on a grounded, retrieval-first stack':'ग्राउंडेड, रिट्रीवल-फर्स्ट तकनीकी स्टैक पर आधारित',
    'Real technology, not a wrapper around a chatbot.':'वास्तविक तकनीक, केवल चैटबॉट का आवरण नहीं।',
    'Not an official BIS authority':'यह आधिकारिक BIS प्राधिकरण नहीं है',
    'BIS Intelligence is an AI-powered standards and compliance intelligence platform that helps you discover relevant BIS standards, retrieve supporting evidence, and understand potential compliance pathways. It is not an official BIS website or certification authority — AI-generated results are decision-support information, and users should verify compliance requirements with current official BIS sources.':'BIS Intelligence एक AI-संचालित मानक और अनुपालन इंटेलिजेंस प्लेटफ़ॉर्म है जो प्रासंगिक BIS मानकों को खोजने, सहायक साक्ष्य प्राप्त करने और संभावित अनुपालन मार्ग समझने में मदद करता है। यह आधिकारिक BIS वेबसाइट या प्रमाणन प्राधिकरण नहीं है—AI द्वारा दिए गए परिणाम निर्णय-सहायता जानकारी हैं और उपयोगकर्ताओं को वर्तमान आधिकारिक BIS स्रोतों से अनुपालन आवश्यकताओं का सत्यापन करना चाहिए।',
    'Ready to see what applies to your product?':'क्या आप जानना चाहते हैं कि आपके उत्पाद पर क्या लागू होता है?',
    'Explore Standards':'मानकों को देखें',
    'BIS Intelligence is an AI-assisted research and compliance-support prototype developed for SIH26107. It is not an official BIS platform and does not replace official BIS publications, certification procedures, laboratories, or professional compliance advice.':'BIS Intelligence SIH26107 के लिए विकसित AI-सहायित अनुसंधान और अनुपालन-सहायता प्रोटोटाइप है। यह आधिकारिक BIS प्लेटफ़ॉर्म नहीं है और आधिकारिक BIS प्रकाशनों, प्रमाणन प्रक्रियाओं, प्रयोगशालाओं या पेशेवर अनुपालन सलाह का विकल्प नहीं है।',
    'Product':'उत्पाद', 'GitHub (placeholder)':'GitHub (प्लेसहोल्डर)', 'Demo video (placeholder)':'डेमो वीडियो (प्लेसहोल्डर)',
    'NVIDIA NIM · RAG':'NVIDIA NIM · RAG', 'FastAPI · Next.js':'FastAPI · Next.js',

    'Standards discovery':'मानक खोज', 'Find the Right BIS Standard':'सही BIS मानक खोजें',
    'Search BIS standards using product name, description, IS number, category or keywords — then trace recommendations to supporting evidence.':'उत्पाद का नाम, विवरण, IS संख्या, श्रेणी या कीवर्ड से BIS मानक खोजें और फिर अनुशंसाओं को सहायक साक्ष्य से जोड़कर देखें।',
    'Product / Standard search':'उत्पाद / मानक खोज', 'Product category':'उत्पाद श्रेणी', 'All categories':'सभी श्रेणियाँ',
    'Electrical appliances':'विद्युत उपकरण', 'Cement & construction':'सीमेंट और निर्माण', 'Steel products':'स्टील उत्पाद',
    'Food packaging':'खाद्य पैकेजिंग', 'Water':'जल', 'Toys':'खिलौने', 'Personal protective equipment':'व्यक्तिगत सुरक्षा उपकरण',
    'Find Standard':'मानक खोजें', 'Drinking water':'पीने का पानी', 'Helmets':'हेलमेट', 'Standards results':'मानक परिणाम',
    "We couldn't find an exact match.":'हमें कोई सटीक मिलान नहीं मिला।',
    'Try a broader product description or use the Compliance Assistant for natural-language guidance.':'उत्पाद का अधिक विस्तृत विवरण दें या प्राकृतिक भाषा में मार्गदर्शन के लिए अनुपालन सहायक का उपयोग करें।',
    'Ask Compliance Assistant':'अनुपालन सहायक से पूछें', 'AI recommendation':'AI अनुशंसा',
    'Not sure which standard applies? Describe your product in natural language and review the evidence-backed recommendation.':'पता नहीं कौन-सा मानक लागू होता है? अपने उत्पाद का प्राकृतिक भाषा में वर्णन करें और साक्ष्य-समर्थित अनुशंसा देखें।',
    'Recommended match':'अनुशंसित मिलान', 'Reason:':'कारण:', 'Match percentage':'मिलान प्रतिशत', 'Confidence: High':'विश्वास: उच्च',
    'Related':'संबंधित', 'Source':'स्रोत', 'Official BIS':'आधिकारिक BIS', 'Evidence-linked':'साक्ष्य से जुड़ा',
    'View Evidence':'साक्ष्य देखें', 'Check Compliance':'अनुपालन जाँचें', 'View evidence':'साक्ष्य देखें', 'Analyze compliance':'अनुपालन का विश्लेषण करें',
    'standard':'मानक', 'standards':'मानक', 'found':'मिले',

    'Evidence-first compliance':'साक्ष्य-आधारित अनुपालन', 'Your BIS Compliance Assistant':'आपका BIS अनुपालन सहायक',
    'Understand certification, testing, documentation and compliance requirements for your product.':'अपने उत्पाद के प्रमाणन, परीक्षण, दस्तावेज़ और अनुपालन आवश्यकताओं को समझें।',
    'Start Compliance Check':'अनुपालन जाँच शुरू करें', 'Product information':'उत्पाद जानकारी',
    'Provide enough context for the prototype to identify a potentially applicable compliance pathway.':'संभावित रूप से लागू अनुपालन मार्ग पहचानने के लिए पर्याप्त जानकारी दें।',
    'Product name':'उत्पाद का नाम', 'Product description':'उत्पाद का विवरण', 'Manufacturer type':'निर्माता का प्रकार',
    'Manufacturer':'निर्माता', 'MSME':'MSME', 'Importer':'आयातक', 'Startup':'स्टार्टअप', 'Consumer / Researcher':'उपभोक्ता / शोधकर्ता',
    'Intended market':'लक्षित बाज़ार', 'India':'भारत', 'Export':'निर्यात', 'Both':'दोनों', 'Country / location':'देश / स्थान',
    'Existing IS number (optional)':'मौजूदा IS संख्या (वैकल्पिक)', 'Analyze Compliance':'अनुपालन का विश्लेषण करें',
    'AI compliance analysis':'AI अनुपालन विश्लेषण', 'Decision-support output with confidence and evidence-oriented language.':'विश्वास स्तर और साक्ष्य-आधारित भाषा के साथ निर्णय-सहायता परिणाम।',
    'Awaiting product analysis':'उत्पाद विश्लेषण की प्रतीक्षा', 'Complete the form above to generate a sample compliance dashboard.':'नमूना अनुपालन डैशबोर्ड बनाने के लिए ऊपर दिया गया फ़ॉर्म पूरा करें।',
    'Personalized compliance roadmap':'व्यक्तिगत अनुपालन रोडमैप', 'A practical sequence from standard identification to licensing.':'मानक की पहचान से लाइसेंस प्राप्त करने तक का व्यावहारिक क्रम।',
    'Identify Applicable Standard':'लागू मानक की पहचान करें', 'Confirm the product-standard relationship.':'उत्पाद और मानक के संबंध की पुष्टि करें।',
    'Check Certification Requirement':'प्रमाणन आवश्यकता जाँचें', 'Determine mandatory or voluntary pathways.':'अनिवार्य या स्वैच्छिक मार्ग निर्धारित करें।',
    'Prepare Manufacturing Infrastructure':'विनिर्माण अवसंरचना तैयार करें', 'Review process and quality controls.':'प्रक्रिया और गुणवत्ता नियंत्रण की समीक्षा करें।',
    'Complete Testing':'परीक्षण पूरा करें', 'Plan tests against applicable requirements.':'लागू आवश्यकताओं के अनुसार परीक्षण की योजना बनाएँ।',
    'Prepare Documents':'दस्तावेज़ तैयार करें', 'Collect technical and business records.':'तकनीकी और व्यावसायिक अभिलेख एकत्र करें।',
    'Apply for BIS Certification':'BIS प्रमाणन के लिए आवेदन करें', 'Follow the applicable BIS application process.':'लागू BIS आवेदन प्रक्रिया का पालन करें।',
    'Assessment':'मूल्यांकन', 'Prepare for inspection or assessment.':'निरीक्षण या मूल्यांकन के लिए तैयारी करें।',
    'Obtain Licence':'लाइसेंस प्राप्त करें', 'Complete the final applicable BIS process.':'अंतिम लागू BIS प्रक्रिया पूरी करें।',
    'Document checklist':'दस्तावेज़ चेकलिस्ट', 'Application documents':'आवेदन दस्तावेज़', 'Manufacturing documents':'विनिर्माण दस्तावेज़',
    'Test reports':'परीक्षण रिपोर्ट', 'Quality control documents':'गुणवत्ता नियंत्रण दस्तावेज़', 'Identity / business documents':'पहचान / व्यावसायिक दस्तावेज़',
    'Other supporting documents':'अन्य सहायक दस्तावेज़', 'Verify against the latest applicable BIS process.':'नवीनतम लागू BIS प्रक्रिया के अनुसार सत्यापित करें।',
    'Testing requirements':'परीक्षण आवश्यकताएँ', 'Example structure for mapping required tests and laboratory status.':'आवश्यक परीक्षण और प्रयोगशाला स्थिति को दर्शाने की उदाहरण संरचना।',
    'Required test':'आवश्यक परीक्षण', 'Parameter':'पैरामीटर', 'Laboratory':'प्रयोगशाला', 'Status':'स्थिति',
    'Electrical safety':'विद्युत सुरक्षा', 'Safety performance':'सुरक्षा प्रदर्शन', 'Suitable BIS-recognized facility':'उपयुक्त BIS-मान्यता प्राप्त सुविधा',
    'Pending':'लंबित', 'Marking verification':'मार्किंग सत्यापन', 'Required markings':'आवश्यक मार्किंग', 'Document review':'दस्तावेज़ समीक्षा', 'Ready':'तैयार',
    'AI Assistant':'AI सहायक', 'Ask questions such as “Is BIS certification mandatory for my product?”, “What documents do I need?” or “Which laboratory can test my product?”':'ऐसे प्रश्न पूछें: “क्या मेरे उत्पाद के लिए BIS प्रमाणन अनिवार्य है?”, “मुझे कौन-से दस्तावेज़ चाहिए?” या “मेरे उत्पाद का परीक्षण कौन-सी प्रयोगशाला कर सकती है?”',
    'Ask with product context':'उत्पाद संदर्भ के साथ पूछें', 'Important:':'महत्वपूर्ण:',
    'AI-generated guidance should be verified against the latest official BIS requirements.':'AI द्वारा दिए गए मार्गदर्शन को नवीनतम आधिकारिक BIS आवश्यकताओं के विरुद्ध सत्यापित किया जाना चाहिए।',
    'High-confidence demo match':'उच्च-विश्वास डेमो मिलान',
    'Potentially applicable based on the product information supplied. Verify the latest official BIS applicability before making a certification decision.':'दी गई उत्पाद जानकारी के आधार पर संभावित रूप से लागू। प्रमाणन निर्णय लेने से पहले नवीनतम आधिकारिक BIS प्रयोज्यता सत्यापित करें।',
    'Certification required':'प्रमाणन आवश्यक', 'Depends on product and applicable scheme':'उत्पाद और लागू योजना पर निर्भर',
    'Certification type':'प्रमाणन प्रकार', 'Product-specific BIS conformity pathway':'उत्पाद-विशिष्ट BIS अनुरूपता मार्ग',
    'Testing':'परीक्षण', 'Review the applicable standard test methods':'लागू मानक की परीक्षण विधियों की समीक्षा करें',
    'Documents':'दस्तावेज़', 'Technical, manufacturing and business records':'तकनीकी, विनिर्माण और व्यावसायिक अभिलेख',
    'Select a suitable recognized laboratory':'उपयुक्त मान्यता प्राप्त प्रयोगशाला चुनें', 'Compliance Score':'अनुपालन स्कोर',
    'Demo score based on completeness of the supplied product information.':'डेमो स्कोर दी गई उत्पाद जानकारी की पूर्णता पर आधारित है।',

    'Source traceability':'स्रोत ट्रेसबिलिटी', 'Evidence Behind Every Answer':'हर उत्तर के पीछे साक्ष्य',
    'Explore the official BIS sources, standards and documents supporting AI recommendations.':'AI अनुशंसाओं का समर्थन करने वाले आधिकारिक BIS स्रोतों, मानकों और दस्तावेज़ों को देखें।',
    'Search Evidence':'साक्ष्य खोजें', 'Evidence library':'साक्ष्य लाइब्रेरी',
    'Prototype evidence records are clearly presented as examples; connect this view to your live evidence API for production data.':'प्रोटोटाइप साक्ष्य रिकॉर्ड उदाहरण के रूप में प्रस्तुत किए गए हैं; उत्पादन डेटा के लिए इस दृश्य को अपने लाइव साक्ष्य API से जोड़ें।',
    'Source document:':'स्रोत दस्तावेज़:', 'Relevant clause:':'प्रासंगिक खंड:', 'Page:':'पृष्ठ:', 'Official BIS source':'आधिकारिक BIS स्रोत', 'Prototype record':'प्रोटोटाइप रिकॉर्ड',
    'View Standard':'मानक देखें', 'No supporting evidence found.':'कोई सहायक साक्ष्य नहीं मिला।',
    'Try another standard number, product keyword or clause.':'कोई अन्य मानक संख्या, उत्पाद कीवर्ड या खंड आज़माएँ।',
    'AI answer + evidence':'AI उत्तर + साक्ष्य', 'Evidence is shown alongside the answer so users can inspect the reasoning trail.':'उत्तर के साथ साक्ष्य दिखाया जाता है ताकि उपयोगकर्ता तर्क की पूरी कड़ी देख सकें।',
    'AI Recommendation':'AI अनुशंसा', 'Your electrical appliance may require compliance with IS 302.':'आपके विद्युत उपकरण के लिए IS 302 का अनुपालन आवश्यक हो सकता है।',
    'This is a decision-support statement, not a final certification determination.':'यह निर्णय-सहायता कथन है, अंतिम प्रमाणन निर्धारण नहीं।',
    'Supporting evidence':'सहायक साक्ष्य', 'Retrieved evidence is displayed here so the user can verify the source before relying on the recommendation.':'यहाँ प्राप्त साक्ष्य दिखाया जाता है ताकि उपयोगकर्ता अनुशंसा पर भरोसा करने से पहले स्रोत सत्यापित कर सके।',
    'User Question':'उपयोगकर्ता का प्रश्न', 'Relevant BIS Document':'प्रासंगिक BIS दस्तावेज़', 'Relevant Clause':'प्रासंगिक खंड',
    'Hallucination prevention':'हैलुसिनेशन की रोकथाम',
    'Answers are grounded in retrieved BIS information. When reliable evidence is unavailable, the system should clearly indicate insufficient evidence instead of inventing information.':'उत्तर प्राप्त BIS जानकारी पर आधारित होते हैं। जब विश्वसनीय साक्ष्य उपलब्ध न हो, तो सिस्टम को जानकारी गढ़ने के बजाय स्पष्ट रूप से अपर्याप्त साक्ष्य बताना चाहिए।',
    'Evidence details':'साक्ष्य विवरण', 'Close':'बंद करें', 'Source name:':'स्रोत का नाम:', 'Document:':'दस्तावेज़:', 'IS Number:':'IS संख्या:', 'Clause:':'खंड:',
    'Source URL:':'स्रोत URL:', 'Retrieved date:':'प्राप्ति तिथि:',
    'Example evidence record: appliance marking requirements should be checked against the current official document.':'उदाहरण साक्ष्य रिकॉर्ड: उपकरण की मार्किंग आवश्यकताओं को वर्तमान आधिकारिक दस्तावेज़ से जाँचना चाहिए।',
    'Relevant test section':'प्रासंगिक परीक्षण खंड', 'Water quality section':'जल गुणवत्ता खंड',
    'Example evidence record for food-contact material testing and migration assessment.':'खाद्य-संपर्क सामग्री परीक्षण और माइग्रेशन आकलन के लिए उदाहरण साक्ष्य रिकॉर्ड।',
    'Example evidence record for drinking-water quality requirements.':'पीने के पानी की गुणवत्ता आवश्यकताओं के लिए उदाहरण साक्ष्य रिकॉर्ड।',
    'Safety of Household and Similar Electrical Appliances':'घरेलू एवं समान विद्युत उपकरणों की सुरक्षा',
    'Overall Migration of Plastics to Foodstuffs':'खाद्य पदार्थों में प्लास्टिक का समग्र माइग्रेशन', 'Drinking Water — Specification':'पीने का पानी — विनिर्देश',

    'Testing network':'परीक्षण नेटवर्क', 'Find the Right BIS Laboratory':'सही BIS प्रयोगशाला खोजें',
    'Discover laboratories capable of testing your product according to applicable Indian Standards.':'लागू भारतीय मानकों के अनुसार आपके उत्पाद का परीक्षण करने में सक्षम प्रयोगशालाएँ खोजें।',
    'Find Laboratory':'प्रयोगशाला खोजें', 'State':'राज्य', 'All states':'सभी राज्य', 'Maharashtra':'महाराष्ट्र', 'Gujarat':'गुजरात',
    'Laboratory type':'प्रयोगशाला प्रकार', 'All types':'सभी प्रकार', 'Materials':'सामग्री', 'Food contact':'खाद्य-संपर्क', 'Apply Filters':'फ़िल्टर लागू करें',
    'Laboratory results':'प्रयोगशाला परिणाम',
    'Accreditation and contact details should be sourced from the current official BIS-recognized laboratory directory before selection.':'चयन से पहले मान्यता और संपर्क विवरण वर्तमान आधिकारिक BIS-मान्यता प्राप्त प्रयोगशाला निर्देशिका से सत्यापित किए जाने चाहिए।',
    "Couldn't find a suitable laboratory.":'कोई उपयुक्त प्रयोगशाला नहीं मिली।', 'Modify the product, IS number, test type, state or laboratory type.':'उत्पाद, IS संख्या, परीक्षण प्रकार, राज्य या प्रयोगशाला प्रकार बदलकर देखें।',
    'Which laboratory should I choose?':'मुझे कौन-सी प्रयोगशाला चुननी चाहिए?', 'AI recommendation':'AI अनुशंसा',
    'Electrical testing laboratory':'विद्युत परीक्षण प्रयोगशाला', 'Reason:':'कारण:', 'Applicable IS:':'लागू IS:', 'Required test:':'आवश्यक परीक्षण:',
    'electrical safety and related performance checks':'विद्युत सुरक्षा और संबंधित प्रदर्शन जाँच', 'Match percentage':'मिलान प्रतिशत', 'Confidence: Medium–High':'विश्वास: मध्यम–उच्च',
    'Laboratory details & testing status':'प्रयोगशाला विवरण और परीक्षण स्थिति', 'Selected laboratory':'चयनित प्रयोगशाला',
    'Select a result to populate live laboratory details when connected to the BIS directory API.':'BIS निर्देशिका API से जुड़ने पर लाइव प्रयोगशाला विवरण भरने के लिए कोई परिणाम चुनें।',
    'Supported standards':'समर्थित मानक', 'Facilities':'सुविधाएँ', 'Testing-specific; verify current directory':'परीक्षण-विशिष्ट; वर्तमान निर्देशिका से सत्यापित करें',
    'Applicable standard method':'लागू मानक विधि', 'Electrical testing facility':'विद्युत परीक्षण सुविधा', 'Standard-specific':'मानक-विशिष्ट',
    'Laboratory map':'प्रयोगशाला मानचित्र', 'API-free visual placeholder — replace with a live map only when you add an approved map/data source.':'API-रहित दृश्य प्लेसहोल्डर—स्वीकृत मानचित्र/डेटा स्रोत जोड़ने पर ही लाइव मानचित्र से बदलें।',
    'Example markers':'उदाहरण मार्कर', 'Directory check':'निर्देशिका जाँच', 'Tests:':'परीक्षण:', 'Distance:':'दूरी:', 'Nearby':'पास में',
    'Recognition details required from live BIS directory':'लाइव BIS निर्देशिका से मान्यता विवरण आवश्यक', 'Concrete, steel, strength and dimensional tests':'कंक्रीट, स्टील, मजबूती और आयामी परीक्षण',
    'Migration and food-contact material tests':'माइग्रेशन और खाद्य-संपर्क सामग्री परीक्षण', 'Pune':'पुणे', 'Mumbai':'मुंबई', 'Ahmedabad':'अहमदाबाद',
    'Select Laboratory':'प्रयोगशाला चुनें', 'View Details':'विवरण देखें',

    'About the platform':'प्लेटफ़ॉर्म के बारे में', 'About BIS Intelligence':'BIS Intelligence के बारे में',
    'From Product Description to BIS Compliance — powered by AI and grounded in official BIS information.':'उत्पाद विवरण से BIS अनुपालन तक—AI द्वारा संचालित और आधिकारिक BIS जानकारी पर आधारित।',
    'The problem':'समस्या',
    'BIS provides thousands of standards, certification schemes, testing information and related services. Users may struggle to find the correct standard, understand certification requirements, identify required tests, find suitable laboratories, understand required documents and navigate different BIS services.':'BIS हजारों मानक, प्रमाणन योजनाएँ, परीक्षण जानकारी और संबंधित सेवाएँ प्रदान करता है। उपयोगकर्ताओं को सही मानक खोजने, प्रमाणन आवश्यकताओं को समझने, आवश्यक परीक्षण पहचानने, उपयुक्त प्रयोगशालाएँ खोजने, आवश्यक दस्तावेज़ समझने और विभिन्न BIS सेवाओं को नेविगेट करने में कठिनाई हो सकती है।',
    'Why it matters':'यह क्यों महत्वपूर्ण है', 'Standards research often spans multiple documents and portals. BIS Intelligence is designed to reduce that discovery burden while keeping evidence and verification visible.':'मानकों का शोध अक्सर कई दस्तावेज़ों और पोर्टलों में फैला होता है। BIS Intelligence को इस खोज के बोझ को कम करने और साथ ही साक्ष्य व सत्यापन को स्पष्ट रखने के लिए बनाया गया है।',
    'Our solution':'हमारा समाधान', 'BIS Intelligence is an intelligent decision-support platform that connects natural-language product descriptions to standards, compliance guidance and evidence.':'BIS Intelligence एक बुद्धिमान निर्णय-सहायता प्लेटफ़ॉर्म है जो प्राकृतिक भाषा में दिए गए उत्पाद विवरण को मानकों, अनुपालन मार्गदर्शन और साक्ष्य से जोड़ता है।',
    'AI BIS Assistant':'AI BIS सहायक', 'Understand product and compliance questions in natural language.':'उत्पाद और अनुपालन संबंधी प्रश्नों को प्राकृतिक भाषा में समझें।',
    'Intelligent Standard Finder':'बुद्धिमान मानक खोजक', 'Recommend potentially relevant Indian Standards.':'संभावित रूप से प्रासंगिक भारतीय मानकों की अनुशंसा करें।',
    'Compliance Checker':'अनुपालन जाँचकर्ता', 'Explain possible certification and requirement pathways.':'संभावित प्रमाणन और आवश्यकता मार्गों को समझाएँ।',
    'Evidence-based Answers':'साक्ष्य-आधारित उत्तर', 'Show supporting source, page and clause references.':'सहायक स्रोत, पृष्ठ और खंड संदर्भ दिखाएँ।',
    'Laboratory Finder':'प्रयोगशाला खोजक', 'Help map testing needs to suitable facilities.':'परीक्षण आवश्यकताओं को उपयुक्त सुविधाओं से जोड़ने में मदद करें।',
    'Multilingual Support':'बहुभाषी सहायता', 'Designed for multilingual interactions.':'बहुभाषी संवाद के लिए बनाया गया।',
    'Compliance Roadmap':'अनुपालन रोडमैप', 'Turn discovery into actionable next steps.':'खोज को कार्रवाई योग्य अगले चरणों में बदलें।',
    'Confidence Score':'विश्वास स्कोर', 'Communicate uncertainty and evidence strength.':'अनिश्चितता और साक्ष्य की मजबूती स्पष्ट करें।',
    'How it works':'यह कैसे काम करता है',
    'User → Product Description → AI Understanding → BIS Knowledge Retrieval → Relevant Standards → Compliance Analysis → Evidence-backed Guidance':'उपयोगकर्ता → उत्पाद विवरण → AI समझ → BIS ज्ञान प्राप्ति → प्रासंगिक मानक → अनुपालन विश्लेषण → साक्ष्य-समर्थित मार्गदर्शन',
    'Technology':'तकनीक', 'Built around a retrieval-first prototype architecture.':'रिट्रीवल-फर्स्ट प्रोटोटाइप आर्किटेक्चर पर आधारित।',
    'Frontend · Next.js / React':'फ्रंटएंड · Next.js / React', 'Backend · Python / FastAPI':'बैकएंड · Python / FastAPI', 'AI / LLM · NVIDIA NIM':'AI / LLM · NVIDIA NIM',
    'RAG · TF-IDF retrieval':'RAG · TF-IDF रिट्रीवल', 'Database · SQLite':'डेटाबेस · SQLite', 'APIs · BIS / application APIs':'APIs · BIS / एप्लिकेशन APIs',
    'Authentication · token-based prototype':'प्रमाणीकरण · टोकन-आधारित प्रोटोटाइप', 'Trust & Transparency':'विश्वास और पारदर्शिता',
    'The system is designed to ground responses in official BIS information and clearly indicate confidence or lack of evidence. It is an AI-assisted decision-support prototype, not an official BIS certification authority.':'सिस्टम को आधिकारिक BIS जानकारी पर उत्तर आधारित रखने और विश्वास स्तर या साक्ष्य की कमी स्पष्ट रूप से बताने के लिए डिज़ाइन किया गया है। यह AI-सहायित निर्णय-सहायता प्रोटोटाइप है, आधिकारिक BIS प्रमाणन प्राधिकरण नहीं।',
    'Making BIS Compliance Simpler':'BIS अनुपालन को सरल बनाना',
    'Our vision is to make standards discovery, testing, certification and compliance guidance easier to understand — without hiding the evidence that supports the answer.':'हमारा दृष्टिकोण मानकों की खोज, परीक्षण, प्रमाणन और अनुपालन मार्गदर्शन को समझना आसान बनाना है—उत्तर के समर्थन में मौजूद साक्ष्य को छिपाए बिना।',
    'Built for SIH26107':'SIH26107 के लिए निर्मित', 'Problem Statement: SIH26107 · Theme: Smart Automation · Category: Software':'समस्या वक्तव्य: SIH26107 · थीम: स्मार्ट ऑटोमेशन · श्रेणी: सॉफ़्टवेयर',
    'Back to Home':'होम पर वापस जाएँ',

    'Help centre':'सहायता केंद्र', 'Frequently Asked Questions':'अक्सर पूछे जाने वाले प्रश्न',
    'Find quick answers about BIS standards, certification and compliance.':'BIS मानकों, प्रमाणन और अनुपालन के बारे में त्वरित उत्तर पाएँ।',
    'Search':'खोजें', 'All':'सभी', 'General':'सामान्य', 'BIS Standards':'BIS मानक', 'Certification':'प्रमाणन', 'Testing':'परीक्षण', 'Laboratories':'प्रयोगशालाएँ',
    'How can I find the correct BIS standard for my product?':'मैं अपने उत्पाद के लिए सही BIS मानक कैसे खोज सकता हूँ?',
    'What is BIS?':'BIS क्या है?', 'What is an Indian Standard (IS)?':'भारतीय मानक (IS) क्या है?', 'What is BIS Intelligence?':'BIS Intelligence क्या है?',
    'What is an IS number?':'IS संख्या क्या है?', 'How do I know whether a standard is current?':'मुझे कैसे पता चलेगा कि कोई मानक वर्तमान है?',
    'What are related standards?':'संबंधित मानक क्या होते हैं?', 'Is BIS certification mandatory for my product?':'क्या मेरे उत्पाद के लिए BIS प्रमाणन अनिवार्य है?',
    'What is the difference between mandatory and voluntary certification?':'अनिवार्य और स्वैच्छिक प्रमाणन में क्या अंतर है?',
    'What documents are required for BIS certification?':'BIS प्रमाणन के लिए कौन-से दस्तावेज़ आवश्यक हैं?', 'How can I apply for BIS certification?':'मैं BIS प्रमाणन के लिए आवेदन कैसे करूँ?',
    'What tests are required?':'कौन-से परीक्षण आवश्यक हैं?', 'Where can I get my product tested?':'मैं अपने उत्पाद का परीक्षण कहाँ करा सकता हूँ?',
    'How do I find a BIS-recognized laboratory?':'मैं BIS-मान्यता प्राप्त प्रयोगशाला कैसे खोजूँ?', 'How does the BIS AI assistant work?':'BIS AI सहायक कैसे काम करता है?',
    'How does BIS Intelligence recommend standards?':'BIS Intelligence मानकों की अनुशंसा कैसे करता है?', 'How does the system prevent AI hallucinations?':'सिस्टम AI हैलुसिनेशन को कैसे रोकता है?',
    'What does the confidence score mean?':'विश्वास स्कोर का क्या अर्थ है?', 'Can I trust AI-generated compliance guidance?':'क्या मैं AI द्वारा दिए गए अनुपालन मार्गदर्शन पर भरोसा कर सकता हूँ?',
    'Can’t find your answer?':'उत्तर नहीं मिला?', 'Use the relevant product workflow or ask the assistant with more context.':'संबंधित उत्पाद प्रक्रिया का उपयोग करें या अधिक संदर्भ के साथ सहायक से पूछें।',
    'Ask BIS Intelligence':'BIS Intelligence से पूछें', 'Important disclaimer:':'महत्वपूर्ण अस्वीकरण:',
    'BIS requirements may change. Always verify final certification and compliance requirements using the latest official BIS information.':'BIS की आवश्यकताएँ बदल सकती हैं। अंतिम प्रमाणन और अनुपालन आवश्यकताओं को हमेशा नवीनतम आधिकारिक BIS जानकारी से सत्यापित करें।',
    'The Bureau of Indian Standards (BIS) is India’s national standards body. Verify current information through official BIS sources.':'भारतीय मानक ब्यूरो (BIS) भारत का राष्ट्रीय मानक निकाय है। वर्तमान जानकारी को आधिकारिक BIS स्रोतों से सत्यापित करें।',
    'An Indian Standard is a published standard identified by an IS number and title. Applicability depends on the product and scope.':'भारतीय मानक एक प्रकाशित मानक है जिसकी पहचान IS संख्या और शीर्षक से होती है। इसकी प्रयोज्यता उत्पाद और दायरे पर निर्भर करती है।',
    'BIS Intelligence is an independent AI-assisted standards and compliance-support prototype developed for SIH26107; it is not an official BIS platform.':'BIS Intelligence SIH26107 के लिए विकसित एक स्वतंत्र AI-सहायित मानक और अनुपालन-सहायता प्रोटोटाइप है; यह आधिकारिक BIS प्लेटफ़ॉर्म नहीं है।',
    'Use the Find Standards page with a product description, IS number, category or keywords. Review the scope and supporting evidence before relying on a result.':'उत्पाद विवरण, IS संख्या, श्रेणी या कीवर्ड के साथ मानक खोजें। परिणाम पर भरोसा करने से पहले उसका दायरा और सहायक साक्ष्य देखें।',
    'It is the identifier used to reference an Indian Standard, often including a part and publication year.':'यह भारतीय मानक को संदर्भित करने के लिए उपयोग किया जाने वाला पहचानकर्ता है, जिसमें अक्सर भाग और प्रकाशन वर्ष शामिल होते हैं।',
    'Check the latest official BIS publication or directory. The prototype can surface indexed status, but final verification should use current BIS information.':'नवीनतम आधिकारिक BIS प्रकाशन या निर्देशिका देखें। प्रोटोटाइप इंडेक्स की स्थिति दिखा सकता है, लेकिन अंतिम सत्यापन वर्तमान BIS जानकारी से होना चाहिए।',
    'Related standards are other documents that may address connected materials, methods, components, testing or applications.':'संबंधित मानक वे अन्य दस्तावेज़ हैं जो जुड़े हुए पदार्थों, विधियों, घटकों, परीक्षणों या अनुप्रयोगों से संबंधित हो सकते हैं।',
    'It depends on the product and the applicable regulatory scheme. Do not assume mandatory status from an AI response alone; verify current official BIS requirements.':'यह उत्पाद और लागू नियामक योजना पर निर्भर करता है। केवल AI उत्तर के आधार पर अनिवार्य स्थिति न मानें; वर्तमान आधिकारिक BIS आवश्यकताओं का सत्यापन करें।',
    'Mandatory certification is required where applicable regulation or scheme says so; voluntary certification is pursued without that mandatory requirement.':'जहाँ लागू विनियमन या योजना इसकी मांग करती है, वहाँ अनिवार्य प्रमाणन आवश्यक होता है; स्वैच्छिक प्रमाणन ऐसी अनिवार्यता के बिना लिया जाता है।',
    'Requirements vary by product and scheme. Typical records can include application, manufacturing, test, quality and business documents.':'आवश्यकताएँ उत्पाद और योजना के अनुसार बदलती हैं। सामान्य रिकॉर्ड में आवेदन, विनिर्माण, परीक्षण, गुणवत्ता और व्यावसायिक दस्तावेज़ शामिल हो सकते हैं।',
    'Follow the current official BIS process for the applicable product and scheme, including application, testing and assessment steps where required.':'लागू उत्पाद और योजना के लिए वर्तमान आधिकारिक BIS प्रक्रिया का पालन करें, जिसमें आवश्यकतानुसार आवेदन, परीक्षण और मूल्यांकन चरण शामिल हैं।',
    'Tests depend on the applicable standard, product construction and relevant test methods. The Compliance Assistant can help structure the investigation.':'परीक्षण लागू मानक, उत्पाद संरचना और संबंधित परीक्षण विधियों पर निर्भर करते हैं। अनुपालन सहायक जाँच को व्यवस्थित करने में मदद कर सकता है।',
    'Use the Laboratories page to discover potential testing facilities, then verify current recognition and scope in the official BIS directory.':'संभावित परीक्षण सुविधाएँ खोजने के लिए प्रयोगशालाएँ पृष्ठ देखें, फिर आधिकारिक BIS निर्देशिका में वर्तमान मान्यता और दायरे की पुष्टि करें।',
    'Search by product, IS number, test type and location, then confirm the laboratory’s current recognition and scope with official BIS information.':'उत्पाद, IS संख्या, परीक्षण प्रकार और स्थान से खोजें, फिर आधिकारिक BIS जानकारी से प्रयोगशाला की वर्तमान मान्यता और दायरे की पुष्टि करें।',
    'The intended flow is natural-language understanding followed by retrieval of relevant BIS document chunks and then a grounded explanation.':'निर्धारित प्रक्रिया में पहले प्राकृतिक भाषा को समझना, फिर प्रासंगिक BIS दस्तावेज़ खंड प्राप्त करना और उसके बाद साक्ष्य-आधारित व्याख्या देना शामिल है।',
    'It combines product/query understanding with retrieval and similarity ranking to surface potentially relevant standards.':'यह संभावित रूप से प्रासंगिक मानकों को सामने लाने के लिए उत्पाद/प्रश्न की समझ को रिट्रीवल और समानता रैंकिंग के साथ जोड़ता है।',
    'The design instructs the model to answer only from retrieved evidence and to report insufficient authoritative evidence instead of inventing standards, clauses or requirements.':'डिज़ाइन मॉडल को केवल प्राप्त साक्ष्य से उत्तर देने और मानक, खंड या आवश्यकताएँ गढ़ने के बजाय अपर्याप्त आधिकारिक साक्ष्य बताने के लिए निर्देशित करता है।',
    'It communicates the strength of the available match/evidence. It is not a legal or certification guarantee.':'यह उपलब्ध मिलान/साक्ष्य की मजबूती बताता है। यह कानूनी या प्रमाणन गारंटी नहीं है।',
    'Use it as decision-support and research guidance. Always verify final requirements, applicability, certification status and current documents through official BIS sources.':'इसे निर्णय-सहायता और शोध मार्गदर्शन के रूप में उपयोग करें। अंतिम आवश्यकताओं, प्रयोज्यता, प्रमाणन स्थिति और वर्तमान दस्तावेज़ों को हमेशा आधिकारिक BIS स्रोतों से सत्यापित करें।',

    'Skip to content':'सामग्री पर जाएँ'
  };

  // Centralized multilingual engine. Hindi uses the curated BIS dictionary above;
  // other languages use the same source strings with a cached translation fallback.
  var STORAGE_KEY = 'bisLanguage';
  var CACHE_KEY = 'bisTranslationCacheV2';
  var LANGUAGES = {
    en:'English', hi:'हिन्दी', mr:'मराठी', bn:'বাংলা', gu:'ગુજરાતી', ta:'தமிழ்', te:'తెలుగు',
    kn:'ಕನ್ನಡ', ml:'മലയാളം', pa:'ਪੰਜਾਬੀ', or:'ଓଡ଼ିଆ', as:'অসমীয়া', ur:'اردو', ne:'नेपाली',
    sa:'संस्कृत', es:'Español', fr:'Français', de:'Deutsch', it:'Italiano', pt:'Português',
    ru:'Русский', ar:'العربية', 'zh-CN':'简体中文', 'zh-TW':'繁體中文', ja:'日本語', ko:'한국어',
    th:'ไทย', vi:'Tiếng Việt', id:'Bahasa Indonesia', ms:'Bahasa Melayu', tr:'Türkçe',
    nl:'Nederlands', pl:'Polski', uk:'Українська', fa:'فارسی', he:'עברית', sw:'Kiswahili'
  };
  var MR = {
    'Skip to content':'सामग्रीकडे जा','Standards Navigator':'मानक नेव्हिगेटर','Home':'मुख्यपृष्ठ','Find Standards':'मानक शोधा',
    'Compliance Assistant':'अनुपालन सहाय्यक','Evidence':'पुरावा','Laboratories':'प्रयोगशाळा','About':'आमच्याबद्दल','FAQ':'वारंवार विचारले जाणारे प्रश्न',
    'English':'इंग्रजी','हिन्दी':'हिंदी','Try BIS Intelligence':'BIS Intelligence वापरा','Find Standard':'मानक शोधा','Compliance':'अनुपालन',
    'Trust & Safety':'विश्वास आणि सुरक्षितता','Official BIS website':'अधिकृत BIS संकेतस्थळ','Built for':'यासाठी निर्मित',
    'Smart India Hackathon':'स्मार्ट इंडिया हॅकाथॉन','Problem SIH26107':'समस्या SIH26107','Made for the Smart India Hackathon':'स्मार्ट इंडिया हॅकाथॉनसाठी निर्मित',
    'Evidence-first AI':'पुराव्यावर आधारित AI','From product description':'उत्पादनाच्या वर्णनापासून','to BIS compliance.':'BIS अनुपालनापर्यंत.',
    'Analyze':'विश्लेषण करा','High confidence':'उच्च विश्वास','Medium confidence':'मध्यम विश्वास','Low confidence':'कमी विश्वास',
    'Find Laboratory':'प्रयोगशाळा शोधा','View Details':'तपशील पहा','Select Laboratory':'प्रयोगशाळा निवडा','View Evidence':'पुरावा पहा','View Source':'स्रोत पहा',
    'View Standard':'मानक पहा','Check Compliance':'अनुपालन तपासा','Start Compliance Check':'अनुपालन तपासणी सुरू करा','Analyze Compliance':'अनुपालनाचे विश्लेषण करा',
    'Search your question...':'तुमचा प्रश्न शोधा...','Search standards, clauses, documents or evidence...':'मानके, कलमे, दस्तऐवज किंवा पुरावे शोधा...',
    'Search by product, IS number or test...':'उत्पादन, IS क्रमांक किंवा चाचणीद्वारे शोधा...','Couldn’t find a suitable laboratory.':'योग्य प्रयोगशाळा सापडली नाही.',
    "Couldn't find a suitable laboratory.":'योग्य प्रयोगशाळा सापडली नाही.','No supporting evidence found.':'समर्थन करणारा पुरावा सापडला नाही.',
    'We couldn’t find an exact match.':'अचूक जुळणी सापडली नाही.','We couldn’t find an exact match.':'अचूक जुळणी सापडली नाही.'
  };

  function normalize(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function loadCache(){ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return {}} }
  var cache=loadCache();
  function saveCache(){ try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache));}catch(e){} }
  /* Text nodes do not have a dataset property. Keep their originals in a WeakMap so
     switching languages never loses the English source text. */
  var originalTextNodes = new WeakMap();
  function sourceText(node){
    if(!node) return '';
    if(!originalTextNodes.has(node)) originalTextNodes.set(node,node.nodeValue);
    return normalize(originalTextNodes.get(node));
  }
  function attrSource(el,attr){
    var key='i18nOriginal'+attr.charAt(0).toUpperCase()+attr.slice(1);
    if(!el.dataset[key]) el.dataset[key]=el.getAttribute(attr)||'';
    return normalize(el.dataset[key]);
  }
  function curated(text,lang){
    if(lang==='en') return text;
    if(lang==='hi') return DICT[text] || text;
    if(lang==='mr') return MR[text] || text;
    return text;
  }
  function translateRemote(text,lang){
    if(!text || lang==='en') return Promise.resolve(text);
    var ckey=lang+'|'+text;
    var direct=curated(text,lang); if(direct!==text) return Promise.resolve(direct);
    if(cache[ckey]) return Promise.resolve(cache[ckey]);
    var url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+encodeURIComponent(lang)+'&dt=t&q='+encodeURIComponent(text);
    return fetch(url,{mode:'cors'}).then(function(r){return r.json()}).then(function(data){
      var result=(data&&data[0]||[]).map(function(x){return x[0]||''}).join('')||text;
      cache[ckey]=result; saveCache(); return result;
    }).catch(function(){ return text; });
  }
  function setTextNode(node,lang){
    var original=sourceText(node); if(!original) return Promise.resolve();
    return translateRemote(original,lang).then(function(t){
      if(node.parentElement && !/^(SCRIPT|STYLE)$/i.test(node.parentElement.tagName)) node.nodeValue=t;
    });
  }
  function translateElement(root,lang){
    if(!root || root.nodeType!==1 || root.closest && root.closest('[data-no-translate="true"]')) return Promise.resolve();
    var tasks=[];
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
    while(walker.nextNode()){
      var n=walker.currentNode;
      if(!n.parentElement || /^(SCRIPT|STYLE|OPTION)$/i.test(n.parentElement.tagName)) continue;
      if(n.parentElement.closest && n.parentElement.closest('[data-no-translate="true"]')) continue;
      if(!normalize(n.nodeValue)) continue;
      tasks.push(setTextNode(n,lang));
    }
    root.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title]').forEach(function(el){
      ['placeholder','aria-label','title'].forEach(function(attr){
        if(!el.hasAttribute(attr)) return;
        var original=attrSource(el,attr); if(!original) return;
        tasks.push(translateRemote(original,lang).then(function(t){el.setAttribute(attr,t)}));
      });
    });
    return Promise.all(tasks);
  }
  function updateSelectors(lang){
    document.querySelectorAll('.lang-select').forEach(function(select){
      var current=select.value;
      select.setAttribute('data-no-translate','true');
      select.innerHTML=Object.keys(LANGUAGES).map(function(code){return '<option value="'+code+'">'+LANGUAGES[code]+'</option>'}).join('');
      select.value=LANGUAGES[lang]?lang:current||'en';
      select.setAttribute('aria-label',lang==='en'?'Language selector':'भाषा निवडकर्ता');
    });
  }
  function restoreOriginal(root){
    if(!root) return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(n){
      if(originalTextNodes.has(n)) n.nodeValue=originalTextNodes.get(n);
    });
    root.querySelectorAll('[data-i18n-original-placeholder],[data-i18n-original-aria-label],[data-i18n-original-title]').forEach(function(el){
      ['placeholder','aria-label','title'].forEach(function(attr){var k='i18nOriginal'+attr.charAt(0).toUpperCase()+attr.slice(1);if(el.dataset[k]!==undefined)el.setAttribute(attr,el.dataset[k]);});
    });
  }
  function translateDocument(lang){
    lang=LANGUAGES[lang]?lang:'en';
    localStorage.setItem(STORAGE_KEY,lang);
    document.documentElement.lang=lang;
    document.documentElement.dataset.language=lang;
    updateSelectors(lang);
    if(lang==='en'){ restoreOriginal(document.body); restoreOriginal(document.head); document.title=document.documentElement.dataset.i18nTitle||document.title; return Promise.resolve(); }
    if(!document.documentElement.dataset.i18nTitle) document.documentElement.dataset.i18nTitle=document.title;
    return translateRemote(document.documentElement.dataset.i18nTitle,lang).then(function(t){document.title=t;return translateElement(document.body,lang);});
  }
  function init(){
    var saved=localStorage.getItem(STORAGE_KEY)||'en'; if(!LANGUAGES[saved]) saved='en';
    if(!document.documentElement.dataset.i18nTitle) document.documentElement.dataset.i18nTitle=document.title;
    document.querySelectorAll('.lang-select').forEach(function(select){
      select.addEventListener('change',function(){translateDocument(this.value);});
    });
    translateDocument(saved);
    var observer=new MutationObserver(function(ms){
      var lang=localStorage.getItem(STORAGE_KEY)||'en'; if(lang==='en') return;
      ms.forEach(function(m){m.addedNodes.forEach(function(n){
        if(n.nodeType===1 && !(n.matches && n.matches('[data-no-translate="true"]')) && !(n.closest && n.closest('[data-no-translate="true"]'))) translateElement(n,lang);
      });});
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  window.BISLanguage={apply:translateDocument,translate:function(t,lang){return translateRemote(t,lang||localStorage.getItem(STORAGE_KEY)||'en')},dictionary:DICT,languages:LANGUAGES};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
