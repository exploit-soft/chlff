// import classes from './Game.module.css';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../app/store';
// import Puzzle from './Puzzle';
// import QuestionsPage from './Questions';
// import { revealPiece, selectRandomPiece, addTime, decrementTimer, resetGame } from '../../../features/puzzleSlice';
// import questionsData from '../../../data/questions/questions.json';
// import confetti from 'canvas-confetti';
// import { motion } from 'framer-motion';
// import profilePhoto from '/assets/bear-profile-photo.png';
// import Progress from '../../Shared/Progress/Progress';
// import Overlay from '../../Shared/Overlay/Overlay';
// import GameScoreModal from '../../Modals/GameScoreModal/GameScoreModal';

// const imageUrls = [
//   '/assets/bear-profile-photo.png',
//   '/assets/avatar/african avatar.png',
//   '/assets/avatar/asian avatar.png',
//   '/assets/avatar/boy avatar.png',
//   '/assets/avatar/cute avatar.png',
//   '/assets/avatar/excited avatar.png',
//   '/assets/avatar/fashion boy.png',
//   '/assets/avatar/girl avatar.png',
//   '/assets/avatar/glass-girl avatar.png',
//   '/assets/avatar/teacher avatar.png',
// ];

// const backgroundColors = [
//   'bg-blue-400',
//   'bg-green-400',
//   'bg-red-400',
//   'bg-yellow-400',
// ];

// interface QuestionType {
//   id: number;
//   question: string;
//   answer: string;
//   options: string[];
// }

// const players = [
//   { first_name: 'Ziyech', last_name: 'Hakim', level: 5 },
//   { first_name: 'Mount', last_name: 'Mason', level: 4 },
//   { first_name: 'Mainoo', last_name: 'Kobbie', level: 3 },
//   { first_name: 'Garnacho', last_name: 'Alejandro', level: 2 },
//   { first_name: 'Ziyech', last_name: 'Hakim', level: 5 },
//   { first_name: 'Mount', last_name: 'Mason', level: 4 },
//   { first_name: 'Mainoo', last_name: 'Kobbie', level: 3 },
//   { first_name: 'Garnacho', last_name: 'Alejandro', level: 2 },
// ];

// const variants = {
//   open: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       y: { stiffness: 1000, velocity: -100 },
//     },
//   },
//   closed: {
//     y: 50,
//     opacity: 0,
//     transition: {
//       y: { stiffness: 1000 },
//     },
//   },
// };

// const getRandomPhotoSet = () => {
//   const photoSets = ['bear', 'zebra', 'elephant', 'lion', 'tiger'];
//   const randomIndex = Math.floor(Math.random() * photoSets.length);
//   return photoSets[randomIndex];
// };

// const Game: React.FC = () => {
//   const dispatch = useDispatch();
//   const state = useSelector((state: RootState) => state.puzzle);
//   const [feedbackPiece, setFeedbackPiece] = useState<number | null>(null);
//   const [showPopup, setShowPopup] = useState<boolean>(false);
//   const [borderColor, setBorderColor] = useState<string>('');
//   const [questions] = useState<QuestionType[]>(questionsData);
//   const [correctAnswers, setCorrectAnswers] = useState<number>(0);
//   const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
//   const [gameEnded, setGameEnded] = useState<boolean>(false);
//   const [showModal, setShowModal] = useState(false);
//   const [gameRunning, setGameRunning] = useState<boolean>(false);

//   const [playerImages, setPlayerImages] = useState<string[]>([]);
//   const [playerBackgroundColors, setPlayerBackgroundColors] = useState<string[]>([]);
//   const [photoSet] = useState(getRandomPhotoSet());

//   useEffect(() => {
//     const images = players.map(() => imageUrls[Math.floor(Math.random() * imageUrls.length)]);
//     const colors = players.map(() => backgroundColors[Math.floor(Math.random() * backgroundColors.length)]);

//     setPlayerImages(images);
//     setPlayerBackgroundColors(colors);
//   }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setGameRunning(false);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (state.timeLeft > 0 && !gameEnded && gameRunning) {
//       const timer = setInterval(() => {
//         dispatch(decrementTimer());
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (state.timeLeft <= 0 && !gameEnded) {
//       handleGameEnd();
//     }
//   }, [dispatch, state.timeLeft, gameEnded, gameRunning]);

//   // const wonAudio = new Audio('./sound/point.wav');
//   const wonAudio = new Audio('/sound/point.wav');
//   const lostAudio = new Audio('/sound/negative.wav');

//   const handleGameEnd = () => {
//     setGameEnded(true);
//     setShowModal(true);
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   };

