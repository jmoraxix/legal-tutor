"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/components/auth/UserButton";

// Ejemplo de preguntas para el quiz
const sampleQuestions = [
  {
    id: 1,
    question: "¿Cuál es el nombre oficial de la constitución de Costa Rica?",
    options: [
      "Constitución Política de la República de Costa Rica",
      "Carta Magna de Costa Rica",
      "Ley Fundamental de Costa Rica",
      "Constitución Nacional de Costa Rica"
    ],
    correctAnswer: 0,
    explanation: "El nombre oficial es 'Constitución Política de la República de Costa Rica', promulgada el 7 de noviembre de 1949."
  },
  {
    id: 2,
    question: "¿Cuál es la duración del período presidencial en Costa Rica?",
    options: [
      "3 años",
      "4 años",
      "5 años",
      "6 años"
    ],
    correctAnswer: 1,
    explanation: "En Costa Rica, el período presidencial tiene una duración de 4 años, según lo establecido en el artículo 134 de la Constitución Política."
  },
  {
    id: 3,
    question: "¿Cuál de los siguientes NO es un poder de la República de Costa Rica?",
    options: [
      "Poder Ejecutivo",
      "Poder Legislativo",
      "Poder Electoral",
      "Poder Judicial"
    ],
    correctAnswer: 2,
    explanation: "Los tres poderes de la República de Costa Rica son el Ejecutivo, Legislativo y Judicial. El 'Poder Electoral' no existe como tal; las funciones electorales son responsabilidad del Tribunal Supremo de Elecciones, que es considerado un cuarto poder por algunos."
  }
];

/**
 * Quiz page component for legal learning.
 *
 * @returns {React.ReactNode} The rendered quiz page
 */
export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  /**
   * Handles option selection in the quiz.
   *
   * @param {number} index - The index of the selected option
   */
  const handleOptionSelect = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  /**
   * Checks the selected answer and shows explanation.
   */
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    setShowExplanation(true);
    if (selectedOption === sampleQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  /**
   * Moves to the next question in the quiz.
   */
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  /**
   * Restarts the quiz.
   */
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            Legal Tutor
          </Link>
          <nav className="flex items-center gap-6">
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                  Chat
                </Link>
              </li>
            </ul>
            <UserButton />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">Quiz Legal</CardTitle>
          </CardHeader>
          <CardContent className="bg-white dark:bg-slate-900 p-6">
            {quizCompleted ? (
              <div className="text-center py-8">
                <h2 className="text-2xl font-serif font-bold mb-4 text-legal-800 dark:text-legal-200">¡Quiz Completado!</h2>
                <p className="text-xl mb-6 text-legal-600 dark:text-legal-300">
                  Tu puntuación: {score} de {sampleQuestions.length}
                </p>
                <Button 
                  onClick={handleRestartQuiz}
                  className="bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                >
                  Reiniciar Quiz
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-between text-legal-600 dark:text-legal-400">
                  <span>Pregunta {currentQuestion + 1} de {sampleQuestions.length}</span>
                  <span className="font-medium">Puntuación: {score}</span>
                </div>
                
                <h2 className="text-xl font-serif font-semibold mb-6 text-legal-800 dark:text-legal-200">
                  {sampleQuestions[currentQuestion].question}
                </h2>
                
                <div className="space-y-3 mb-8">
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-md cursor-pointer border transition-all ${
                        selectedOption === index
                          ? "border-legal-600 bg-legal-50 dark:border-legal-500 dark:bg-legal-900/30 shadow-sm"
                          : "border-legal-200 hover:border-legal-400 dark:border-legal-700 dark:hover:border-legal-600"
                      } ${
                        showExplanation && index === sampleQuestions[currentQuestion].correctAnswer
                          ? "border-emerald-600 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20"
                          : ""
                      } ${
                        showExplanation && selectedOption === index && index !== sampleQuestions[currentQuestion].correctAnswer
                          ? "border-legal-500 bg-legal-100 dark:border-legal-500 dark:bg-legal-800/50"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 mt-0.5 rounded border ${
                          selectedOption === index 
                            ? "border-legal-600 dark:border-legal-400" 
                            : "border-legal-300 dark:border-legal-600"
                        } ${
                          showExplanation && index === sampleQuestions[currentQuestion].correctAnswer
                            ? "border-emerald-600 dark:border-emerald-600" 
                            : ""
                        }`}></div>
                        <span className="ml-3 text-legal-700 dark:text-legal-300">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {showExplanation && (
                  <div className="mb-8 p-4 bg-legal-50 border border-legal-200 dark:bg-legal-800/30 dark:border-legal-700 rounded-md">
                    <h3 className="font-serif font-semibold mb-2 text-legal-800 dark:text-legal-200">Explicación:</h3>
                    <p className="text-legal-700 dark:text-legal-300">{sampleQuestions[currentQuestion].explanation}</p>
                  </div>
                )}
                
                {!showExplanation ? (
                  <Button 
                    onClick={handleCheckAnswer} 
                    disabled={selectedOption === null}
                    className="bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                  >
                    Verificar Respuesta
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                  >
                    {currentQuestion < sampleQuestions.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between p-4 border-t bg-white dark:bg-slate-900 text-legal-500">
            <div className="text-sm">
              Aprende sobre el sistema legal costarricense a través de preguntas interactivas.
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-4 bg-white dark:bg-slate-900 shadow-md">
        <div className="container mx-auto text-center text-sm text-legal-500">
          <p>&copy; {new Date().getFullYear()} Ayzek Studio. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-2">
            <Link href="/terminos" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Términos</Link>
            <Link href="/privacidad" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Privacidad</Link>
            <Link href="/contacto" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
