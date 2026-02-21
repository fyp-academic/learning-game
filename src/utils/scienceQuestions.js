import { CHEMISTRY_QUESTIONS } from "../data/science/ChemistryQn.js";
import { CHEMISTRY_ANSWERS } from "../data/science/ChemistryAnswers.js";
import { BIOLOGY_QUESTIONS } from "../data/science/BiologyQn.js";
import { BIOLOGY_ANSWERS } from "../data/science/BiologyAnswers.js";
import { PHYSICS_QUESTIONS } from "../data/science/PhysicsQn.js";
import { PHYSICS_ANSWERS } from "../data/science/PhysicsAnswers.js";

const SCIENCE_SUBJECTS = {
  chemistry: {
    questions: CHEMISTRY_QUESTIONS,
    answers: CHEMISTRY_ANSWERS
  },
  biology: {
    questions: BIOLOGY_QUESTIONS,
    answers: BIOLOGY_ANSWERS
  },
  physics: {
    questions: PHYSICS_QUESTIONS,
    answers: PHYSICS_ANSWERS
  }
};

function randomOf(array){
  return array[Math.floor(Math.random() * array.length)];
}

function resolveBucket(questionSets, difficulty){
  if(questionSets[difficulty]?.length) return questionSets[difficulty];
  if(questionSets.medium?.length) return questionSets.medium;
  const fallbackKey = Object.keys(questionSets).find(key => questionSets[key]?.length);
  return fallbackKey ? questionSets[fallbackKey] : [];
}

export function isScienceSubject(subject){
  return Boolean(SCIENCE_SUBJECTS[subject]);
}

export function getScienceQuestion(subject, difficulty = "easy"){
  const subjectPack = SCIENCE_SUBJECTS[subject];
  if(!subjectPack) return null;

  const bucket = resolveBucket(subjectPack.questions, difficulty);
  if(!bucket.length) return null;

  const question = randomOf(bucket);
  if(!question) return null;

  const answer = subjectPack.answers[question.id];
  if(typeof answer !== "number") return null;

  return {
    type: "mcq",
    subject,
    difficulty,
    id: question.id,
    text: question.prompt,
    options: [...question.options],
    answer
  };
}

export function listScienceSubjects(){
  return Object.keys(SCIENCE_SUBJECTS);
}
