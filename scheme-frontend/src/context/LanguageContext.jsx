import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Nav & General
    appName: "Scheme Hub",
    navHome: "Home",
    navSearch: "Explore Schemes",
    navRecommendations: "Personal Recommendations",
    navCompare: "Compare Schemes",
    navApplications: "My Applications",
    navAdmin: "Admin Panel",
    navLogout: "Logout",
    navLogin: "Login / Register",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    actions: "Actions",

    // Home
    heroTitle: "Find Government Schemes You Qualify For",
    heroSubtitle: "Evaluate your eligibility dynamically, understand requirements, and track application processes easily.",
    getStartedBtn: "Get Started Now",
    featureRecTitle: "Personalized Recommendations",
    featureRecDesc: "Build your citizen profile to see matches ranked by matching rules.",
    featureCheckTitle: "Eligibility Checker",
    featureCheckDesc: "Find out exactly why you match or what criteria is missing.",
    featureTrackTitle: "Application Tracker",
    featureTrackDesc: "Bookmark schemes and track application progress from planning to approval.",

    // Profile
    profileTitle: "My Citizen Profile",
    profileDesc: "Fill in your demographic and occupational details to enable the scheme recommendation engine.",
    profileUpdated: "Profile updated successfully!",
    age: "Age",
    gender: "Gender",
    state: "State",
    district: "District",
    annualIncome: "Annual Income (₹)",
    occupation: "Occupation",
    education: "Education Level",
    caste: "Caste / Category",
    disabilityStatus: "Disability Status",
    disabilityDetails: "Disability Details",
    familyMembers: "Number of Family Members",
    isFarmer: "Are you a Farmer?",
    isStudent: "Are you a Student?",
    isBusinessOwner: "Do you own a Business?",

    // Recommendations
    recTitle: "🎯 Your Scheme Recommendations",
    recSubtitle: "Schemes matching your profile are listed below.",
    matchLabel: "Match Score",
    potEligible: "Potentially Eligible",
    whyEligible: "Why am I eligible?",
    missingDetails: "Missing Information Needed",
    passedRules: "Passed Requirements",
    failedRules: "Failed Requirements",
    checkEligibility: "Check Eligibility",
    applyNow: "Bookmark & Apply",
    benefitCalculator: "Estimated Benefit Calculator",
    calculateBtn: "Calculate Benefit",
    estimatedBenefit: "Estimated Benefit",
    viewDetails: "View Details",

    // Search
    searchPlaceholder: "Search schemes by name, department...",
    filters: "Filters",
    clearFilters: "Clear Filters",
    categoryFilter: "Category",
    beneficiaryFilter: "Beneficiary Type",
    locationFilter: "State / Location",
    schemeType: "Scheme Type",
    centralGov: "Central Government",
    stateGov: "State Government",
    noSchemes: "No schemes found matching the filters.",

    // Applications & Checklist
    appTrackingTitle: "Application Tracker & Document Checklist",
    bookmarkTitle: "Bookmarked Schemes",
    statusLabel: "Status",
    refIdLabel: "Reference ID",
    appDateLabel: "Application Date",
    notesLabel: "Notes",
    checklistHeader: "Required Documents Checklist",
    uploadBtn: "Upload",
    uploadSuccess: "File uploaded successfully!",
    statusSaved: "Saved",
    statusPlanning: "Planning to Apply",
    statusStarted: "Application Started",
    statusSubmitted: "Submitted",
    statusVerification: "Under Verification",
    statusApproved: "Approved",
    statusRejected: "Rejected"
  },
  hi: {
    // Nav & General
    appName: "योजना हब",
    navHome: "होम",
    navSearch: "योजनाएं खोजें",
    navRecommendations: "व्यक्तिगत सिफारिशें",
    navCompare: "योजनाओं की तुलना करें",
    navApplications: "मेरे आवेदन",
    navAdmin: "प्रशासन पैनल",
    navLogout: "लॉगआउट",
    navLogin: "लॉगिन / पंजीकरण",
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    actions: "कार्रवाई",

    // Home
    heroTitle: "उन सरकारी योजनाओं को खोजें जिनके लिए आप पात्र हैं",
    heroSubtitle: "अपनी पात्रता का मूल्यांकन करें, आवश्यकताओं को समझें और आवेदन प्रक्रियाओं को आसानी से ट्रैक करें।",
    getStartedBtn: "अभी शुरू करें",
    featureRecTitle: "व्यक्तिगत सिफारिशें",
    featureRecDesc: "मिलान नियमों द्वारा क्रमबद्ध योजनाओं को देखने के लिए अपना प्रोफ़ाइल बनाएं।",
    featureCheckTitle: "पात्रता जाँचकर्ता",
    featureCheckDesc: "सटीक रूप से जानें कि आप क्यों पात्र हैं या कौन सी जानकारी गायब है।",
    featureTrackTitle: "आवेदन ट्रैकर",
    featureTrackDesc: "योजनाओं को बुकमार्क करें और योजना से लेकर अनुमोदन तक आवेदन की प्रगति को ट्रैक करें।",

    // Profile
    profileTitle: "मेरा नागरिक प्रोफ़ाइल",
    profileDesc: "सिफारिश इंजन को सक्षम करने के लिए अपने जनसांख्यिकीय और व्यावसायिक विवरण भरें।",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
    age: "आयु",
    gender: "लिंग",
    state: "राज्य",
    district: "जिला",
    annualIncome: "वार्षिक आय (₹)",
    occupation: "व्यवसाय",
    education: "शिक्षा का स्तर",
    caste: "जाति / श्रेणी",
    disabilityStatus: "विकलांगता स्थिति",
    disabilityDetails: "विकलांगता विवरण",
    familyMembers: "परिवार के सदस्यों की संख्या",
    isFarmer: "क्या आप एक किसान हैं?",
    isStudent: "क्या आप एक छात्र हैं?",
    isBusinessOwner: "क्या आपका कोई व्यवसाय है?",

    // Recommendations
    recTitle: "🎯 आपकी योजना सिफारिशें",
    recSubtitle: "आपके प्रोफ़ाइल से मेल खाने वाली योजनाएं नीचे सूचीबद्ध हैं।",
    matchLabel: "मैच स्कोर",
    potEligible: "संभावित रूप से पात्र",
    whyEligible: "मैं क्यों पात्र हूँ?",
    missingDetails: "आवश्यक गायब जानकारी",
    passedRules: "पूरी की गई आवश्यकताएं",
    failedRules: "असफल आवश्यकताएं",
    checkEligibility: "पात्रता की जांच करें",
    applyNow: "बुकमार्क और आवेदन करें",
    benefitCalculator: "अनुमानित लाभ कैलकुलेटर",
    calculateBtn: "लाभ की गणना करें",
    estimatedBenefit: "अनुमानित लाभ",
    viewDetails: "विवरण देखें",

    // Search
    searchPlaceholder: "नाम या विभाग द्वारा योजनाएं खोजें...",
    filters: "फ़िल्टर",
    clearFilters: "फ़िल्टर हटाएं",
    categoryFilter: "श्रेणी",
    beneficiaryFilter: "लाभार्थी प्रकार",
    locationFilter: "राज्य / स्थान",
    schemeType: "योजना प्रकार",
    centralGov: "केंद्र सरकार",
    stateGov: "राज्य सरकार",
    noSchemes: "फ़िल्टर से मेल खाने वाली कोई योजना नहीं मिली।"
  },
  ta: {
    // Nav & General
    appName: "திட்ட மையம்",
    navHome: "முகப்பு",
    navSearch: "திட்டங்களை தேடுக",
    navRecommendations: "தனிப்பயன் பரிந்துரைகள்",
    navCompare: "திட்டங்களை ஒப்பிடுக",
    navApplications: "எனது விண்ணப்பங்கள்",
    navAdmin: "நிர்வாகக் குழு",
    navLogout: "வெளியேறு",
    navLogin: "உள்நுழை / பதிவுசெய்",
    loading: "ஏற்றப்படுகிறது...",
    save: "சேமி",
    cancel: "ரத்து செய்",
    submit: "சமர்ப்பி",
    actions: "செயல்கள்",

    // Home
    heroTitle: "உங்களுக்குத் தகுதியான அரசு திட்டங்களைக் கண்டறியுங்கள்",
    heroSubtitle: "உங்கள் தகுதியைத் தானாகவே மதிப்பீடு செய்து, தேவைகளைப் புரிந்து கொண்டு, விண்ணப்ப செயல்முறைகளை எளிதாகக் கண்காணியுங்கள்.",
    getStartedBtn: "இப்போதே தொடங்குங்கள்",
    featureRecTitle: "தனிப்பயனாக்கப்பட்ட பரிந்துரைகள்",
    featureRecDesc: "பரிந்துரை விதிகள் மூலம் தகுதியான அரசு திட்டங்களை வரிசைப்படுத்திப் பார்க்க உங்கள் சுயவிவரத்தை உருவாக்குங்கள்.",
    featureCheckTitle: "தகுதி சரிபார்ப்பு",
    featureCheckDesc: "திட்டங்களின் தகுதி தேவைகள் உங்களுக்கு எப்படிப் பொருந்துகிறது அல்லது விடுபட்ட தகவல்கள் என்ன என்பதைச் சரியாகக் கண்டறியவும்.",
    featureTrackTitle: "விண்ணப்பக் கண்காணிப்பு",
    featureTrackDesc: "திட்டங்களைச் சேமித்து, திட்டமிடல் முதல் ஒப்புதல் வரை விண்ணப்ப முன்னேற்றத்தைக் கண்காணியுங்கள்.",

    // Profile
    profileTitle: "எனது குடிமகன் சுயவிவரம்",
    profileDesc: "திட்ட பரிந்துரை இயந்திரத்தை இயக்க உங்கள் சுயவிவரத் தகவல்களைப் பூர்த்தி செய்யவும்.",
    profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    age: "வயது",
    gender: "பாலினம்",
    state: "மாநிலம்",
    district: "மாவட்டம்",
    annualIncome: "ஆண்டு வருமானம் (₹)",
    occupation: "தொழில்",
    education: "கல்வித் தகுதி",
    caste: "சமூகப் பிரிவு (ஜாதி)",
    disabilityStatus: "மாற்றுத்திறனாளி நிலை",
    disabilityDetails: "மாற்றுத்திறனாளி விவரங்கள்",
    familyMembers: "குடும்ப உறுப்பினர்களின் எண்ணிக்கை",
    isFarmer: "நீங்கள் ஒரு விவசாயியா?",
    isStudent: "நீங்கள் ஒரு மாணவரா?",
    isBusinessOwner: "உங்களுக்குத் தொழில் உள்ளதா?",

    // Recommendations
    recTitle: "🎯 உங்கள் திட்டப் பரிந்துரைகள்",
    recSubtitle: "உங்கள் சுயவிவரத்திற்குப் பொருந்தும் அரசு திட்டங்கள் கீழே பட்டியலிடப்பட்டுள்ளன.",
    matchLabel: "பொருத்த மதிப்பெண்",
    potEligible: "தகுதி பெற வாய்ப்புள்ளது",
    whyEligible: "நான் ஏன் தகுதியுடையவன்?",
    missingDetails: "தேவைப்படும் விடுபட்ட தகவல்கள்",
    passedRules: "பொருந்திய தகுதிகள்",
    failedRules: "பொருந்தாத தகுதிகள்",
    checkEligibility: "தகுதியைச் சரிபார்",
    applyNow: "திட்டத்தைச் சேமி & விண்ணப்பி",
    benefitCalculator: "மதிப்பிடப்பட்ட உதவித்தொகை கணக்கீடு",
    calculateBtn: "உதவித்தொகையைக் கணக்கிடு",
    estimatedBenefit: "மதிப்பிடப்பட்ட உதவித்தொகை",
    viewDetails: "விவரங்களைக் காண்க",

    // Search
    searchPlaceholder: "திட்டத்தின் பெயர் அல்லது துறையைத் தேடுக...",
    filters: "வடிகட்டிகள்",
    clearFilters: "வடிகட்டிகளை நீக்கு",
    categoryFilter: "பிரிவு",
    beneficiaryFilter: "பயனாளிகள் வகை",
    locationFilter: "மாநிலம் / இருப்பிடம்",
    schemeType: "திட்ட வகை",
    centralGov: "மத்திய அரசு திட்டம்",
    stateGov: "மாநில அரசு திட்டம்",
    noSchemes: "வடிகட்டிகளுக்குப் பொருந்தும் திட்டங்கள் எதுவும் இல்லை."
  }
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
