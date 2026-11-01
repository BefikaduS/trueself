import type { AnalysisResult, SubmittedAnswer } from "../types";

// Demo-mode analysis generator.
//
// When no AI credential is configured, Trueself still needs to produce a
// genuinely personalized report instead of one fixed placeholder. This
// module maps each selected option to short, honest interpretive
// fragments (written in the same voice as the AI prompt) and assembles
// them into a full report referencing the user's real choices. The UI
// always labels this clearly as "demo analysis" — it is never presented
// as if a model produced it.

type Letter = string;

function pick<T>(byLetter: Record<Letter, T>, letter: string, fallback: T): T {
  return byLetter[letter] ?? fallback;
}

const Q1_MOTIVE: Record<Letter, { trait: string; fragment: string }> = {
  A: { trait: "a builder's instinct", fragment: "your mind drifts toward making something — an idea, a project, a piece of work that didn't exist before" },
  B: { trait: "genuine curiosity", fragment: "you reach for something new to learn or understand the moment the pressure is off" },
  C: { trait: "a pull toward connection", fragment: "free time quickly turns into wanting to be near or close to someone" },
  D: { trait: "a need for order", fragment: "your mind goes straight to unfinished responsibilities and the feeling of things being under control" },
  E: { trait: "a tendency to self-distract", fragment: "you reach for distraction fairly automatically, often without a clear reason" },
  F: { trait: "an honest need for rest", fragment: "what you actually want, more than anything else, is to stop performing and just rest" },
};

const Q2_RESPONSE: Record<Letter, { trait: string; fragment: string }> = {
  A: { trait: "perfectionism", fragment: "you keep refining things because showing unfinished work feels uncomfortable" },
  B: { trait: "procrastination", fragment: "you know exactly what to do, yet keep finding legitimate-sounding reasons to start later" },
  C: { trait: "overthinking", fragment: "you research and reconsider until the decision itself becomes exhausting" },
  D: { trait: "a start-stop rhythm", fragment: "you burn bright for a while and then struggle to keep the momentum going" },
  E: { trait: "people-pleasing under pressure", fragment: "other people's expectations quietly take priority over your own goals" },
  F: { trait: "steady problem-solving", fragment: "you break the problem down and keep moving even when progress is slow" },
};

const Q3_EXCUSE: Record<Letter, { trait: string; fragment: string; isConstraint: boolean }> = {
  A: { trait: "divided attention", fragment: "\"I don't have enough time\" shows up often, and your attention genuinely struggles to stay protected", isConstraint: false },
  B: { trait: "preparation as a shield", fragment: "\"I need to prepare a little more\" sometimes doubles as a way to postpone the risk of failing", isConstraint: false },
  C: { trait: "timing as an exit", fragment: "\"it's not the right moment\" tends to appear exactly when starting would require facing something uncertain", isConstraint: false },
  D: { trait: "muted wants", fragment: "\"I don't really mind\" often covers a preference you didn't feel comfortable stating", isConstraint: false },
  E: { trait: "quiet over-tolerance", fragment: "\"it's fine\" sometimes gets said about situations you already know aren't working", isConstraint: false },
  F: { trait: "real capacity limits", fragment: "\"I'm genuinely at capacity\" reads less like avoidance and more like an accurate description of your current load", isConstraint: true },
};

const Q4_REFLEX: Record<Letter, { trait: string; fragment: string }> = {
  A: { trait: "withdrawal", fragment: "you tend to go quiet and act like it didn't matter, even when it clearly did" },
  B: { trait: "internal replaying", fragment: "you replay the moment and search for what you might have missed" },
  C: { trait: "defending the other person first", fragment: "you look for reasons to understand them before you let yourself feel the disappointment" },
  D: { trait: "an immediate reaction", fragment: "you want to address it right away, sometimes before you've fully processed it" },
  E: { trait: "fixing over feeling", fragment: "you move straight to solving the situation instead of sitting with how it affected you" },
  F: { trait: "direct communication", fragment: "you tend to say what bothered you and stay open to hearing their side" },
};

