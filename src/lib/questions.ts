import type { AssessmentQuestion } from "./types";

// The six questions are the heart of Trueself. Copy is intentionally
// specific and behavioral rather than generic personality-test phrasing.
// Interpretation meaning is never shown to the user before they answer.
export const QUESTIONS: AssessmentQuestion[] = [
  {
    id: "natural-self",
    index: 1,
    eyebrow: "Your natural self",
    question:
      "When nobody needs anything from you, nobody is watching, and you finally have time to yourself, where does your mind naturally take you?",
    options: [
      { id: "A", label: "I start imagining things I could create, build, or turn into something meaningful." },
      { id: "B", label: "I become curious about something new. I want to discover, learn, explore, or understand." },
      { id: "C", label: "I look for connection. I want to talk to someone, spend time with people, or feel close to someone." },
      { id: "D", label: "I start organizing my life, thinking about unfinished responsibilities, and trying to get everything under control." },
      { id: "E", label: "I escape into distractions. I scroll, watch things, or keep myself occupied without necessarily knowing why." },
      { id: "F", label: "I genuinely want to rest. Sometimes I am simply tired and need space without expectations." },
    ],
    contextPlaceholder: "Tell us what usually happens in real life...",
  },
  {
    id: "response-to-difficulty",
    index: 2,
    eyebrow: "Your response to difficulty",
    question:
      "When something genuinely matters to you, but it starts becoming difficult, which version of yourself usually appears?",
    options: [
      { id: "A", label: "The perfectionist. I keep improving things because showing unfinished work makes me uncomfortable." },
      { id: "B", label: "The procrastinator. I know what I should do, but somehow I keep finding reasons to start later." },
      { id: "C", label: "The overthinker. I research, reconsider, and explore possibilities until making a decision feels exhausting." },
      { id: "D", label: "The sprinter. I become intensely motivated, work hard for a while, then struggle to maintain momentum." },
      { id: "E", label: "The people-pleaser. I put other people's expectations first, even when my own goals suffer." },
      { id: "F", label: "The problem-solver. I break things down, ask for help when necessary, and continue even when progress is slow." },
    ],
    contextPlaceholder: "What does this usually look like for you?",
  },
  {
    id: "the-excuse",
    index: 3,
    eyebrow: "The excuse you might be protecting",
    question:
      "Which sentence do you find yourself saying most often, even though part of you sometimes suspects there is something deeper behind it?",
    options: [
      { id: "A", label: "\"I don't have enough time.\" My attention is often divided, and I struggle to protect what matters." },
      { id: "B", label: "\"I need to prepare a little more.\" I sometimes confuse preparation with avoiding the possibility of failure." },
      { id: "C", label: "\"It's not the right moment.\" Starting something new feels easier to postpone than to face." },
      { id: "D", label: "\"I don't really mind.\" Sometimes I hide what I want because expressing it feels uncomfortable." },
      { id: "E", label: "\"It's fine.\" I sometimes accept situations that I know are not working for me." },
      { id: "F", label: "\"I'm genuinely at capacity.\" Sometimes the problem is not avoidance. I have too much on my plate." },
    ],
    contextPlaceholder: "Is there a specific situation this comes up in?",
  },
  {
    id: "emotional-reflex",
    index: 4,
    eyebrow: "Your emotional reflex",
    question:
      "When someone disappoints you, hurts your feelings, or doesn't meet your expectations, what usually happens inside you before you decide what to say?",
    options: [
      { id: "A", label: "I become quiet. I act as though it didn't matter, even when it did." },
      { id: "B", label: "I replay everything. I analyze what happened and wonder what I might have missed." },
      { id: "C", label: "I defend their behavior. I find reasons to understand them before acknowledging how I feel." },
      { id: "D", label: "I react immediately. I want to address the issue, sometimes before I have fully processed it." },
      { id: "E", label: "I focus on fixing the situation instead of dealing with how it affected me." },
      { id: "F", label: "I try to communicate directly. I explain what bothered me and listen to their perspective." },
    ],
    contextPlaceholder: "Think of a recent time this happened...",
  },
  {
    id: "real-success",
    index: 5,
    eyebrow: "Your real definition of success",
    question:
      "Imagine you achieve something that everyone around you considers successful. Which version of that achievement would secretly feel the least satisfying?",
    helper: "There's no wrong answer here — this is about what would quietly bother you.",
    options: [
      { id: "A", label: "Having an impressive title or reputation while feeling disconnected from the work I actually do." },
      { id: "B", label: "Having financial comfort but almost no time to enjoy the life I worked for." },
      { id: "C", label: "Being admired by many people but not feeling genuinely understood by anyone." },
      { id: "D", label: "Being needed by everybody but having very little energy left for myself." },
      { id: "E", label: "Living a life that looks impressive from the outside but was largely built around other people's expectations." },
      { id: "F", label: "None of these. I have a reasonably clear idea of what success means to me." },
    ],
    contextPlaceholder: "What would success actually need to feel like?",
  },
  {
    id: "future-responsibility",
    index: 6,
    eyebrow: "The future you're responsible for",
    question:
      "Imagine it is October next year. Your life looks almost exactly the same as it does today. What would you most regret not addressing?",
    options: [
      { id: "A", label: "I continued protecting my comfort more than the goals I repeatedly said mattered to me." },
      { id: "B", label: "I kept waiting to feel confident instead of giving myself the experience needed to become confident." },
      { id: "C", label: "I spread my attention across too many things and never gave the important ones enough time." },
      { id: "D", label: "I continued saying yes to things while neglecting my own needs and priorities." },
      { id: "E", label: "I avoided a conversation, decision, or change that I already knew I needed to face." },
      { id: "F", label: "I still haven't figured out what I genuinely want, separate from what other people expect of me." },
      { id: "G", label: "My circumstances, resources, or environment genuinely need to change before I can move forward." },
    ],
    contextPlaceholder: "What's actually standing in the way, in your own words?",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
