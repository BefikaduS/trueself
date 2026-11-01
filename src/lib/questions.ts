import type { AssessmentQuestion, AnswerOption } from "./types";

// =========================================================================
// DIMENSION 1: YOUR NATURAL SELF (Unprompted Instincts & Energy)
// =========================================================================
const POOL_NATURAL_SELF: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "natural-self-solitude",
    dimension: "natural-self",
    dimensionIndex: 1,
    eyebrow: "Your natural self",
    question:
      "When nobody needs anything from you, nobody is watching, and you finally have time to yourself, where does your mind naturally take you?",
    options: [
      { id: "A", trait: "builder", label: "I start imagining things I could create, build, or turn into something meaningful." },
      { id: "B", trait: "curious", label: "I become curious about something new. I want to discover, learn, explore, or understand." },
      { id: "C", trait: "connector", label: "I look for connection. I want to talk to someone, spend time with people, or feel close to someone." },
      { id: "D", trait: "organizer", label: "I start organizing my life, thinking about unfinished responsibilities, and trying to get everything under control." },
      { id: "E", trait: "distractor", label: "I escape into distractions. I scroll, watch things, or keep myself occupied without necessarily knowing why." },
      { id: "F", trait: "rest", label: "I genuinely want to rest. Sometimes I am simply tired and need space without expectations." },
    ],
    contextPlaceholder: "Tell us what usually happens in real life...",
  },
  {
    id: "natural-self-vitality",
    dimension: "natural-self",
    dimensionIndex: 1,
    eyebrow: "Your natural self",
    question:
      "When your schedule clears completely for an afternoon, which activity actually returns your vitality rather than just passing the time?",
    options: [
      { id: "A", trait: "builder", label: "Diving deep into an unhurried creative project or craft with no external deadline or client." },
      { id: "B", trait: "curious", label: "Immersing myself in research, a captivating book, or an unfamiliar discipline that widens my worldview." },
      { id: "C", trait: "connector", label: "Having a long, unhurried, honest conversation with someone who genuinely understands me." },
      { id: "D", trait: "organizer", label: "Tidying my space, updating my plans, and eliminating lingering administrative friction." },
      { id: "E", trait: "distractor", label: "Completely disengaging into entertainment, comfort food, or digital feeds until the hours slip away." },
      { id: "F", trait: "rest", label: "Total physical stillness, a quiet nap, or staring out the window with zero demands." },
    ],
    contextPlaceholder: "What does an ideal empty afternoon look like for you?",
  },
  {
    id: "natural-self-monologue",
    dimension: "natural-self",
    dimensionIndex: 1,
    eyebrow: "Your natural self",
    question:
      "When you are walking or commuting in silence with no audio playing, what does your interior monologue consistently orbit around?",
    options: [
      { id: "A", trait: "builder", label: "Conceptualizing future projects, sketching ideas in my head, and imagining what could exist." },
      { id: "B", trait: "curious", label: "Analyzing patterns, dissecting interesting concepts, and wondering why things work the way they do." },
      { id: "C", trait: "connector", label: "Replaying past interactions, evaluating my relationships, and wondering how someone I care about is feeling." },
      { id: "D", trait: "organizer", label: "Running through mental checklists, anticipating deadlines, and structuring how I will navigate the week." },
      { id: "E", trait: "distractor", label: "Restless internal chatter, imaginary arguments, or vague anxieties that I quickly try to suppress." },
      { id: "F", trait: "rest", label: "A quiet wish to turn down the internal volume and simply give my nervous system a break." },
    ],
    contextPlaceholder: "Where does your mind wander when left in silence?",
  },
  {
    id: "natural-self-flow",
    dimension: "natural-self",
    dimensionIndex: 1,
    eyebrow: "Your natural self",
    question:
      "In what kind of experience or environment do you most effortlessly lose track of time?",
    options: [
      { id: "A", trait: "builder", label: "When I am in the flow of shaping an idea into concrete reality — making, writing, or coding." },
      { id: "B", trait: "curious", label: "When I am untangling a complex problem or following a fascinating intellectual rabbit hole." },
      { id: "C", trait: "connector", label: "When I am engaged in deep, soulful conversation where masks come off and time stands still." },
      { id: "D", trait: "organizer", label: "When I am structuring chaos — reorganizing systems, clearing backlogs, or optimizing processes." },
      { id: "E", trait: "distractor", label: "When I get sucked into algorithmic feeds, short videos, or bingeable media without realizing it." },
      { id: "F", trait: "rest", label: "When I am immersed in nature, soaking in warm water, or resting with no obligations on the horizon." },
    ],
    contextPlaceholder: "When did you last lose all sense of time?",
  },
  {
    id: "natural-self-authentic-spark",
    dimension: "natural-self",
    dimensionIndex: 1,
    eyebrow: "Your natural self",
    question:
      "If financial security and societal prestige were completely guaranteed for life, how would you spend the majority of your weekdays?",
    options: [
      { id: "A", trait: "builder", label: "Inventing, building original creations, and tackling ambitious artistic or practical works." },
      { id: "B", trait: "curious", label: "Studying the world, mastering diverse fields, traveling to understand, and sharing knowledge." },
      { id: "C", trait: "connector", label: "Fostering community, mentoring others, and spending quality time with people I cherish." },
      { id: "D", trait: "organizer", label: "Stewarding resources, leading important initiatives, and creating order in complex organizations." },
      { id: "E", trait: "distractor", label: "Floating freely without routines, chasing novel pleasures, and avoiding any serious commitments." },
      { id: "F", trait: "rest", label: "Cultivating a quiet, peaceful life rooted in wellness, slow mornings, and low-stress rhythms." },
    ],
    contextPlaceholder: "What would your weeks look like without external pressure?",
  },
];

