"use client"
import { useState, useEffect, useRef } from 'react';

const initialWords = ["オブジェクト指向プログラミング","ソースコード管理システム","統合開発環境","コンパイルエラー","デバッグプロセス","バージョンコントロール","アルゴリズム最適化","データベース設計","ユーザーインターフェースデザイン","メモリ管理手法","マルチスレッドプログラミング","ネットワークプロトコル","ソフトウェアアーキテクチャ","継続的インテグレーション","データ構造とアルゴリズム","ソフトウェアテスト自動化","クラウドコンピューティングサービス","サイバーセキュリティ対策","人工知能と機械学習","分散システム設計"];

const TypingSpeedGame = () => {
    const [word, setWord] = useState("");
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [correctWords, setCorrectWords] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [availableWords, setAvailableWords] = useState([...initialWords]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (timeLeft > 0 && isRunning) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            setGameOver(true);
            saveResult();
        }
    }, [timeLeft, isRunning]);

    const startGame = () => {
        setIsRunning(true);
        setGameOver(false);
        setTimeLeft(30);
        setCorrectWords(0);
        setInput("");
        setAvailableWords([...initialWords]);
        setWord(initialWords[Math.floor(Math.random() * initialWords.length)]);
        inputRef.current?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (e.target.value === word) {
            setCorrectWords(correctWords + 1);
            setInput("");
            const newAvailableWords = availableWords.filter(w => w !== word);
            setAvailableWords(newAvailableWords);
            if (newAvailableWords.length > 0) {
                setWord(newAvailableWords[Math.floor(Math.random() * newAvailableWords.length)]);
            } else {
                setIsRunning(false);
                setGameOver(true);
                saveResult();
            }
        }
    };

    const saveResult = () => {
        const results = JSON.parse(localStorage.getItem("results") || "[]");
        results.push({ date: new Date(), correctWords });
        localStorage.setItem("results", JSON.stringify(results));
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-purple-600">タイピングゲーム</h1>
            {!isRunning && !gameOver && (
                <button onClick={startGame} className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition duration-300 ease-in-out">
                    スタート
                </button>
            )}
            {isRunning && (
                <>
                    <div className="text-2xl mb-4 text-gray-700">残り時間: <span className="font-bold">{timeLeft}s</span></div>
                    <div className="text-2xl mb-4 text-gray-700">単語: <span className="font-bold text-purple-600">{word}</span></div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded-lg w-full max-w-md text-xl"
                    />
                    <div className="text-2xl mt-4 text-gray-700">スコア: <span className="font-bold">{correctWords}</span></div>
                </>
            )}
            {gameOver && (
                <>
                    <div className="text-2xl mt-4 text-gray-700">終了!</div>
                    <div className="text-2xl mt-4 text-gray-700">最終スコア: <span className="font-bold">{correctWords}</span></div>
                    <button onClick={startGame} className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg mt-6 transition duration-300 ease-in-out">
                        もう一回プレイ
                    </button>
                </>
            )}
        </div>
    );
};

export default TypingSpeedGame;
