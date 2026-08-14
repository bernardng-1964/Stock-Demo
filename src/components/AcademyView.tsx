import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Coins,
  CheckCircle2,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
} from 'lucide-react';
import { AcademyLesson } from '../types';
import { academyLessons, chibiMascots } from '../data/mockData';
import { playChibiSound, formatCoins } from '../utils/formatters';

interface AcademyViewProps {
  onEarnCoins: (amount: number) => void;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
  soundEnabled: boolean;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  onEarnCoins,
  completedLessons,
  onCompleteLesson,
  soundEnabled,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(academyLessons[0].id);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const activeLesson = academyLessons.find((l) => l.id === activeLessonId) || academyLessons[0];
  const mascot = chibiMascots[activeLesson.mascot];
  const isLessonCompleted = completedLessons.includes(activeLesson.id);

  const handleOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    if (soundEnabled) playChibiSound('pop');
    setSelectedOptionIndex(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedOptionIndex === null) return;
    setQuizSubmitted(true);

    const isCorrect = selectedOptionIndex === activeLesson.quiz.correctIndex;
    if (isCorrect) {
      if (soundEnabled) playChibiSound('celebrate');
      setShowCelebration(true);
      if (!isLessonCompleted) {
        onEarnCoins(activeLesson.quiz.coinReward);
        onCompleteLesson(activeLesson.id);
      }
    } else {
      if (soundEnabled) playChibiSound('pop');
    }
  };

  const handleNextLesson = () => {
    const currentIndex = academyLessons.findIndex((l) => l.id === activeLessonId);
    const nextIndex = (currentIndex + 1) % academyLessons.length;
    setActiveLessonId(academyLessons[nextIndex].id);
    setSelectedOptionIndex(null);
    setQuizSubmitted(false);
    setShowCelebration(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner shrink-0 animate-float">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-2xl text-white">Chibi Junior Stock Academy</h2>
              <span className="text-xs bg-amber-400 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
                Earn +250 CC per Quiz!
              </span>
            </div>
            <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
              Read 5-minute illustrated stories with your Chibi mentors, answer the quiz, and collect bonus coins to
              invest in your portfolio!
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shrink-0 flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-300" />
          <div>
            <div className="text-[10px] font-bold uppercase text-blue-200">Academy Progress</div>
            <div className="font-heading font-bold text-sm text-white">
              {completedLessons.length} / {academyLessons.length} Lessons Finished 🌟
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lesson Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {academyLessons.map((lesson, idx) => {
          const isSelected = lesson.id === activeLessonId;
          const isDone = completedLessons.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => {
                if (soundEnabled) playChibiSound('pop');
                setActiveLessonId(lesson.id);
                setSelectedOptionIndex(null);
                setQuizSubmitted(false);
                setShowCelebration(false);
              }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-left font-heading transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-2 border-amber-200'
              }`}
            >
              <span className="text-2xl">{lesson.emoji}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">Lesson {idx + 1}</span>
                  {isDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-100" />
                  )}
                </div>
                <div className="text-xs font-semibold line-clamp-1 max-w-[140px]">
                  {lesson.title.split('(')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Lesson Story & Quiz Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Story Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            {/* Mascot Teacher Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{mascot.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-base text-slate-900">{mascot.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {mascot.role}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{activeLesson.duration} read &bull; Illustrated Story</div>
              </div>
            </div>

            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              {activeLesson.title}
            </h3>
            <p className="text-xs font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-4">
              💡 <strong>Intro:</strong> {activeLesson.intro}
            </p>

            {/* Story Paragraphs with cute numbers */}
            <div className="space-y-3">
              {activeLesson.story.map((para, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-heading font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{para}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaway Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block mb-1">
              🌟 Penny&apos;s Key Takeaway:
            </span>
            <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed">
              {activeLesson.keyTakeaway}
            </p>
          </div>
        </div>

        {/* Interactive Quiz Box (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Lesson Quiz Challenge
                </h4>
              </div>
              <span className="text-xs font-extrabold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-full border border-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                +{activeLesson.quiz.coinReward} CC
              </span>
            </div>

            <p className="text-xs md:text-sm font-bold text-slate-800 mb-4 leading-relaxed">
              {activeLesson.quiz.question}
            </p>

            {/* 4 Quiz Options */}
            <div className="space-y-2.5">
              {activeLesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = idx === activeLesson.quiz.correctIndex;

                let buttonStyle = 'bg-white hover:bg-amber-100/80 border-2 border-amber-200 text-slate-700';

                if (isSelected) {
                  buttonStyle = 'bg-amber-500 text-white border-2 border-amber-600 shadow-xs scale-[1.01]';
                }

                if (quizSubmitted) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 font-bold';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-500 text-white border-2 border-rose-600';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={quizSubmitted}
                    className={`w-full p-3 rounded-2xl text-left text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-start gap-2.5 ${buttonStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/10 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Feedback & Action */}
          <div>
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOptionIndex === null}
                className={`w-full font-heading font-bold text-sm py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 ${
                  selectedOptionIndex !== null
                    ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Check My Answer! 🎯</span>
              </button>
            ) : (
              <div className="space-y-3 animate-coin">
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold border-2 ${
                    selectedOptionIndex === activeLesson.quiz.correctIndex
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-rose-100 text-rose-950 border-rose-300'
                  }`}
                >
                  {selectedOptionIndex === activeLesson.quiz.correctIndex ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎉</span>
                      <div>
                        <strong>Woohoo! You got it right!</strong>
                        <p>{activeLesson.quiz.explanation}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <strong>Oops, not quite!</strong>
                      <p>Penny says: Try reviewing the story again! The correct answer was: {activeLesson.quiz.options[activeLesson.quiz.correctIndex]}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextLesson}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-heading font-bold text-xs py-2.5 rounded-2xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next Quest &rarr;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