// =========================================================================
// DIMENSION 2: YOUR RESPONSE TO DIFFICULTY (Friction & Pressure Personas)
// =========================================================================
const POOL_DIFFICULTY: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "difficulty-archetype",
    dimension: "response-to-difficulty",
    dimensionIndex: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When something genuinely matters to you, but it starts becoming difficult, which version of yourself usually appears?",
    options: [
      { id: "A", trait: "perfectionist", label: "The perfectionist. I keep improving things because showing unfinished work makes me uncomfortable." },
      { id: "B", trait: "procrastinator", label: "The procrastinator. I know what I should do, but somehow I keep finding reasons to start later." },
      { id: "C", trait: "overthinker", label: "The overthinker. I research, reconsider, and explore possibilities until making a decision feels exhausting." },
      { id: "D", trait: "sprinter", label: "The sprinter. I become intensely motivated, work hard for a while, then struggle to maintain momentum." },
      { id: "E", trait: "pleaser", label: "The people-pleaser. I put other people's expectations first, even when my own goals suffer." },
      { id: "F", trait: "solver", label: "The problem-solver. I break things down, ask for help when necessary, and continue even when progress is slow." },
    ],
    contextPlaceholder: "What does this usually look like for you?",
  },
  {
    id: "difficulty-middle-slump",
    dimension: "response-to-difficulty",
    dimensionIndex: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When a project leaves the initial novelty phase and enters the tedious, unglamorous middle stage, what is your most common failure mode?",
    options: [
      { id: "A", trait: "perfectionist", label: "I obsess over minor cosmetic details and edge cases instead of finishing what is essential." },
      { id: "B", trait: "procrastinator", label: "The friction feels heavy, so I suddenly discover other urgent administrative tasks to tackle first." },
      { id: "C", trait: "overthinker", label: "I begin doubting the entire concept and spend days debating whether I should pivot completely." },
      { id: "D", trait: "sprinter", label: "The initial adrenaline is spent, and grinding through without emotional excitement feels like a slog." },
      { id: "E", trait: "pleaser", label: "I allow other people's emergent requests to commandeer my calendar and let my project quietly stall." },
      { id: "F", trait: "solver", label: "I accept the mundane plateau, shrink the daily scope, and keep putting one foot in front of the other." },
    ],
    contextPlaceholder: "How do you handle the middle phase of hard projects?",
  },
  {
    id: "difficulty-ambiguity-freeze",
    dimension: "response-to-difficulty",
    dimensionIndex: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When faced with an important task with no clear playbook and high uncertainty, how do you instinctively cope?",
    options: [
      { id: "A", trait: "perfectionist", label: "I over-prepare and over-engineer every possible contingency to avoid any visible misstep." },
      { id: "B", trait: "procrastinator", label: "I freeze and put off taking the first step until I feel a sudden burst of confidence." },
      { id: "C", trait: "overthinker", label: "I buy books, read case studies, and collect endless frameworks instead of testing in reality." },
      { id: "D", trait: "sprinter", label: "I charge in full speed with high enthusiasm, only to crash when early obstacles prove stubborn." },
      { id: "E", trait: "pleaser", label: "I look around for reassurance and consensus before I feel safe putting a stake in the ground." },
      { id: "F", trait: "solver", label: "I run small, lightweight experiments knowing that early mistakes are the fastest way to learn." },
    ],
    contextPlaceholder: "What happens when the path forward is ambiguous?",
  },
  {
    id: "difficulty-stinging-feedback",
    dimension: "response-to-difficulty",
    dimensionIndex: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When someone points out a significant flaw in something you poured days of dedicated effort into, what is your knee-jerk reaction?",
    options: [
      { id: "A", trait: "perfectionist", label: "I feel a wave of humiliation and want to redo the entire piece in secret until it's flawless." },
      { id: "B", trait: "procrastinator", label: "I feel demoralized and find it hard to reopen or touch the file for several days." },
      { id: "C", trait: "overthinker", label: "I mentally replay their exact wording for hours, analyzing whether they are right or biased." },
      { id: "D", trait: "sprinter", label: "My initial enthusiasm drains completely, and I struggle to care about continuing the effort." },
      { id: "E", trait: "pleaser", label: "I instantly agree with everything they said and rush to please them, even if it compromises my vision." },
      { id: "F", trait: "solver", label: "I separate my ego from the work, isolate the useful signal, and calmly adjust the approach." },
    ],
    contextPlaceholder: "Think of a recent piece of critical feedback...",
  },
  {
    id: "difficulty-abandoned-goals",
    dimension: "response-to-difficulty",
    dimensionIndex: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When you reflect on important personal goals you started but eventually abandoned, what was the primary reason?",
    options: [
      { id: "A", trait: "perfectionist", label: "The gap between the vision in my head and the reality of my draft made finishing feel painful." },
      { id: "B", trait: "procrastinator", label: "Each session required too much friction to start, until days turned into weeks of silence." },
      { id: "C", trait: "overthinker", label: "I became overwhelmed by all the possible variations and couldn't pick a definite direction." },
      { id: "D", trait: "sprinter", label: "I burned through my initial burst of passion and didn't have the steady stamina to sustain it." },
      { id: "E", trait: "pleaser", label: "Demands from friends, colleagues, or family gradually consumed all my remaining attention." },
      { id: "F", trait: "solver", label: "I evaluated the payoff realistically and made a deliberate, conscious decision to reallocate my time." },
    ],
    contextPlaceholder: "What caused you to stop last time?",
  },
];

