let userName = '';
let userAge = '';

// Application state
let currentStep = 0;
let currentQuestionIndex = 0;
let assessmentResponses = {};
let assessmentSteps = [];
let moodResult = {};
let primaryConcerns = [];

// Assessment data from the provided JSON
const assessmentData = {
    academic_stress: [
        {
            id: "exam_pressure",
            question: "How would you rate your current academic pressure level?",
            type: "scale",
            options: ["1 (No pressure)", "2", "3", "4", "5 (Moderate)", "6", "7", "8", "9", "10 (Extreme pressure)"]
        },
        {
            id: "upcoming_exams",
            question: "Do you have any important exams or tests coming up?",
            type: "multiple_choice",
            options: ["No upcoming exams", "Board exams within 6 months", "Competitive exams (JEE/NEET/etc.)", "University/college exams", "Regular school tests"]
        },
        {
            id: "career_uncertainty",
            question: "How uncertain do you feel about your career path?",
            type: "scale",
            options: ["1 (Very certain)", "2", "3", "4", "5 (Somewhat uncertain)", "6", "7", "8", "9", "10 (Completely lost)"]
        },
        {
            id: "academic_performance",
            question: "How do you feel about your current academic performance?",
            type: "multiple_choice",
            options: ["Exceeding expectations", "Meeting expectations", "Slightly below expectations", "Significantly below expectations", "Failing to meet any expectations"]
        }
    ],
    family_dynamics: [
        {
            id: "family_support",
            question: "How supportive is your family regarding your personal choices?",
            type: "scale",
            options: ["1 (Not supportive)", "2", "3", "4", "5 (Moderately supportive)", "6", "7", "8", "9", "10 (Very supportive)"]
        },
        {
            id: "family_pressure",
            question: "What type of family pressure do you experience most?",
            type: "multiple_choice",
            options: ["Academic performance pressure", "Career choice pressure", "Marriage-related pressure", "Financial burden concerns", "Cultural/traditional expectations", "No significant pressure"]
        },
        {
            id: "family_communication",
            question: "How comfortable are you discussing your problems with family?",
            type: "scale",
            options: ["1 (Never comfortable)", "2", "3", "4", "5 (Sometimes)", "6", "7", "8", "9", "10 (Always comfortable)"]
        },
        {
            id: "family_conflict",
            question: "How often do you experience conflicts with family members?",
            type: "multiple_choice",
            options: ["Never", "Rarely (once a month)", "Sometimes (weekly)", "Often (few times a week)", "Daily conflicts"]
        }
    ],
    social_personal: [
        {
            id: "social_isolation",
            question: "How often do you feel lonely or isolated?",
            type: "multiple_choice",
            options: ["Never", "Rarely", "Sometimes", "Often", "Almost always"]
        },
        {
            id: "peer_relationships",
            question: "How satisfied are you with your friendships and peer relationships?",
            type: "scale",
            options: ["1 (Very unsatisfied)", "2", "3", "4", "5 (Neutral)", "6", "7", "8", "9", "10 (Very satisfied)"]
        },
        {
            id: "self_esteem",
            question: "How would you rate your confidence and self-esteem lately?",
            type: "scale",
            options: ["1 (Very low)", "2", "3", "4", "5 (Average)", "6", "7", "8", "9", "10 (Very high)"]
        },
        {
            id: "future_anxiety",
            question: "How anxious do you feel about your future?",
            type: "scale",
            options: ["1 (Not anxious)", "2", "3", "4", "5 (Moderately anxious)", "6", "7", "8", "9", "10 (Extremely anxious)"]
        }
    ],
    physical_emotional: [
        {
            id: "sleep_quality",
            question: "How would you describe your sleep quality recently?",
            type: "multiple_choice",
            options: ["Excellent (7-8 hours, restful)", "Good (6-7 hours, mostly restful)", "Fair (5-6 hours, some difficulty)", "Poor (less than 5 hours, restless)", "Very poor (insomnia, frequent waking)"]
        },
        {
            id: "energy_levels",
            question: "How are your energy levels throughout the day?",
            type: "multiple_choice",
            options: ["High energy all day", "Good energy most of the day", "Moderate energy with some fatigue", "Low energy, frequent tiredness", "Exhausted most of the time"]
        },
        {
            id: "concentration",
            question: "How is your ability to concentrate on tasks?",
            type: "multiple_choice",
            options: ["Excellent focus", "Good focus most times", "Some difficulty concentrating", "Frequent concentration problems", "Unable to focus on anything"]
        },
        {
            id: "emotional_stability",
            question: "How stable have your emotions been lately?",
            type: "multiple_choice",
            options: ["Very stable, consistent mood", "Generally stable", "Some mood swings", "Frequent emotional ups and downs", "Extreme emotional instability"]
        }
    ],
    cultural_societal: [
        {
            id: "societal_expectations",
            question: "How much do societal expectations (what people think) affect your decisions?",
            type: "scale",
            options: ["1 (Not at all)", "2", "3", "4", "5 (Moderately)", "6", "7", "8", "9", "10 (Completely)"]
        },
        {
            id: "cultural_conflict",
            question: "Do you experience conflict between traditional values and your personal beliefs?",
            type: "multiple_choice",
            options: ["No conflict at all", "Minor conflicts occasionally", "Moderate conflicts regularly", "Significant conflicts often", "Major conflicts constantly"]
        },
        {
            id: "social_media_impact",
            question: "How does social media affect your mood and self-perception?",
            type: "multiple_choice",
            options: ["Positive impact", "No significant impact", "Sometimes negative", "Often makes me feel worse", "Very negative impact"]
        }
    ]
};

