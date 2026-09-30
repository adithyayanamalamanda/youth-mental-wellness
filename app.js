// MindCare Assessment Application Logic
// Cultural Youth Mental Wellness Assessment with Google Material Symbols

let userName = 'Anonymous';
let userAge = 'Youth';

// Application state
let currentStep = 0;
let currentQuestionIndex = 0;
let assessmentResponses = {};
let assessmentSteps = [];
let moodResult = {};
let primaryConcerns = [];
let previousScreenId = 'welcome-screen';

// Category Google Material Icons
const categoryIcons = {
    academic_stress: "school",
    family_dynamics: "family_restroom",
    social_personal: "diversity_3",
    physical_emotional: "spa",
    cultural_societal: "public"
};

// Assessment data
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
            options: ["No upcoming exams", "Board exams within 6 months", "Competitive exams (JEE/NEET/CUET/GATE)", "University / College semester exams", "Regular school / internal tests"]
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
            options: ["Exceeding my goals", "Meeting expectations", "Slightly below expectations", "Significantly below expectations", "Struggling to meet expectations"]
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
            options: ["Academic performance pressure", "Career choice pressure", "Marriage & life timeline expectations", "Financial burden concerns", "Cultural & traditional norms", "No significant pressure"]
        },
        {
            id: "family_communication",
            question: "How comfortable are you discussing your personal worries with family?",
            type: "scale",
            options: ["1 (Never comfortable)", "2", "3", "4", "5 (Sometimes)", "6", "7", "8", "9", "10 (Always comfortable)"]
        },
        {
            id: "family_conflict",
            question: "How often do you experience conflicts or arguments with family members?",
            type: "multiple_choice",
            options: ["Never or rarely", "Occasionally (monthly)", "Sometimes (weekly)", "Frequent (multiple times a week)", "Daily intense conflicts"]
        }
    ],
    social_personal: [
        {
            id: "social_isolation",
            question: "How often do you feel lonely or emotionally isolated?",
            type: "multiple_choice",
            options: ["Rarely or never", "Occasionally", "Sometimes", "Often", "Almost every day"]
        },
        {
            id: "peer_relationships",
            question: "How satisfied are you with your friendships and peer connections?",
            type: "scale",
            options: ["1 (Very unsatisfied)", "2", "3", "4", "5 (Neutral)", "6", "7", "8", "9", "10 (Very satisfied)"]
        },
        {
            id: "self_esteem",
            question: "How would you rate your confidence and self-worth lately?",
            type: "scale",
            options: ["1 (Very low)", "2", "3", "4", "5 (Average)", "6", "7", "8", "9", "10 (Very high)"]
        },
        {
            id: "future_anxiety",
            question: "How anxious do you feel when thinking about your future?",
            type: "scale",
            options: ["1 (Calm / optimistic)", "2", "3", "4", "5 (Moderately anxious)", "6", "7", "8", "9", "10 (Extremely anxious)"]
        }
    ],
    physical_emotional: [
        {
            id: "sleep_quality",
            question: "How would you describe your sleep quality and pattern recently?",
            type: "multiple_choice",
            options: ["Restful & consistent (7-8 hrs)", "Good (6-7 hrs)", "Fair (frequent waking or delays)", "Poor (less than 5 hrs)", "Severely disturbed / Insomnia"]
        },
        {
            id: "energy_levels",
            question: "How are your daily physical energy and motivation levels?",
            type: "multiple_choice",
            options: ["High and sustained all day", "Good energy most of the day", "Moderate energy with occasional fatigue", "Low energy, constantly drained", "Chronically exhausted"]
        },
        {
            id: "concentration",
            question: "How is your ability to maintain focus and concentrate on tasks?",
            type: "multiple_choice",
            options: ["Sharp & clear focus", "Generally good focus", "Easily distracted at times", "Frequent brain fog & difficulty", "Unable to concentrate on anything"]
        },
        {
            id: "emotional_stability",
            question: "How stable have your mood and emotions been recently?",
            type: "multiple_choice",
            options: ["Very stable & positive", "Generally calm", "Occasional mood swings", "Frequent emotional ups and downs", "Overwhelming swings / numbness"]
        }
    ],
    cultural_societal: [
        {
            id: "societal_expectations",
            question: "How much does worry over social perception ('Log kya kahenge') influence you?",
            type: "scale",
            options: ["1 (Not at all)", "2", "3", "4", "5 (Moderately)", "6", "7", "8", "9", "10 (Completely)"]
        },
        {
            id: "cultural_conflict",
            question: "Do you experience inner conflict between traditional expectations and your own values?",
            type: "multiple_choice",
            options: ["No conflict at all", "Minor occasional friction", "Moderate regular friction", "Significant frequent conflict", "Intense constant conflict"]
        },
        {
            id: "social_media_impact",
            question: "How does social media scrolling affect your self-perception and mental state?",
            type: "multiple_choice",
            options: ["Positive & inspiring", "Neutral / No effect", "Occasionally causes comparison", "Often triggers inadequacy", "Severely worsens anxiety"]
        }
    ]
};