//   const handleAnswerSubmit = (answer: string) => {
//     if (state.timeLeft <= 0 || state.selectedPiece === null || gameEnded) return;

//     const question = questions[state.selectedPiece];
//     if (!question) return;

//     if (answer.toLowerCase() === question.answer.toLowerCase()) {
//       dispatch(revealPiece());
//       setCorrectAnswers((prev) => prev + 1);

//       if (state.revealedPieces.length + 1 === questions.length) {
//         handleGameEnd();
//         return;
//       }

//       dispatch(selectRandomPiece());
//       dispatch(addTime(3));
//       setFeedbackPiece(state.selectedPiece);
//       setBorderColor('border-green-500');
//       setShowPopup(true);
//       wonAudio.play();
//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//       });
//       setTimeout(() => setShowPopup(false), 1000);
//     } else {
//       setIncorrectAnswers((prev) => prev + 1);
//       setFeedbackPiece(state.selectedPiece);
//       setBorderColor('border-red-500');
//       lostAudio.play();
//     }

//     setTimeout(() => {
//       setFeedbackPiece(null);
//       setBorderColor('');
//     }, 1000);
//   };

//   const restartGame = () => {
//     setShowModal(false);
//     dispatch(resetGame());
//     setCorrectAnswers(0);
//     setIncorrectAnswers(0);
//     setGameEnded(false);
//     dispatch(selectRandomPiece());
//     setGameRunning(true);
//   };

//   const currentQuestion = state.selectedPiece !== null ? questions[state.selectedPiece] : null;

//   return (
//     <main className="min-h-screen container mx-auto p-5">
//       {!gameRunning && !gameEnded && (
//         <Overlay opened={true}>

//           <div className="flex justify-center items-center h-screen">
//             <button
//               onClick={restartGame}
//               className="bg-blue-500 text-white p-4 rounded-lg shadow-lg"
//             >
//               Start Game
//             </button>
//           </div>
//         </Overlay >

//       )}

//       {gameRunning && (
//         <div>
//           <div className={classes.title}>
//             <h1>Picture Puzzle</h1>
//           </div>
//           <div className='flex justify-center items-center space-x-3 mx-10'>
//             <div className='md:w-1/5 hidden md:block'>
//               <div className='h-[38rem] bg-blue-400 rounded-xl p-2 backdrop-blur-sm bg-opacity-10 z-10 backdrop shadow-xl text-gray-800'>
//                 <div className='leader-board'>
//                   <p className='leader-board-title'>LeaderBoard</p>
//                   <div className='leader-board-players'>
//                     {players.map((item, index) => (
//                       <motion.div
//                         variants={variants}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                         className='leader-board-player'
//                         key={index.toString()}
//                       >
//                         <div className='mx-auto w-full'>
//                           <div className='flex items-center py-1 px-1'>
//                             <span className={`w-10 h-10 rounded-full object-cover ${playerBackgroundColors[index]} flex justify-center items-center`}>
//                               <img src={playerImages[index]} alt={`${item.first_name}'s profile`} className='h-9' />
//                             </span>
//                             <div className='flex items-center px-2'>
//                               <p className='text-lg mr-4 text-black'>{item.first_name}</p>
//                               <p className='text-sm text-black'>Lv{index + 1}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className='md:w-3/5 lg:w-3/5'>
//               <section className="flex-1 bg-blue-400 bg-opacity-10 backdrop-blur-sm rounded-2xl mb-2">
//                 <Puzzle  photoSet={photoSet} feedbackPiece={feedbackPiece} revealedPieces={state.revealedPieces} borderColor={borderColor} />
//               </section>

//               <section className="flex-1 bg-gradient-to-b  from-[#397eb7] to-blue-400 rounded-lg shadow-lg flex items-center justify-center">
//                 {currentQuestion ? (
//                   <QuestionsPage question={currentQuestion} onAnswerSubmit={handleAnswerSubmit} />
//                 ) : (
//                   <p>No question selected</p>
//                 )}
//               </section>
//             </div>

//             <div className='w-1/5 hidden md:block'>
//               <div className='h-[38rem] bg-blue-400 rounded-xl backdrop-blur-sm bg-opacity-20 z-10 backdrop shadow-xl text-gray-800'>
//                 <div>
//                   <div className="flex items-center p-2">
//                     <span className="w-16 h-16 rounded-full object-cover mr-4 bg-blue-400 flex justify-center items-center">
//                       <img src={profilePhoto} alt={`${name}'s profile`} className='h-12' />