// Mood categories
const moodCategories = {
    excellent: {
        name: "Excellent Mental State",
        description: "You are doing very well – feeling happy, balanced, and productive. The goal here is to keep it that way by maintaining good habits.",
        color: "#f0f9f0",
        icon: "😊"
    },
    good: {
        name: "Good Mental State",
        description: "You are mostly fine but sometimes feel a little stressed. Focus on keeping balance and preventing stress from growing.",
        color: "#f0f8ff",
        icon: "🙂"
    },
    moderate_stress: {
        name: "Moderate Stress Level",
        description: "You are feeling stressed in a noticeable way. Focus on relaxing, sharing with others, and adding support.",
        color: "#fff8e1",
        icon: "😐"
    },
    high_stress: {
        name: "High Stress Level",
        description: "Stress feels very heavy and may be affecting sleep, focus, or emotions. You need strong coping skills and close monitoring.",
        color: "#fff3e0",
        icon: "😟"
    },
    crisis: {
        name: "Crisis Level - Immediate Support Needed",
        description: "This is a very serious stage. The person needs immediate professional help. Self-help alone is not enough.",
        color: "#fce4ec",
        icon: "😰"
    }
};

// YouTube videos by mood category
const youtubeVideos = {
    excellent: [
        {
            title: "6 Easy Habits to Elevate Your Mental Wellness",
            url: "https://www.youtube.com/watch?v=hlE2uL3m6W0"
        },
        {
            title: "Mental Wellness Playlist (Exercises, Tips & Techniques)",
            url: "https://www.youtube.com/playlist?list=PL-wiTtpoOGDuNbzxFb3f4XSNmpPr0vYjo"
        }
    ],
    good: [
        {
            title: "Atomic Habits for Mental Health",
            url: "https://www.youtube.com/watch?v=AOHT-YiOeQA"
        },
        {
            title: "Mental Wellness and Lifestyle | APA",
            url: "https://www.youtube.com/watch?v=0amLuVS343M"
        },
        {
            title: "Box Breathing Relaxation Technique",
            url: "https://www.youtube.com/watch?v=tEmt1Znux58"
        }
    ],
    moderate_stress: [
        {
            title: "5 Steps to Rapidly Reduce Stress",
            url: "https://www.youtube.com/watch?v=1WIHlVZcrzs"
        },
        {
            title: "Mindfulness & Meditation – A Grounding Exercise (Mayo Clinic)",
            url: "https://www.youtube.com/watch?v=t5LO8JaRszg"
        },
        {
            title: "Get Yourself Grounded With These 6 Simple Techniques",
            url: "https://www.youtube.com/watch?v=Z7C0v4GfUUI"
        }
    ],
    high_stress: [
        {
            title: "5 Steps For Crisis Intervention",
            url: "https://www.youtube.com/watch?v=j7tUQG1xc3o"
        },
        {
            title: "The 5-4-3-2-1 Method: A Grounding Exercise to Manage Anxiety",
            url: "https://www.youtube.com/watch?v=30VMIEmA114"
        },
        {
            title: "Grounding Exercise: Anxiety Skills #5",
            url: "https://www.youtube.com/watch?v=1ao4xdDK9iE"
        }
    ],
    crisis: [
        {
            title: "5 Steps For Crisis Intervention",
            url: "https://www.youtube.com/watch?v=j7tUQG1xc3o"
        },
        {
            title: "Grounding Exercise: Anxiety Skills #5",
            url: "https://www.youtube.com/watch?v=1ao4xdDK9iE"
        },
        {
            title: "Mental Health & Wellness: Taking Care of You",
            url: "https://www.youtube.com/watch?v=VXHTZ4KS2yU"
        }
    ]
};

