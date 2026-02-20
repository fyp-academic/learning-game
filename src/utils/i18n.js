export const I18N = {
  en: {
    home: "HOME",
    titleLanding: "TUG: LEARNING ARENA",
    titleGame: "TUG: A MATHEMATICAL GAME",
    chooseMode: "Choose your learning mode",
    readyCompetition: "Ready for Competition",
    modeDesc:
      "Team Blue vs Team Red. Answer correctly to pull the rope. First to cross the dotted line wins.",
    subject: "Subject",
    mathematics: "Mathematics",
    science: "Science",
    comingSoon: "Coming soon",
    language: "Language",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    start: "Start Competition",
    tip: "Tip: Two people can play on the same device.",
    scienceNote: "Science mode is coming soon. Use Mathematics for now.",
    timer: "Timer",
    statusDefault: "Answer correctly to pull the rope.",
    bothCorrect: "Both correct — no movement.",
    correct: "Correct!",
    wrong: "Wrong answer. Try again!",
    timeUp: "Time up!",
    winner: "WINNER",
    playAgain: "Play Again",
    backHome: "Back to Home",
    finalScores: "Final Scores",
    draw: "DRAW"
  },
  sw: {
    home: "NYUMBANI",
    titleLanding: "TUG: UWANJA WA KUJIFUNZA",
    titleGame: "TUG: MCHEZO WA HISABATI",
    chooseMode: "Chagua aina ya mchezo",
    readyCompetition: "Tayari kwa Mashindano",
    modeDesc:
      "Timu Blue dhidi ya Timu Red. Jibu sahihi kuvuta kamba. Anayevuka mstari wa nukta ndiye mshindi.",
    subject: "Somo",
    mathematics: "Hisabati",
    science: "Sayansi",
    comingSoon: "Inakuja",
    language: "Lugha",
    difficulty: "Ugumu",
    easy: "Rahisi",
    medium: "Wastani",
    hard: "Ngumu",
    start: "Anza Mashindano",
    tip: "Dokezo: Watu wawili wanaweza kucheza kwenye kifaa kimoja.",
    scienceNote: "Mode ya Sayansi inakuja. Tumia Hisabati kwa sasa.",
    timer: "Muda",
    statusDefault: "Jibu sahihi ili kuvuta kamba.",
    bothCorrect: "Wote sahihi — hakuna kusogea.",
    correct: "Sahihi!",
    wrong: "Si sahihi. Jaribu tena!",
    timeUp: "Muda umeisha!",
    winner: "MSHINDI",
    playAgain: "Cheza Tena",
    backHome: "Rudi Nyumbani",
    finalScores: "Alama za Mwisho",
    draw: "SARE"
  }
};

export function t(lang, key){
  const pack = I18N[lang] || I18N.en;
  return pack[key] ?? I18N.en[key] ?? key;
}
