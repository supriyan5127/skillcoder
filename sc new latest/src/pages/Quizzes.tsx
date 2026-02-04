import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Zap,
  Target,
  Award,
  Brain,
  Shield,
  Code,
  Database,
  Globe,
  Cpu,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CombinedBackground from "@/components/CombinedBackground";
import GlowingText from "@/components/GlowText";

const domains = [
  { id: "cybersecurity", name: "Cybersecurity", icon: Shield, color: "text-red-400" },
  { id: "web-dev", name: "Web Development", icon: Code, color: "text-blue-400" },
  { id: "database", name: "Database Management", icon: Database, color: "text-green-400" },
  { id: "networking", name: "Networking", icon: Globe, color: "text-purple-400" },
  { id: "ai-ml", name: "AI & Machine Learning", icon: Cpu, color: "text-yellow-400" },
  { id: "cloud", name: "Cloud Computing", icon: Settings, color: "text-cyan-400" },
];

const sampleQuestions = {
  "cybersecurity": [
    {
      id: 1,
      type: "true-false",
      question: "SQL Injection is a type of cyber attack that targets web application databases.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
    {
      id: 2,
      type: "multiple",
      question: "Which of the following is NOT a common type of malware?",
      correctAnswer: "Firewall",
      options: ["Trojan", "Ransomware", "Firewall", "Spyware"],
    },
    {
      id: 3,
      type: "true-false",
      question: "HTTPS provides end-to-end encryption for web traffic.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
  ],
  "web-dev": [
    {
      id: 1,
      type: "multiple",
      question: "Which HTML tag is used to create a hyperlink?",
      correctAnswer: "<a>",
      options: ["<link>", "<a>", "<href>", "<url>"],
    },
    {
      id: 2,
      type: "true-false",
      question: "CSS stands for Cascading Style Sheets.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
    {
      id: 3,
      type: "multiple",
      question: "Which JavaScript method is used to add an element to the end of an array?",
      correctAnswer: "push()",
      options: ["append()", "push()", "add()", "insert()"],
    },
  ],
  "database": [
    {
      id: 1,
      type: "multiple",
      question: "Which SQL command is used to retrieve data from a database?",
      correctAnswer: "SELECT",
      options: ["GET", "FETCH", "SELECT", "RETRIEVE"],
    },
    {
      id: 2,
      type: "true-false",
      question: "MongoDB is a relational database management system.",
      correctAnswer: "false",
      options: ["true", "false"],
    },
  ],
  "networking": [
    {
      id: 1,
      type: "multiple",
      question: "Which protocol is used for secure web browsing?",
      correctAnswer: "HTTPS",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    },
    {
      id: 2,
      type: "true-false",
      question: "An IP address uniquely identifies a device on a network.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
  ],
  "ai-ml": [
    {
      id: 1,
      type: "multiple",
      question: "Which algorithm is commonly used for classification problems?",
      correctAnswer: "Decision Tree",
      options: ["Linear Regression", "Decision Tree", "K-Means", "PCA"],
    },
    {
      id: 2,
      type: "true-false",
      question: "Deep Learning is a subset of Machine Learning.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
  ],
  "cloud": [
    {
      id: 1,
      type: "multiple",
      question: "Which of the following is a cloud service model?",
      correctAnswer: "SaaS",
      options: ["SaaS", "HTTP", "TCP", "DNS"],
    },
    {
      id: 2,
      type: "true-false",
      question: "AWS stands for Amazon Web Services.",
      correctAnswer: "true",
      options: ["true", "false"],
    },
  ],
};

type QuizState = "select" | "quiz" | "result";

const Quizzes = () => {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<typeof sampleQuestions["cybersecurity"]>([]);
  const [isAdmin] = useState(false); // Mock admin state

  const toggleDomain = (domainId: string) => {
    setSelectedDomains(prev =>
      prev.includes(domainId)
        ? prev.filter(d => d !== domainId)
        : [...prev, domainId]
    );
  };

  const startQuiz = () => {
    if (selectedDomains.length === 0) return;

    // Combine questions from selected domains
    const allQuestions: typeof sampleQuestions["cybersecurity"] = [];
    selectedDomains.forEach(domain => {
      const domainQuestions = sampleQuestions[domain as keyof typeof sampleQuestions] || [];
      allQuestions.push(...domainQuestions);
    });

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setQuizState("quiz");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer("");
    setShowAnswer(false);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      // Level complete
      const levelCredits = score * 10 * currentLevel;
      setTotalCredits(prev => prev + levelCredits);
      setQuizState("result");
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
      setShowAnswer(false);
    }
  };

  const nextLevel = () => {
    if (currentLevel < 100) {
      setCurrentLevel(prev => prev + 1);
      startQuiz();
    }
  };

  const resetQuiz = () => {
    setQuizState("select");
    setSelectedDomains([]);
    setCurrentLevel(1);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <CombinedBackground />
      <Navbar />

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Brain className="h-3 w-3 mr-1" />
                Test Your Skills
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <GlowingText>Crack the Quizzes</GlowingText>
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Challenge yourself across 100 levels. Earn credits, gain skills, and become a master!
              </p>

              {/* Credits Display */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 bg-primary/20 px-6 py-3 rounded-full border border-primary/30"
              >
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold text-primary">{totalCredits}</span>
                <span className="text-muted-foreground">Credits Earned</span>
              </motion.div>

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Button variant="outline" className="border-primary/50">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Quizzes (Admin)
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {quizState === "select" && (
            <motion.section
              key="select"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="py-12"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center mb-8">
                  Select Your <span className="text-primary">Domains</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                  {domains.map((domain, index) => (
                    <motion.div
                      key={domain.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${selectedDomains.includes(domain.id)
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border hover:border-primary/50"
                          }`}
                        onClick={() => toggleDomain(domain.id)}
                      >
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-muted ${domain.color}`}>
                            <domain.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{domain.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {sampleQuestions[domain.id as keyof typeof sampleQuestions]?.length || 0} questions
                            </p>
                          </div>
                          {selectedDomains.includes(domain.id) && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={startQuiz}
                    disabled={selectedDomains.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    Start Level {currentLevel}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    {selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""} selected
                  </p>
                </div>

                {/* Level Progress */}
                <div className="mt-16 max-w-4xl mx-auto">
                  <h3 className="text-xl font-bold mb-6 text-center">Level Progress</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((level) => (
                      <motion.div
                        key={level}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: level * 0.005 }}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                          ${level < currentLevel
                            ? "bg-primary text-primary-foreground"
                            : level === currentLevel
                              ? "bg-primary/50 text-primary-foreground border-2 border-primary animate-pulse"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {level < currentLevel ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : level === currentLevel ? (
                          level
                        ) : (
                          <Lock className="h-3 w-3 opacity-50" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {quizState === "quiz" && questions.length > 0 && (
            <motion.section
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-8">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Level {currentLevel}
                  </Badge>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1}/{questions.length}
                    </span>
                    <Badge className="bg-primary/20 text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      {score} correct
                    </Badge>
                  </div>
                </div>

                <Progress
                  value={(currentQuestion / questions.length) * 100}
                  className="mb-8"
                />

                <Card className="border-border bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">
                        {questions[currentQuestion].type === "true-false" ? "True or False" : "Multiple Choice"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">
                      {questions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedAnswer}
                      onValueChange={setSelectedAnswer}
                      disabled={showAnswer}
                      className="space-y-3"
                    >
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.div
                          key={option}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Label
                            htmlFor={option}
                            className={`
                              flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                              ${showAnswer
                                ? option === questions[currentQuestion].correctAnswer
                                  ? "border-green-500 bg-green-500/10"
                                  : option === selectedAnswer
                                    ? "border-red-500 bg-red-500/10"
                                    : "border-border"
                                : selectedAnswer === option
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }
                            `}
                          >
                            <RadioGroupItem value={option} id={option} />
                            <span className="capitalize">{option}</span>
                            {showAnswer && option === questions[currentQuestion].correctAnswer && (
                              <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                            )}
                            {showAnswer && option === selectedAnswer && option !== questions[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                            )}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>

                    <div className="mt-8 flex justify-end gap-4">
                      {!showAnswer ? (
                        <Button
                          onClick={submitAnswer}
                          disabled={!selectedAnswer}
                          className="bg-primary text-primary-foreground"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Button onClick={nextQuestion} className="bg-primary text-primary-foreground">
                            {currentQuestion + 1 >= questions.length ? "See Results" : "Next Question"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          )}

          {quizState === "result" && (
            <motion.section
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
                <Card className="border-primary/30 bg-card/80 backdrop-blur-sm text-center">
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="mx-auto mb-4"
                    >
                      {score >= questions.length * 0.7 ? (
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Trophy className="h-10 w-10 text-green-500" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Target className="h-10 w-10 text-yellow-500" />
                        </div>
                      )}
                    </motion.div>
                    <CardTitle className="text-2xl">
                      Level {currentLevel} {score >= questions.length * 0.7 ? "Complete!" : "Attempted"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold">{score}/{questions.length}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10">
                        <p className="text-sm text-muted-foreground">Credits Earned</p>
                        <p className="text-2xl font-bold text-primary">+{score * 10 * currentLevel}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-lg">
                        {score >= questions.length * 0.7
                          ? "Great job! You can proceed to the next level."
                          : "Keep practicing! Try again to unlock the next level."
                        }
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {score >= questions.length * 0.7 && currentLevel < 100 && (
                        <Button onClick={nextLevel} className="bg-primary text-primary-foreground w-full">
                          <Award className="h-4 w-4 mr-2" />
                          Go to Level {currentLevel + 1}
                        </Button>
                      )}
                      <Button onClick={startQuiz} variant="outline" className="w-full">
                        Retry Level {currentLevel}
                      </Button>
                      <Button onClick={resetQuiz} variant="ghost" className="w-full">
                        Select Different Domains
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Quizzes;