// Mood categories
const moodCategories = {
    excellent: {
        name: "Excellent Mental State",
        description: "You are thriving with high resilience, balance, and positive energy. Maintain your foundational sleep, social, and mindfulness habits to sustain this momentum.",
        color: "#10b981",
        iconSymbol: "sentiment_very_satisfied",
        icon: "😊"
    },
    good: {
        name: "Good Mental State",
        description: "You are generally balanced with healthy coping capacity. Minor stressors are manageable, and proactive self-care will keep stress from compounding.",
        color: "#0d9488",
        iconSymbol: "sentiment_satisfied",
        icon: "🙂"
    },
    moderate_stress: {
        name: "Moderate Stress Level",
        description: "You are experiencing noticeable emotional or academic stress. Introducing structured study pauses, open communication, and grounding exercises will restore equilibrium.",
        color: "#f59e0b",
        iconSymbol: "sentiment_neutral",
        icon: "😐"
    },
    high_stress: {
        name: "High Stress Level",
        description: "Stress feels heavy and is starting to impact focus, mood, or sleep. It is important to set healthy boundaries, scale back non-essential pressure, and consult a counselor.",
        color: "#f97316",
        iconSymbol: "sentiment_dissatisfied",
        icon: "😟"
    },
    crisis: {
        name: "Crisis Level - Immediate Support Needed",
        description: "You are carrying an overwhelming emotional burden. Please remember you do not have to endure this alone. Confidential professional helplines and supportive counselors are ready 24/7.",
        color: "#ef4444",
        iconSymbol: "crisis_alert",
        icon: "😰"
    }
};

// YouTube recommendations by category
const youtubeVideos = {
    excellent: [
        {
            title: "6 Daily Habits That Elevate Mental Wellness",
            url: "https://www.youtube.com/watch?v=hlE2uL3m6W0"
        },
        {
            title: "Mindfulness & Peak Performance Playlist",
            url: "https://www.youtube.com/playlist?list=PL-wiTtpoOGDuNbzxFb3f4XSNmpPr0vYjo"
        }
    ],
    good: [
        {
            title: "Atomic Habits for Mental Resilience",
            url: "https://www.youtube.com/watch?v=AOHT-YiOeQA"
        },
        {
            title: "Box Breathing 4-4-4-4 Relaxation Technique",
            url: "https://www.youtube.com/watch?v=tEmt1Znux58"
        },
        {
            title: "Navigating Study & Lifestyle Balance",
            url: "https://www.youtube.com/watch?v=0amLuVS343M"
        }
    ],
    moderate_stress: [
        {
            title: "5 Rapid Steps to Calm Overthinking & Stress",
            url: "https://www.youtube.com/watch?v=1WIHlVZcrzs"
        },
        {
            title: "Mindfulness & Meditation Grounding (Mayo Clinic)",
            url: "https://www.youtube.com/watch?v=t5LO8JaRszg"
        },
        {
            title: "Ground Yourself With 6 Practical Somatic Techniques",
            url: "https://www.youtube.com/watch?v=Z7C0v4GfUUI"
        }
    ],
    high_stress: [
        {
            title: "The 5-4-3-2-1 Sensory Grounding Method for Anxiety",
            url: "https://www.youtube.com/watch?v=30VMIEmA114"
        },
        {
            title: "Anxiety Skills & Nervous System Regulation",
            url: "https://www.youtube.com/watch?v=1ao4xdDK9iE"
        },
        {
            title: "Immediate Coping Steps When Feeling Overwhelmed",
            url: "https://www.youtube.com/watch?v=j7tUQG1xc3o"
        }
    ],
    crisis: [
        {
            title: "Immediate Crisis De-escalation & Safe Grounding",
            url: "https://www.youtube.com/watch?v=j7tUQG1xc3o"
        },
        {
            title: "Grounding Exercises for Intense Emotional Distress",
            url: "https://www.youtube.com/watch?v=1ao4xdDK9iE"
        },
        {
            title: "Self-Compassion in Times of Acute Pain",
            url: "https://www.youtube.com/watch?v=VXHTZ4KS2yU"
        }
    ]
};