// =========================================================================
// DIMENSION 3: THE EXCUSE (The Rationalized Shield & Hidden Defense)
// =========================================================================
const POOL_EXCUSE: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "the-excuse-phrase",
    dimension: "the-excuse",
    dimensionIndex: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "Which sentence do you find yourself saying most often, even though part of you sometimes suspects there is something deeper behind it?",
    options: [
      { id: "A", trait: "time", label: "\"I don't have enough time.\" My attention is often divided, and I struggle to protect what matters." },
      { id: "B", trait: "preparation", label: "\"I need to prepare a little more.\" I sometimes confuse preparation with avoiding the possibility of failure." },
      { id: "C", trait: "timing", label: "\"It's not the right moment.\" Starting something new feels easier to postpone than to face." },
      { id: "D", trait: "suppression", label: "\"I don't really mind.\" Sometimes I hide what I want because expressing it feels uncomfortable." },
      { id: "E", trait: "tolerance", label: "\"It's fine.\" I sometimes accept situations that I know are not working for me." },
      { id: "F", trait: "capacity", label: "\"I'm genuinely at capacity.\" Sometimes the problem is not avoidance. I have too much on my plate." },
    ],
    contextPlaceholder: "Is there a specific situation this comes up in?",
  },
  {
    id: "the-excuse-virtue-shield",
    dimension: "the-excuse",
    dimensionIndex: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "Behind which responsible-sounding justification does your hesitation most comfortably camouflage itself?",
    options: [
      { id: "A", trait: "time", label: "\"I must clear all minor obligations before I can give this my 100% focused attention.\"" },
      { id: "B", trait: "preparation", label: "\"I need to take one more course or read one more book so I don't look amateurish.\"" },
      { id: "C", trait: "timing", label: "\"It's wiser to wait for the current external turbulence to settle down first.\"" },
      { id: "D", trait: "suppression", label: "\"I'm being unselfish by putting my personal desires aside for the greater good.\"" },
      { id: "E", trait: "tolerance", label: "\"I should be grateful for what I have rather than rocking the boat with new demands.\"" },
      { id: "F", trait: "capacity", label: "\"My physical nervous system is genuinely depleted and pushing right now would cause a breakdown.\"" },
    ],
    contextPlaceholder: "Which justification sounds most familiar?",
  },
  {
    id: "the-excuse-prerequisite-illusion",
    dimension: "the-excuse",
    dimensionIndex: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "What prerequisite condition do you frequently believe must happen before you can take full ownership of your path?",
    options: [
      { id: "A", trait: "time", label: "When my daily schedule finally calms down and I have uninterrupted blocks of free hours." },
      { id: "B", trait: "preparation", label: "When I feel completely knowledgeable and no longer feel like an imposter in the room." },
      { id: "C", trait: "timing", label: "When the circumstances align — the right season, the right partner, or the right market conditions." },
      { id: "D", trait: "suppression", label: "When everyone around me is settled, happy, and no longer dependent on my immediate support." },
      { id: "E", trait: "tolerance", label: "When someone in authority explicitly gives me permission or invites me to step up." },
      { id: "F", trait: "capacity", label: "I don't have an illusion — I literally have real financial or legal constraints that require solving first." },
    ],
    contextPlaceholder: "What condition do you find yourself waiting for?",
  },
  {
    id: "the-excuse-self-soothing-story",
    dimension: "the-excuse",
    dimensionIndex: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "When you fail to follow through on an intention you repeatedly set for yourself, what story softens the sting?",
    options: [
      { id: "A", trait: "time", label: "\"Modern life is just too fragmented. Anyone with my responsibilities would struggle to find time.\"" },
      { id: "B", trait: "preparation", label: "\"At least I spent time laying the groundwork and educating myself; nothing was wasted.\"" },
      { id: "C", trait: "timing", label: "\"If it was meant to happen right now, it would have flowed more naturally.\"" },
      { id: "D", trait: "suppression", label: "\"I'm showing maturity by not being rigid and adapting to the needs of the group.\"" },
      { id: "E", trait: "tolerance", label: "\"It really wasn't that important to me anyway; I was just getting ahead of myself.\"" },
      { id: "F", trait: "capacity", label: "\"I honored my real physical limits today instead of falling into toxic productivity.\"" },
    ],
    contextPlaceholder: "How do you explain it to yourself when you put it off?",
  },
  {
    id: "the-excuse-lifestyle-compromise",
    dimension: "the-excuse",
    dimensionIndex: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "Which compromise in your current daily reality do you defend to others, even though deep down you know it drains you?",
    options: [
      { id: "A", trait: "time", label: "Allowing digital interruptions and low-priority messages to slice my working hours into fragments." },
      { id: "B", trait: "preparation", label: "Accumulating more credentials, research, and materials rather than releasing imperfect work." },
      { id: "C", trait: "timing", label: "Staying in a safe holding pattern because leaving would cause uncomfortable friction." },
      { id: "D", trait: "suppression", label: "Smiling and saying 'yes' to social or professional demands while quietly harboring resentment." },
      { id: "E", trait: "tolerance", label: "Downplaying my ambitions so I don't appear arrogant or make others uncomfortable." },
      { id: "F", trait: "capacity", label: "Protecting strict boundaries that friends or family find inconvenient because my energy is fragile." },
    ],
    contextPlaceholder: "What compromise are you defending to yourself?",
  },
];