// Recommendations database
const recommendations = {
    academic_stress: {
        immediate: [
            "Take a 10-minute break from studying every hour",
            "Practice deep breathing: 4 counts in, 4 counts hold, 4 counts out",
            "Write down your top 3 study priorities for today",
            "Remind yourself: 'I am more than my grades'"
        ],
        short_term: [
            "Create a realistic study schedule with breaks",
            "Talk to a teacher or counselor about your academic concerns",
            "Practice relaxation techniques before exams",
            "Set achievable daily study goals"
        ],
        long_term: [
            "Explore multiple career paths, not just traditional ones",
            "Build a support network of peers facing similar challenges",
            "Develop hobbies outside of academics for balance",
            "Consider professional counseling for exam anxiety"
        ]
    },
    family_dynamics: {
        immediate: [
            "Take space if family discussions become overwhelming",
            "Practice saying 'I need time to think about this'",
            "Remember that your happiness matters too",
            "Reach out to a trusted friend or relative"
        ],
        short_term: [
            "Plan a calm conversation with family about your feelings",
            "Find one family member who might understand your perspective",
            "Set small boundaries and communicate them respectfully",
            "Write down your thoughts before difficult conversations"
        ],
        long_term: [
            "Work on building mutual understanding with family",
            "Seek family counseling if conflicts are severe",
            "Develop independence while maintaining family relationships",
            "Find balance between family expectations and personal goals"
        ]
    },
    social_personal: {
        immediate: [
            "Reach out to one person today, even with a simple message",
            "Spend time in a public space like a library or park",
            "Call a friend or family member",
            "Join an online community related to your interests"
        ],
        short_term: [
            "Attend one social activity or event this week",
            "Join a club, sports team, or volunteer organization",
            "Practice social skills in low-pressure situations",
            "Set a goal to have one meaningful conversation daily"
        ],
        long_term: [
            "Work on building deep, meaningful friendships",
            "Address underlying social anxiety if present",
            "Develop confidence through personal interests and hobbies",
            "Consider therapy to work on social skills and self-esteem"
        ]
    },
    physical_emotional: {
        immediate: [
            "Take 5 deep breaths focusing on your exhale",
            "Do 10 minutes of light stretching or movement",
            "Drink a glass of water and have a healthy snack",
            "Step outside for fresh air, even if just for a few minutes"
        ],
        short_term: [
            "Establish a consistent sleep schedule with 7-8 hours nightly",
            "Incorporate 20-30 minutes of physical activity daily",
            "Practice mindfulness or meditation for 10 minutes daily",
            "Monitor and improve your eating habits"
        ],
        long_term: [
            "Build sustainable exercise habits that you enjoy",
            "Develop a strong sleep hygiene routine",
            "Learn stress management techniques like progressive muscle relaxation",
            "Consider professional help if physical symptoms persist"
        ]
    },
    cultural_societal: {
        immediate: [
            "Acknowledge that cultural conflicts are normal for young people",
            "Take time to understand both perspectives",
            "Practice self-compassion - you're navigating complex situations",
            "Connect with peers who face similar cultural challenges"
        ],
        short_term: [
            "Have respectful conversations with family about your viewpoints",
            "Find cultural mentors who've navigated similar conflicts",
            "Research successful people who've balanced tradition and modernity",
            "Practice expressing your beliefs assertively but respectfully"
        ],
        long_term: [
            "Develop a personal value system that honors both cultures",
            "Build a support network of culturally aware friends",
            "Consider cultural counseling to navigate identity conflicts",
            "Work on building bridges between traditional and modern values"
        ]
    },
    crisis_support: {
        immediate: [
            "Contact a crisis helpline immediately",
            "Reach out to a trusted adult or friend",
            "Remove any means of self-harm from your environment",
            "Stay with someone or go to a safe public place"
        ],
        helplines: [
            "Vandrevala Foundation: 9999666555 (24/7)",
            "AASRA: 022-27546669 (24/7)",
            "Sneha Foundation: 044-24640050 (24/7)",
            "National Suicide Prevention: 022-25521111"
        ]
    }
};

// Detailed recommendations for each mental state level
const detailedRecommendations = {
    excellent: {
        immediate: [
            "Do the 4-7-8 breathing exercise: inhale for 4 seconds, hold for 7, exhale for 8. Do this once after waking up and once before sleeping to stay calm and fresh.",
            "Share your good mood with a friend or family member. Talking positively helps you and also makes them happier.",
            "Write in a gratitude journal for 5 minutes: note down 2–3 things you are thankful for."
        ],
        short_term: [
            "Talk to loved ones twice this week and use \"I feel… I need…\" to express yourself (example: \"I feel tired, I need some quiet time\"). This builds strong bonds.",
            "Try the Pomodoro technique: study or learn something in 25-minute sessions with short breaks. Use this with a new hobby or skill.",
            "Join one group or online community related to your interest (coding, reading, etc.)."
        ],
        long_term: [
            "Talk with someone experienced (informational interview) to learn about future career or projects.",
            "Host a small family meeting to solve problems together and improve teamwork.",
            "Join a monthly mindfulness workshop or support group to strengthen your mental health further."
        ]
    },
    good: {
        immediate: [
            "Try Box Breathing: breathe in for 4 seconds, hold 4, out for 4, hold 4. Do this 5 times.",
            "Call a trusted friend and talk for a few minutes to feel connected.",
            "Listen to a short guided meditation to relax your mind."
        ],
        short_term: [
            "Use \"I\" statements with family to ask for support: \"I need quiet time to study.\" This avoids arguments.",
            "Try the Eisenhower Matrix: sort tasks into urgent–important vs not urgent–not important to manage time.",
            "Plan one social activity (outing or video call) with friends."
        ],
        long_term: [
            "Do a skills check and take an online course to grow in studies or career.",
            "Plan one family activity like a game night or outing.",
            "Attend 2 local workshops or group therapy sessions to share and learn from others."
        ]
    },
    moderate_stress: {
        immediate: [
            "Do Progressive Muscle Relaxation: tense and relax muscles from toes up to head.",
            "Write down 3 worries and then write 3 things you are thankful for. This balances your thinking.",
            "Take a 5-minute brisk walk to release stress."
        ],
        short_term: [
            "Write a letter or note to family explaining your stress and what kind of help you need.",
            "Use a Pomodoro schedule: study in 25 minutes, then take a 15-minute break.",
            "Join an online study or support group to not feel alone."
        ],
        long_term: [
            "Schedule 2 conversations with professionals or seniors to learn about future paths. Also, take a personality test to know yourself better.",
            "Have weekly family meetings where one member leads discussion. This shares responsibility.",
            "Go for counseling sessions (like CBT therapy) to learn tools for managing stress."
        ]
    },
    high_stress: {
        immediate: [
            "Do the Grounding Technique (5-4-3-2-1): name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. This calms racing thoughts.",
            "Call a support helpline (e.g., AASRA, Snehi) if you feel overwhelmed.",
            "Splash face with cold water to quickly reduce strong stress feelings."
        ],
        short_term: [
            "Sit with a family member for 10 minutes daily, where they just listen without judgment.",
            "Limit studies to 3 tasks per day with breaks, so pressure reduces.",
            "Do 1 community activity (half-day volunteering) to shift focus and feel useful."
        ],
        long_term: [
            "Try a shadowing opportunity (follow a senior or alum) to get fresh perspective.",
            "Use collaborative problem-solving with family to handle ongoing issues together.",
            "Write in a therapy journal and attend group support workshops for shared healing."
        ]
    },
    crisis: {
        immediate: [
            "Call emergency hotlines: AASRA (91-22-27546669), Snehi (91-22-25521111). Professional support is critical.",
            "Do 4-7-8 breathing only under guidance (to prevent panic).",
            "Enact a safety plan: remove any harmful items, stay with a trusted person, don\'t be alone."
        ],
        short_term: [
            "Have at least 2 daily check-ins with a mental health professional or trained volunteer.",
            "Follow a no-phone, rest-focused schedule with family support.",
            "Use \"Feel–Need\" statements to express yourself to supporters daily: \"I feel scared, I need someone nearby.\""
        ],
        long_term: [
            "Join an intensive therapy program with at least 8 sessions.",
            "Build a stable daily routine of sleep, healthy food, and light exercise.",
            "Review a safety plan every week with your support team."
        ]
    }
};