//                     </span>
//                     <div className="flex-1">
//                       <h2 className="text-2xl text-black font-semibold">Nathan</h2>
//                       <p className="text-gray-800 text-sm"><span className='mr-2'> &#x2022;</span>Class</p>
//                       <p className="text-gray-800 text-sm"> <span className='mr-2'> &#x2022;</span>School</p>
//                     </div>
//                   </div>
//                   <p className='text-center text-black'>LEVEL</p>

//                   <Progress />
//                 </div>
//                 <div>
//                   <div className='flex items-center mt-3 bg-[#397eb7]'>
//                     <p className='bg-black mr-2 text-center p-3.5 py-5 text-yellow-400'>TIME</p>
//                     <div className='ml-6'>
//                       <p className='text-yellow-400 text-center text-6xl'>{state.timeLeft}</p>
//                       <p className='text-sm text-yellow-400 text-center '>Seconds Left</p>
//                     </div>
//                   </div>

//                   <div className='flex justify-apart items-center py-1'>
//                     <p className='w-1/3 mr-2 text-center py-3 text-black'>{correctAnswers}</p>
//                     <p className='text-lg text-black'>Correct answers</p>
//                   </div>
//                   <hr className="border-gray-500 border-t-2" />
//                   <div className='flex justify-apart items-center py-1'>
//                     <p className='w-1/3 mr-2 text-center py-3 text-black'>{incorrectAnswers}</p>
//                     <p className='text-lg text-black'>Incorrect answers</p>
//                   </div>

//                 </div>
//                 <div className='bg-[#397eb7] pb-4'>
//                   <h3 className='text-center text-white pt-2'>INSTRUCTIONS</h3>
//                   <p className='text-center text-sm  mt-2'>1.) Click on the correct option to reveal a picture piece</p>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {showPopup && (
//             <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-4 rounded shadow-lg">
//               +3 seconds!
//             </div>
//           )}

//         </div>
//       )}

//       <Overlay opened={showModal}>
//         <GameScoreModal title="Your Result">
//           <div className="mt-2 py-12">
//             <div className="h-24 w-24 bg-indigo-800 rounded-full mx-auto flex justify-center items-center">
//               <div>
//                 <p className="text-7xl text-center"> {correctAnswers}</p>
//                 <p className="text-xs text-gray-300 text-center">of 30</p>
//               </div>
//             </div>
//             <div
//               onClick={restartGame}
//               className="flex mt-12 cursor-pointer justify-center items-center text-white bg-indigo-900 hover:bg-indigo-700 py-1 px-4 rounded"
//             >
//               Replay
//             </div>
//           </div>
//         </GameScoreModal>
//       </Overlay>
//     </main>
//   );
// };

// export default Game;

import classes from './Game.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import Puzzle from './Puzzle';
import QuestionsPage from './Questions';
import {
  revealPiece,
  selectRandomPiece,
  addTime,
  decrementTimer,
  resetGame,
} from '../../../features/puzzleSlice';
import questionsData from '../../../data/questions/questions.json';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import profilePhoto from '/assets/bear-profile-photo.png';
import Progress from '../../Shared/Progress/Progress';
import Overlay from '../../Shared/Overlay/Overlay';
import GameScoreModal from '../../Modals/GameScoreModal/GameScoreModal';

const imageUrls = [
  '/assets/bear-profile-photo.png',
  '/assets/avatar/african avatar.png',
  '/assets/avatar/asian avatar.png',
  '/assets/avatar/boy avatar.png',
  '/assets/avatar/cute avatar.png',
  '/assets/avatar/excited avatar.png',
  '/assets/avatar/fashion boy.png',
  '/assets/avatar/girl avatar.png',
  '/assets/avatar/glass-girl avatar.png',
  '/assets/avatar/teacher avatar.png',
];

const backgroundColors = [
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-green-400 to-green-600',
  'bg-gradient-to-br from-yellow-400 to-yellow-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-red-400 to-red-600',
];

interface QuestionType {
  id: number;
  question: string;
  answer: string;
  options: string[];
}