// =========================================================================
// DIMENSION 4: YOUR EMOTIONAL REFLEX (Interpersonal Tension & Hurt)
// =========================================================================
const POOL_REFLEX: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "reflex-disappointment",
    dimension: "emotional-reflex",
    dimensionIndex: 4,
    eyebrow: "Your emotional reflex",
    question:
      "When someone disappoints you, hurts your feelings, or doesn't meet your expectations, what usually happens inside you before you decide what to say?",
    options: [
      { id: "A", trait: "withdrawal", label: "I become quiet. I act as though it didn't matter, even when it did." },
      { id: "B", trait: "replaying", label: "I replay everything. I analyze what happened and wonder what I might have missed." },
      { id: "C", trait: "defending", label: "I defend their behavior. I find reasons to understand them before acknowledging how I feel." },
      { id: "D", trait: "immediate", label: "I react immediately. I want to address the issue, sometimes before I have fully processed it." },
      { id: "E", trait: "fixing", label: "I focus on fixing the situation instead of dealing with how it affected me." },
      { id: "F", trait: "direct", label: "I try to communicate directly. I explain what bothered me and listen to their perspective." },
    ],
    contextPlaceholder: "Think of a recent time this happened...",
  },
  {
    id: "reflex-sharp-critique",
    dimension: "emotional-reflex",
    dimensionIndex: 4,
    eyebrow: "Your emotional reflex",
    question:
      "When someone you respect delivers an unexpected, stinging critique of your character or behavior, what is your first 30-second reaction?",
    options: [
      { id: "A", trait: "withdrawal", label: "I emotionally freeze, nod politely on the surface, and mentally retreat behind a protective wall." },
      { id: "B", trait: "replaying", label: "I spiral into self-examination, wondering if they see a fundamental flaw that I am blind to." },
      { id: "C", trait: "defending", label: "I immediately take their side, apologize profusely, and assume that I am entirely in the wrong." },
      { id: "D", trait: "immediate", label: "A sharp defensive heat flares up inside me, and I prepare a mental counter-case against them." },
      { id: "E", trait: "fixing", label: "I immediately change the subject to logistical solutions to bypass the uncomfortable emotion." },
      { id: "F", trait: "direct", label: "I take a slow breath, acknowledge the sting, and ask curious questions to understand their angle." },
    ],
    contextPlaceholder: "What happens in your body when criticized sharply?",
  },
  {
    id: "reflex-boundary-crossing",
    dimension: "emotional-reflex",
    dimensionIndex: 4,
    eyebrow: "Your emotional reflex",
    question:
      "When someone oversteps your boundaries or asks for something you really do not want to give, what makes it difficult to say a simple 'no'?",
    options: [
      { id: "A", trait: "withdrawal", label: "I agree on the spot, but then pull away or drag my feet fulfilling the request with hidden resentment." },
      { id: "B", trait: "replaying", label: "I agonize over how to phrase my refusal so they won't think I am selfish or uncaring." },
      { id: "C", trait: "defending", label: "I feel intense guilt, convincing myself that their distress is more important than my discomfort." },
      { id: "D", trait: "immediate", label: "I feel an irritable flash of anger that they put me on the spot, and might snap back tersely." },
      { id: "E", trait: "fixing", label: "I offer an elaborate alternative or partial favor just to avoid a direct, clear rejection." },
      { id: "F", trait: "direct", label: "I decline clearly and warmly without over-explaining, trusting our connection to handle honesty." },
    ],
    contextPlaceholder: "How comfortable are you with saying no?",
  },
  {
    id: "reflex-conflict-role",
    dimension: "emotional-reflex",
    dimensionIndex: 4,
    eyebrow: "Your emotional reflex",
    question:
      "During an interpersonal disagreement where both sides feel aggrieved, which role do you involuntarily inhabit?",
    options: [
      { id: "A", trait: "withdrawal", label: "The Ghost. I shut down verbal interaction and wait for the emotional tension to dissipate on its own." },
      { id: "B", trait: "replaying", label: "The Auditor. I fixate on exact phrasing, facts, and logical contradictions in what they said." },
      { id: "C", trait: "defending", label: "The Appeaser. I concede my own stance rapidly just to extinguish the terrifying discomfort of conflict." },
      { id: "D", trait: "immediate", label: "The Challenger. I lean forward, amplify my points, and need to feel heard before I can calm down." },
      { id: "E", trait: "fixing", label: "The Mediator. I detach from my own feelings and try to mechanically solve everyone else's dispute." },
      { id: "F", trait: "direct", label: "The Anchor. I stay present in the room, name what I am feeling, and make space for their truth." },
    ],
    contextPlaceholder: "What is your instinctive role in conflict?",
  },
  {
    id: "reflex-misinterpreted-intent",
    dimension: "emotional-reflex",
    dimensionIndex: 4,
    eyebrow: "Your emotional reflex",
    question:
      "When someone whose judgment matters to you completely misjudges your intentions, how does your system react?",
    options: [
      { id: "A", trait: "withdrawal", label: "I quietly give up on them: \"If they could believe that about me, they never knew me anyway.\"" },
      { id: "B", trait: "replaying", label: "I spend immense mental energy drafting unsent messages to prove what I really meant." },
      { id: "C", trait: "defending", label: "I wonder if my communication was so clumsy that their misunderstanding is entirely my fault." },
      { id: "D", trait: "immediate", label: "I demand an immediate confrontation to clear my name, unable to sit with the tension." },
      { id: "E", trait: "fixing", label: "I brush it off as an irrelevant operational misfire and keep moving without emotional processing." },
      { id: "F", trait: "direct", label: "I clarify my intention calmly once, and let them hold whatever perspective they choose." },
    ],
    contextPlaceholder: "How do you handle being fundamentally misjudged?",
  },
];