// Wellness tips
const wellnessTips = [
    "Practice gratitude by writing down 3 good things each day",
    "Maintain a regular sleep schedule, even on weekends",
    "Exercise for at least 30 minutes daily, even if it's just walking",
    "Limit social media use, especially comparison-heavy platforms",
    "Practice mindfulness or meditation for 10 minutes daily",
    "Eat regular, nutritious meals and stay hydrated",
    "Connect with nature by spending time outdoors",
    "Engage in activities you genuinely enjoy, not just productive ones",
    "Learn to say no to commitments that overwhelm you",
    "Seek professional help when self-help strategies aren't enough"
];

window.showUserInfoPopup = function() {
    const popup = document.getElementById('user-info-popup');
    if (popup) {
        popup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Disable the start button initially
        const startBtn = document.querySelector('#user-info-popup .btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
        }

        // Add event listeners to inputs for validation
        const nameInput = document.getElementById('user-name');
        const ageInput = document.getElementById('user-age');

        const validateInputs = function() {
            const name = nameInput.value.trim();
            const age = ageInput.value.trim();
            const isValid = name.length > 0 && age.length > 0 && !isNaN(age) && parseInt(age) > 0;

            if (startBtn) {
                startBtn.disabled = !isValid;
                startBtn.style.opacity = isValid ? '1' : '0.5';
                startBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
            }
        };

        nameInput.addEventListener('input', validateInputs);
        ageInput.addEventListener('input', validateInputs);
    }
};

window.startAssessmentWithUser = function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        // Automatically set user info from logged-in user
        userName = user.username || user.name || 'User';
        userAge = user.age || 18; // Default age if not available

        // Start assessment directly
        window.startAssessment();
    } else {
        // Fallback to popup if no user is logged in
        window.showUserInfoPopup();
    }
};