// Detailed Action Plan recommendations
const detailedRecommendations = {
    excellent: {
        immediate: [
            "Practice 4-7-8 deep breathing once in the morning to start centered and focused.",
            "Write down 3 specific things you are grateful for today in a quick 2-minute note.",
            "Share a word of genuine encouragement with a friend or peer facing exam pressure."
        ],
        short_term: [
            "Maintain the 25-minute Pomodoro method when learning new complex subjects.",
            "Schedule at least two intentional 30-minute digital detox walks outdoors this week.",
            "Join or mentor a study/interest group to build collaborative social bonds."
        ],
        long_term: [
            "Conduct exploratory informational interviews with professionals in fields of your interest.",
            "Cultivate a sustainable creative hobby (sketching, music, sports) alongside your studies.",
            "Consistently guard your 7-8 hours sleep window against late-night blue light exposure."
        ]
    },
    good: {
        immediate: [
            "Practice 3 cycles of Box Breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s).",
            "Call or message a trusted friend for a casual 5-minute check-in.",
            "Step outside for 10 minutes of direct natural sunlight to reset circadian rhythm."
        ],
        short_term: [
            "Use 'I feel... I need...' communication to clarify study boundaries with your family.",
            "Sort your weekly assignments using the Eisenhower Matrix (Urgent vs Important).",
            "Dedicate 15 minutes before bedtime to gentle stretching or ambient music."
        ],
        long_term: [
            "Establish a clear non-negotiable weekly rest day or rest afternoon.",
            "Explore skills courses outside standard syllabus to build self-directed confidence.",
            "Build positive social circles that encourage open emotional discussion."
        ]
    },
    moderate_stress: {
        immediate: [
            "Perform Progressive Muscle Relaxation: Tense each muscle group for 5s, then release.",
            "Write down your top 3 current worries, then beside each write 1 actionable micro-step.",
            "Take a 10-minute break away from your study desk immediately."
        ],
        short_term: [
            "Have an honest, calm conversation with a family member about your current workload.",
            "Break large syllabus units into bite-sized 20-minute daily review sessions.",
            "Limit social media usage to 30 minutes daily to reduce comparative anxiety."
        ],
        long_term: [
            "Schedule a session with an academic mentor or counselor to organize realistic milestones.",
            "Develop assertive communication habits for handling family and peer expectations.",
            "Adopt mindfulness journaling to recognize stress patterns before they escalate."
        ]
    },
    high_stress: {
        immediate: [
            "Use the 5-4-3-2-1 Sensory Grounding: 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste.",
            "Splash cold water on your face to activate the calming mammalian dive reflex.",
            "Reach out to a close friend or call a helpline if you need non-judgmental support."
        ],
        short_term: [
            "Cap daily study goals to no more than 3 high-priority tasks to alleviate overwhelm.",
            "Ask a trusted family member or mentor to sit with you for supportive, quiet listening.",
            "Schedule a structured consultation with a licensed youth psychologist or counselor."
        ],
        long_term: [
            "Enroll in regular Cognitive Behavioral (CBT) counseling to master thought reframing.",
            "Work with family to establish realistic career horizons beyond singular test pressures.",
            "Build a comprehensive stress-reduction routine emphasizing restorative rest."
        ]
    },
    crisis: {
        immediate: [
            "Call the 24/7 Tele-MANAS helpline (14416) or Vandrevala Foundation (9999666555).",
            "Stay in the company of a trusted family member, close friend, or mentor right now.",
            "Practice slow, guided belly breathing and avoid staying in complete isolation."
        ],
        short_term: [
            "Arrange an in-person evaluation with a licensed psychiatrist or mental health clinician.",
            "Follow a gentle, low-pressure daily routine with family support and no critical decisions.",
            "Create a personal safety plan with your support system identifying safe spaces and contacts."
        ],
        long_term: [
            "Commit to a continuous professional therapy journey with weekly support check-ins.",
            "Rebuild physical foundations: stable nourishing meals, regular sleep, and gentle walking.",
            "Remember that healing is non-linear and help is always available to guide you through."
        ]
    }
};

