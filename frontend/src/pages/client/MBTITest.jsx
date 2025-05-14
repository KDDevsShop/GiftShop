import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MBTITest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mbtiType, setMbtiType] = useState('');
  const [traits, setTraits] = useState([]);

  const questions = [
    // E vs I questions
    {
      id: 1,
      text: 'At social gatherings, you:',
      options: [
        { text: 'Interact with many, including strangers', type: 'E' },
        { text: 'Interact with a few, known to you', type: 'I' },
      ],
    },
    {
      id: 2,
      text: 'You tend to:',
      options: [
        { text: 'Think out loud and speak freely', type: 'E' },
        { text: 'Think privately and speak selectively', type: 'I' },
      ],
    },
    {
      id: 3,
      text: 'After a long week, you prefer to:',
      options: [
        { text: 'Go out with friends to recharge', type: 'E' },
        { text: 'Spend time alone to recharge', type: 'I' },
      ],
    },
    {
      id: 4,
      text: 'When working on projects, you prefer:',
      options: [
        { text: 'Collaborative group work', type: 'E' },
        { text: 'Individual focused work', type: 'I' },
      ],
    },
    // S vs N questions
    {
      id: 5,
      text: 'You are more interested in:',
      options: [
        { text: 'What is actual and present', type: 'S' },
        { text: 'What is possible and future-oriented', type: 'N' },
      ],
    },
    {
      id: 6,
      text: 'You prefer explanations that are:',
      options: [
        { text: 'Concrete and literal', type: 'S' },
        { text: 'Figurative and metaphorical', type: 'N' },
      ],
    },
    {
      id: 7,
      text: 'You value more:',
      options: [
        { text: 'Experience and practical solutions', type: 'S' },
        { text: 'Theories and innovative ideas', type: 'N' },
      ],
    },
    {
      id: 8,
      text: 'You are more drawn to:',
      options: [
        { text: 'Details and facts', type: 'S' },
        { text: 'Patterns and possibilities', type: 'N' },
      ],
    },
    // T vs F questions
    {
      id: 9,
      text: 'When making decisions, you typically:',
      options: [
        { text: 'Use logic and objective analysis', type: 'T' },
        { text: 'Consider people and special circumstances', type: 'F' },
      ],
    },
    {
      id: 10,
      text: 'You value more in yourself:',
      options: [
        { text: 'Being competent and reasonable', type: 'T' },
        { text: 'Being authentic and compassionate', type: 'F' },
      ],
    },
    {
      id: 11,
      text: 'When giving feedback, you tend to be:',
      options: [
        { text: 'Frank and straightforward', type: 'T' },
        { text: 'Tactful and encouraging', type: 'F' },
      ],
    },
    {
      id: 12,
      text: 'In conflicts, you focus more on:',
      options: [
        { text: 'Finding the most logical solution', type: 'T' },
        { text: 'Maintaining harmony and understanding feelings', type: 'F' },
      ],
    },
    // J vs P questions
    {
      id: 13,
      text: 'You prefer to:',
      options: [
        { text: 'Plan ahead and follow schedules', type: 'J' },
        { text: 'Be spontaneous and adapt as you go', type: 'P' },
      ],
    },
    {
      id: 14,
      text: 'Your workspace is usually:',
      options: [
        { text: 'Organized and structured', type: 'J' },
        { text: 'Flexible and adaptable', type: 'P' },
      ],
    },
    {
      id: 15,
      text: 'You feel better when things are:',
      options: [
        { text: 'Settled and decided', type: 'J' },
        { text: 'Open to change and possibilities', type: 'P' },
      ],
    },
    {
      id: 16,
      text: 'In your daily life, you prefer:',
      options: [
        { text: 'To-do lists and clear priorities', type: 'J' },
        { text: 'Flexibility to respond to what happens', type: 'P' },
      ],
    },
  ];

  useEffect(() => {
    // Update progress whenever current question changes
    setProgress(((currentQuestion + 1) / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleAnswer = (type) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: type,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateMBTI();
    }
  };

  const calculateMBTI = () => {
    setLoading(true);

    // Calculate MBTI type based on answers
    const counts = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    Object.values(answers).forEach((type) => {
      counts[type]++;
    });

    const type = [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P',
    ].join('');

    // Simulate API call to get detailed results
    setTimeout(() => {
      setMbtiType(type);
      setTraits(getTypeTraits(type));
      setShowResult(true);
      setLoading(false);
    }, 1500);
  };

  const getTypeDescription = (type) => {
    const descriptions = {
      ISTJ: 'The Inspector - Practical, fact-minded, and reliable. You value tradition, security, and peaceful living.',
      ISFJ: 'The Protector - Warm-hearted, conscientious, and cooperative. You are committed and steady in meeting your obligations.',
      INFJ: 'The Counselor - Quietly forceful, creative, and highly principled. You have a clear sense of moral direction.',
      INTJ: 'The Mastermind - Strategic, logical, and innovative. You have original minds and great drive for implementing your ideas.',
      ISTP: 'The Craftsman - Tolerant, flexible, and practical problem-solver. You excel at analyzing situations objectively.',
      ISFP: 'The Composer - Quiet, friendly, sensitive, and kind. You enjoy the present moment and are often artistic.',
      INFP: 'The Healer - Idealistic, loyal, and curious about possibilities. You seek to understand people and help them fulfill their potential.',
      INTP: 'The Architect - Analytical, detached, and objectively critical. You are driven to create logical explanations for everything.',
      ESTP: 'The Dynamo - Energetic, action-oriented, and pragmatic. You are adaptable, resourceful, and focused on immediate results.',
      ESFP: 'The Performer - Outgoing, friendly, and accepting. You love people and new experiences, finding joy in the present moment.',
      ENFP: 'The Champion - Warmly enthusiastic, creative, and sociable. You see life as full of possibilities.',
      ENTP: 'The Visionary - Quick, ingenious, and stimulating. You are adept at generating conceptual possibilities.',
      ESTJ: 'The Supervisor - Practical, matter-of-fact, and realistic. You are decisive and focused on getting results efficiently.',
      ESFJ: 'The Provider - Warmhearted, conscientious, and cooperative. You value harmony and cooperation.',
      ENFJ: 'The Teacher - Warm, empathetic, responsive, and responsible. You are highly attuned to the emotions of others.',
      ENTJ: 'The Commander - Frank, decisive, and strategic leader. You excel at logical reasoning and leadership.',
    };

    return (
      descriptions[type] ||
      'Your personality type is unique and complex. To get a more detailed description, we recommend reading more about your type.'
    );
  };

  const getTypeTraits = (type) => {
    const traits = {
      ISTJ: [
        'Responsible',
        'Organized',
        'Loyal',
        'Traditional',
        'Practical',
        'Logical',
        'Detail-oriented',
        'Dependable',
      ],
      ISFJ: [
        'Considerate',
        'Loyal',
        'Traditional',
        'Detailed',
        'Warm',
        'Reliable',
        'Patient',
        'Supportive',
      ],
      INFJ: [
        'Insightful',
        'Principled',
        'Creative',
        'Passionate',
        'Altruistic',
        'Complex',
        'Empathetic',
        'Determined',
      ],
      INTJ: [
        'Strategic',
        'Independent',
        'Innovative',
        'Analytical',
        'Determined',
        'Private',
        'Logical',
        'Ambitious',
      ],
      ISTP: [
        'Logical',
        'Adaptable',
        'Observant',
        'Practical',
        'Self-contained',
        'Spontaneous',
        'Independent',
        'Adventurous',
      ],
      ISFP: [
        'Artistic',
        'Sensitive',
        'Harmonious',
        'Loyal',
        'Adaptable',
        'Observant',
        'Gentle',
        'Present-focused',
      ],
      INFP: [
        'Idealistic',
        'Compassionate',
        'Creative',
        'Authentic',
        'Open-minded',
        'Adaptable',
        'Dedicated',
        'Curious',
      ],
      INTP: [
        'Analytical',
        'Objective',
        'Curious',
        'Theoretical',
        'Abstract',
        'Logical',
        'Inventive',
        'Independent',
      ],
      ESTP: [
        'Energetic',
        'Direct',
        'Spontaneous',
        'Practical',
        'Observant',
        'Risk-taking',
        'Adaptable',
        'Resourceful',
      ],
      ESFP: [
        'Enthusiastic',
        'Social',
        'Spontaneous',
        'Practical',
        'Observant',
        'Supportive',
        'Playful',
        'Present-focused',
      ],
      ENFP: [
        'Enthusiastic',
        'Creative',
        'Sociable',
        'Perceptive',
        'Expressive',
        'Optimistic',
        'Flexible',
        'Passionate',
      ],
      ENTP: [
        'Innovative',
        'Entrepreneurial',
        'Adaptable',
        'Analytical',
        'Outspoken',
        'Quick-thinking',
        'Theoretical',
        'Debative',
      ],
      ESTJ: [
        'Organized',
        'Efficient',
        'Structured',
        'Practical',
        'Dependable',
        'Traditional',
        'Direct',
        'Decisive',
      ],
      ESFJ: [
        'Supportive',
        'Sociable',
        'Organized',
        'Practical',
        'Loyal',
        'Traditional',
        'Cooperative',
        'Caring',
      ],
      ENFJ: [
        'Charismatic',
        'Inspiring',
        'Supportive',
        'Idealistic',
        'Diplomatic',
        'Organized',
        'Appreciative',
        'Compassionate',
      ],
      ENTJ: [
        'Strategic',
        'Efficient',
        'Decisive',
        'Ambitious',
        'Assertive',
        'Direct',
        'Logical',
        'Structured',
      ],
    };

    return traits[type] || ['Unique', 'Complex', 'Thoughtful', 'Adaptable'];
  };

  const navigateToProducts = () => {
    const traitsQuery = traits
      .map((trait) => `traits=${encodeURIComponent(trait)}`)
      .join('&');

    navigate(`/products?mbti=${mbtiType}&${traitsQuery}`);
  };

  if (loading) {
    return (
      <div className='max-w-3xl mx-auto py-12 px-4'>
        <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            Analyzing Your Answers...
          </h2>
          <div className='w-16 h-16 border-8 border-gray-200 border-t-purple-600 rounded-full animate-spin my-6'></div>
          <p className='text-gray-600'>
            Calculating your personality type and finding the perfect gift
            recommendations for you.
          </p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className='max-w-3xl mx-auto py-12 px-4'>
        <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Your MBTI Type: {mbtiType}
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            {getTypeDescription(mbtiType)}
          </p>
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Your Key Traits
            </h3>
            <div className='flex flex-wrap gap-2 justify-center'>
              {traits.map((trait, index) => (
                <span
                  key={index}
                  className='bg-purple-100 text-purple-700 py-2 px-4 rounded-full text-sm font-medium'
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 w-full justify-center'>
            <button
              onClick={navigateToProducts}
              className='bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold cursor-pointer hover:bg-purple-700 transition'
            >
              Browse Recommended Gifts
            </button>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResult(false);
                setMbtiType('');
              }}
              className='bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold cursor-pointer hover:bg-gray-300 transition'
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto py-12 px-4'>
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <div className='w-full bg-gray-200 rounded-full h-2 mb-8'>
          <div
            className='bg-purple-600 h-full rounded-full transition-all'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className='text-lg text-gray-600 mb-6'>
          {questions[currentQuestion].text}
        </p>
        <div className='flex flex-col gap-4'>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.type)}
              className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                answers[currentQuestion] === option.type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MBTITest;