window.closeUserInfoPopup = function() {
    const popup = document.getElementById('user-info-popup');
    if (popup) {
        popup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

window.submitUserInfo = function() {
    const nameInput = document.getElementById('user-name');
    const ageInput = document.getElementById('user-age');

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();

    if (!name) {
        alert("Name is required to start the assessment.");
        return;
    }
    if (!age || isNaN(age)) {
        alert("Valid age is required to start the assessment.");
        return;
    }

    userName = name;
    userAge = age;

    closeUserInfoPopup();
    window.startAssessment();
};

// Navigation functions - Define these functions early and make them global immediately
window.startAssessment = function() {
    console.log('Starting assessment...');
    initializeAssessment();
    showPage('assessment-screen');
    updateAssessmentDisplay();
};

window.showPage = function(pageId) {
    console.log('Navigating to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Successfully showed page:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
};



window.previousQuestion = function() {
    console.log('Previous question clicked');
    if (currentQuestionIndex > 0) {
        // Move to previous question in current step
        currentQuestionIndex--;
    } else if (currentStep > 0) {
        // Move to previous step
        currentStep--;
        currentQuestionIndex = assessmentSteps[currentStep].questions.length - 1;
    }
    
    updateAssessmentDisplay();
};

window.selectOption = function(questionId, value, element) {
    console.log('Option selected:', questionId, value);
    
    // Remove previous selections
    const container = element.parentNode;
    container.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    // Add selection to current element
    element.classList.add('selected');
    
    // Store response
    assessmentResponses[questionId] = value;
    
    // Enable next button
    updateNavigationButtons();

    // Automatically go to next question after selection
    setTimeout(() => {
        window.nextQuestion();
    }, 300);
};

window.showRecommendationTab = function(tabName) {
    console.log('Showing recommendation tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.recommendation-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find the clicked button and make it active
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(tabName)) {
            btn.classList.add('active');
        }
    });
};

window.retakeAssessment = function() {
    if (confirm('Are you sure you want to retake the assessment? This will clear your current results.')) {
        showPage('welcome-screen');
    }
};

window.showResults = function() {
    showPage('results-screen');
};

window.showResources = function() {
    showPage('resources-screen');
};

window.downloadResults = function() {
    const assessmentId = generateUniqueId();
    const completionTime = new Date().toLocaleString();

    // Create professional PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPosition = 20;

    // Set up colors and fonts
    const primaryColor = [79, 70, 229]; // Indigo
    const secondaryColor = [107, 114, 128]; // Gray
    const accentColor = [16, 185, 129]; // Green

    // Header with professional branding
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Mental Wellness Assessment', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprehensive Mood Analysis for Indian Youth', 20, 30);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 60;

    // Assessment Information Box
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPosition - 5, 180, 35, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Assessment Information', 20, yPosition);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPosition += 10;
    doc.text(`Assessment ID: ${assessmentId}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Generated: ${completionTime}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Name: ${userName} | Age: ${userAge}`, 25, yPosition);
    yPosition += 20;

    // Mood Category Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('Mental Wellness Status', 20, yPosition);
    yPosition += 15;

    // Mood score box
    doc.setFillColor(...accentColor);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(20, yPosition - 3, 50, 15, 3, 3, 'F');
    doc.setFontSize(14);
    doc.text(`${moodResult.score}/100`, 30, yPosition + 5);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`${moodResult.icon} ${moodResult.name}`, 80, yPosition + 2);
    yPosition += 15;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const cleanDescription = personalizeDescription(moodResult.description);
    const descLines = doc.splitTextToSize(cleanDescription, 160);
    doc.text(descLines, 25, yPosition);
    yPosition += descLines.length * 5 + 10;

    // Strengths Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('Your Unique Strengths', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    getUniqueStrengths().split('\n').forEach(strength => {
        if (strength.trim()) {
            doc.text(`• ${strength}`, 25, yPosition);
            yPosition += 6;
        }
    });
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }

    // Personalized Recommendations Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('Personalized Action Plan', 20, yPosition);
    yPosition += 15;

    // Immediate Actions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('🚀 Immediate Actions (Next 24-48 hours)', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    getPersonalizedRecommendationsText('immediate').split('\n').forEach(rec => {
        if (rec.trim()) {
            // Remove only control characters except common punctuation and accented letters
            const cleanRec = rec.replace(/[\x00-\x1F\x7F]/g, '');
            const recLines = doc.splitTextToSize(cleanRec, 150);
            doc.text(recLines, 25, yPosition);
            yPosition += recLines.length * 5;
        }
    });
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
    }

    // Short-term Goals
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('📅 Short-Term Goals (Next 1-2 weeks)', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    getPersonalizedRecommendationsText('short_term').split('\n').forEach(rec => {
        if (rec.trim()) {
            // Remove only control characters except common punctuation and accented letters
            const cleanRec = rec.replace(/[\x00-\x1F\x7F]/g, '');
            const recLines = doc.splitTextToSize(cleanRec, 150);
            doc.text(recLines, 25, yPosition);
            yPosition += recLines.length * 5;
        }
    });
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
    }

    // Long-term Development
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('🎯 Long-Term Development (Next 1-3 months)', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    getPersonalizedRecommendationsText('long_term').split('\n').forEach(rec => {
        if (rec.trim()) {
            // Remove only control characters except common punctuation and accented letters
            const cleanRec = rec.replace(/[\x00-\x1F\x7F]/g, '');
            const recLines = doc.splitTextToSize(cleanRec, 150);
            doc.text(recLines, 25, yPosition);
            yPosition += recLines.length * 5;
        }
    });
    yPosition += 15;

    // Wellness Tips Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('💡 Wellness Tips for Your Journey', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    wellnessTips.slice(0, 4).forEach(tip => {
        // Remove only control characters except common punctuation and accented letters
        const cleanTip = tip.replace(/[\x00-\x1F\x7F]/g, '');
        const tipLines = doc.splitTextToSize(`• ${cleanTip}`, 150);
        doc.text(tipLines, 25, yPosition);
        yPosition += tipLines.length * 5;
    });
    yPosition += 15;

    // Crisis Support Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38); // Red for crisis
    doc.text('🚨 Crisis Support Resources', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const crisisResources = [
        'Vandrevala Foundation: 9999666555 (24/7)',
        'AASRA Mumbai: 022-27546669 (24/7)',
        'Sneha Foundation: 044-24640050 (24/7)',
        'National Suicide Prevention: 022-25521111'
    ];

    crisisResources.forEach(resource => {
        doc.text(`• ${resource}`, 25, yPosition);
        yPosition += 6;
    });
    yPosition += 15;

    // Professional Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 270, 210, 27, 'F');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    const disclaimer = 'This assessment is for informational purposes only and is not a substitute for professional medical advice. Results are based on self-reported responses and should be discussed with a qualified mental health professional for comprehensive support.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, 180);
    doc.text(disclaimerLines, 15, 280);

    // Assessment ID in footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Assessment ID: ${assessmentId}`, 15, 295);

    // Download PDF
    const pdfFileName = `Mental_Wellness_Assessment_${userName.replace(/\s+/g, '_')}_${assessmentId}.pdf`;
    doc.save(pdfFileName);

    // Store results in localStorage
    const resultsData = {
        assessmentId,
        completionTime,
        moodResult,
        primaryConcerns,
        recommendations: {
            immediate: getPersonalizedRecommendationsText('immediate'),
            short_term: getPersonalizedRecommendationsText('short_term'),
            long_term: getPersonalizedRecommendationsText('long_term')
        },
        strengths: getUniqueStrengths(),
        wellnessTips: wellnessTips.slice(0, 4)
    };

    let storedResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
    storedResults.push(resultsData);
    localStorage.setItem('assessmentResults', JSON.stringify(storedResults));

    alert(`Professional assessment report downloaded as "${pdfFileName}" and stored locally!`);
};

function getUniqueStrengths() {
    const strengths = [];
    if (assessmentResponses.self_esteem && parseInt(assessmentResponses.self_esteem) >= 7) {
        strengths.push("- Strong self-confidence and self-worth");
    }
    if (assessmentResponses.family_communication && parseInt(assessmentResponses.family_communication) >= 7) {
        strengths.push("- Effective family communication skills");
    }
    if (assessmentResponses.peer_relationships && parseInt(assessmentResponses.peer_relationships) >= 7) {
        strengths.push("- Healthy social connections and friendships");
    }
    if (assessmentResponses.energy_levels && assessmentResponses.energy_levels.includes('High')) {
        strengths.push("- Good physical energy and vitality");
    }
    if (strengths.length === 0) {
        strengths.push("- Resilience and willingness to seek self-improvement");
        strengths.push("- Active engagement with personal mental health");
    }
    // Remove only control characters except common punctuation and accented letters
    return strengths.join('\n').replace(/[\x00-\x1F\x7F]/g, '');
}

