const translations = {
  en: {
    // General
    dashboard: "Dashboard",
    newSettlement: "New Settlement",
    history: "History",
    workers: "Workers",
    reports: "Reports",
    thresherManager: "Thresher Manager",
    adminLogin: "Admin Login",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    loading: "Loading...",
    cropRecords: "Crop thresher financial records",
    signOut: "Sign Out",
    refresh: "Refresh",
    admin: "Admin",

    // Dashboard
    goodMorning: "SHASI'S THRESHER",
    organizeRecords:
      "Keep your thresher income, diesel and worker wages organized.",
    totalIncome: "Total Income",
    dieselExpense: "Diesel Expense",
    ownerProfit: "Owner Profit",
    workersPaidShare: "Workers Paid Share",
    recentSettlements: "Recent Settlements",
    latestRecords: "Latest saved work records",
    viewAll: "View All",
    noSettlements:
      "No settlements yet. Create your first daily settlement.",
    activeWorkers: "Active Workers",
    availableToday: "Available for today's selection",
    more: "more",
    workersLabel: "workers",
    unknownWorker: "Unknown Worker",

    // Daily settlement
    dailySettlement: "Daily Settlement",
    dailyWorkDetails: "Daily Work Details",
    enterIncome:
      "Enter today's thresher income and expenses.",
    workDate: "Work Date",
    totalIncomeRupees: "Total Income (₹)",
    dieselExpenseRupees: "Diesel Expense (₹)",
    notes: "Notes",
    optionalNotes:
      "Optional: crop, village, customer, tractor details...",
    selectWorkers: "Select Workers",
    selected: "selected",
    selectAll: "Select All",
    clear: "Clear",

    // Settlement preview
    settlementPreview: "Settlement Preview",
    calculatedAutomatically:
      "Calculated automatically before saving.",
    netAmount: "Net Amount",
    ownerShare: "Owner Share (50%)",
    workersShare: "Workers Share (50%)",
    eachWorker: "Each Worker",
    yourRule: "Your Rule",
    ruleDescription:
      "Income − diesel = net. Net is split equally between owner and workers. The workers' half is divided equally among today's selected workers.",
    saveSettlement: "Save Daily Settlement",
    saving: "Saving...",

    // History
    settlementHistory: "Settlement History",
    settlementHistoryTitle: "Settlement History",
    savedWorkDays: "saved work days",
    noSettlementRecords: "No settlement records yet.",
    date: "Date",
    income: "Income",
    diesel: "Diesel",
    net: "Net",
    owner: "Owner",
    workerCount: "Workers",
    workerShare: "Workers' Share",
    details: "Details",

    // Settlement details
    settlementDetails: "Settlement Details",
    workerWages: "Worker Wages",
    markedPaid: "marked paid",
    paid: "Paid",
    markPaid: "Mark Paid",
    deleteSettlement: "Delete Settlement",
    close: "Close",
    deleteSettlementConfirm:
      "Delete this settlement and all its worker wage records?",
    settlementDeleted: "Settlement deleted.",

    // Workers
    addWorker: "Add Worker",
    addWorkerDescription:
      "Add the people who can work on the thresher.",
    workerName: "Worker Name",
    phoneOptional: "Phone (Optional)",
    addWorkerButton: "Add Worker",
    adding: "Adding...",
    workerList: "Worker List",
    workersMasterList: "workers in master list",
    active: "Active",
    inactive: "Inactive",
    noPhone: "No phone number",
    delete: "Delete",
    workerAdded: "Worker added.",
    workerDeleted: "Worker deleted.",

    // Multilingual worker names
    workerNameEnglish: "English Name",
    workerNameTelugu: "Telugu Name",
    workerNameKannada: "Kannada Name",
    enterEnglishName: "Enter English name",
    enterTeluguName: "Enter Telugu name",
    enterKannadaName: "Enter Kannada name",

    // Reports
    workerReports: "Worker Reports",
    individualWorkerEarnings: "Individual Worker Earnings",
    allTimeEarnings: "Total earnings from all recorded work days",
    totalWorkDays: "Total Work Days",
    totalWorkers: "Total Workers",
    totalWorkerEarnings: "Total Worker Earnings",
    pendingWages: "Pending Wages",
    daysWorked: "Days Worked",
    totalEarnings: "Total Earnings",
    pending: "Pending",
    total: "TOTAL",
    noWorkerEarnings: "No worker earnings available yet.",
    day: "day",
    days: "days",
    workerNameReport: "Worker Name",

    // Validation / messages
    selectDate: "Select the work date.",
    enterTotalIncome: "Enter the total income.",
    dieselGreater:
      "Diesel expense cannot be greater than income.",
    selectAtLeastOne: "Select at least one worker.",
    settlementSaved: "Settlement saved successfully.",

    // Login note
    createAdmin:
      "Create the admin user from Supabase Dashboard → Authentication → Users.",

    // Common
    error: "Error"
  },

  te: {
    // General
    dashboard: "డాష్‌బోర్డ్",
    newSettlement: "కొత్త సెటిల్‌మెంట్",
    history: "చరిత్ర",
    workers: "కార్మికులు",
    reports: "రిపోర్టులు",
    thresherManager: "థ్రెషర్ మేనేజర్",
    adminLogin: "అడ్మిన్ లాగిన్",
    email: "ఈమెయిల్",
    password: "పాస్‌వర్డ్",
    signIn: "లాగిన్",
    signingIn: "లాగిన్ అవుతోంది...",
    loading: "లోడ్ అవుతోంది...",
    cropRecords: "థ్రెషర్ ఆర్థిక రికార్డులు",
    signOut: "లాగ్ అవుట్",
    refresh: "రిఫ్రెష్",
    admin: "అడ్మిన్",

    // Dashboard
    goodMorning: "శుభోదయం 👋",
    organizeRecords:
      "మీ థ్రెషర్ ఆదాయం, డీజిల్ మరియు కార్మికుల వేతనాలను క్రమబద్ధంగా నిర్వహించండి.",
    totalIncome: "మొత్తం ఆదాయం",
    dieselExpense: "డీజిల్ ఖర్చు",
    ownerProfit: "యజమాని లాభం",
    workersPaidShare: "కార్మికుల వాటా",
    recentSettlements: "ఇటీవలి సెటిల్‌మెంట్లు",
    latestRecords: "ఇటీవల సేవ్ చేసిన పని రికార్డులు",
    viewAll: "అన్నీ చూడండి",
    noSettlements:
      "ఇంకా సెటిల్‌మెంట్లు లేవు. మీ మొదటి రోజువారీ సెటిల్‌మెంట్‌ను సృష్టించండి.",
    activeWorkers: "యాక్టివ్ కార్మికులు",
    availableToday: "ఈరోజు ఎంపిక కోసం అందుబాటులో ఉన్నవారు",
    more: "మరిన్ని",
    workersLabel: "కార్మికులు",
    unknownWorker: "తెలియని కార్మికుడు",

    // Daily settlement
    dailySettlement: "రోజువారీ సెటిల్‌మెంట్",
    dailyWorkDetails: "రోజువారీ పని వివరాలు",
    enterIncome:
      "ఈరోజు థ్రెషర్ ఆదాయం మరియు ఖర్చులను నమోదు చేయండి.",
    workDate: "పని తేదీ",
    totalIncomeRupees: "మొత్తం ఆదాయం (₹)",
    dieselExpenseRupees: "డీజిల్ ఖర్చు (₹)",
    notes: "గమనికలు",
    optionalNotes:
      "ఐచ్ఛికం: పంట, గ్రామం, కస్టమర్, ట్రాక్టర్ వివరాలు...",
    selectWorkers: "కార్మికులను ఎంచుకోండి",
    selected: "ఎంపిక చేశారు",
    selectAll: "అందరినీ ఎంచుకోండి",
    clear: "క్లియర్",

    // Settlement preview
    settlementPreview: "సెటిల్‌మెంట్ వివరాలు",
    calculatedAutomatically:
      "సేవ్ చేయడానికి ముందు లెక్కలు ఆటోమేటిక్‌గా జరుగుతాయి.",
    netAmount: "నికర మొత్తం",
    ownerShare: "యజమాని వాటా (50%)",
    workersShare: "కార్మికుల వాటా (50%)",
    eachWorker: "ఒక్కో కార్మికుడు",
    yourRule: "మీ నియమం",
    ruleDescription:
      "ఆదాయం − డీజిల్ = నికర మొత్తం. నికర మొత్తాన్ని యజమాని మరియు కార్మికుల మధ్య సమానంగా పంచుతారు. కార్మికుల వాటాను ఆ రోజు ఎంపిక చేసిన కార్మికులందరికీ సమానంగా పంచుతారు.",
    saveSettlement: "రోజువారీ సెటిల్‌మెంట్ సేవ్ చేయండి",
    saving: "సేవ్ అవుతోంది...",

    // History
    settlementHistory: "సెటిల్‌మెంట్ చరిత్ర",
    settlementHistoryTitle: "సెటిల్‌మెంట్ చరిత్ర",
    savedWorkDays: "సేవ్ చేసిన పని రోజులు",
    noSettlementRecords: "ఇంకా సెటిల్‌మెంట్ రికార్డులు లేవు.",
    date: "తేదీ",
    income: "ఆదాయం",
    diesel: "డీజిల్",
    net: "నికర మొత్తం",
    owner: "యజమాని",
    workerCount: "కార్మికులు",
    workerShare: "కార్మికుల వాటా",
    details: "వివరాలు",

    // Settlement details
    settlementDetails: "సెటిల్‌మెంట్ వివరాలు",
    workerWages: "కార్మికుల వేతనాలు",
    markedPaid: "చెల్లించినట్లు గుర్తించారు",
    paid: "చెల్లించారు",
    markPaid: "చెల్లించినట్లు గుర్తించండి",
    deleteSettlement: "సెటిల్‌మెంట్ తొలగించండి",
    close: "మూసివేయండి",
    deleteSettlementConfirm:
      "ఈ సెటిల్‌మెంట్ మరియు దానికి సంబంధించిన అన్ని కార్మికుల వేతన రికార్డులను తొలగించాలా?",
    settlementDeleted: "సెటిల్‌మెంట్ తొలగించబడింది.",

    // Workers
    addWorker: "కార్మికుడిని జోడించండి",
    addWorkerDescription:
      "థ్రెషర్‌పై పని చేసే కార్మికులను జోడించండి.",
    workerName: "కార్మికుడి పేరు",
    phoneOptional: "ఫోన్ (ఐచ్ఛికం)",
    addWorkerButton: "కార్మికుడిని జోడించండి",
    adding: "జోడిస్తోంది...",
    workerList: "కార్మికుల జాబితా",
    workersMasterList: "మాస్టర్ జాబితాలోని కార్మికులు",
    active: "యాక్టివ్",
    inactive: "ఇనాక్టివ్",
    noPhone: "ఫోన్ నంబర్ లేదు",
    delete: "తొలగించు",
    workerAdded: "కార్మికుడు జోడించబడ్డారు.",
    workerDeleted: "కార్మికుడు తొలగించబడ్డారు.",

    // Multilingual worker names
    workerNameEnglish: "ఇంగ్లీష్ పేరు",
    workerNameTelugu: "తెలుగు పేరు",
    workerNameKannada: "కన్నడ పేరు",
    enterEnglishName: "ఇంగ్లీష్ పేరు నమోదు చేయండి",
    enterTeluguName: "తెలుగు పేరు నమోదు చేయండి",
    enterKannadaName: "కన్నడ పేరు నమోదు చేయండి",

    // Reports
    workerReports: "కార్మికుల రిపోర్టులు",
    individualWorkerEarnings: "ప్రతి కార్మికుడి సంపాదన",
    allTimeEarnings:
      "రికార్డ్ చేసిన అన్ని పని రోజుల మొత్తం సంపాదన",
    totalWorkDays: "మొత్తం పని రోజులు",
    totalWorkers: "మొత్తం కార్మికులు",
    totalWorkerEarnings: "మొత్తం కార్మికుల సంపాదన",
    pendingWages: "చెల్లించాల్సిన వేతనాలు",
    daysWorked: "పని చేసిన రోజులు",
    totalEarnings: "మొత్తం సంపాదన",
    pending: "పెండింగ్",
    total: "మొత్తం",
    noWorkerEarnings: "ఇంకా కార్మికుల సంపాదన వివరాలు లేవు.",
    day: "రోజు",
    days: "రోజులు",
    workerNameReport: "కార్మికుడి పేరు",

    // Validation / messages
    selectDate: "పని తేదీని ఎంచుకోండి.",
    enterTotalIncome: "మొత్తం ఆదాయాన్ని నమోదు చేయండి.",
    dieselGreater:
      "డీజిల్ ఖర్చు ఆదాయం కంటే ఎక్కువగా ఉండకూడదు.",
    selectAtLeastOne: "కనీసం ఒక కార్మికుడిని ఎంచుకోండి.",
    settlementSaved: "సెటిల్‌మెంట్ విజయవంతంగా సేవ్ చేయబడింది.",

    // Login note
    createAdmin:
      "Supabase Dashboard → Authentication → Users నుండి అడ్మిన్ యూజర్‌ను సృష్టించండి.",

    error: "లోపం"
  },

  kn: {
    // General
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    newSettlement: "ಹೊಸ ಸೆಟಲ್‌ಮೆಂಟ್",
    history: "ಇತಿಹಾಸ",
    workers: "ಕಾರ್ಮಿಕರು",
    reports: "ವರದಿಗಳು",
    thresherManager: "ಥ್ರೆಶರ್ ಮ್ಯಾನೇಜರ್",
    adminLogin: "ಅಡ್ಮಿನ್ ಲಾಗಿನ್",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    signIn: "ಸೈನ್ ಇನ್",
    signingIn: "ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    cropRecords: "ಥ್ರೆಶರ್ ಹಣಕಾಸು ದಾಖಲೆಗಳು",
    signOut: "ಸೈನ್ ಔಟ್",
    refresh: "ರಿಫ್ರೆಶ್",
    admin: "ಅಡ್ಮಿನ್",

    // Dashboard
    goodMorning: "ಶುಭೋದಯ 👋",
    organizeRecords:
      "ನಿಮ್ಮ ಥ್ರೆಶರ್ ಆದಾಯ, ಡೀಸೆಲ್ ಮತ್ತು ಕಾರ್ಮಿಕರ ವೇತನಗಳನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ನಿರ್ವಹಿಸಿ.",
    totalIncome: "ಒಟ್ಟು ಆದಾಯ",
    dieselExpense: "ಡೀಸೆಲ್ ವೆಚ್ಚ",
    ownerProfit: "ಮಾಲೀಕರ ಲಾಭ",
    workersPaidShare: "ಕಾರ್ಮಿಕರ ಪಾಲು",
    recentSettlements: "ಇತ್ತೀಚಿನ ಸೆಟಲ್‌ಮೆಂಟ್‌ಗಳು",
    latestRecords: "ಇತ್ತೀಚೆಗೆ ಉಳಿಸಿದ ಕೆಲಸದ ದಾಖಲೆಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    noSettlements:
      "ಇನ್ನೂ ಯಾವುದೇ ಸೆಟಲ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ದೈನಂದಿನ ಸೆಟಲ್‌ಮೆಂಟ್ ರಚಿಸಿ.",
    activeWorkers: "ಸಕ್ರಿಯ ಕಾರ್ಮಿಕರು",
    availableToday: "ಇಂದಿನ ಆಯ್ಕೆಗಾಗಿ ಲಭ್ಯವಿರುವವರು",
    more: "ಹೆಚ್ಚು",
    workersLabel: "ಕಾರ್ಮಿಕರು",
    unknownWorker: "ಅಪರಿಚಿತ ಕಾರ್ಮಿಕ",

    // Daily settlement
    dailySettlement: "ದೈನಂದಿನ ಸೆಟಲ್‌ಮೆಂಟ್",
    dailyWorkDetails: "ದೈನಂದಿನ ಕೆಲಸದ ವಿವರಗಳು",
    enterIncome:
      "ಇಂದಿನ ಥ್ರೆಶರ್ ಆದಾಯ ಮತ್ತು ವೆಚ್ಚಗಳನ್ನು ನಮೂದಿಸಿ.",
    workDate: "ಕೆಲಸದ ದಿನಾಂಕ",
    totalIncomeRupees: "ಒಟ್ಟು ಆದಾಯ (₹)",
    dieselExpenseRupees: "ಡೀಸೆಲ್ ವೆಚ್ಚ (₹)",
    notes: "ಟಿಪ್ಪಣಿಗಳು",
    optionalNotes:
      "ಐಚ್ಛಿಕ: ಬೆಳೆ, ಗ್ರಾಮ, ಗ್ರಾಹಕ, ಟ್ರ್ಯಾಕ್ಟರ್ ವಿವರಗಳು...",
    selectWorkers: "ಕಾರ್ಮಿಕರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selected: "ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ",
    selectAll: "ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ",
    clear: "ಕ್ಲಿಯರ್",

    // Settlement preview
    settlementPreview: "ಸೆಟಲ್‌ಮೆಂಟ್ ವಿವರಗಳು",
    calculatedAutomatically:
      "ಉಳಿಸುವ ಮೊದಲು ಲೆಕ್ಕಾಚಾರವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮಾಡಲಾಗುತ್ತದೆ.",
    netAmount: "ನಿವ್ವಳ ಮೊತ್ತ",
    ownerShare: "ಮಾಲೀಕರ ಪಾಲು (50%)",
    workersShare: "ಕಾರ್ಮಿಕರ ಪಾಲು (50%)",
    eachWorker: "ಪ್ರತಿ ಕಾರ್ಮಿಕ",
    yourRule: "ನಿಮ್ಮ ನಿಯಮ",
    ruleDescription:
      "ಆದಾಯ − ಡೀಸೆಲ್ = ನಿವ್ವಳ ಮೊತ್ತ. ನಿವ್ವಳ ಮೊತ್ತವನ್ನು ಮಾಲೀಕರು ಮತ್ತು ಕಾರ್ಮಿಕರ ನಡುವೆ ಸಮವಾಗಿ ಹಂಚಲಾಗುತ್ತದೆ. ಕಾರ್ಮಿಕರ ಪಾಲನ್ನು ಆ ದಿನ ಆಯ್ಕೆ ಮಾಡಿದ ಎಲ್ಲಾ ಕಾರ್ಮಿಕರಿಗೆ ಸಮವಾಗಿ ಹಂಚಲಾಗುತ್ತದೆ.",
    saveSettlement: "ದೈನಂದಿನ ಸೆಟಲ್‌ಮೆಂಟ್ ಉಳಿಸಿ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",

    // History
    settlementHistory: "ಸೆಟಲ್‌ಮೆಂಟ್ ಇತಿಹಾಸ",
    settlementHistoryTitle: "ಸೆಟಲ್‌ಮೆಂಟ್ ಇತಿಹಾಸ",
    savedWorkDays: "ಉಳಿಸಿದ ಕೆಲಸದ ದಿನಗಳು",
    noSettlementRecords: "ಇನ್ನೂ ಯಾವುದೇ ಸೆಟಲ್‌ಮೆಂಟ್ ದಾಖಲೆಗಳಿಲ್ಲ.",
    date: "ದಿನಾಂಕ",
    income: "ಆದಾಯ",
    diesel: "ಡೀಸೆಲ್",
    net: "ನಿವ್ವಳ",
    owner: "ಮಾಲೀಕರು",
    workerCount: "ಕಾರ್ಮಿಕರು",
    workerShare: "ಕಾರ್ಮಿಕರ ಪಾಲು",
    details: "ವಿವರಗಳು",

    // Settlement details
    settlementDetails: "ಸೆಟಲ್‌ಮೆಂಟ್ ವಿವರಗಳು",
    workerWages: "ಕಾರ್ಮಿಕರ ವೇತನಗಳು",
    markedPaid: "ಪಾವತಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ",
    paid: "ಪಾವತಿಸಲಾಗಿದೆ",
    markPaid: "ಪಾವತಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    deleteSettlement: "ಸೆಟಲ್‌ಮೆಂಟ್ ಅಳಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    deleteSettlementConfirm:
      "ಈ ಸೆಟಲ್‌ಮೆಂಟ್ ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಕಾರ್ಮಿಕರ ವೇತನ ದಾಖಲೆಗಳನ್ನು ಅಳಿಸಬೇಕೇ?",
    settlementDeleted: "ಸೆಟಲ್‌ಮೆಂಟ್ ಅಳಿಸಲಾಗಿದೆ.",

    // Workers
    addWorker: "ಕಾರ್ಮಿಕರನ್ನು ಸೇರಿಸಿ",
    addWorkerDescription:
      "ಥ್ರೆಶರ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುವ ಕಾರ್ಮಿಕರನ್ನು ಸೇರಿಸಿ.",
    workerName: "ಕಾರ್ಮಿಕರ ಹೆಸರು",
    phoneOptional: "ಫೋನ್ (ಐಚ್ಛಿಕ)",
    addWorkerButton: "ಕಾರ್ಮಿಕರನ್ನು ಸೇರಿಸಿ",
    adding: "ಸೇರಿಸಲಾಗುತ್ತಿದೆ...",
    workerList: "ಕಾರ್ಮಿಕರ ಪಟ್ಟಿ",
    workersMasterList: "ಮಾಸ್ಟರ್ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಕಾರ್ಮಿಕರು",
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
    noPhone: "ಫೋನ್ ಸಂಖ್ಯೆ ಇಲ್ಲ",
    delete: "ಅಳಿಸಿ",
    workerAdded: "ಕಾರ್ಮಿಕರನ್ನು ಸೇರಿಸಲಾಗಿದೆ.",
    workerDeleted: "ಕಾರ್ಮಿಕರನ್ನು ಅಳಿಸಲಾಗಿದೆ.",

    // Multilingual worker names
    workerNameEnglish: "ಇಂಗ್ಲಿಷ್ ಹೆಸರು",
    workerNameTelugu: "ತೆಲುಗು ಹೆಸರು",
    workerNameKannada: "ಕನ್ನಡ ಹೆಸರು",
    enterEnglishName: "ಇಂಗ್ಲಿಷ್ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    enterTeluguName: "ತೆಲುಗು ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    enterKannadaName: "ಕನ್ನಡ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",

    // Reports
    workerReports: "ಕಾರ್ಮಿಕರ ವರದಿಗಳು",
    individualWorkerEarnings: "ಪ್ರತಿ ಕಾರ್ಮಿಕರ ಆದಾಯ",
    allTimeEarnings:
      "ದಾಖಲಾದ ಎಲ್ಲಾ ಕೆಲಸದ ದಿನಗಳ ಒಟ್ಟು ಆದಾಯ",
    totalWorkDays: "ಒಟ್ಟು ಕೆಲಸದ ದಿನಗಳು",
    totalWorkers: "ಒಟ್ಟು ಕಾರ್ಮಿಕರು",
    totalWorkerEarnings: "ಒಟ್ಟು ಕಾರ್ಮಿಕರ ಆದಾಯ",
    pendingWages: "ಬಾಕಿ ವೇತನ",
    daysWorked: "ಕೆಲಸ ಮಾಡಿದ ದಿನಗಳು",
    totalEarnings: "ಒಟ್ಟು ಆದಾಯ",
    pending: "ಬಾಕಿ",
    total: "ಒಟ್ಟು",
    noWorkerEarnings: "ಇನ್ನೂ ಯಾವುದೇ ಕಾರ್ಮಿಕರ ಆದಾಯದ ವಿವರಗಳಿಲ್ಲ.",
    day: "ದಿನ",
    days: "ದಿನಗಳು",
    workerNameReport: "ಕಾರ್ಮಿಕರ ಹೆಸರು",

    // Validation / messages
    selectDate: "ಕೆಲಸದ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    enterTotalIncome: "ಒಟ್ಟು ಆದಾಯವನ್ನು ನಮೂದಿಸಿ.",
    dieselGreater:
      "ಡೀಸೆಲ್ ವೆಚ್ಚವು ಆದಾಯಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬಾರದು.",
    selectAtLeastOne: "ಕನಿಷ್ಠ ಒಬ್ಬ ಕಾರ್ಮಿಕರನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    settlementSaved: "ಸೆಟಲ್‌ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",

    // Login note
    createAdmin:
      "Supabase Dashboard → Authentication → Users ನಿಂದ ಅಡ್ಮಿನ್ ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ.",

    error: "ದೋಷ"
  }
};

export function getLanguage() {
  return localStorage.getItem("thresher-language") || "en";
}

export function setLanguage(language) {
  localStorage.setItem("thresher-language", language);
}

export function t(language, key) {
  return translations[language]?.[key] || translations.en[key] || key;
}