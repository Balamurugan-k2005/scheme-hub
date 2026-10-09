package com.schemehub.backend.config;

import com.schemehub.backend.entity.*;
import com.schemehub.backend.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private EligibilityRuleRepository eligibilityRuleRepository;

    @Autowired
    private RequiredDocumentRepository requiredDocumentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsersAndProfiles();
        }
        if (schemeRepository.count() < 20) {
            log.info("Seeding comprehensive Government Schemes catalog into MySQL database...");
            seedComprehensiveSchemes();
            log.info("Successfully seeded catalog! Total schemes in database: {}", schemeRepository.count());
        }
    }

    private void seedUsersAndProfiles() {
        // 1. Create Admin
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@schemehub.gov.in")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        // 2. Create Scheme Manager
        User manager = User.builder()
                .username("manager")
                .password(passwordEncoder.encode("manager123"))
                .email("manager@schemehub.gov.in")
                .role(Role.SCHEME_MANAGER)
                .build();
        userRepository.save(manager);

        // 3. Create standard Citizen
        User citizen = User.builder()
                .username("citizen")
                .password(passwordEncoder.encode("citizen123"))
                .email("citizen@gmail.com")
                .role(Role.USER)
                .build();
        userRepository.save(citizen);

        // 4. Create Profile for Citizen
        Profile profile = Profile.builder()
                .user(citizen)
                .age(22)
                .gender("MALE")
                .state("Tamil Nadu")
                .district("Chennai")
                .annualIncome(180000.0)
                .occupation("STUDENT")
                .education("GRADUATE")
                .caste("OBC")
                .disabilityStatus(false)
                .familyMembers(4)
                .isFarmer(false)
                .isStudent(true)
                .isBusinessOwner(false)
                .build();
        profileRepository.save(profile);
    }

    private void seedComprehensiveSchemes() {
        // ==========================================
        // 1. AGRICULTURE & FARMERS
        // ==========================================
        createScheme(
                "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
                "பிஎம்-கிசான் (பிரதான் மந்திரி கிசான் சம்மன் நிதி)",
                "Central sector scheme to provide income support to all landholding farmer families across India for agricultural inputs.",
                "देश भर के सभी भूमिधारक किसान परिवारों को कृषि इनपुट के लिए वित्तीय सहायता।",
                "அனைத்து நிலம் வைத்துள்ள விவசாய குடும்பங்களுக்கும் ஆண்டுக்கு ₹6,000 நிதி உதவி வழங்கும் மத்திய அரசு திட்டம்.",
                "Small and marginal farmers holding cultivable land registered in their name.",
                "Financial assistance of ₹6,000 per year, paid in three equal installments of ₹2,000 directly into bank accounts.",
                "6000",
                "https://pmkisan.gov.in/",
                "Ministry of Agriculture and Farmers Welfare",
                "AGRICULTURE",
                "FARMERS",
                true,
                null,
                LocalDate.now().plusMonths(12),
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be at least 18 years old"),
                        new RuleSeed("isFarmer", RuleOperator.EQ, "true", true, "Applicant must be a registered agricultural farmer")
                ),
                List.of("Aadhaar Card", "Land Ownership Record (Khata/Patta)", "Bank Passbook")
        );

        createScheme(
                "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "प्रधानमंत्री फसल बीमा योजना",
                "பிரதான் மந்திரி பயிர் காப்பீட்டுத் திட்டம்",
                "Comprehensive crop insurance scheme protecting farmers against non-preventable natural risks from pre-sowing to post-harvest.",
                "प्राकृतिक आपदाओं से फसल नुकसान के खिलाफ किसानों को वित्तीय सहायता और बीमा सुरक्षा।",
                "இயற்கை பேரிடரால் பயிர் சேதமடையும் போது விவசாயிகளுக்கு காப்பீட்டு இழப்பீடு வழங்கும் திட்டம்.",
                "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
                "Full insured sum for crop loss with minimal premium (2% Kharif, 1.5% Rabi).",
                "15000",
                "https://pmfby.gov.in/",
                "Ministry of Agriculture and Farmers Welfare",
                "AGRICULTURE",
                "FARMERS",
                true,
                null,
                LocalDate.now().plusMonths(8),
                List.of(
                        new RuleSeed("isFarmer", RuleOperator.EQ, "true", true, "Must be an active cultivating farmer")
                ),
                List.of("Aadhaar Card", "Sowing Certificate / Adangal", "Land Possession Certificate", "Bank Account Details")
        );

        createScheme(
                "Kisan Credit Card (KCC) Scheme",
                "किसान क्रेडिट कार्ड योजना",
                "கிசான் கடன் அட்டை திட்டம்",
                "Provides timely short-term institutional credit to farmers for agricultural needs and allied activities at subsidized interest rates.",
                "किसानों को खेती और संबद्ध गतिविधियों के लिए रियायती ब्याज दर पर ऋण उपलब्ध कराना।",
                "விவசாயிகள் பயிர் சாகுபடி செலவுகளுக்காக குறைந்த வட்டியில் கடன் பெற உதவும் திட்டம்.",
                "Individual or joint farmers, tenant farmers, and self-help groups engaged in agriculture or animal husbandry.",
                "Credit limit up to ₹3,00,000 at an effective interest rate of 4% per annum.",
                "#annualIncome < 300000 ? 50000 : 25000",
                "https://agricoop.nic.in/",
                "Ministry of Agriculture and Farmers Welfare",
                "AGRICULTURE",
                "FARMERS",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be between 18 and 75 years"),
                        new RuleSeed("isFarmer", RuleOperator.EQ, "true", true, "Applicant must be engaged in farming or allied activities")
                ),
                List.of("Aadhaar Card", "Land Record Documents", "Passport Photo", "PAN Card")
        );

        // ==========================================
        // 2. EDUCATION & STUDENTS
        // ==========================================
        createScheme(
                "Post Matric Scholarship for OBC / SC / ST Students",
                "ओबीसी/एससी/एसटी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति",
                "பிற்படுத்தப்பட்ட மற்றும் ஆதிதிராவிட மாணவர்களுக்கான போஸ்ட் மெட்ரிக் கல்வி உதவித்தொகை",
                "Financial assistance to students belonging to backward and marginalized categories pursuing post-matriculation or higher education.",
                "अनुसूचित जाति/जनजाति और अन्य पिछड़ा वर्ग के छात्रों को उच्च शिक्षा प्राप्त करने के लिए वित्तीय सहायता।",
                "பத்தாம் வகுப்புக்கு மேல் பயிலும் பிற்படுத்தப்பட்ட மற்றும் ஆதிதிராவிட மாணவர்களின் கல்வி கட்டணத்தை ஏற்கும் திட்டம்.",
                "OBC, SC, or ST students enrolled in recognized colleges or universities whose annual family income is within eligibility limits.",
                "100% tuition fee waiver and maintenance allowance up to ₹20,000 per year.",
                "#annualIncome < 150000 ? 25000 : 15000",
                "https://scholarships.gov.in/",
                "Ministry of Social Justice and Empowerment",
                "EDUCATION",
                "STUDENTS",
                true,
                null,
                LocalDate.now().plusMonths(4),
                List.of(
                        new RuleSeed("isStudent", RuleOperator.EQ, "true", true, "Must be a currently enrolled student"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "250000", true, "Annual family income must not exceed ₹2.5 Lakhs"),
                        new RuleSeed("caste", RuleOperator.IN, "OBC,SC,ST", true, "Applicant must belong to OBC, SC, or ST category")
                ),
                List.of("Community/Caste Certificate", "Income Certificate", "College Admission Bonafide", "Previous Year Marksheet", "Aadhaar Card")
        );

        createScheme(
                "National Means-cum-Merit Scholarship Scheme (NMMSS)",
                "राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना",
                "தேசிய வருவாய்வழி மற்றும் திறன் படிப்பு உதவித்தொகை திட்டம்",
                "Awards scholarships to meritorious students of economically weaker sections to arrest dropout rate at class VIII.",
                "आर्थिक रूप से कमजोर वर्ग के मेधावी छात्रों को आठवीं कक्षा में पढ़ाई छोड़ने से रोकने के लिए छात्रवृत्ति।",
                "பொருளாதாரத்தில் பின்தங்கிய திறமையான மாணவர்கள் பள்ளிக் கல்வியைத் தொடர மாதம் ₹1,000 உதவித்தொகை.",
                "Students studying in Class IX in Government or Aided schools with parental annual income below ₹3.5 Lakhs.",
                "Scholarship of ₹12,000 per annum (₹1,000 per month) for classes IX to XII.",
                "12000",
                "https://scholarships.gov.in/",
                "Department of School Education & Literacy, Ministry of Education",
                "EDUCATION",
                "STUDENTS",
                true,
                null,
                LocalDate.now().plusMonths(5),
                List.of(
                        new RuleSeed("isStudent", RuleOperator.EQ, "true", true, "Must be an active enrolled school student"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "350000", true, "Annual parental income must be under ₹3.5 Lakhs")
                ),
                List.of("Student School Identity Card", "Income Certificate", "Class VII/VIII Marksheet", "Bank Passbook")
        );

        createScheme(
                "Central Sector Scheme of Scholarship for College and University Students",
                "कॉलेज और विश्वविद्यालय के छात्रों के लिए छात्रवृत्ति की केंद्रीय क्षेत्र योजना",
                "கல்லூரி மற்றும் பல்கலைக்கழக மாணவர்களுக்கான மத்திய துறை உதவித்தொகை",
                "Provides financial support to meritorious students from low-income families to meet their day-to-day expenses while pursuing higher studies.",
                "उच्च शिक्षा प्राप्त करने वाले निम्न आय वर्ग के मेधावी छात्रों को वित्तीय सहायता।",
                "12ஆம் வகுப்பில் அதிக மதிப்பெண் பெற்று கல்லூரி செல்லும் மாணவர்களுக்கு ஆண்டுக்கு ₹12,000 முதல் ₹20,000 உதவித்தொகை.",
                "Students above 80th percentile in Class XII board exams with family income below ₹4.5 Lakhs per annum.",
                "₹12,000/year for graduation and ₹20,000/year for post-graduation studies.",
                "12000",
                "https://scholarships.gov.in/",
                "Department of Higher Education, Ministry of Education",
                "EDUCATION",
                "STUDENTS",
                true,
                null,
                LocalDate.now().plusMonths(3),
                List.of(
                        new RuleSeed("isStudent", RuleOperator.EQ, "true", true, "Must be enrolled in a regular graduate or post-graduate course"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "450000", true, "Annual family income must not exceed ₹4.5 Lakhs")
                ),
                List.of("Class XII Marksheet", "Income Certificate", "College Admission Bonafide", "Aadhaar Card", "Bank Account Details")
        );

        // ==========================================
        // 3. HEALTH & WELLNESS
        // ==========================================
        createScheme(
                "Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
                "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
                "ஆயுஷ்மான் பாரத் - பிரதம மந்திரி மக்கள் ஆரோக்கிய திட்டம்",
                "The world's largest government-funded health insurance scheme offering cashless treatment for secondary and tertiary hospitalization.",
                "द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख का कैशलेस स्वास्थ्य कवर।",
                "ஏழை எளிய குடும்பங்களுக்கு ஆண்டுக்கு ₹5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை வழங்கும் சுகாதார காப்பீட்டு திட்டம்.",
                "Families identified under the Socio-Economic Caste Census (SECC) or low-income criteria.",
                "Cashless medical treatment cover of up to ₹5,00,000 per family per year across 27,000+ empanelled hospitals.",
                "500000",
                "https://pmjay.gov.in/",
                "National Health Authority, Ministry of Health and Family Welfare",
                "HEALTH",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("annualIncome", RuleOperator.LTE, "500000", true, "Annual family income must be under ₹5.0 Lakhs")
                ),
                List.of("Ayushman Card / Ration Card", "Aadhaar Card", "Family Member ID Proof")
        );

        createScheme(
                "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
                "प्रधानमंत्री सुरक्षित मातृत्व अभियान",
                "பிரதான் மந்திரி தாய்மை பாதுகாப்பு இயக்கம்",
                "Guarantees comprehensive, quality antenatal care and health checkups to all pregnant women on the 9th of every month.",
                "गर्भवती महिलाओं को गुणवत्तापूर्ण प्रसव पूर्व देखभाल और मुफ्त स्वास्थ्य जांच।",
                "கர்ப்பிணிப் பெண்களுக்கு ஒவ்வொரு மாதமும் 9ஆம் தேதி இலவச மருத்துவ பரிசோதனை மற்றும் சத்துணவு மாத்திரைகள்.",
                "All pregnant women in their 2nd and 3rd trimesters visiting public health facilities.",
                "Free diagnostic tests, ultrasound, blood tests, and iron-folic acid nutritional supplements.",
                "3000",
                "https://pmsma.nhp.gov.in/",
                "Ministry of Health and Family Welfare",
                "HEALTH",
                "WOMEN",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be female")
                ),
                List.of("Mother and Child Protection (MCP) Card", "Aadhaar Card")
        );

        // ==========================================
        // 4. BANKING, FINANCIAL SERVICES & INSURANCE
        // ==========================================
        createScheme(
                "PM Mudra Yojana (PMMY)",
                "प्रधानमंत्री मुद्रा योजना",
                "பிரதான் மந்திரி முத்ரா கடன் திட்டம்",
                "Facilitates micro and small business loans up to ₹10 Lakhs without collateral for non-farm income-generating enterprises.",
                "गैर-कॉर्पोरेट, गैर-कृषि लघु और सूक्ष्म उद्यमों को ₹10 लाख तक का संपार्श्विक-मुक्त ऋण।",
                "சிறு தொழில் தொடங்குவதற்கும் விரிவுபடுத்துவதற்கும் ₹10 லட்சம் வரை பிணையமில்லா வங்கிக் கடன் வழங்கும் திட்டம்.",
                "Any Indian citizen having a viable business idea or running micro-enterprises in manufacturing, trading, or services.",
                "Collateral-free business credit (Shishu up to ₹50k, Kishore up to ₹5L, Tarun up to ₹10L) at low interest rates.",
                "50000",
                "https://www.mudra.org.in/",
                "Department of Financial Services, Ministry of Finance",
                "FINANCIAL",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be 18 years or older")
                ),
                List.of("Business Plan / Proposal", "Aadhaar Card", "PAN Card", "Bank Account Statement (6 months)", "Proof of Business Address")
        );

        createScheme(
                "Atal Pension Yojana (APY)",
                "अटल पेंशन योजना",
                "அடல் ஓய்வூதியத் திட்டம்",
                "Guaranteed monthly pension scheme for citizens working in the unorganized sector to secure their post-retirement life.",
                "असंगठित क्षेत्र के श्रमिकों के लिए 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 तक की गारंटीकृत मासिक पेंशन।",
                "அமைப்புசாரா தொழிலாளர்களுக்கு 60 வயதுக்கு பிறகு மாதம் ₹1,000 முதல் ₹5,000 வரை உறுதியான ஓய்வூதியம்.",
                "Indian citizens aged between 18 and 40 years holding a savings bank account and not income tax payers.",
                "Guaranteed monthly pension of ₹1,000 to ₹5,000 upon reaching 60 years of age based on contribution.",
                "60000",
                "https://www.npscra.nsdl.co.in/",
                "Pension Fund Regulatory and Development Authority (PFRDA)",
                "FINANCIAL",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Minimum entry age is 18 years"),
                        new RuleSeed("age", RuleOperator.LTE, "40", true, "Maximum entry age is 40 years")
                ),
                List.of("Savings Bank Account", "Aadhaar Card", "Mobile Number linked to Bank")
        );

        createScheme(
                "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
                "प्रधानमंत्री जीवन ज्योति बीमा योजना",
                "பிரதம மந்திரி ஆயுள் காப்பீட்டுத் திட்டம்",
                "One-year renewable life insurance scheme offering life cover for death due to any reason at an affordable premium.",
                "किसी भी कारण से मृत्यु होने पर ₹2 लाख का जीवन बीमा कवर, केवल ₹436 प्रति वर्ष के प्रीमियम पर।",
                "ஆண்டுக்கு ₹436 பிரீமியத்தில் எந்த காரணத்தினால் மரணம் அடைந்தாலும் ₹2 லட்சம் ஆயுள் காப்பீடு.",
                "All savings bank account holders between 18 and 50 years of age.",
                "Life risk coverage of ₹2,00,000 payable to nominee in case of death of the insured.",
                "200000",
                "https://financialservices.gov.in/",
                "Department of Financial Services, Ministry of Finance",
                "FINANCIAL",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be at least 18 years old"),
                        new RuleSeed("age", RuleOperator.LTE, "50", true, "Maximum enrollment age is 50 years")
                ),
                List.of("Aadhaar Card", "Bank Passbook / Auto-debit consent")
        );

        // ==========================================
        // 5. WOMEN & CHILD WELFARE
        // ==========================================
        createScheme(
                "Sukanya Samriddhi Yojana (SSY)",
                "सुकन्या समृद्धि योजना",
                "செல்வ மகள் சேமிப்புத் திட்டம் (சுகன்யா சம்ரித்தி)",
                "High-interest small deposit savings scheme for girl children to support their higher education and marriage expenses.",
                "बालिकाओं की उच्च शिक्षा और विवाह के लिए उच्च ब्याज दर वाली छोटी बचत योजना।",
                "பெண் குழந்தைகளின் எதிர்கால கல்வி மற்றும் திருமண செலவுகளுக்காக அதிக வட்டி வழங்கும் மத்திய அரசு சேமிப்பு திட்டம்.",
                "Parents or legal guardians of a girl child below 10 years of age.",
                "8.2% tax-free annual interest with complete Section 80C tax exemption on deposits.",
                "150000",
                "https://www.nsiindia.gov.in/",
                "Ministry of Finance",
                "WOMEN",
                "WOMEN",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", false, "Benefit target is girl child")
                ),
                List.of("Girl Child Birth Certificate", "Parent/Guardian Aadhaar Card", "Address Proof", "Passport Size Photos")
        );

        createScheme(
                "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
                "प्रधानमंत्री मातृ वंदना योजना",
                "பிரதான் மந்திரி மாத்ரு வந்தனா திட்டம்",
                "Direct cash maternity benefit incentive for pregnant women and lactating mothers for health and nutritional support.",
                "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को पोषण और स्वास्थ्य में सुधार के लिए ₹5,000 की नकद सहायता।",
                "கர்ப்பிணி தாய்மார்களுக்கு முதல் பிரசவத்திற்கு ஊட்டச்சத்து மற்றும் மருத்துவ செலவிற்காக ₹5,000 நிதி உதவி.",
                "Pregnant women and lactating mothers for their first living child.",
                "Direct cash benefit of ₹5,000 transferred in installments into beneficiary bank accounts.",
                "5000",
                "https://pmmvy.wcd.gov.in/",
                "Ministry of Women and Child Development",
                "WOMEN",
                "WOMEN",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be female"),
                        new RuleSeed("age", RuleOperator.GTE, "19", true, "Applicant must be 19 years or older")
                ),
                List.of("Mother and Child Protection (MCP) Card", "Aadhaar Card of Mother & Husband", "Bank Account Passbook")
        );

        // ==========================================
        // 6. HOUSING & SHELTER
        // ==========================================
        createScheme(
                "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
                "प्रधानमंत्री आवास योजना - ग्रामीण",
                "பிரதமர் ஊரக வீட்டு வசதி திட்டம் (பிஎம்ஏஒய்-ஜி)",
                "Provides financial assistance to rural homeless families and those living in kutcha/dilapidated houses to build pucca homes.",
                "ग्रामीण क्षेत्रों में बेघर और कच्चे घरों में रहने वाले परिवारों को पक्का मकान बनाने के लिए वित्तीय सहायता।",
                "கிராமப்புற ஏழை எளிய மக்களுக்கு அடிப்படை வசதிகளுடன் கூடிய கான்கிரீட் வீடு கட்ட ₹1.20 லட்சம் மானியம்.",
                "Rural households with no pucca house and annual family income within BPL/EWS thresholds.",
                "Direct financial grant of ₹1,20,000 in plains and ₹1,30,000 in hilly areas + 90 days of MGNREGA wages.",
                "120000",
                "https://pmayg.nic.in/",
                "Ministry of Rural Development",
                "HOUSING",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("annualIncome", RuleOperator.LTE, "300000", true, "Family income must be below ₹3.0 Lakhs per annum")
                ),
                List.of("Aadhaar Card", "Ration / BPL Card", "Land / Site Document", "Bank Account Details", "MGNREGA Job Card")
        );

        createScheme(
                "PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi)",
                "पीएम स्वनिधि योजना",
                "பிஎம் ஸ்வநிதி (தெருவோர வியாபாரிகள் கடன் திட்டம்)",
                "Special micro-credit facility providing affordable working capital loans to urban street vendors to resume livelihoods.",
                "शहरी रेहड़ी-पटरी विक्रेताओं को अपना व्यवसाय फिर से शुरू करने के लिए किफायती कार्यशील पूंजी ऋण।",
                "தெருவோர வியாபாரிகள் தொழில் நடத்த ₹10,000 முதல் ₹50,000 வரை பிணையமில்லா கடனுதவி மற்றும் 7% வட்டி மானியம்.",
                "Street vendors / hawkers vending in urban or peri-urban areas holding Vending Certificates / ID cards.",
                "Initial collateral-free loan of ₹10,000 with 7% interest subsidy, upgrading up to ₹50,000 on timely repayment.",
                "10000",
                "https://pmsvanidhi.mohua.gov.in/",
                "Ministry of Housing and Urban Affairs",
                "HOUSING",
                "BUSINESS",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be 18 years or older")
                ),
                List.of("Urban Local Body Vending Certificate / ID", "Aadhaar Card", "Bank Account Details")
        );

        // ==========================================
        // 7. UTILITIES, ENERGY & SANITATION
        // ==========================================
        createScheme(
                "PM Surya Ghar: Muft Bijli Yojana",
                "पीएम सूर्य घर: मुफ्त बिजली योजना",
                "பிரதமர் சூரிய இல்லம்: இலவச மின்சாரத் திட்டம்",
                "National solar rooftop mission providing capital subsidy up to ₹78,000 to residential households to install solar power.",
                "आवासीय घरों के लिए छत पर सौर पैनल लगाने हेतु ₹78,000 तक की सरकारी सब्सिडी और 300 यूनिट तक मुफ्त बिजली।",
                "வீடுகளில் சோலார் தகடுகள் அமைத்து மாதம் 300 யூனிட் வரை இலவச மின்சாரம் மற்றும் ₹78,000 அரசு மானியம்.",
                "Residential households possessing a domestic electricity connection with suitable shadow-free rooftop area.",
                "Direct central capital subsidy of ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW systems.",
                "#annualIncome < 300000 ? 78000 : 60000",
                "https://pmsuryaghar.gov.in/",
                "Ministry of New and Renewable Energy",
                "UTILITY",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be 18 years or older")
                ),
                List.of("Latest Domestic Electricity Bill", "Aadhaar Card", "Rooftop Ownership Document", "Bank Passbook")
        );

        createScheme(
                "Pradhan Mantri Ujjwala Yojana (PMUY 2.0)",
                "प्रधानमंत्री उज्ज्वला योजना 2.0",
                "பிரதான் மந்திரி உஜ்வாலா திட்டம் (இலவச எரிவாயு இணைப்பு)",
                "Provides deposit-free LPG gas connections to adult women from economically poor households to promote clean cooking fuel.",
                "गरीब ग्रामीण और शहरी परिवारों की वयस्क महिलाओं को मुफ्त एलपीजी गैस कनेक्शन और पहली रिफिल।",
                "ஏழை எளிய குடும்பங்களைச் சேர்ந்த பெண்களுக்கு இலவச சமையல் எரிவாயு (LPG) இணைப்பு மற்றும் அடுப்பு வழங்கும் திட்டம்.",
                "Adult women belonging to SC/ST/BPL/EWS households with no existing LPG connection in the family.",
                "Free LPG connection + first stove + first refill voucher completely free of charge.",
                "3500",
                "https://pmuy.gov.in/",
                "Ministry of Petroleum and Natural Gas",
                "UTILITY",
                "WOMEN",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be female head of household"),
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be 18 years or older"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "200000", true, "Annual income must be below ₹2.0 Lakhs")
                ),
                List.of("Ration Card / BPL Proof", "Aadhaar Card", "Bank Account Passbook", "Address Proof")
        );

        // ==========================================
        // 8. SKILLS, EMPLOYMENT & ENTREPRENEURSHIP
        // ==========================================
        createScheme(
                "PM Vishwakarma Scheme",
                "पीएम विश्वकर्मा योजना",
                "பிரதமர் விஸ்வகர்மா திட்டம்",
                "End-to-end holistic support for traditional artisans and craftspersons across 18 trades with skill training, toolkits, and collateral-free credit.",
                "पारंपरिक कारीगरों और शिल्पकारों को कौशल प्रशिक्षण, ₹15,000 का टूलकिट और 5% ब्याज पर ₹3 लाख तक का ऋण।",
                "பாரம்பரிய கைவினைஞர்களுக்கு திறன் பயிற்சி, ₹15,000 மதிப்பிலான நவீன உபகரணங்கள் மற்றும் ₹3 லட்சம் வரை குறைந்த வட்டி கடன்.",
                "Artisans and craftspersons engaged in 18 designated family-based traditional trades aged 18+.",
                "Skill training stipend ₹500/day + ₹15,000 toolkit voucher + collateral-free enterprise loan up to ₹3,00,000 at 5% interest.",
                "15000",
                "https://pmvishwakarma.gov.in/",
                "Ministry of Micro, Small and Medium Enterprises (MSME)",
                "BUSINESS",
                "ALL",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "18", true, "Applicant must be at least 18 years old")
                ),
                List.of("Aadhaar Card", "Traditional Trade Skill Proof / Artisan ID", "Bank Account Passbook")
        );

        createScheme(
                "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
                "प्रधानमंत्री कौशल विकास योजना",
                "பிரதம மந்திரி திறன் மேம்பாட்டு திட்டம்",
                "Flagship skill certification scheme of the Ministry of Skill Development to enable Indian youth to take up industry-relevant skill training.",
                "भारतीय युवाओं को उद्योग-प्रासंगिक कौशल प्रशिक्षण और निःशुल्क प्रमाणन प्रदान करना।",
                "இளைஞர்களுக்கு வேலைவாய்ப்புடன் கூடிய இலவச குறுகிய கால தொழிற்பயிற்சி மற்றும் மத்திய அரசு சான்றிதழ்.",
                "Any unemployed youth or school/college dropouts aged between 15 and 45 years.",
                "100% free industry training + government recognized NSQF skill certificate + job placement assistance.",
                "8000",
                "https://www.pmkvyofficial.org/",
                "Ministry of Skill Development and Entrepreneurship",
                "SKILLS",
                "STUDENTS",
                true,
                null,
                null,
                List.of(
                        new RuleSeed("age", RuleOperator.GTE, "15", true, "Minimum age requirement is 15 years"),
                        new RuleSeed("age", RuleOperator.LTE, "45", true, "Maximum age is 45 years")
                ),
                List.of("Aadhaar Card", "Educational Qualification Certificate", "Bank Account Details", "Passport Size Photos")
        );

        // ==========================================
        // 9. STATE SPECIFIC WELFARE SCHEMES
        // ==========================================

        // -- TAMIL NADU --
        createScheme(
                "Kalaignar Magalir Urimai Thittam (Tamil Nadu)",
                "कलैग्नार महिला अधिकार योजना (तमिलनाडु)",
                "கலைஞர் மகளிர் உரிமைத் திட்டம் (தமிழ்நாடு)",
                "Basic direct income financial assistance scheme by the Government of Tamil Nadu providing ₹1,000 monthly to eligible women heads of family.",
                "तमिलनाडु सरकार द्वारा पात्र महिला पारिवारिक मुखियाओं को ₹1,000 प्रति माह की प्रत्यक्ष आय सहायता।",
                "தமிழ்நாடு அரசின் மிக முக்கிய திட்டம் - தகுதியுள்ள குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 உரிமைத்தொகை வங்கி கணக்கில் வரவு.",
                "Women heads of family residing in Tamil Nadu with annual family income below ₹2,50,000 and electricity consumption under 3600 units.",
                "₹1,000 monthly direct cash transfer into bank account (₹12,000 per year).",
                "12000",
                "https://kmut.tn.gov.in/",
                "Special Programme Implementation Department, Tamil Nadu",
                "WOMEN",
                "WOMEN",
                false,
                "Tamil Nadu",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Tamil Nadu", true, "Must be a permanent resident of Tamil Nadu"),
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be a female family head"),
                        new RuleSeed("age", RuleOperator.GTE, "21", true, "Applicant must be 21 years or older"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "250000", true, "Annual family income must not exceed ₹2.5 Lakhs")
                ),
                List.of("Family Smart Card (Ration Card)", "Aadhaar Card", "Bank Account Passbook", "Electricity Consumer Card")
        );

        createScheme(
                "Pudhumai Penn Scheme (Moovalur Ramamirtham Higher Education)",
                "पुधुमई पेन योजना (तमिलनाडु उच्च शिक्षा)",
                "புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் உயர்கல்வித் திட்டம்)",
                "Monthly financial incentive of ₹1,000 to girl students who studied classes 6 to 12 in Tamil Nadu government schools to complete their college degrees.",
                "तमिलनाडु के सरकारी स्कूलों से कक्षा 6 से 12 तक पढ़ने वाली छात्राओं को कॉलेज की पढ़ाई के लिए ₹1,000 प्रति माह।",
                "அரசுப் பள்ளிகளில் 6 முதல் 12 ஆம் வகுப்பு வரை படித்து கல்லூரி செல்லும் மாணவிகளுக்கு மாதம் ₹1,000 உதவித்தொகை.",
                "Girl students studying undergraduate, diploma, or ITI courses who studied in Tamil Nadu Government Schools from 6th to 12th standard.",
                "₹1,000 per month deposited directly into student's bank account until graduation completion.",
                "12000",
                "https://www.pudhumaipenn.tn.gov.in/",
                "Social Welfare and Women Empowerment Department, Tamil Nadu",
                "EDUCATION",
                "STUDENTS",
                false,
                "Tamil Nadu",
                LocalDate.now().plusMonths(6),
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Tamil Nadu", true, "Applicant must reside in Tamil Nadu"),
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be female"),
                        new RuleSeed("isStudent", RuleOperator.EQ, "true", true, "Must be an active college/degree student")
                ),
                List.of("Government School Study Certificate (Class 6-12)", "College Admission Bonafide", "Aadhaar Card", "Student Bank Passbook")
        );

        // -- MAHARASHTRA --
        createScheme(
                "Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra)",
                "मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र)",
                "முதல்வர் மாஜி லட்கி பஹின் திட்டம் (மகாராஷ்டிரா)",
                "Direct financial assistance scheme by the Government of Maharashtra providing ₹1,500 monthly to eligible women aged 21-65 years.",
                "महाराष्ट्र सरकार द्वारा 21 से 65 वर्ष की पात्र महिलाओं को ₹1,500 प्रति माह की वित्तीय सहायता।",
                "மகாராஷ்டிரா அரசால் பெண்களுக்கு மாதம் ₹1,500 நிதி உதவி வழங்கும் திட்டம்.",
                "Married, widowed, divorced, or destitute women aged 21 to 65 residing in Maharashtra with annual family income below ₹2.5 Lakhs.",
                "Direct monthly cash support of ₹1,500 (₹18,000/year) into Aadhaar-linked bank account.",
                "18000",
                "https://ladakibahin.maharashtra.gov.in/",
                "Women and Child Development Department, Maharashtra",
                "WOMEN",
                "WOMEN",
                false,
                "Maharashtra",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Maharashtra", true, "Must reside in Maharashtra"),
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Must be a woman"),
                        new RuleSeed("age", RuleOperator.GTE, "21", true, "Minimum age is 21 years"),
                        new RuleSeed("age", RuleOperator.LTE, "65", true, "Maximum age is 65 years"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "250000", true, "Annual family income must not exceed ₹2.5 Lakhs")
                ),
                List.of("Aadhaar Card", "Maharashtra Domicile Certificate", "Ration Card (Yellow/Orange)", "Income Certificate", "Bank Passbook")
        );

        // -- UTTAR PRADESH --
        createScheme(
                "Mukhya Mantri Kanya Sumangala Yojana (Uttar Pradesh)",
                "मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)",
                "முதலமைச்சர் கன்யா சுமங்கலா திட்டம் (உத்தரப் பிரதேசம்)",
                "Financial assistance scheme of ₹25,000 in six phased milestones from birth to higher education for girl children in Uttar Pradesh.",
                "उत्तर प्रदेश में बालिकाओं के जन्म से लेकर उच्च शिक्षा तक 6 चरणों में ₹25,000 की वित्तीय सहायता।",
                "உத்தரபிரதேசத்தில் பெண் குழந்தையின் பிறப்பு முதல் பட்டப்படிப்பு வரை 6 கட்டங்களாக ₹25,000 வழங்கும் திட்டம்.",
                "Permanent residents of Uttar Pradesh with annual family income under ₹3.0 Lakhs having maximum two girl children in family.",
                "Total grant of ₹25,000 distributed across milestones (birth, vaccination, class 1, 6, 9, and college admission).",
                "25000",
                "https://mksy.up.gov.in/",
                "Women and Child Development Department, Uttar Pradesh",
                "WOMEN",
                "WOMEN",
                false,
                "Uttar Pradesh",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Uttar Pradesh", true, "Must be resident of Uttar Pradesh"),
                        new RuleSeed("annualIncome", RuleOperator.LTE, "300000", true, "Annual family income must be under ₹3.0 Lakhs")
                ),
                List.of("UP Domicile Certificate", "Income Certificate", "Girl Child Birth Certificate", "Aadhaar Card", "Bank Passbook")
        );

        // -- KARNATAKA --
        createScheme(
                "Gruha Lakshmi Scheme (Karnataka)",
                "गृह लक्ष्मी योजना (कर्नाटक)",
                "கிருஹ லக்ஷ்மி திட்டம் (கர்நாடகா)",
                "Guaranteed monthly direct benefit transfer of ₹2,000 to the female head of every eligible household in Karnataka.",
                "कर्नाटक में पात्र परिवारों की महिला मुखिया को प्रति माह ₹2,000 की सीधी वित्तीय सहायता।",
                "கர்நாடகாவில் குடும்பத் தலைவிகளுக்கு மாதம் ₹2,000 நிதி உதவி வழங்கும் திட்டம்.",
                "Women named as head of the family on Antyodaya, BPL, or APL ration cards in Karnataka.",
                "Direct benefit transfer of ₹2,000 per month (₹24,000 per year) into bank account.",
                "24000",
                "https://sevasindhu.karnataka.gov.in/",
                "Department of Women and Child Development, Karnataka",
                "WOMEN",
                "WOMEN",
                false,
                "Karnataka",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Karnataka", true, "Must reside in Karnataka"),
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Applicant must be female")
                ),
                List.of("Ration Card", "Aadhaar Card of Wife & Husband", "Aadhaar Linked Bank Account Details")
        );

        // -- TELANGANA & ANDHRA PRADESH --
        createScheme(
                "Rythu Bharosa / Rythu Bandhu Scheme (Telangana / AP)",
                "रायथू भरोसा / रायथू बंधु योजना",
                "ரைத்து பந்து / ரைத்து பரோசா திட்டம் (தெலுங்கானா / ஆந்திரா)",
                "Direct investment support scheme for agriculture and horticulture crops, providing financial aid per acre per season to farmers.",
                "किसानों को बीज, उर्वरक और कीटनाशकों की खरीद के लिए प्रति एकड़ प्रति वर्ष वित्तीय सहायता।",
                "விவசாயிகளுக்கு ஏக்கருக்கு ஆண்டுதோறும் நேரடி சாகுபடி உதவித்தொகை வழங்கும் திட்டம்.",
                "All landholding farmers possessing agricultural land in Telangana / Andhra Pradesh.",
                "Financial support of ₹10,000 to ₹15,000 per acre per year directly into bank account.",
                "15000",
                "https://rythubandhu.telangana.gov.in/",
                "Department of Agriculture, Telangana",
                "AGRICULTURE",
                "FARMERS",
                false,
                "Telangana",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.IN, "Telangana,Andhra Pradesh", true, "Must reside in Telangana or Andhra Pradesh"),
                        new RuleSeed("isFarmer", RuleOperator.EQ, "true", true, "Applicant must be an agricultural landowner")
                ),
                List.of("Pattadar Passbook / Land Ownership Document", "Aadhaar Card", "Bank Account Details")
        );

        // -- WEST BENGAL --
        createScheme(
                "Kanyashree Prakalpa (West Bengal)",
                "कन्याश्री प्रकल्प (पश्चिम बंगाल)",
                "கன்யாஸ்ரீ திட்டம் (மேற்கு வங்கம்)",
                "Conditional cash transfer scheme by the West Bengal Government to improve status and wellbeing of girl children by encouraging higher education and preventing child marriage.",
                "बालिकाओं की शिक्षा जारी रखने और बाल विवाह रोकने के लिए पश्चिम बंगाल सरकार की वित्तीय योजना।",
                "மேற்கு வங்காளத்தில் பெண் குழந்தைகளின் பள்ளிப் படிப்பை ஊக்குவிக்க ஆண்டுதோறும் உதவித்தொகை மற்றும் ₹25,000 ஒருமுறை மானியம்.",
                "Unmarried girl students aged 13-18 studying in recognized schools/institutions with family income up to ₹1.2 Lakhs.",
                "Annual scholarship of ₹1,000 (K1) and one-time grant of ₹25,000 (K2) upon turning 18.",
                "25000",
                "https://wbkanyashree.gov.in/",
                "Department of Women Development & Social Welfare, West Bengal",
                "WOMEN",
                "STUDENTS",
                false,
                "West Bengal",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "West Bengal", true, "Must be resident of West Bengal"),
                        new RuleSeed("gender", RuleOperator.EQ, "FEMALE", true, "Must be female student"),
                        new RuleSeed("isStudent", RuleOperator.EQ, "true", true, "Must be an enrolled student")
                ),
                List.of("School Bonafide Certificate", "Birth Certificate", "Unmarried Declaration", "Bank Account Passbook", "Aadhaar Card")
        );

        // -- KERALA --
        createScheme(
                "Medisep Health Insurance (Kerala)",
                "मेडिसेप स्वास्थ्य बीमा योजना (केरल)",
                "மெடிசெப் சுகாதார காப்பீட்டுத் திட்டம் (கேரளா)",
                "Comprehensive cashless health insurance scheme for government employees and pensioners in Kerala for medical emergencies.",
                "केरल में कर्मचारियों और पेंशनभोगियों के लिए कैशलेस स्वास्थ्य बीमा योजना।",
                "கேரள அரசு ஊழியர்கள் மற்றும் ஓய்வூதியதாரர்களுக்கான பணமில்லா மருத்துவ காப்பீட்டுத் திட்டம்.",
                "State government employees, pensioners, and their eligible dependent family members in Kerala.",
                "Cashless medical coverage up to ₹3,00,000 per year for basic package across empanelled hospitals.",
                "300000",
                "https://medisep.kerala.gov.in/",
                "Finance Department, Government of Kerala",
                "HEALTH",
                "ALL",
                false,
                "Kerala",
                null,
                List.of(
                        new RuleSeed("state", RuleOperator.EQ, "Kerala", true, "Must reside in Kerala")
                ),
                List.of("Medisep ID Card", "Employee/Pensioner ID Proof", "Aadhaar Card")
        );
    }

    private void createScheme(
            String nameEn, String nameHi, String nameTa,
            String descEn, String descHi, String descTa,
            String eligEn, String benefitEn, String benefitCalcExpr,
            String sourceUrl, String deptEn, String category, String beneficiary,
            boolean isCentral, String stateName, LocalDate deadline,
            List<RuleSeed> rules, List<String> documents
    ) {
        // Check duplicate
        if (schemeRepository.findAll().stream().anyMatch(s -> s.getNameEn().equalsIgnoreCase(nameEn.trim()))) {
            return;
        }

        Scheme scheme = Scheme.builder()
                .nameEn(nameEn)
                .nameHi(nameHi)
                .nameTa(nameTa)
                .descriptionEn(descEn)
                .descriptionHi(descHi)
                .descriptionTa(descTa)
                .eligibilityDescEn(eligEn)
                .benefitEn(benefitEn)
                .benefitCalculatorExpr(benefitCalcExpr)
                .officialSourceUrl(sourceUrl)
                .departmentEn(deptEn)
                .category(category)
                .beneficiaryType(beneficiary)
                .isCentral(isCentral)
                .stateName(stateName)
                .deadlineDate(deadline)
                .status("OPEN")
                .verifiedStatus(VerifiedStatus.VERIFIED)
                .viewsCount(120 + (int)(Math.random() * 850))
                .build();

        Scheme saved = schemeRepository.save(scheme);

        if (rules != null) {
            for (RuleSeed r : rules) {
                EligibilityRule rule = EligibilityRule.builder()
                        .scheme(saved)
                        .fieldName(r.fieldName)
                        .operator(r.operator)
                        .ruleValue(r.ruleValue)
                        .isCritical(r.isCritical)
                        .messageEn(r.messageEn)
                        .build();
                eligibilityRuleRepository.save(rule);
            }
        }

        if (documents != null) {
            for (String docName : documents) {
                RequiredDocument doc = RequiredDocument.builder()
                        .scheme(saved)
                        .documentNameEn(docName)
                        .isMandatory(true)
                        .build();
                requiredDocumentRepository.save(doc);
            }
        }
    }

    private static class RuleSeed {
        String fieldName;
        RuleOperator operator;
        String ruleValue;
        boolean isCritical;
        String messageEn;

        RuleSeed(String fieldName, RuleOperator operator, String ruleValue, boolean isCritical, String messageEn) {
            this.fieldName = fieldName;
            this.operator = operator;
            this.ruleValue = ruleValue;
            this.isCritical = isCritical;
            this.messageEn = messageEn;
        }
    }
}