function getPersonalizedRecommendationsText(timeframe) {
    let recommendationsList = detailedRecommendations[moodResult.category]?.[timeframe] || [];

return [...new Set(recommendationsList)].slice(0, 3).map(rec => `- ${rec}`).join('\n').replace(/[\x00-\x1F\x7F]/g, '');
}

function personalizeDescription(description) {
    // Simple personalization - could be expanded
    return description;
}

function getPersonalizedInsight(category) {
    // Simple insight based on category
    const insights = {
        academic_stress: "Focus on study-life balance",
        family_dynamics: "Open communication is key",
        social_personal: "Building connections helps",
        physical_emotional: "Self-care is important",
        cultural_societal: "Cultural identity is valuable"
    };
    return insights[category] || "Seek professional guidance";
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Crisis modal functions
window.showCrisisModal = function() {
    console.log('Showing crisis modal');
    const modal = document.getElementById('crisis-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCrisisModal = function() {
    console.log('Closing crisis modal');
    const modal = document.getElementById('crisis-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

// Initialize assessment steps
function initializeAssessment() {
    console.log('Initializing assessment');
    assessmentSteps = [
        { name: 'Academic Stress Assessment', questions: assessmentData.academic_stress },
        { name: 'Family Dynamics Assessment', questions: assessmentData.family_dynamics },
        { name: 'Social & Personal Assessment', questions: assessmentData.social_personal },
        { name: 'Physical & Emotional Assessment', questions: assessmentData.physical_emotional },
        { name: 'Cultural & Societal Assessment', questions: assessmentData.cultural_societal }
    ];
    
    currentStep = 0;
    currentQuestionIndex = 0;
    assessmentResponses = {};
}

function updateAssessmentDisplay() {
    updateProgressBar();
    updateStepInfo();
    displayCurrentQuestion();
}

function updateProgressBar() {
    const totalQuestions = 20; // 5 steps * 4 questions each
    const questionsPerStep = 4;
    const currentQuestionNumber = currentStep * questionsPerStep + currentQuestionIndex + 1;
    const progress = (currentQuestionNumber / totalQuestions) * 100;

    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function updateStepInfo() {
    const stepCounter = document.getElementById('step-counter');
    const stepTitle = document.getElementById('step-title');
    
    if (stepCounter) {
        // Display current question number within the step as well
        const currentQuestionNumber = currentQuestionIndex + 1;
        const totalQuestions = assessmentSteps[currentStep].questions.length;
        stepCounter.textContent = `Step ${currentStep + 1} of ${assessmentSteps.length} - Question ${currentQuestionNumber} of ${totalQuestions}`;
    }
    
    if (stepTitle) {
        stepTitle.textContent = assessmentSteps[currentStep].name;
    }
}

function displayCurrentQuestion() {
    const container = document.getElementById('question-container');
    if (!container) return;
    
    const currentStepData = assessmentSteps[currentStep];
    const question = currentStepData.questions[currentQuestionIndex];
    
    container.innerHTML = `
        <div class="question">
            <h4>${question.question}</h4>
            <div class="question-options" id="question-options">
                ${generateQuestionOptions(question)}
            </div>
        </div>
    `;
    
    updateNavigationButtons();
}

function generateQuestionOptions(question) {
    if (question.type === 'scale') {
        return `
            <div class="scale-options">
                ${question.options.map((option, index) => `
                    <button class="scale-btn" onclick="selectOption('${question.id}', ${index + 1}, this)" data-value="${index + 1}">
                        ${index + 1}
                    </button>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
                <span>${question.options[0]}</span>
                <span>${question.options[question.options.length - 1]}</span>
            </div>
        `;
    } else {
        return question.options.map((option, index) => `
            <button class="option-btn" onclick="selectOption('${question.id}', '${option}', this)" data-value="${option}">
                ${option}
            </button>
        `).join('');
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentStep === 0 && currentQuestionIndex === 0;
    }

    // Remove any existing validation messages since Next button is removed
    const validationMessage = document.getElementById('validation-message');
    if (validationMessage) {
        validationMessage.remove();
    }
}

function validateAssessmentCompletion() {
    for (let step of assessmentSteps) {
        for (let question of step.questions) {
            if (!assessmentResponses.hasOwnProperty(question.id)) {
                alert('Please complete all questions before finishing the assessment.');
                return false;
            }
        }
    }
    return true;
}

window.nextQuestion = function() {
    console.log('Next question triggered');
    const currentStepData = assessmentSteps[currentStep];
    
    // Check if current question is answered (for manual navigation if needed)
    const currentQuestion = currentStepData.questions[currentQuestionIndex];
    if (!assessmentResponses.hasOwnProperty(currentQuestion.id)) {
        console.log('Current question not answered, cannot proceed');
        return;
    }
    
    if (currentQuestionIndex < currentStepData.questions.length - 1) {
        // Move to next question in current step
        currentQuestionIndex++;
    } else if (currentStep < assessmentSteps.length - 1) {
        // Move to next step
        currentStep++;
        currentQuestionIndex = 0;
    } else {
        // Assessment complete
        if (validateAssessmentCompletion()) {
            completeAssessment();
        }
        return;
    }
    
    updateAssessmentDisplay();
};

function completeAssessment() {
    console.log('Assessment completed');
    calculateMoodResult();
    identifyPrimaryConcerns();
    showPage('results-screen');
    displayResults();
}

function calculateMoodResult() {
    let totalScore = 0;
    let maxScore = 0;
    let categoryScores = {
        academic_stress: 0,
        family_dynamics: 0,
        social_personal: 0,
        physical_emotional: 0,
        cultural_societal: 0
    };
    
    // Calculate scores for each category
    Object.keys(assessmentData).forEach(category => {
        const questions = assessmentData[category];
        let categoryScore = 0;
        let categoryMax = 0;
        
        questions.forEach(question => {
            const response = assessmentResponses[question.id];
            if (response !== undefined) {
                let score = 0;
                let questionMax = 0;
                
                if (question.type === 'scale') {
                    score = parseInt(response);
                    questionMax = 10;
                    
                    // Reverse scoring for positive questions
                    if (question.id === 'family_support' || question.id === 'peer_relationships' || 
                        question.id === 'self_esteem' || question.id === 'family_communication') {
                        score = 11 - score; // Reverse scale
                    }
                } else {
                    // Multiple choice questions
                    const optionIndex = question.options.indexOf(response);
                    questionMax = question.options.length - 1;
                    
                    // Score based on severity (higher index = more concerning)
                    score = optionIndex;
                }
                
                categoryScore += score;
                categoryMax += questionMax;
            }
        });
        
        // Normalize to 0-100 scale
        categoryScores[category] = categoryMax > 0 ? (categoryScore / categoryMax) * 100 : 0;
        totalScore += categoryScore;
        maxScore += categoryMax;
    });
    
    // Calculate overall score (reverse it so higher = better)
    const overallScore = maxScore > 0 ? 100 - ((totalScore / maxScore) * 100) : 100;
    
    // Determine mood category
    let moodCategory = 'excellent';
    if (overallScore >= 85) {
        moodCategory = 'excellent';
    } else if (overallScore >= 70) {
        moodCategory = 'good';
    } else if (overallScore >= 50) {
        moodCategory = 'moderate_stress';
    } else if (overallScore >= 30) {
        moodCategory = 'high_stress';
    } else {
        moodCategory = 'crisis';
    }
    
    moodResult = {
        category: moodCategory,
        score: Math.round(overallScore),
        categoryScores: categoryScores,
        ...moodCategories[moodCategory]
    };
}

function identifyPrimaryConcerns() {
    primaryConcerns = [];
    const threshold = 60; // Scores above this indicate concern
    
    Object.keys(moodResult.categoryScores).forEach(category => {
        if (moodResult.categoryScores[category] > threshold) {
            const concernName = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            primaryConcerns.push({
                category: category,
                name: concernName,
                score: Math.round(moodResult.categoryScores[category])
            });
        }
    });
    
    // Sort by severity
    primaryConcerns.sort((a, b) => b.score - a.score);
}

function displayResults() {
    // Update mood display
    const moodIcon = document.getElementById('mood-icon');
    const moodCategory = document.getElementById('mood-category');
    const moodDescription = document.getElementById('mood-description');
    const moodScore = document.getElementById('mood-score');
    const resultsScreen = document.getElementById('results-screen');
    
    if (moodIcon) moodIcon.textContent = moodResult.icon;
    if (moodCategory) moodCategory.textContent = moodResult.name;
    if (moodDescription) moodDescription.textContent = moodResult.description.replace(/[^\x20-\x7E]/g, '');
    if (moodScore) moodScore.textContent = `${moodResult.score}/100`;

    // Change background color of results page based on mood category color
    if (resultsScreen) {
        resultsScreen.style.backgroundColor = moodResult.color;
        // Optional: adjust text color for contrast if needed
        if (moodResult.color === '#ef4444') { // red for crisis
            resultsScreen.style.color = '#fff';
        } else {
            resultsScreen.style.color = '#000';
        }
    }
    
    // Display primary concerns
    const concernsList = document.getElementById('concerns-list');
    if (concernsList) {
        if (primaryConcerns.length > 0) {
            concernsList.innerHTML = primaryConcerns.map(concern => 
                `<span class="concern-tag">${concern.name} (${concern.score}%)</span>`
            ).join('');
        } else {
            concernsList.innerHTML = '<span style="color: var(--color-success);">No major concerns identified</span>';
        }
    }
    
    // Generate and display recommendations
    generateRecommendations();
    displayWellnessTips();

    // Display YouTube videos based on mood category
    const videosContainer = document.getElementById('youtube-videos');
    if (videosContainer) {
        const videos = youtubeVideos[moodResult.category] || [];
        if (videos.length > 0) {
            videosContainer.innerHTML = videos.map(video => `
                <div class="video-item">
                    <a href="${video.url}" target="_blank" rel="noopener noreferrer">${video.title}</a>
                </div>
            `).join('');
        } else {
            videosContainer.innerHTML = '<p>No videos available for this mental state.</p>';
        }
    }
}

function generateRecommendations() {
    const timeframes = ['immediate', 'short_term', 'long_term'];
    
    timeframes.forEach(timeframe => {
        const container = document.getElementById(`${timeframe.replace('_', '-')}-recommendations`);
        if (!container) return;
        
        let recommendationsList = detailedRecommendations[moodResult.category]?.[timeframe] || [];

        
        // Remove duplicates and limit to 5 recommendations
        recommendationsList = [...new Set(recommendationsList)].slice(0, 5);
        
        container.innerHTML = `
            <ul class="recommendations-list">
                ${recommendationsList.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;
    });
}

function displayWellnessTips() {
    const container = document.getElementById('wellness-tips-list');
    if (!container) return;
    
    // Select 5 random wellness tips
    const selectedTips = wellnessTips.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    container.innerHTML = selectedTips.map(tip => 
        `<div class="wellness-tip">${tip}</div>`
    ).join('');
}

// Check authentication on page load
function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // No user logged in, redirect to registration
        window.location.href = 'register.html';
        return false;
    }

    // User is authenticated, show welcome screen
    console.log('User authenticated:', JSON.parse(currentUser));
    return true;
}

// Logout function
window.logout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

// Dark Mode Toggle Functionality
function initializeDarkMode() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    if (!toggleButton || !toggleIcon) return;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply saved theme or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
        toggleButton.classList.add('dark');
    } else {
        toggleIcon.textContent = '🌙';
        toggleButton.classList.remove('dark');
    }

    // Toggle function
    function toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        const newTheme = isDark ? 'dark' : 'light';

        // Update icon and button appearance
        if (isDark) {
            toggleIcon.textContent = '☀️';
            toggleButton.classList.add('dark');
        } else {
            toggleIcon.textContent = '🌙';
            toggleButton.classList.remove('dark');
        }

        // Save preference
        localStorage.setItem('theme', newTheme);
    }

    // Add event listener
    toggleButton.addEventListener('click', toggleDarkMode);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Mental Wellness Assessment');

    // Initialize dark mode toggle
    initializeDarkMode();

    // Open Demo button functionality
    const openDemoBtn = document.getElementById('open-demo-btn');
    if (openDemoBtn) {
        openDemoBtn.addEventListener('click', function() {
            const demoUser = {
                username: 'Demo User',
                email: 'demo@example.com',
                provider: 'demo'
            };
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            showPage('welcome-screen');
        });
    }

    // Create tooltip element for recommendation hover
    let recommendationTooltip = document.createElement('div');
    recommendationTooltip.id = 'recommendation-tooltip';
    recommendationTooltip.style.position = 'absolute';
    recommendationTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    recommendationTooltip.style.color = '#fff';
    recommendationTooltip.style.padding = '8px';
    recommendationTooltip.style.borderRadius = '4px';
    recommendationTooltip.style.fontSize = '12px';
    recommendationTooltip.style.maxWidth = '300px';
    recommendationTooltip.style.zIndex = '1000';
    recommendationTooltip.style.display = 'none';
    recommendationTooltip.style.pointerEvents = 'none';
    document.body.appendChild(recommendationTooltip);

    // Add hover event listeners to recommendation tab buttons
    function showTooltip(event) {
        const tabName = event.target.getAttribute('data-tab');
        if (!tabName) return;

        // Get recommendations for the hovered tab
        const timeframe = tabName.replace('-', '_');
        const recommendationsList = detailedRecommendations[moodResult.category]?.[timeframe] || [];
        if (recommendationsList.length === 0) {
            recommendationTooltip.style.display = 'none';
            return;
        }

        // Build tooltip content as a list
        const content = '<strong>' + event.target.textContent + '</strong><br><ul style="margin: 4px 0 0 16px; padding: 0;">' +
            recommendationsList.map(rec => `<li>${rec}</li>`).join('') + '</ul>';

        recommendationTooltip.innerHTML = content;

        // Position tooltip near the hovered element
        const rect = event.target.getBoundingClientRect();
        recommendationTooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        recommendationTooltip.style.left = (rect.left + window.scrollX) + 'px';
        recommendationTooltip.style.display = 'block';
    }

    function hideTooltip() {
        recommendationTooltip.style.display = 'none';
    }

    // Attach listeners after DOM is ready
    setTimeout(() => {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.setAttribute('data-tab', btn.id ? btn.id.replace('-tab-btn', '') : '');
            btn.addEventListener('mouseenter', showTooltip);
            btn.addEventListener('mouseleave', hideTooltip);
        });
    }, 500);

    // Check if user is authenticated
    if (!checkAuthentication()) {
        // Show login screen if not authenticated
        showPage('login-screen');
        return; // Redirect handled in checkAuthentication
    }

    // Disable right-click and left-click on non-interactive elements during assessment
    document.addEventListener('contextmenu', function(e) {
        const assessmentScreen = document.getElementById('assessment-screen');
        if (assessmentScreen && assessmentScreen.classList.contains('active')) {
            e.preventDefault();
        }
    });

    document.addEventListener('click', function(e) {
        const assessmentScreen = document.getElementById('assessment-screen');
        if (assessmentScreen && assessmentScreen.classList.contains('active')) {
            // Allow clicks only on buttons, inputs, and options
            if (!(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('option') || e.target.closest('.assessment-navigation'))) {
                e.preventDefault();
            }
        }
    });

    // Set up modal close listeners
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('crisis-modal');
        if (event.target === modal) {
            closeCrisisModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('crisis-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeCrisisModal();
            }
        }
    });

    // Login form functionality
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const demoLoginBtn = document.getElementById('demo-login-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            loginError.textContent = '';

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value;

            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showPage('welcome-screen');
            } else {
                loginError.textContent = 'Invalid email or password.';
            }
        });
    }

    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', function() {
            const demoUser = {
                email: 'demo@example.com',
                name: 'Demo User',
                age: 25,
                gender: 'Other'
            };
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            showPage('welcome-screen');
        });
    }

    // Chatbot toggle
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotQuestions = document.getElementById('chatbot-questions');
    const chatbotAnswer = document.getElementById('chatbot-answer');

    chatbotButton.addEventListener('click', () => {
        if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
            chatbotWindow.style.display = 'block';
        } else {
            chatbotWindow.style.display = 'none';
            chatbotAnswer.textContent = '';
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
        chatbotAnswer.textContent = '';
    });

    chatbotQuestions.addEventListener('click', (event) => {
        if (event.target.classList.contains('question-item')) {
            const answer = event.target.getAttribute('data-answer');
            chatbotAnswer.textContent = answer;
        }
    });

    console.log('Mental Wellness Assessment loaded successfully');
});