// =========================================================================
// DIMENSION 5: REAL SUCCESS (Intrinsic Meaning vs Hollow Milestones)
// =========================================================================
const POOL_SUCCESS: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "real-success-hollow-achievement",
    dimension: "real-success",
    dimensionIndex: 5,
    eyebrow: "Your real definition of success",
    question:
      "Imagine you achieve something that everyone around you considers successful. Which version of that achievement would secretly feel the least satisfying?",
    helper: "There's no wrong answer here — this is about what would quietly bother you.",
    options: [
      { id: "A", trait: "disconnection", label: "Having an impressive title or reputation while feeling disconnected from the work I actually do." },
      { id: "B", trait: "time_trade", label: "Having financial comfort but almost no time to enjoy the life I worked for." },
      { id: "C", trait: "unseen", label: "Being admired by many people but not feeling genuinely understood by anyone." },
      { id: "D", trait: "depletion", label: "Being needed by everybody but having very little energy left for myself." },
      { id: "E", trait: "audience", label: "Living a life that looks impressive from the outside but was largely built around other people's expectations." },
      { id: "F", trait: "settled", label: "None of these. I have a reasonably clear idea of what success means to me." },
    ],
    contextPlaceholder: "What would success actually need to feel like?",
  },
  {
    id: "real-success-uneasy-praise",
    dimension: "real-success",
    dimensionIndex: 5,
    eyebrow: "Your real definition of success",
    question:
      "Which kind of public compliment or praise leaves you feeling most uneasy or quietly dissatisfied?",
    options: [
      { id: "A", trait: "disconnection", label: "Being praised for an outcome that required very little of my authentic craft or intellectual depth." },
      { id: "B", trait: "time_trade", label: "Being celebrated for relentless hustle and work ethic when my personal life was falling apart." },
      { id: "C", trait: "unseen", label: "Being treated as a flawless authority figure by people who don't know my actual messy reality." },
      { id: "D", trait: "depletion", label: "Being thanked for always being the selfless martyr who never complains and absorbs all the load." },
      { id: "E", trait: "audience", label: "Receiving prestigious awards or milestones that society values, but that leave me emotionally cold." },
      { id: "F", trait: "settled", label: "I receive recognition with ease because I judge my accomplishments by internal standards." },
    ],
    contextPlaceholder: "What kind of praise makes you uncomfortable?",
  },
  {
    id: "real-success-unacceptable-sacrifice",
    dimension: "real-success",
    dimensionIndex: 5,
    eyebrow: "Your real definition of success",
    question:
      "If reaching the absolute summit of your field required a permanent personal sacrifice, which trade-off would turn the victory into defeat?",
    options: [
      { id: "A", trait: "disconnection", label: "Surrendering my creative independence to build things designed purely for mass commercial vanity." },
      { id: "B", trait: "time_trade", label: "Sacrificing my physical health, unhurried mornings, and everyday sanity just to maintain the position." },
      { id: "C", trait: "unseen", label: "Losing authentic intimacy and genuine trust with the small circle of people who truly matter to me." },
      { id: "D", trait: "depletion", label: "Becoming so chronically drained and reactive that I have no tenderness or humor left for life." },
      { id: "E", trait: "audience", label: "Waking up at the top to discover that I spent decades climbing someone else's mountain." },
      { id: "F", trait: "settled", label: "I would reject all of these trades; my ambitions are firmly anchored to personal non-negotiables." },
    ],
    contextPlaceholder: "What is your non-negotiable line in life?",
  },
  {
    id: "real-success-envy-diagnostic",
    dimension: "real-success",
    dimensionIndex: 5,
    eyebrow: "Your real definition of success",
    question:
      "When you feel an involuntary flash of envy toward someone else's life or accomplishments, what is the core quality you crave?",
    options: [
      { id: "A", trait: "disconnection", label: "The absolute creative freedom they possess to build whatever strange, beautiful things they desire." },
      { id: "B", trait: "time_trade", label: "The unhurried spaciousness of their days and their freedom from constant frantic emergencies." },
      { id: "C", trait: "unseen", label: "The warmth, depth, and safety of the relationships they have built around themselves." },
      { id: "D", trait: "depletion", label: "Their calm, unflappable energy and the clear boundaries they maintain without guilt." },
      { id: "E", trait: "audience", label: "The boldness they show in living on their own terms without needing anyone's permission." },
      { id: "F", trait: "settled", label: "I rarely experience envy; my focus is almost entirely calibrated to my own personal progress." },
    ],
    contextPlaceholder: "What does your envy reveal about your values?",
  },
  {
    id: "real-success-private-self-respect",
    dimension: "real-success",
    dimensionIndex: 5,
    eyebrow: "Your real definition of success",
    question:
      "At the close of an ordinary Tuesday, what must have occurred for you to turn off the lights feeling quiet, unshakeable self-respect?",
    options: [
      { id: "A", trait: "disconnection", label: "I brought something original and substantive into reality through my own genuine craftsmanship." },
      { id: "B", trait: "time_trade", label: "I protected my time, moved at an intentional pace, and avoided giving away my peace." },
      { id: "C", trait: "unseen", label: "I was truly attentive, generous, and present with someone I love without checking my phone." },
      { id: "D", trait: "depletion", label: "I held firm to a necessary boundary and refused to sacrifice myself for another's ease." },
      { id: "E", trait: "audience", label: "I stood by what I believed was right, even when doing so was unpopular or inconvenient." },
      { id: "F", trait: "settled", label: "I showed up with realistic, honest effort and allowed myself to rest without self-judgment." },
    ],
    contextPlaceholder: "What creates authentic pride at the end of the day?",
  },
];