const Q5_SUCCESS: Record<Letter, { trait: string; fragment: string }> = {
  A: { trait: "disconnection from the work itself", fragment: "a title that looks impressive but feels disconnected from the actual work would quietly bother you" },
  B: { trait: "traded time", fragment: "financial comfort without the time to enjoy it would feel like the wrong trade" },
  C: { trait: "being seen without being known", fragment: "being widely admired but not genuinely understood would feel hollow" },
  D: { trait: "depletion from being needed", fragment: "being needed by everyone while having nothing left for yourself would feel like a loss, not a win" },
  E: { trait: "a life built for an audience", fragment: "a life that looks impressive but was built around other people's expectations would feel like it isn't fully yours" },
  F: { trait: "a settled sense of success", fragment: "you already have a reasonably clear, personal definition of what success means to you" },
};

const Q6_REGRET: Record<Letter, { trait: string; fragment: string }> = {
  A: { trait: "comfort over commitment", fragment: "protecting comfort more than the goals you say matter" },
  B: { trait: "waiting for confidence", fragment: "waiting to feel confident instead of building the experience that creates confidence" },
  C: { trait: "scattered attention", fragment: "spreading attention across too much and never giving the important things enough room" },
  D: { trait: "neglected needs", fragment: "saying yes to others while your own needs quietly go unmet" },
  E: { trait: "an avoided conversation", fragment: "avoiding a conversation, decision or change you already know you need to face" },
  F: { trait: "unclear personal direction", fragment: "still not knowing what you genuinely want, separate from what's expected of you" },
  G: { trait: "a real external constraint", fragment: "circumstances or resources that genuinely need to change before you can move forward" },
};

const TRAIT_TO_LETTER_D1: Record<string, string> = {
  builder: "A", curious: "B", connector: "C", organizer: "D", distractor: "E", rest: "F"
};
const TRAIT_TO_LETTER_D2: Record<string, string> = {
  perfectionist: "A", procrastinator: "B", overthinker: "C", sprinter: "D", pleaser: "E", solver: "F"
};
const TRAIT_TO_LETTER_D3: Record<string, string> = {
  time: "A", preparation: "B", timing: "C", suppression: "D", tolerance: "E", capacity: "F"
};
const TRAIT_TO_LETTER_D4: Record<string, string> = {
  withdrawal: "A", replaying: "B", defending: "C", immediate: "D", fixing: "E", direct: "F"
};
const TRAIT_TO_LETTER_D5: Record<string, string> = {
  disconnection: "A", time_trade: "B", unseen: "C", depletion: "D", audience: "E", settled: "F"
};
const TRAIT_TO_LETTER_D6: Record<string, string> = {
  comfort: "A", confidence: "B", scattered: "C", pleasing: "D", avoidance: "E", direction: "F", constraint: "G"
};

function resolveLetter(ans?: SubmittedAnswer, map?: Record<string, string>, fallback = "A"): string {
  if (ans?.trait && map && map[ans.trait]) {
    return map[ans.trait];
  }
  return ans?.optionId || fallback;
}

function answerFor(answers: SubmittedAnswer[], index: number) {
  return answers[index];
}