// Core wellness tips
const wellnessTips = [
    "Honor regular sleep: Aim for 7-8 hours with consistent bedtimes to stabilize emotional resilience.",
    "Movement resets mood: 20-30 minutes of walking or light exercise reduces cortisol levels naturally.",
    "Separate worth from test scores: Academic exams are milestones, not a measure of your human value.",
    "Curate your digital diet: Unfollow accounts that trigger negative self-comparison and anxiety.",
    "Practice assertive empathy: Communicate your boundaries with family respectfully but clearly.",
    "Mindful pauses: Just 5 minutes of conscious diaphragmatic breathing activates the parasympathetic system."
];

// ==========================================================================
// Initialization & Navigation Flow
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeChatbot();
    
    // Auto start on welcome screen
    showPage('welcome-screen');
});

// Start assessment directly from welcome screen
window.startAssessmentDirectly = function() {
    const nameInput = document.getElementById('user-name-input');
    const ageInput = document.getElementById('user-age-input');

    userName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Anonymous';
    userAge = (ageInput && ageInput.value.trim()) ? ageInput.value.trim() : 'Youth';

    initializeAssessment();
    showPage('assessment-screen');
    updateAssessmentDisplay();
};

// Initialize steps
function initializeAssessment() {
    assessmentSteps = [
        { key: 'academic_stress', name: 'Academic Stress Assessment', questions: assessmentData.academic_stress },
        { key: 'family_dynamics', name: 'Family Dynamics Assessment', questions: assessmentData.family_dynamics },
        { key: 'social_personal', name: 'Social & Personal Assessment', questions: assessmentData.social_personal },
        { key: 'physical_emotional', name: 'Physical & Emotional Assessment', questions: assessmentData.physical_emotional },
        { key: 'cultural_societal', name: 'Cultural & Societal Assessment', questions: assessmentData.cultural_societal }
    ];

    currentStep = 0;
    currentQuestionIndex = 0;
    assessmentResponses = {};
}

