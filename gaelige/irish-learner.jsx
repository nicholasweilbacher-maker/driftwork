import { useState, useEffect } from "react";

// ── VOCABULARY DATA ──────────────────────────────────────────────────────────
const categories = {
  greetings: {
    label: "Greetings",
    emoji: "👋",
    words: [
      { irish: "Dia duit", english: "Hello (to one person)", pronunciation: "Dee-ah gwit", note: "Literally: 'God to you'" },
      { irish: "Dia is Muire duit", english: "Hello (reply)", pronunciation: "Dee-ah iss Mwir-eh gwit", note: "Reply to 'Dia duit'" },
      { irish: "Conas atá tú?", english: "How are you?", pronunciation: "Kun-us ah-taw too" },
      { irish: "Tá mé go maith", english: "I am well", pronunciation: "Taw may guh mah" },
      { irish: "Tá mé go dona", english: "I am not well", pronunciation: "Taw may guh dun-ah" },
      { irish: "Maidin mhaith", english: "Good morning", pronunciation: "Mah-jin wah" },
      { irish: "Tráthnóna maith", english: "Good evening", pronunciation: "Traw-no-nah mah" },
      { irish: "Oíche mhaith", english: "Good night", pronunciation: "Ee-heh wah" },
      { irish: "Slán", english: "Goodbye", pronunciation: "Slawn" },
      { irish: "Slán agat", english: "Goodbye (to person staying)", pronunciation: "Slawn ah-gut" },
      { irish: "Slán leat", english: "Goodbye (to person leaving)", pronunciation: "Slawn lyat" },
      { irish: "Fáilte", english: "Welcome", pronunciation: "Fawl-cheh" },
    ],
  },
  numbers: {
    label: "Numbers",
    emoji: "🔢",
    words: [
      { irish: "a haon", english: "1 – One", pronunciation: "ah hayn" },
      { irish: "a dó", english: "2 – Two", pronunciation: "ah doe" },
      { irish: "a trí", english: "3 – Three", pronunciation: "ah tree" },
      { irish: "a ceathair", english: "4 – Four", pronunciation: "ah kah-her" },
      { irish: "a cúig", english: "5 – Five", pronunciation: "ah koo-ig" },
      { irish: "a sé", english: "6 – Six", pronunciation: "ah shay" },
      { irish: "a seacht", english: "7 – Seven", pronunciation: "ah shakt" },
      { irish: "a hocht", english: "8 – Eight", pronunciation: "ah hukt" },
      { irish: "a naoi", english: "9 – Nine", pronunciation: "ah nee" },
      { irish: "a deich", english: "10 – Ten", pronunciation: "ah djeh" },
      { irish: "a haon déag", english: "11 – Eleven", pronunciation: "ah hayn djay-ug" },
      { irish: "a dó dhéag", english: "12 – Twelve", pronunciation: "ah doe yay-ug" },
    ],
  },
  colors: {
    label: "Colors",
    emoji: "🎨",
    words: [
      { irish: "dearg", english: "Red", pronunciation: "dj-ar-ug" },
      { irish: "gorm", english: "Blue", pronunciation: "gur-um" },
      { irish: "glas", english: "Green", pronunciation: "glass" },
      { irish: "buí", english: "Yellow", pronunciation: "bwee" },
      { irish: "dubh", english: "Black", pronunciation: "duv" },
      { irish: "bán", english: "White", pronunciation: "bawn" },
      { irish: "donn", english: "Brown", pronunciation: "dun" },
      { irish: "oráiste", english: "Orange", pronunciation: "or-awsh-teh" },
      { irish: "corcra", english: "Purple", pronunciation: "kor-krah" },
      { irish: "bándearg", english: "Pink", pronunciation: "bawn-dj-ar-ug" },
      { irish: "liath", english: "Grey", pronunciation: "lee-ah" },
      { irish: "airgead", english: "Silver", pronunciation: "ar-ih-gid" },
    ],
  },
  days: {
    label: "Days",
    emoji: "📅",
    words: [
      { irish: "Dé Luain", english: "Monday", pronunciation: "djay loo-in" },
      { irish: "Dé Máirt", english: "Tuesday", pronunciation: "djay mawrt" },
      { irish: "Dé Céadaoin", english: "Wednesday", pronunciation: "djay kay-deen" },
      { irish: "Déardaoin", english: "Thursday", pronunciation: "djare-deen" },
      { irish: "Dé hAoine", english: "Friday", pronunciation: "djay heen-eh" },
      { irish: "Dé Sathairn", english: "Saturday", pronunciation: "djay sah-hirn" },
      { irish: "Dé Domhnaigh", english: "Sunday", pronunciation: "djay dow-nee" },
      { irish: "inniu", english: "today", pronunciation: "in-yoo" },
      { irish: "inné", english: "yesterday", pronunciation: "in-yay" },
      { irish: "amárach", english: "tomorrow", pronunciation: "ah-maw-rakh" },
    ],
  },
  family: {
    label: "Family",
    emoji: "👨‍👩‍👧‍👦",
    words: [
      { irish: "máthair", english: "mother", pronunciation: "maw-hir" },
      { irish: "athair", english: "father", pronunciation: "ah-hir" },
      { irish: "deartháir", english: "brother", pronunciation: "dj-ar-hawr" },
      { irish: "deirfiúr", english: "sister", pronunciation: "djer-fyoor" },
      { irish: "mac", english: "son", pronunciation: "mok" },
      { irish: "iníon", english: "daughter", pronunciation: "in-een" },
      { irish: "seanathair", english: "grandfather", pronunciation: "shan-ah-hir" },
      { irish: "seanmháthair", english: "grandmother", pronunciation: "shan-waw-hir" },
      { irish: "col ceathrair", english: "cousin", pronunciation: "kul kah-rir" },
      { irish: "uncail", english: "uncle", pronunciation: "un-kil" },
      { irish: "aintín", english: "aunt", pronunciation: "an-cheen" },
    ],
  },
  phrases: {
    label: "Useful Phrases",
    emoji: "💬",
    words: [
      { irish: "Is mise [ainm]", english: "I am [name]", pronunciation: "iss mish-eh" },
      { irish: "Cad is ainm duit?", english: "What is your name?", pronunciation: "kod iss an-im gwit" },
      { irish: "Le do thoil", english: "Please", pronunciation: "leh duh hull" },
      { irish: "Go raibh maith agat", english: "Thank you", pronunciation: "guh rev mah ah-gut" },
      { irish: "Tá fáilte romhat", english: "You're welcome", pronunciation: "taw fawl-cheh row-ut" },
      { irish: "Gabh mo leithscéal", english: "Excuse me / Sorry", pronunciation: "gah muh lyeh-shkale" },
      { irish: "Tuigim", english: "I understand", pronunciation: "tig-im" },
      { irish: "Ní thuigim", english: "I don't understand", pronunciation: "nee hig-im" },
      { irish: "Níl a fhios agam", english: "I don't know", pronunciation: "neel iss ah-gum" },
      { irish: "Cé mhéad?", english: "How much?", pronunciation: "kay vade" },
      { irish: "Cá bhfuil...?", english: "Where is...?", pronunciation: "kaw will" },
      { irish: "An bhfuil Gaeilge agat?", english: "Do you speak Irish?", pronunciation: "un will gayl-geh ah-gut" },
    ],
  },
};