export function generateDemoAnalysis(name: string, answers: SubmittedAnswer[]): AnalysisResult {
  const a1 = answerFor(answers, 0);
  const a2 = answerFor(answers, 1);
  const a3 = answerFor(answers, 2);
  const a4 = answerFor(answers, 3);
  const a5 = answerFor(answers, 4);
  const a6 = answerFor(answers, 5);

  const k1 = resolveLetter(a1, TRAIT_TO_LETTER_D1, "F");
  const k2 = resolveLetter(a2, TRAIT_TO_LETTER_D2, "F");
  const k3 = resolveLetter(a3, TRAIT_TO_LETTER_D3, "F");
  const k4 = resolveLetter(a4, TRAIT_TO_LETTER_D4, "F");
  const k5 = resolveLetter(a5, TRAIT_TO_LETTER_D5, "F");
  const k6 = resolveLetter(a6, TRAIT_TO_LETTER_D6, "F");

  const m1 = pick(Q1_MOTIVE, k1, Q1_MOTIVE.F);
  const m2 = pick(Q2_RESPONSE, k2, Q2_RESPONSE.F);
  const m3 = pick(Q3_EXCUSE, k3, Q3_EXCUSE.F);
  const m4 = pick(Q4_REFLEX, k4, Q4_REFLEX.F);
  const m5 = pick(Q5_SUCCESS, k5, Q5_SUCCESS.F);
  const m6 = pick(Q6_REGRET, k6, Q6_REGRET.F);

  const firstName = name?.trim() || "You";

  const portraitSummary = `${firstName}, your answers point to someone shaped by ${m1.trait} — ${m1.fragment}. Under pressure, ${m2.trait} tends to take over: ${m2.fragment}. The sentence you reach for most, "${a3?.optionText.split(".")[0].replace(/"/g, "")}", suggests ${m3.isConstraint ? "a real limitation worth taking seriously rather than explaining away" : m3.trait}. Emotionally, your reflex leans toward ${m4.trait} — ${m4.fragment}. And the version of success that would quietly disappoint you reveals what you actually value: ${m5.fragment} None of this is the whole picture, but together it's a fairly consistent sketch of how you operate when no one is grading the performance.`;

  const honestTruthObservation = m3.isConstraint
    ? `You described your current capacity honestly rather than hiding behind a vaguer excuse, and that's worth noticing. But your answers also suggest ${m2.trait} and ${m6.trait} show up even outside moments of genuine overload. It might be worth asking which parts of your "full plate" are truly fixed, and which have quietly become permanent because re-negotiating them feels harder than carrying them.`
    : `You seem to know fairly clearly what you want — your answer about success wasn't vague. But knowing what you want and consistently making room for it look like two different things here. The excuse you reach for most ("${a3?.optionText.split(".")[0].replace(/"/g, "")}") and your response to difficulty (${m2.trait}) point in the same direction: it's possible you protect the comfort of not fully committing more than you protect the progress of actually finishing.`;

  const strengthMap: Record<string, { title: string; description: string; howToUseIt: string }> = {
    A: {
      title: "You can turn ambiguity into something concrete",
      description: `Your instinct toward ${m1.trait} combined with ${m2.trait} suggests you don't just enjoy ideas — you're capable of building things that matter to you, even if finishing them is the harder part.`,
      howToUseIt: "Protect a small, recurring block of time where the only goal is visible progress, not perfect progress.",
    },
    B: {
      title: "Your curiosity is a genuine asset, not a distraction",
      description: "Wanting to learn and understand things isn't incidental for you — it's one of your clearest sources of energy, and it shows up even when nothing is demanding it.",
      howToUseIt: "Point that curiosity at the thing you've been avoiding instead of only at new, low-stakes topics.",
    },
    C: {
      title: "You read people and situations well",
      description: `Your pull toward ${m1.trait} paired with ${m4.trait} suggests real relational attentiveness — you notice what's happening between you and other people, even when it costs you something.`,
      howToUseIt: "Use that same attentiveness on your own needs, not only on everyone else's.",
    },
  };
  const strength = strengthMap[a1?.optionId] ?? strengthMap.A;

  const blindSpots: AnalysisResult["blindSpots"] = [];
  blindSpots.push({
    title: m2.trait === "procrastination" ? "The preparation trap" : `The cost of ${m2.trait}`,
    pattern: `When things get difficult, ${m2.fragment}. Combined with how you described success (${m5.trait}), this can quietly become a way of avoiding the discomfort of an imperfect attempt.`,
    relatedAnswers: [`Q2 (${a2?.optionId})`, `Q5 (${a5?.optionId})`],
    everydayImpact: "Projects and decisions that matter to you take longer to start than they need to, which can make them feel heavier over time.",
    howToNotice: "Notice the next time you choose one more round of preparation — ask honestly whether it adds value or just delays the risk.",
  });
  if (!m3.isConstraint) {
    blindSpots.push({
      title: "The explanation that does extra work",
      pattern: `"${a3?.optionText.split(".")[0].replace(/"/g, "")}" shows up often. Your answers suggest it sometimes explains a real limit, and sometimes stands in for something less comfortable to admit.`,
      relatedAnswers: [`Q3 (${a3?.optionId})`, `Q6 (${a6?.optionId})`],
      everydayImpact: "It can be hard for the people around you — and for you — to tell which situation you're actually in.",
      howToNotice: "Before saying it next time, finish the sentence privately: \"...and if that weren't true, I would also need to admit ___.\"",
    });
  }
  blindSpots.push({
    title: m4.trait === "withdrawal" || m4.trait === "defending the other person first" ? "Feelings that arrive late" : "Reacting before reflecting",
    pattern: `Your emotional reflex (${m4.trait}) suggests feelings get processed ${m4.trait === "an immediate reaction" ? "out loud, before you've fully sat with them" : "privately, sometimes well after the moment has passed"}.`,
    relatedAnswers: [`Q4 (${a4?.optionId})`],
    everydayImpact: "People close to you may not always know what actually affected you, which can make patterns repeat.",
    howToNotice: "Try naming the feeling to yourself, in one sentence, before deciding what to say or do about it.",
  });

  const contradictions: AnalysisResult["contradictions"] = [
    {
      valuedThing: `A life that reflects ${m5.trait === "a settled sense of success" ? "your own definition of success" : `avoiding ${m5.trait}`}`,
      observedBehavior: `${m6.fragment}`,
      possibleContradiction: `You seem to know what you don't want, but your answers suggest the daily behavior (${m2.trait}, ${m3.isConstraint ? "a genuinely full plate" : m3.trait}) doesn't yet consistently point toward what you do want.`,
      wayForward: "Pick one concrete decision this month that would move you toward your own definition of success, even if it's small.",
    },
  ];

  const stages = [
    `A real desire shows up (${m1.trait})`,
    `It meets difficulty and triggers ${m2.trait}`,
    m3.isConstraint ? "Genuine capacity limits slow things down" : `"${a3?.optionText.split(".")[0].replace(/"/g, "")}" gets used to explain the delay`,
    `Feelings about it get processed via ${m4.trait}`,
    "Frustration builds quietly",
    "A short burst of motivation resets the cycle",
  ];

  const stopDoing = {
    action: m2.trait === "perfectionism" ? "Treating 'not ready yet' as a stopping point instead of a feeling to work alongside." : `Letting "${a3?.optionText.split(".")[0].replace(/"/g, "")}" close the conversation before you've checked if it's fully true.`,
    reason: "It postpones the exact moments that would otherwise build real evidence that you can handle imperfect progress.",
  };
  const startDoing = {
    action: `Giving yourself permission to produce one unfinished, visible step toward ${m1.trait === "a builder's instinct" ? "the thing you want to build" : "the thing you've been circling"} — on a regular, small schedule.`,
    reason: "Visible, imperfect progress is the fastest way to break a cycle that depends on waiting to feel ready.",
  };

  const priorities = [
    `Protect time for ${m1.trait === "a builder's instinct" ? "meaningful, unfinished-looking work" : "the thing that actually energizes you"}, before the day fills up with everything else.`,
    `Get more comfortable with ${m2.trait === "perfectionism" ? "imperfect, visible progress" : "steady effort without needing a motivation spike"}.`,
    `Say the true sentence instead of the convenient one, especially around "${a3?.optionText.split(".")[0].replace(/"/g, "")}".`,
  ];

  const sevenDayPlan: AnalysisResult["sevenDayPlan"] = [
    { day: 1, title: "Name it", action: "Write one honest sentence about what you're currently avoiding or postponing.", minutes: 10, purpose: "Clarity before action." },
    { day: 2, title: "Fifteen minutes", action: `Spend 15 minutes on the thing tied to ${m1.trait}, without optimizing or researching first.`, minutes: 15, purpose: "Break the starting barrier." },
    { day: 3, title: "Say the real thing", action: "Replace one instance of your default excuse with a more honest sentence, even just to yourself.", minutes: 5, purpose: "Weaken the automatic script." },
    { day: 4, title: "Rest on purpose", action: "Take 20 minutes of rest with zero screens, and actually call it rest instead of a break.", minutes: 20, purpose: "Separate genuine rest from distraction." },
    { day: 5, title: "One honest conversation", action: "Say one true, slightly uncomfortable thing to someone you trust.", minutes: 15, purpose: `Practice ${m4.trait === "direct communication" ? "doing it even when it's harder than usual" : "a more direct version of your emotional reflex"}.` },
    { day: 6, title: "Unfinished is fine", action: "Share an unfinished version of something you're working on with one person.", minutes: 20, purpose: "Build tolerance for visible imperfection." },
    { day: 7, title: "Look back honestly", action: "Reread what you wrote on day 1 and note what actually changed, without judging what didn't.", minutes: 10, purpose: "Turn the week into evidence, not a verdict." },
  ];

  const thirtyDayExperiment = {
    focusArea: priorities[0],
    behavior: `Produce one small, visible step related to ${m1.trait === "a builder's instinct" ? "your project" : "your priority"} before doing anything else that doesn't require focus.`,
    frequency: "4-5 times per week",
    successLooksLike: "More days with a visible step taken than days without — not perfection, just a better ratio than today.",
    ifYouMissADay: "Note it without penalty and continue the next day. One missed day is data, not a failure.",
    howProgressIsEvaluated: "At day 30, compare how many days you showed up versus week one, and re-read your day-1 and day-7 notes from the first week.",
  };

  const finalNote = `${firstName}, none of this means you're broken or behind — it means there's a fairly consistent pattern in how you handle the gap between what you want and what's difficult. You already know more about yourself than this report does; it just put a few things next to each other you might not have looked at side by side. The next month isn't about becoming a different person. It's about collecting a little more honest evidence about what actually works for you.`;

  return {
    portrait: {
      title: "Here's the person your answers are describing.",
      summary: portraitSummary,
      supportingAnswers: [`Q1 (${a1?.optionId})`, `Q2 (${a2?.optionId})`, `Q5 (${a5?.optionId})`],
      confidence: "moderate",
    },
    honestTruth: {
      title: "Something you might not want to hear.",
      observation: honestTruthObservation,
      supportingAnswers: [`Q2 (${a2?.optionId})`, `Q3 (${a3?.optionId})`, `Q6 (${a6?.optionId})`],
      reasoning: "This observation connects your stated response to difficulty with the explanation you reach for most often and the regret you anticipate.",
      confidence: "moderate",
    },
    strength: {
      title: "Something you might not give yourself enough credit for.",
      description: strength.description,
      supportingAnswers: [`Q1 (${a1?.optionId})`],
      howToUseIt: strength.howToUseIt,
    },
    blindSpots,
    contradictions,
    behaviorPattern: {
      stages,
      explanation: "This is one plausible cycle suggested by your answers — not a fixed loop. Mark whether it feels accurate; your own read matters more than this inference.",
    },
    stopDoing,
    startDoing,
    priorities,
    next24Hours: {
      action: `Spend 20 minutes today on the thing tied to ${m6.fragment}. Don't research, don't restart the plan — produce one small, unfinished, tangible result.`,
      purpose: "A single small action breaks the pattern faster than any amount of planning.",
    },
    sevenDayPlan,
    thirtyDayExperiment,
    finalNote,
  };
}