// Show target screen
window.showPage = function(pageId) {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id !== 'resources-screen') {
        previousScreenId = activePage.id;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Resources navigation
window.showResources = function() {
    showPage('resources-screen');
};

window.goBackFromResources = function() {
    showPage(previousScreenId || 'welcome-screen');
};

// Crisis modal controls
window.showCrisisModal = function() {
    const modal = document.getElementById('crisis-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCrisisModal = function() {
    const modal = document.getElementById('crisis-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

// ==========================================================================
// Assessment Rendering & Option Selection
// ==========================================================================

function updateAssessmentDisplay() {
    updateProgressBar();
    updateStepHeader();
    displayCurrentQuestion();
}

function updateProgressBar() {
    const totalQuestions = 19; // 4 + 4 + 4 + 4 + 3 questions = 19
    let answeredCount = 0;

    for (let s = 0; s < currentStep; s++) {
        answeredCount += assessmentSteps[s].questions.length;
    }
    answeredCount += (currentQuestionIndex + 1);

    const progress = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
}

function updateStepHeader() {
    const stepData = assessmentSteps[currentStep];
    const categoryIcon = document.getElementById('category-icon');
    const stepTitle = document.getElementById('step-title');
    const stepCounter = document.getElementById('step-counter');

    if (categoryIcon) categoryIcon.textContent = categoryIcons[stepData.key] || 'psychology';
    if (stepTitle) stepTitle.textContent = stepData.name;
    if (stepCounter) {
        const qNum = currentQuestionIndex + 1;
        const totalQ = stepData.questions.length;
        stepCounter.textContent = `Step ${currentStep + 1} of ${assessmentSteps.length} • Q${qNum} of ${totalQ}`;
    }
}

function displayCurrentQuestion() {
    const container = document.getElementById('question-container');
    if (!container) return;

    const stepData = assessmentSteps[currentStep];
    const question = stepData.questions[currentQuestionIndex];
    const questionNum = currentQuestionIndex + 1;

    let optionsHtml = '';

    if (question.type === 'scale') {
        const selectedVal = assessmentResponses[question.id];
        optionsHtml = `
            <div class="scale-wrapper">
                <div class="scale-grid">
                    ${question.options.map((opt, idx) => {
                        const val = idx + 1;
                        const isSelected = selectedVal == val ? 'selected' : '';
                        return `
                            <button class="scale-btn ${isSelected}" onclick="window.selectOption('${question.id}', ${val}, this)" type="button" data-val="${val}">
                                ${val}
                            </button>
                        `;
                    }).join('')}
                </div>
                <div class="scale-legend">
                    <div class="scale-legend-item">
                        <span class="material-symbols-outlined">sentiment_satisfied</span>
                        <span>${question.options[0]}</span>
                    </div>
                    <div class="scale-legend-item">
                        <span>${question.options[question.options.length - 1]}</span>
                        <span class="material-symbols-outlined">sentiment_very_dissatisfied</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        const selectedVal = assessmentResponses[question.id];
        optionsHtml = `
            <div class="mcq-options-list">
                ${question.options.map(option => {
                    const isSelected = selectedVal === option ? 'selected' : '';
                    return `
                        <button class="option-btn ${isSelected}" onclick="window.selectOption('${question.id}', '${escapeHtml(option)}', this)" type="button">
                            <div class="option-radio-indicator">
                                <div class="option-radio-dot"></div>
                            </div>
                            <span class="option-text">${option}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="question-header">
            <span class="question-num-pill">Q${questionNum}</span>
            <h3 class="question-title">${question.question}</h3>
        </div>
        <div class="question-body">
            ${optionsHtml}
        </div>
    `;

    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.disabled = (currentStep === 0 && currentQuestionIndex === 0);
    }
}

function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.selectOption = function(questionId, value, element) {
    assessmentResponses[questionId] = value;

    // Visual selection feedback
    const parent = element.closest('.scale-grid') || element.closest('.mcq-options-list');
    if (parent) {
        parent.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    }
    element.classList.add('selected');

    // Auto advance after brief micro-delay
    setTimeout(() => {
        advanceQuestion();
    }, 280);
};

window.previousQuestion = function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
    } else if (currentStep > 0) {
        currentStep--;
        currentQuestionIndex = assessmentSteps[currentStep].questions.length - 1;
    }
    updateAssessmentDisplay();
};

function advanceQuestion() {
    const stepData = assessmentSteps[currentStep];

    if (currentQuestionIndex < stepData.questions.length - 1) {
        currentQuestionIndex++;
        updateAssessmentDisplay();
    } else if (currentStep < assessmentSteps.length - 1) {
        currentStep++;
        currentQuestionIndex = 0;
        updateAssessmentDisplay();
    } else {
        // Complete assessment
        finishAssessment();
    }
}

// ==========================================================================
// Results Calculation & Display
// ==========================================================================

function finishAssessment() {
    calculateResults();
    identifyFocusAreas();
    showPage('results-screen');
    renderResultsScreen();
}

function calculateResults() {
    let totalScore = 0;
    let maxScore = 0;
    let categoryScores = {
        academic_stress: 0,
        family_dynamics: 0,
        social_personal: 0,
        physical_emotional: 0,
        cultural_societal: 0
    };

    Object.keys(assessmentData).forEach(catKey => {
        const questions = assessmentData[catKey];
        let catScore = 0;
        let catMax = 0;

        questions.forEach(q => {
            const resp = assessmentResponses[q.id];
            if (resp !== undefined) {
                let score = 0;
                let qMax = 0;

                if (q.type === 'scale') {
                    score = parseInt(resp) || 1;
                    qMax = 10;
                    // Reverse scoring for positive-oriented items
                    if (q.id === 'family_support' || q.id === 'peer_relationships' ||
                        q.id === 'self_esteem' || q.id === 'family_communication') {
                        score = 11 - score;
                    }
                } else {
                    const optIndex = q.options.indexOf(resp);
                    qMax = q.options.length - 1;
                    score = optIndex >= 0 ? optIndex : 0;
                }

                catScore += score;
                catMax += qMax;
            }
        });

        categoryScores[catKey] = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
        totalScore += catScore;
        maxScore += catMax;
    });

    const overallScore = maxScore > 0 ? Math.round(100 - ((totalScore / maxScore) * 100)) : 100;

    let categoryKey = 'excellent';
    if (overallScore >= 85) {
        categoryKey = 'excellent';
    } else if (overallScore >= 70) {
        categoryKey = 'good';
    } else if (overallScore >= 50) {
        categoryKey = 'moderate_stress';
    } else if (overallScore >= 30) {
        categoryKey = 'high_stress';
    } else {
        categoryKey = 'crisis';
    }

    moodResult = {
        category: categoryKey,
        score: overallScore,
        categoryScores: categoryScores,
        ...moodCategories[categoryKey]
    };
}

function identifyFocusAreas() {
    primaryConcerns = [];
    const threshold = 50;

    const categoryNames = {
        academic_stress: 'Academic Pressure',
        family_dynamics: 'Family Communication & Expectations',
        social_personal: 'Social & Emotional Wellbeing',
        physical_emotional: 'Sleep & Energy Balance',
        cultural_societal: 'Cultural & Social Pressure'
    };

    Object.keys(moodResult.categoryScores).forEach(cat => {
        const stressPercentage = moodResult.categoryScores[cat];
        if (stressPercentage >= threshold) {
            primaryConcerns.push({
                category: cat,
                name: categoryNames[cat] || cat,
                score: stressPercentage
            });
        }
    });

    primaryConcerns.sort((a, b) => b.score - a.score);
}

function renderResultsScreen() {
    // 1. Mood Icon and category header
    const iconSymbol = document.getElementById('mood-icon-symbol');
    const moodCat = document.getElementById('mood-category');
    const moodDesc = document.getElementById('mood-description');
    const moodScore = document.getElementById('mood-score');

    if (iconSymbol) iconSymbol.textContent = moodResult.iconSymbol || 'sentiment_satisfied';
    if (moodCat) moodCat.textContent = moodResult.name;
    if (moodDesc) moodDesc.textContent = moodResult.description;
    if (moodScore) moodScore.textContent = `${moodResult.score}/100`;

    // 2. Pillar score progress breakdown
    const pillarGrid = document.getElementById('pillar-scores-grid');
    if (pillarGrid) {
        const pillarDisplayNames = {
            academic_stress: { name: 'Academic Stress', icon: 'school' },
            family_dynamics: { name: 'Family Dynamics', icon: 'family_restroom' },
            social_personal: { name: 'Social Wellbeing', icon: 'diversity_3' },
            physical_emotional: { name: 'Physical & Energy', icon: 'spa' },
            cultural_societal: { name: 'Societal Pressures', icon: 'public' }
        };

        pillarGrid.innerHTML = Object.keys(moodResult.categoryScores).map(catKey => {
            const stressPct = moodResult.categoryScores[catKey];
            const wellnessPct = Math.max(0, 100 - stressPct);
            const info = pillarDisplayNames[catKey] || { name: catKey, icon: 'psychology' };

            let barColor = 'var(--success)';
            if (stressPct > 65) barColor = 'var(--danger)';
            else if (stressPct > 40) barColor = 'var(--warning)';

            return `
                <div class="pillar-score-item">
                    <div class="pillar-header">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <span class="material-symbols-outlined" style="font-size:16px; color:var(--primary);">${info.icon}</span>
                            ${info.name}
                        </span>
                        <span>${wellnessPct}% Balance</span>
                    </div>
                    <div class="pillar-bar-track">
                        <div class="pillar-bar-fill" style="width: ${wellnessPct}%; background: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Primary Concerns list
    const concernsList = document.getElementById('concerns-list');
    if (concernsList) {
        if (primaryConcerns.length > 0) {
            concernsList.innerHTML = primaryConcerns.map(c => `
                <span class="concern-tag">
                    <span class="material-symbols-outlined" style="font-size:16px; color:var(--warning);">priority_high</span>
                    ${c.name} (${c.score}% Stress)
                </span>
            `).join('');
        } else {
            concernsList.innerHTML = `
                <span class="concern-tag" style="border-color: rgba(16, 185, 129, 0.4); background: var(--success-light);">
                    <span class="material-symbols-outlined" style="font-size:16px; color:var(--success);">verified</span>
                    No major elevated distress areas identified!
                </span>
            `;
        }
    }

    // 4. Populate recommendations
    ['immediate', 'short-term', 'long-term'].forEach(tab => {
        const fieldKey = tab.replace('-', '_');
        const container = document.getElementById(`${tab}-recommendations`);
        if (container) {
            const list = detailedRecommendations[moodResult.category]?.[fieldKey] || [];
            container.innerHTML = list.map(item => `
                <div class="rec-item-card">
                    <span class="material-symbols-outlined">check_circle</span>
                    <span>${item}</span>
                </div>
            `).join('');
        }
    });

    // 5. Curated Videos
    const videosContainer = document.getElementById('youtube-videos');
    if (videosContainer) {
        const videos = youtubeVideos[moodResult.category] || [];
        videosContainer.innerHTML = videos.map(vid => `
            <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="video-card">
                <div class="video-card-top">
                    <span class="material-symbols-outlined">smart_display</span>
                    <span>YouTube Guide</span>
                </div>
                <h4 class="video-title">${vid.title}</h4>
            </a>
        `).join('');
    }

    // 6. Wellness Tips
    const tipsContainer = document.getElementById('wellness-tips-list');
    if (tipsContainer) {
        tipsContainer.innerHTML = wellnessTips.slice(0, 4).map(tip => `
            <div class="wellness-tip-card">
                <span class="material-symbols-outlined">lightbulb</span>
                <span>${tip}</span>
            </div>
        `).join('');
    }
}

// Tab navigation for recommendations
window.showRecommendationTab = function(tabName) {
    document.querySelectorAll('.recommendation-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) targetTab.classList.add('active');

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
};

// Retake assessment
window.retakeAssessment = function() {
    showPage('welcome-screen');
};

// ==========================================================================
// PDF Generation & Download
// ==========================================================================

window.downloadResults = function() {
    if (!window.jspdf) {
        alert("PDF generator library is still loading. Please try again in a moment.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const assessmentId = 'MC-' + Date.now().toString(36).toUpperCase();
    const completionTime = new Date().toLocaleString();

    let y = 20;

    // Header banner
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('MindCare - Youth Mental Wellness Report', 20, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Confidential Mental Health & Resilience Analysis', 20, 28);

    // Profile metadata block
    y = 48;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 24, 2, 2, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`User Name: ${userName}  |  Age: ${userAge}`, 22, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Assessment ID: ${assessmentId}  |  Date: ${completionTime}`, 22, y + 18);

    // Status Summary
    y += 36;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('1. Overall Mental Wellness Status', 15, y);

    y += 8;
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(15, y, 40, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`Score: ${moodResult.score}/100`, 20, y + 8);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(moodResult.name || 'Assessment Complete', 62, y + 8);

    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(moodResult.description || '', 180);
    doc.text(descLines, 15, y);
    y += descLines.length * 6 + 10;

    // Action Plan Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('2. Immediate Action Plan (Next 24-48 Hours)', 15, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const recs = detailedRecommendations[moodResult.category]?.immediate || [];
    recs.forEach(rec => {
        const lines = doc.splitTextToSize(`• ${rec}`, 175);
        doc.text(lines, 18, y);
        y += lines.length * 5 + 3;
    });

    // Crisis contacts
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text('3. 24/7 National Helplines & Support', 15, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('• Tele-MANAS (Govt of India): 14416 (24/7 toll-free mental health support)', 18, y);
    y += 6;
    doc.text('• Vandrevala Foundation: 9999666555 (Free counseling across languages)', 18, y);
    y += 6;
    doc.text('• KIRAN Helpline: 1800-599-0019 (Govt of India Support)', 18, y);

    // Footer note
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 275, 210, 22, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Disclaimer: This tool is an educational self-assessment and not a substitute for clinical psychological diagnosis.', 15, 285);

    const filename = `MindCare_Wellness_Report_${userName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
};

// ==========================================================================
// Dark Mode Toggle
// ==========================================================================

function initializeDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    if (!toggleBtn || !toggleIcon) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        toggleIcon.textContent = 'light_mode';
    } else {
        document.body.classList.remove('dark-mode');
        toggleIcon.textContent = 'dark_mode';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ==========================================================================
// Floating AI Chatbot
// ==========================================================================

function initializeChatbot() {
    const botBtn = document.getElementById('chatbot-button');
    const botWindow = document.getElementById('chatbot-window');
    const botClose = document.getElementById('chatbot-close');
    const botQuestions = document.getElementById('chatbot-questions');
    const botAnswer = document.getElementById('chatbot-answer');

    if (!botBtn || !botWindow) return;

    botBtn.addEventListener('click', () => {
        const isOpen = botWindow.style.display === 'block';
        botWindow.style.display = isOpen ? 'none' : 'block';
    });

    if (botClose) {
        botClose.addEventListener('click', () => {
            botWindow.style.display = 'none';
        });
    }

    if (botQuestions && botAnswer) {
        botQuestions.addEventListener('click', (e) => {
            const target = e.target.closest('.question-chip');
            if (target) {
                const answer = target.getAttribute('data-answer');
                botAnswer.textContent = answer;
                botAnswer.classList.add('has-content');
            }
        });
    }
}