// ── PRONUNCIATION GUIDE DATA ─────────────────────────────────────────────────
const pronunciationRules = [
  { rule: "bh / mh", sound: "like 'v' or 'w'", example: "mhaith → wah (good), bhfuil → will" },
  { rule: "th", sound: "like 'h'", example: "thoil → hull (will/wish)" },
  { rule: "dh / gh (broad)", sound: "like a soft 'g' or silent", example: "Domhnaigh → dow-nee" },
  { rule: "ch (broad)", sound: "like Scottish 'loch'", example: "mach → makh" },
  { rule: "ch (slender)", sound: "like 'h' or soft 'kh'", example: "mhaith → wah" },
  { rule: "fh", sound: "silent", example: "fhios → iss" },
  { rule: "ph", sound: "like 'f'", example: "phrasa → frasah" },
  { rule: "sh / th", sound: "like 'h'", example: "Sheáin → Hawn" },
  { rule: "a, o, u", sound: "Broad vowels — keep consonants broad", example: "maith, athair, dubh" },
  { rule: "e, i", sound: "Slender vowels — soften surrounding consonants", example: "iníon, dearg" },
  { rule: "síneadh fada (á é í ó ú)", sound: "Lengthens the vowel", example: "bán → bawn, mé → may" },
  { rule: "séimhiú (h after consonant)", sound: "Softens the consonant", example: "b → bh, m → mh, f → fh" },
];