// =========================================================================
// DIMENSION 6: FUTURE RESPONSIBILITY (Agency & The Cost of Inaction)
// =========================================================================
const POOL_FUTURE: Omit<AssessmentQuestion, "index">[] = [
  {
    id: "future-responsibility-audit",
    dimension: "future-responsibility",
    dimensionIndex: 6,
    eyebrow: "The future you're responsible for",
    question:
      "Imagine it is twelve months from today. Your life looks almost exactly the same as it does right now. What would you most regret not addressing?",
    options: [
      { id: "A", trait: "comfort", label: "I continued protecting my comfort more than the goals I repeatedly said mattered to me." },
      { id: "B", trait: "confidence", label: "I kept waiting to feel confident instead of giving myself the experience needed to become confident." },
      { id: "C", trait: "scattered", label: "I spread my attention across too many things and never gave the important ones enough time." },
      { id: "D", trait: "pleasing", label: "I continued saying yes to things while neglecting my own needs and priorities." },
      { id: "E", trait: "avoidance", label: "I avoided a conversation, decision, or change that I already knew I needed to face." },
      { id: "F", trait: "direction", label: "I still haven't figured out what I genuinely want, separate from what other people expect of me." },
      { id: "G", trait: "constraint", label: "My circumstances, resources, or environment genuinely need to change before I can move forward." },
    ],
    contextPlaceholder: "What's actually standing in the way, in your own words?",
  },
  {
    id: "future-deferred-reckoning",
    dimension: "future-responsibility",
    dimensionIndex: 6,
    eyebrow: "The future you're responsible for",
    question:
      "What is the difficult reckoning you already know the answer to, but continue to delay enacting because it will disrupt comfortable routines?",
    options: [
      { id: "A", trait: "comfort", label: "Walking away from a comfortable role or habit that has long since stopped giving me real growth." },
      { id: "B", trait: "confidence", label: "Stepping into the arena with my authentic work instead of remaining a safe, perpetual observer." },
      { id: "C", trait: "scattered", label: "Ruthlessly cutting my commitments in half so I can do two things with true excellence." },
      { id: "D", trait: "pleasing", label: "Setting an uncomfortable boundary with someone who relies on my continuous appeasement." },
      { id: "E", trait: "avoidance", label: "Having a direct, honest conversation that will definitively change the dynamic of a relationship." },
      { id: "F", trait: "direction", label: "Admitting that an ambition I spent years chasing was never truly mine, and choosing a new path." },
      { id: "G", trait: "constraint", label: "I am not postponing an obvious reckoning; I am moving through real-world timing as fast as possible." },
    ],
    contextPlaceholder: "What decision are you putting off?",
  },
  {
    id: "future-quiet-toleration",
    dimension: "future-responsibility",
    dimensionIndex: 6,
    eyebrow: "The future you're responsible for",
    question:
      "What recurring compromise or dynamic in your life would make your future self look back with bewilderment that you tolerated it so long?",
    options: [
      { id: "A", trait: "comfort", label: "Subscribing to low-effort digital habits that drain hours of vital mental energy every single week." },
      { id: "B", trait: "confidence", label: "Waiting for someone else to validate my talent or grant me permission to lead." },
      { id: "C", trait: "scattered", label: "Allowing minor tactical emergencies to continually crowd out the strategic moves that build my future." },
      { id: "D", trait: "pleasing", label: "Absorbing other people's chaos and panic at the expense of my own physical vitality." },
      { id: "E", trait: "avoidance", label: "Staying silent in moments where speaking truth was essential, just to avoid immediate friction." },
      { id: "F", trait: "direction", label: "Living in a reactive mode where everyone else's priorities dictate my daily calendar." },
      { id: "G", trait: "constraint", label: "The current sacrifices I make are tactical, necessary, and temporary responses to real constraints." },
    ],
    contextPlaceholder: "What compromise are you ready to stop tolerating?",
  },
  {
    id: "future-radical-agency",
    dimension: "future-responsibility",
    dimensionIndex: 6,
    eyebrow: "The future you're responsible for",
    question:
      "If you accepted with 100% certainty that no rescuer, perfect mentor, or ideal season is ever coming, what would you initiate by tomorrow morning?",
    options: [
      { id: "A", trait: "comfort", label: "I would stop waiting for ease and begin building the core work I keep putting off." },
      { id: "B", trait: "confidence", label: "I would put my unpolished work in front of real people without waiting to feel fearless." },
      { id: "C", trait: "scattered", label: "I would clear my plate of secondary distractions and establish rigorous daily focus." },
      { id: "D", trait: "pleasing", label: "I would stop apologizing for having high standards and unapologetic boundaries." },
      { id: "E", trait: "avoidance", label: "I would deliver the honest truth to the people who need to hear it, come what may." },
      { id: "F", trait: "direction", label: "I would grant myself full permission to pursue what brings me alive, regardless of who approves." },
      { id: "G", trait: "constraint", label: "I have already embraced radical ownership; my focus is execution within present bounds." },
    ],
    contextPlaceholder: "What changes when you realize nobody is coming?",
  },
  {
    id: "future-ninety-day-trajectory",
    dimension: "future-responsibility",
    dimensionIndex: 6,
    eyebrow: "The future you're responsible for",
    question:
      "If the daily habits, choices, and boundaries of your last 90 days were projected forward across the next five years, where does that trajectory honestly lead?",
    options: [
      { id: "A", trait: "comfort", label: "To a comfortable, respectable existence that quietly falls far short of my real potential." },
      { id: "B", trait: "confidence", label: "To accumulating endless information and notes without ever testing my abilities in the real world." },
      { id: "C", trait: "scattered", label: "To severe mental and physical exhaustion from continually trying to carry too many loose threads." },
      { id: "D", trait: "pleasing", label: "To a deep, corrosive resentment from perpetually subordinating my desires to everyone else." },
      { id: "E", trait: "avoidance", label: "To a painful crisis when the unaddressed reality finally collapses the current structure." },
      { id: "F", trait: "direction", label: "To a quiet drift where months blur together without distinct milestones or self-definition." },
      { id: "G", trait: "constraint", label: "To steady compounding growth and meaningful progress toward the life that truly matters to me." },
    ],
    contextPlaceholder: "Where does your current trajectory point?",
  },
];