const players = [
  { first_name: 'Emma', last_name: 'Star', level: 5, emoji: '⭐' },
  { first_name: 'Liam', last_name: 'Rocket', level: 4, emoji: '🚀' },
  { first_name: 'Zoe', last_name: 'Rainbow', level: 3, emoji: '🌈' },
  { first_name: 'Max', last_name: 'Thunder', level: 2, emoji: '⚡' },
  { first_name: 'Lily', last_name: 'Sparkle', level: 5, emoji: '✨' },
  { first_name: 'Noah', last_name: 'Adventure', level: 4, emoji: '🏰' },
  { first_name: 'Mia', last_name: 'Magic', level: 3, emoji: '🦄' },
  { first_name: 'Leo', last_name: 'Hero', level: 2, emoji: '🦸' },
];

const variants = {
  open: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    scale: 0.8,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const bounceVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, -1, 0],
    transition: {
      rotate: {
        repeat: Infinity,
        duration: 0.5,
      },
    },
  },
  tap: {
    scale: 0.95,
  },
};

const getRandomPhotoSet = () => {
  const photoSets = ['bear', 'zebra', 'elephant', 'lion', 'tiger'];
  const randomIndex = Math.floor(Math.random() * photoSets.length);
  return photoSets[randomIndex];
};

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.puzzle);
  const [feedbackPiece, setFeedbackPiece] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>('');
  const [questions] = useState<QuestionType[]>(questionsData);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [playerImages, setPlayerImages] = useState<string[]>([]);
  const [playerBackgroundColors, setPlayerBackgroundColors] = useState<
    string[]
  >([]);
  const [photoSet] = useState(getRandomPhotoSet());
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);

  useEffect(() => {
    const images = players.map(
      () => imageUrls[Math.floor(Math.random() * imageUrls.length)]
    );
    const colors = players.map(
      () =>
        backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    );
    const emojis = ['🎉', '🎊', '🌟', '✨', '🎈', '🎁', '🏆', '👏'];

    setPlayerImages(images);
    setPlayerBackgroundColors(colors);
    setCelebrationEmojis(emojis);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setGameRunning(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (state.timeLeft > 0 && !gameEnded && gameRunning) {
      const timer = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
      return () => clearInterval(timer);
    } else if (state.timeLeft <= 0 && !gameEnded) {
      handleGameEnd();
    }
  }, [dispatch, state.timeLeft, gameEnded, gameRunning]);

  const wonAudio = new Audio('/sound/point.wav');
  const lostAudio = new Audio('/sound/negative.wav');

  const handleGameEnd = () => {
    setGameEnded(true);
    setShowModal(true);
    // Enhanced confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleAnswerSubmit = (answer: string) => {
    if (state.timeLeft <= 0 || state.selectedPiece === null || gameEnded)
      return;

    const question = questions[state.selectedPiece];
    if (!question) return;

    if (answer.toLowerCase() === question.answer.toLowerCase()) {
      dispatch(revealPiece());
      setCorrectAnswers((prev) => prev + 1);

      if (state.revealedPieces.length + 1 === questions.length) {
        handleGameEnd();
        return;
      }

      dispatch(selectRandomPiece());
      dispatch(addTime(3));
      setFeedbackPiece(state.selectedPiece);
      setBorderColor('border-green-500');
      setShowPopup(true);
      wonAudio.play();

      // Colorful celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#96ceb4',
          '#feca57',
          '#ff9ff3',
        ],
      });

      setTimeout(() => setShowPopup(false), 1500);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      setFeedbackPiece(state.selectedPiece);
      setBorderColor('border-red-500');
      lostAudio.play();
    }

    setTimeout(() => {
      setFeedbackPiece(null);
      setBorderColor('');
    }, 1000);
  };

  const restartGame = () => {
    setShowModal(false);
    dispatch(resetGame());
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setGameEnded(false);
    dispatch(selectRandomPiece());
    setGameRunning(true);
  };

  const currentQuestion =
    state.selectedPiece !== null ? questions[state.selectedPiece] : null;

  return (
    <main className='min-h-screen  p-5 relative overflow-hidden'>
      {/* Floating background decorations */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 text-6xl animate-bounce'>
          🌟
        </div>
        <div className='absolute top-20 right-20 text-4xl animate-pulse'>
          🎈
        </div>
        <div
          className='absolute bottom-20 left-20 text-5xl animate-bounce'
          style={{ animationDelay: '1s' }}
        >
          ⭐
        </div>
        <div
          className='absolute bottom-10 right-10 text-4xl animate-pulse'
          style={{ animationDelay: '0.5s' }}
        >
          🎊
        </div>
        <div
          className='absolute top-1/2 left-5 text-3xl animate-bounce'
          style={{ animationDelay: '2s' }}
        >
          🌈
        </div>
        <div
          className='absolute top-1/3 right-5 text-3xl animate-pulse'
          style={{ animationDelay: '1.5s' }}
        >
          ✨
        </div>
      </div>

      {!gameRunning && !gameEnded && (
        <Overlay opened={true}>
          <div className='flex flex-col justify-center items-center h-screen'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className='text-center mb-8'
            >
              <h1 className='text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4'>
                🧩 Picture Puzzle Fun! 🎮
              </h1>
              <p className='text-2xl text-gray-300 mb-6'>
                Answer questions to reveal the hidden picture!
              </p>
            </motion.div>

            <motion.button
              onClick={restartGame}
              className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform transition-all duration-300'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(34, 197, 94, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ],
              }}
              transition={{
                boxShadow: { repeat: Infinity, duration: 2 },
              }}
            >
              🚀 Start Adventure! 🌟
            </motion.button>
          </div>
        </Overlay>
      )}

      {gameRunning && (
        <div className='container mx-auto relative z-10'>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='text-center mb-6'
          >
            <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2'>
              🧩 Picture Puzzle Adventure! 🎯
            </h1>
            <p className='text-xl text-gray-600'>
              Can you solve all the puzzles and reveal the mystery picture?
            </p>
          </motion.div>

          <div className='flex justify-center items-start space-x-6 mx-4'>
            {/* Leaderboard */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='md:w-1/4 hidden md:block'
            >
              <div className='h-[40rem] bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl p-4 shadow-2xl border-4 border-yellow-300'>
                <div className='text-center mb-4'>
                  <h2 className='text-2xl font-bold text-orange-800 mb-2'>
                    🏆 Champions 🏆
                  </h2>
                  <div className='w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded'></div>
                </div>

                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {players.map((player, index) => (
                    <motion.div
                      key={index}
                      // variants={variants}
                      initial='closed'
                      animate='open'
                      transition={{ delay: index * 0.1 }}
                      whileHover='hover'
                      variants={bounceVariants}
                      className='bg-white rounded-2xl p-3 shadow-lg border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300'
                    >
                      <div className='flex items-center'>
                        <div className='relative'>
                          <span
                            className={`w-12 h-12 rounded-full ${playerBackgroundColors[index]} flex items-center justify-center shadow-lg`}
                          >
                            <img
                              src={playerImages[index]}
                              alt={player.first_name}
                              className='h-8 w-8 object-cover rounded-full'
                            />
                          </span>
                          <span className='absolute -top-1 -right-1 text-lg'>
                            {player.emoji}
                          </span>
                        </div>
                        <div className='ml-3 flex-1'>
                          <p className='font-bold text-gray-800'>
                            {player.first_name}
                          </p>
                          <div className='flex items-center'>
                            <span className='text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded-full'>
                              Level {player.level}
                            </span>
                          </div>
                        </div>
                        <div className='text-2xl'>
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : '🏅'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Game Area */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className='md:w-1/2 lg:w-1/2'
            >
              <section className='bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-4 p-4 shadow-2xl border-4 border-blue-200'>
                <Puzzle
                  photoSet={photoSet}
                  feedbackPiece={feedbackPiece}
                  revealedPieces={state.revealedPieces}
                  borderColor={borderColor}
                />
              </section>

              <section className='bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl border-4 border-purple-300'>
                {currentQuestion ? (
                  <QuestionsPage
                    question={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                  />
                ) : (
                  <div className='p-8 text-center'>
                    <p className='text-white text-xl'>
                      🤔 Loading your next challenge...
                    </p>
                  </div>
                )}
              </section>
            </motion.div>

            {/* Player Stats */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='w-1/4 hidden md:block'
            >
              <div className='h-[40rem] bg-gradient-to-br from-green-200 to-blue-200 rounded-3xl shadow-2xl border-4 border-green-300 overflow-hidden'>
                {/* Player Profile */}
                <div className='bg-gradient-to-r from-green-400 to-blue-400 p-4'>
                  <div className='flex items-center mb-2'>
                    <motion.span
                      className='w-16 h-16 rounded-full bg-yellow-400 flex justify-center items-center shadow-lg border-4 border-white mr-3'
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <img
                        src={profilePhoto}
                        alt="Nathan's profile"
                        className='h-12'
                      />
                    </motion.span>
                    <div>
                      <h2 className='text-2xl text-white font-bold'>
                        Nathan 🌟
                      </h2>
                      <p className='text-blue-100 text-sm'>🎓 Super Student</p>
                      <p className='text-blue-100 text-sm'>🏫 Puzzle Academy</p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <p className='text-white font-bold mb-2'>⭐ LEVEL UP! ⭐</p>
                    <Progress />
                  </div>
                </div>

                {/* Timer */}
                <div className='bg-gradient-to-r from-red-400 to-orange-400 p-4'>
                  <div className='flex items-center justify-center'>
                    <div className='bg-black rounded-lg p-3 mr-3'>
                      <span className='text-yellow-400 font-bold text-lg'>
                        ⏰ TIME
                      </span>
                    </div>
                    <div className='text-center'>
                      <motion.p
                        className='text-white text-5xl font-bold'
                        animate={
                          state.timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}
                        }
                        transition={{
                          repeat: state.timeLeft <= 10 ? Infinity : 0,
                          duration: 1,
                        }}
                        style={{
                          color: state.timeLeft <= 10 ? '#ef4444' : 'white',
                        }}
                      >
                        {state.timeLeft}
                      </motion.p>
                      <p className='text-yellow-100 text-sm'>Seconds Left</p>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className='p-4 space-y-3'>
                  <motion.div
                    className='bg-green-100 rounded-2xl p-3 border-2 border-green-300'
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-3xl mr-2'>✅</span>
                        <span className='text-green-800 font-bold'>
                          Correct
                        </span>
                      </div>
                      <span className='text-2xl font-bold text-green-600'>
                        {correctAnswers}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className='bg-red-100 rounded-2xl p-3 border-2 border-red-300'
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-3xl mr-2'>❌</span>
                        <span className='text-red-800 font-bold'>
                          Incorrect
                        </span>
                      </div>
                      <span className='text-2xl font-bold text-red-600'>
                        {incorrectAnswers}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Instructions */}
                <div className='bg-gradient-to-r from-purple-400 to-pink-400 p-4 mt-auto'>
                  <h3 className='text-center text-white font-bold text-lg mb-2'>
                    🎮 HOW TO PLAY 🎮
                  </h3>
                  <div className='bg-white bg-opacity-20 rounded-lg p-3'>
                    <p className='text-white text-sm text-center leading-relaxed'>
                      🧠 Answer questions correctly to reveal puzzle pieces and
                      discover the hidden picture!
                      <br />
                      <span className='font-bold'>
                        🎁 Bonus: +3 seconds for each correct answer!
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Success Popup */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ scale: 0, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -100 }}
                className='fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'
              >
                <div className='bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-2xl'>🎉</span>
                    <span className='text-xl font-bold'>+3 seconds!</span>
                    <span className='text-2xl'>⏰</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <Overlay opened={showModal}>
        <GameScoreModal title='🎊 Amazing Results! 🎊'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className='mt-4 py-8 text-center'
          >
            <div className='relative'>
              <motion.div
                className='h-32 w-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex justify-center items-center shadow-2xl border-4 border-white mb-6'
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div>
                  <p className='text-6xl text-white font-bold'>
                    {correctAnswers}
                  </p>
                  <p className='text-sm text-purple-100'>of 30</p>
                </div>
              </motion.div>
              <div className='absolute -top-2 -right-2 text-4xl animate-bounce'>
                🏆
              </div>
              <div className='absolute -bottom-2 -left-2 text-3xl animate-pulse'>
                ⭐
              </div>
            </div>

            <div className='mb-6'>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {correctAnswers >= 25
                  ? '🌟 AMAZING! 🌟'
                  : correctAnswers >= 20
                  ? '🎯 GREAT JOB! 🎯'
                  : correctAnswers >= 15
                  ? '👏 WELL DONE! 👏'
                  : '🎮 KEEP TRYING! 🎮'}
              </h3>
              <p className='text-gray-600'>
                {correctAnswers >= 25
                  ? "You're a puzzle master!"
                  : correctAnswers >= 20
                  ? 'Excellent problem solving!'
                  : correctAnswers >= 15
                  ? 'Good work, keep it up!'
                  : 'Practice makes perfect!'}
              </p>
            </div>

            <motion.div
              onClick={restartGame}
              className='inline-flex items-center space-x-2 cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-4 px-8 rounded-full shadow-lg font-bold text-lg transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='text-2xl'>🔄</span>
              <span>Play Again!</span>
              <span className='text-2xl'>🎮</span>
            </motion.div>
          </motion.div>
        </GameScoreModal>
      </Overlay>
    </main>
  );
};

export default Game;