// ── QUIZ GENERATOR ───────────────────────────────────────────────────────────
function buildQuizQuestions(count = 10) {
  const allWords = Object.values(categories).flatMap((c) => c.words);
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((word) => {
    const distractors = allWords
      .filter((w) => w.english !== word.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);
    const options = [...distractors, word.english].sort(() => Math.random() - 0.5);
    return { question: word.irish, answer: word.english, options, pronunciation: word.pronunciation };
  });
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("learn");
  const [category, setCategory] = useState("greetings");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);

  // quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // progress
  const [learned, setLearned] = useState({});

  const currentWords = categories[category].words;
  const currentCard = currentWords[cardIndex];

  function startQuiz() {
    const qs = buildQuizQuestions(10);
    setQuizQuestions(qs);
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
    setQuizDone(false);
    setWrongAnswers([]);
  }

  useEffect(() => {
    if (activeTab === "quiz" && quizQuestions.length === 0) startQuiz();
  }, [activeTab]);

  function handleCardNav(dir) {
    setFlipped(false);
    setShowPronunciation(false);
    setCardIndex((i) => (i + dir + currentWords.length) % currentWords.length);
  }

  function markLearned() {
    setLearned((prev) => ({ ...prev, [`${category}-${cardIndex}`]: true }));
    handleCardNav(1);
  }

  function handleQuizAnswer(opt) {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === quizQuestions[quizIndex].answer;
    if (correct) setScore((s) => s + 1);
    else setWrongAnswers((w) => [...w, quizQuestions[quizIndex]]);
    setTimeout(() => {
      if (quizIndex + 1 >= quizQuestions.length) {
        setQuizDone(true);
      } else {
        setQuizIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
  }

  const totalLearned = Object.keys(learned).length;
  const totalWords = Object.values(categories).reduce((a, c) => a + c.words.length, 0);

  const tabs = [
    { id: "learn", label: "Flashcards", icon: "📖" },
    { id: "quiz", label: "Quiz", icon: "✏️" },
    { id: "guide", label: "Pronunciation", icon: "🗣️" },
    { id: "about", label: "About Irish", icon: "🇮🇪" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0fdf4", minHeight: "100vh", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)", color: "white", padding: "24px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: "2.4rem", marginBottom: "4px" }}>🇮🇪</div>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px" }}>Foghlaim Gaeilge</h1>
        <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: "0.9rem" }}>Learn Irish — Beginner Level</p>
        <div style={{ marginTop: "10px", background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "4px 12px", display: "inline-block", fontSize: "0.8rem" }}>
          📚 {totalLearned} / {totalWords} words learned
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: "white", borderBottom: "2px solid #dcfce7", display: "flex", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1, minWidth: "80px", padding: "12px 8px", border: "none", background: "none", cursor: "pointer",
              borderBottom: activeTab === t.id ? "3px solid #16a34a" : "3px solid transparent",
              color: activeTab === t.id ? "#166534" : "#6b7280",
              fontWeight: activeTab === t.id ? 700 : 400,
              fontSize: "0.8rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "20px 16px" }}>

        {/* ── FLASHCARD TAB ── */}
        {activeTab === "learn" && (
          <div>
            {/* Category Selector */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => { setCategory(key); setCardIndex(0); setFlipped(false); setShowPronunciation(false); }}
                  style={{
                    padding: "6px 12px", borderRadius: "20px", border: "2px solid",
                    borderColor: category === key ? "#16a34a" : "#d1fae5",
                    background: category === key ? "#16a34a" : "white",
                    color: category === key ? "white" : "#166534",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Card Counter */}
            <div style={{ textAlign: "center", color: "#6b7280", fontSize: "0.85rem", marginBottom: "12px" }}>
              Card {cardIndex + 1} of {currentWords.length} · {categories[category].label}
              {learned[`${category}-${cardIndex}`] && <span style={{ marginLeft: "8px", color: "#16a34a" }}>✓ Learned</span>}
            </div>

            {/* Flashcard */}
            <div
              onClick={() => setFlipped((f) => !f)}
              style={{
                background: flipped
                  ? "linear-gradient(135deg, #166534, #15803d)"
                  : "white",
                color: flipped ? "white" : "#111827",
                borderRadius: "16px",
                padding: "36px 24px",
                textAlign: "center",
                boxShadow: "0 4px 24px rgba(22,101,52,0.12)",
                cursor: "pointer",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                border: "2px solid #dcfce7",
                transition: "all 0.3s",
                userSelect: "none",
              }}
            >
              {!flipped ? (
                <>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af", marginBottom: "4px" }}>Irish</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2 }}>{currentCard.irish}</div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "8px" }}>Tap to reveal</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7, marginBottom: "4px" }}>English</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.3 }}>{currentCard.english}</div>
                  {currentCard.note && (
                    <div style={{ fontSize: "0.8rem", opacity: 0.75, fontStyle: "italic", marginTop: "4px" }}>{currentCard.note}</div>
                  )}
                  <div style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "4px" }}>Tap to flip back</div>
                </>
              )}
            </div>

            {/* Pronunciation */}
            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <button
                onClick={() => setShowPronunciation((s) => !s)}
                style={{ background: "none", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "6px 16px", color: "#166534", cursor: "pointer", fontSize: "0.85rem" }}
              >
                🗣️ {showPronunciation ? "Hide" : "Show"} pronunciation
              </button>
              {showPronunciation && (
                <div style={{ marginTop: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px 16px", color: "#166534", fontSize: "1rem", fontStyle: "italic" }}>
                  "{currentCard.pronunciation}"
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => handleCardNav(-1)}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid #dcfce7", background: "white", color: "#166534", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
              >
                ← Prev
              </button>
              <button
                onClick={markLearned}
                style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: learned[`${category}-${cardIndex}`] ? "#dcfce7" : "#16a34a", color: learned[`${category}-${cardIndex}`] ? "#166534" : "white", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}
              >
                {learned[`${category}-${cardIndex}`] ? "✓ Learned" : "Mark as Learned →"}
              </button>
              <button
                onClick={() => handleCardNav(1)}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid #dcfce7", background: "white", color: "#166534", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Next →
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280", marginBottom: "4px" }}>
                <span>Category progress</span>
                <span>{currentWords.filter((_, i) => learned[`${category}-${i}`]).length} / {currentWords.length}</span>
              </div>
              <div style={{ background: "#dcfce7", borderRadius: "99px", height: "6px" }}>
                <div style={{
                  background: "#16a34a", borderRadius: "99px", height: "6px",
                  width: `${(currentWords.filter((_, i) => learned[`${category}-${i}`]).length / currentWords.length) * 100}%`,
                  transition: "width 0.4s",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === "quiz" && (
          <div>
            {quizDone ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "8px" }}>
                  {score >= 8 ? "🏆" : score >= 5 ? "👍" : "📚"}
                </div>
                <h2 style={{ color: "#166534", margin: "0 0 4px" }}>Quiz Complete!</h2>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: score >= 8 ? "#16a34a" : score >= 5 ? "#ca8a04" : "#dc2626" }}>
                  {score} / {quizQuestions.length}
                </div>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                  {score === 10 ? "Tá tú iontach! (You're amazing!)" : score >= 7 ? "Go maith! (Well done!)" : score >= 5 ? "Níl go dona! (Not bad!)" : "Ar aghaidh leat! (Keep going!)"}
                </p>

                {wrongAnswers.length > 0 && (
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", padding: "16px", marginTop: "16px", textAlign: "left" }}>
                    <div style={{ fontWeight: 700, color: "#9a3412", marginBottom: "10px", fontSize: "0.9rem" }}>Review these:</div>
                    {wrongAnswers.map((w, i) => (
                      <div key={i} style={{ marginBottom: "8px", fontSize: "0.85rem" }}>
                        <span style={{ fontWeight: 700, color: "#111" }}>{w.question}</span>
                        <span style={{ color: "#6b7280" }}> = {w.answer}</span>
                        <span style={{ color: "#9ca3af" }}> · {w.pronunciation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={startQuiz}
                  style={{ marginTop: "20px", padding: "14px 32px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}
                >
                  Try Again
                </button>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div>
                {/* Progress */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Question {quizIndex + 1} of {quizQuestions.length}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16a34a" }}>Score: {score}</span>
                </div>
                <div style={{ background: "#dcfce7", borderRadius: "99px", height: "6px", marginBottom: "24px" }}>
                  <div style={{ background: "#16a34a", borderRadius: "99px", height: "6px", width: `${(quizIndex / quizQuestions.length) * 100}%`, transition: "width 0.3s" }} />
                </div>

                {/* Question */}
                <div style={{ background: "linear-gradient(135deg, #166534, #15803d)", borderRadius: "14px", padding: "28px 20px", textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>What does this mean?</div>
                  <div style={{ color: "white", fontSize: "2.2rem", fontWeight: 800 }}>{quizQuestions[quizIndex].question}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "8px", fontStyle: "italic" }}>
                    /{quizQuestions[quizIndex].pronunciation}/
                  </div>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {quizQuestions[quizIndex].options.map((opt, i) => {
                    const isCorrect = opt === quizQuestions[quizIndex].answer;
                    const isSelected = opt === selected;
                    let bg = "white", border = "#dcfce7", color = "#111827";
                    if (selected !== null) {
                      if (isCorrect) { bg = "#dcfce7"; border = "#16a34a"; color = "#166534"; }
                      else if (isSelected) { bg = "#fee2e2"; border = "#dc2626"; color = "#991b1b"; }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(opt)}
                        style={{
                          padding: "14px 18px", borderRadius: "10px", border: `2px solid ${border}`,
                          background: bg, color, cursor: selected !== null ? "default" : "pointer",
                          textAlign: "left", fontSize: "0.95rem", fontWeight: 500,
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                      >
                        <span>{opt}</span>
                        {selected !== null && isCorrect && <span>✓</span>}
                        {selected !== null && isSelected && !isCorrect && <span>✗</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── PRONUNCIATION GUIDE ── */}
        {activeTab === "guide" && (
          <div>
            <div style={{ background: "#166534", color: "white", borderRadius: "12px", padding: "16px 18px", marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1rem" }}>Irish Pronunciation Basics</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.85 }}>
                Irish (Gaeilge) has sounds that don't exist in English. The key insight: vowels control how nearby consonants are pronounced. Every consonant is either <strong>broad</strong> (beside a, o, u) or <strong>slender</strong> (beside e, i).
              </p>
            </div>

            <div style={{ background: "#fff", border: "1px solid #dcfce7", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{ background: "#f0fdf4", padding: "10px 16px", fontWeight: 700, fontSize: "0.85rem", color: "#166534", borderBottom: "1px solid #dcfce7" }}>
                Common Letter Combinations
              </div>
              {pronunciationRules.map((r, i) => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: i < pronunciationRules.length - 1 ? "1px solid #f0fdf4" : "none", display: "grid", gridTemplateColumns: "80px 1fr", gap: "12px" }}>
                  <div style={{ fontWeight: 800, color: "#166534", fontSize: "1rem", fontFamily: "monospace" }}>{r.rule}</div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#111" }}>{r.sound}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic", marginTop: "2px" }}>{r.example}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, color: "#92400e", marginBottom: "8px", fontSize: "0.9rem" }}>💡 Key Tips</div>
              <div style={{ fontSize: "0.85rem", color: "#78350f", lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 8px" }}><strong>The fada matters.</strong> A síneadh fada (the accent over vowels: á é í ó ú) makes the vowel long. Bán (white) and ban (woman) are different words.</p>
                <p style={{ margin: "0 0 8px" }}><strong>Lenition (séimhiú).</strong> Adding 'h' after an initial consonant softens it. B→bh (v), M→mh (v/w), F→fh (silent), S→sh (h).</p>
                <p style={{ margin: 0 }}><strong>Three dialects.</strong> Munster (south), Connacht (west), and Ulster (north) Irish sound quite different. Most resources teach Caighdeán (standard), but locals will vary.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ABOUT IRISH ── */}
        {activeTab === "about" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #166534, #15803d)", color: "white", borderRadius: "14px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem" }}>🇮🇪</div>
              <h2 style={{ margin: "8px 0 4px", fontSize: "1.4rem" }}>An Ghaeilge</h2>
              <p style={{ margin: 0, opacity: 0.85, fontSize: "0.9rem" }}>The Irish Language</p>
            </div>

            {[
              { title: "A Living Ancient Language", icon: "📜", text: "Irish (Gaeilge) is a Celtic language over 2,500 years old — one of the oldest written languages in Europe. It's the first official language of Ireland (before English)." },
              { title: "Where It's Spoken", icon: "📍", text: "The Gaeltacht regions — mostly in the west (Connemara, Donegal, Kerry, Mayo) — are where Irish is spoken daily. About 1.8 million people in Ireland claim some ability." },
              { title: "Three Dialects", icon: "🗺️", text: "Munster (Kerry, Cork), Connacht (Galway, Mayo), and Ulster (Donegal) Irish each sound distinct. If you're in Cork, you'll hear Munster Irish." },
              { title: "Word Order", icon: "📐", text: "Irish uses Verb-Subject-Object order, unlike English (S-V-O). 'Tá mé' means 'Am I' (lit: 'Is me'). The verb comes first — always." },
              { title: "Everyday Usage", icon: "🛒", text: "You'll see Irish everywhere in Ireland: street signs, official documents, schools. Even knowing basics like 'Dia duit' or 'Go raibh maith agat' earns genuine appreciation." },
              { title: "Resources to Go Deeper", icon: "🎧", text: "Duolingo has a solid Irish course. Teanglann.ie is the best online dictionary. RTÉ Raidió na Gaeltachta streams live Irish-language radio — great for ear training." },
            ].map((item, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #dcfce7", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, color: "#166534", fontSize: "0.95rem" }}>{item.title}</span>
                </div>
                <p style={{ margin: 0, color: "#374151", fontSize: "0.88rem", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#166534", marginBottom: "6px" }}>Phrase of the Day</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111" }}>Ní neart go cur le chéile</div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "4px" }}>"There is no strength without unity"</div>
              <div style={{ color: "#9ca3af", fontSize: "0.8rem", fontStyle: "italic", marginTop: "4px" }}>nee nart guh kur leh khay-leh</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