// All 30 Questions across the 6 dimensions
export const ALL_30_QUESTIONS: Omit<AssessmentQuestion, "index">[] = [
  ...POOL_NATURAL_SELF,
  ...POOL_DIFFICULTY,
  ...POOL_EXCUSE,
  ...POOL_REFLEX,
  ...POOL_SUCCESS,
  ...POOL_FUTURE,
];

// Letters for option mapping
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Fisher-Yates array shuffle helper
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles options for a question while preserving/mapping clean sequential IDs (A, B, C...)
 * and keeping their psychological `trait` metadata intact.
 */
function shuffleQuestionOptions(options: AnswerOption[]): AnswerOption[] {
  const randomized = shuffle(options);
  return randomized.map((opt, i) => ({
    id: LETTERS[i] || String(i + 1),
    label: opt.label,
    trait: opt.trait,
  }));
}

/**
 * Picks 1 question at random from each of the 6 dimensions (30 questions pool),
 * and randomizes the order of the answers/options for each question.
 * The 6 views will always appear in sequence: 1 through 6.
 */
export function getRandomAssessmentSet(): AssessmentQuestion[] {
  const pools = [
    POOL_NATURAL_SELF,
    POOL_DIFFICULTY,
    POOL_EXCUSE,
    POOL_REFLEX,
    POOL_SUCCESS,
    POOL_FUTURE,
  ];

  return pools.map((pool, dimIndex) => {
    // Pick 1 random question from the 5 questions in this dimension
    const randomIndex = Math.floor(Math.random() * pool.length);
    const baseQuestion = pool[randomIndex];

    // Shuffle the options so they appear in different orders with fresh option IDs
    const shuffledOptions = shuffleQuestionOptions(baseQuestion.options);

    return {
      ...baseQuestion,
      index: dimIndex + 1,
      options: shuffledOptions,
    };
  });
}

// Initial baseline set for SSR and deterministic fallback
export const QUESTIONS: AssessmentQuestion[] = [
  { ...POOL_NATURAL_SELF[0], index: 1 },
  { ...POOL_DIFFICULTY[0], index: 2 },
  { ...POOL_EXCUSE[0], index: 3 },
  { ...POOL_REFLEX[0], index: 4 },
  { ...POOL_SUCCESS[0], index: 5 },
  { ...POOL_FUTURE[0], index: 6 },
];

export const TOTAL_QUESTIONS = 6;
