const DEFAULT_UNIT_COUNT = 42;
const PDF_DB_NAME = "b1TrainerPdfDb";
const PDF_DB_VERSION = 1;
const PDF_STORE_NAME = "files";
const PDF_RECORD_KEY = "book";

const STORAGE_KEYS = {
  imported: "b1Trainer.importedUnits",
  custom: "b1Trainer.customWords",
  mastered: "b1Trainer.masteredWords",
  progress: "b1Trainer.progress",
  selectedUnit: "b1Trainer.selectedUnit",
  theme: "b1Trainer.theme",
  ebookMode: "b1Trainer.ebookMode",
};

const state = {
  unitId: localStorage.getItem(STORAGE_KEYS.selectedUnit) || "unit-01",
  testWords: [],
  currentIndex: 0,
  score: 0,
  results: [],
  answered: false,
  pdfUrl: "",
  aiImageDataUrl: "",
  aiImageName: "",
};

const els = {
  pdfTab: document.querySelector("#pdfTab"),
  themeToggle: document.querySelector("#themeToggle"),
  ebookModeButton: document.querySelector("#ebookModeButton"),
  learnTab: document.querySelector("#learnTab"),
  testTab: document.querySelector("#testTab"),
  addTab: document.querySelector("#addTab"),
  importTab: document.querySelector("#importTab"),
  pdfPanel: document.querySelector("#pdfPanel"),
  learnPanel: document.querySelector("#learnPanel"),
  testPanel: document.querySelector("#testPanel"),
  addPanel: document.querySelector("#addPanel"),
  importPanel: document.querySelector("#importPanel"),
  pdfInput: document.querySelector("#pdfInput"),
  pdfFrame: document.querySelector("#pdfFrame"),
  pdfFileName: document.querySelector("#pdfFileName"),
  unitSelect: document.querySelector("#unitSelect"),
  unitList: document.querySelector("#unitList"),
  unitInput: document.querySelector("#unitInput"),
  importUnitInput: document.querySelector("#importUnitInput"),
  unitTitle: document.querySelector("#unitTitle"),
  unitDescription: document.querySelector("#unitDescription"),
  learnHeading: document.querySelector("#learnHeading"),
  wordCount: document.querySelector("#wordCount"),
  masteredCount: document.querySelector("#masteredCount"),
  scoreCount: document.querySelector("#scoreCount"),
  readyPercent: document.querySelector("#readyPercent"),
  showLearnButton: document.querySelector("#showLearnButton"),
  startTestButton: document.querySelector("#startTestButton"),
  startTestSideButton: document.querySelector("#startTestSideButton"),
  resetTestButton: document.querySelector("#resetTestButton"),
  onlyUnmasteredInput: document.querySelector("#onlyUnmasteredInput"),
  shuffleInput: document.querySelector("#shuffleInput"),
  searchInput: document.querySelector("#searchInput"),
  wordTable: document.querySelector("#wordTable"),
  questionCard: document.querySelector("#questionCard"),
  questionIndex: document.querySelector("#questionIndex"),
  questionScore: document.querySelector("#questionScore"),
  questionMeaning: document.querySelector("#questionMeaning"),
  questionMeta: document.querySelector("#questionMeta"),
  answerForm: document.querySelector("#answerForm"),
  answerInput: document.querySelector("#answerInput"),
  feedback: document.querySelector("#feedback"),
  skipButton: document.querySelector("#skipButton"),
  nextButton: document.querySelector("#nextButton"),
  resultPanel: document.querySelector("#resultPanel"),
  resultSummary: document.querySelector("#resultSummary"),
  resultList: document.querySelector("#resultList"),
  retryWrongButton: document.querySelector("#retryWrongButton"),
  wordForm: document.querySelector("#wordForm"),
  englishInput: document.querySelector("#englishInput"),
  vietnameseInput: document.querySelector("#vietnameseInput"),
  typeInput: document.querySelector("#typeInput"),
  exampleInput: document.querySelector("#exampleInput"),
  clearCustomButton: document.querySelector("#clearCustomButton"),
  importTextarea: document.querySelector("#importTextarea"),
  importButton: document.querySelector("#importButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  clearImportedButton: document.querySelector("#clearImportedButton"),
  importStatus: document.querySelector("#importStatus"),
  aiProviderInput: document.querySelector("#aiProviderInput"),
  aiApiKeyInput: document.querySelector("#aiApiKeyInput"),
  aiModelInput: document.querySelector("#aiModelInput"),
  aiProxyUrlInput: document.querySelector("#aiProxyUrlInput"),
  imageDropZone: document.querySelector("#imageDropZone"),
  imageFileInput: document.querySelector("#imageFileInput"),
  imagePreview: document.querySelector("#imagePreview"),
  aiImportButton: document.querySelector("#aiImportButton"),
  clearImageButton: document.querySelector("#clearImageButton"),
  aiImportStatus: document.querySelector("#aiImportStatus"),
};

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  els.themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  els.themeToggle.title = theme === "dark" ? "Chế độ sáng" : "Chế độ tối";
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function applyEbookMode(isEnabled) {
  document.body.classList.toggle("ebook-mode", isEnabled);
  localStorage.setItem(STORAGE_KEYS.ebookMode, isEnabled ? "1" : "0");
  els.ebookModeButton.textContent = isEnabled ? "Thoát ebook" : "Ebook mode";
}

function toggleEbookMode() {
  applyEbookMode(!document.body.classList.contains("ebook-mode"));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEmptyUnits() {
  return Array.from({ length: DEFAULT_UNIT_COUNT }, (_, index) => {
    const number = index + 1;
    return {
      id: `unit-${String(number).padStart(2, "0")}`,
      number,
      title: `Unit ${number}`,
      description:
        "Chưa có dữ liệu luyện tập cho unit này. Mở PDF gốc để học hoặc import dữ liệu bạn được phép sử dụng.",
      words: [],
    };
  });
}

function shapeWord(word, unitId) {
  if (Array.isArray(word)) {
    const [english, vietnamese, type, example] = word;
    return { english, vietnamese, type, example, unitId };
  }
  return {
    english: word.english || "",
    vietnamese: word.vietnamese || "",
    type: word.type || "word",
    example: word.example || "",
    phonetic: word.phonetic || word.phonetics || "",
    audio: word.audio || "",
    alternatives: Array.isArray(word.alternatives) ? word.alternatives : [],
    unitId: word.unitId || unitId,
  };
}

function normalizeUnit(unit, index) {
  const number = Number(unit.number || index + 1);
  const id = unit.id || `unit-${String(number).padStart(2, "0")}`;
  return {
    id,
    number,
    title: unit.title || `Unit ${number}`,
    description: unit.description || "Dữ liệu import.",
    words: Array.isArray(unit.words) ? unit.words.map((word) => shapeWord(word, id)) : [],
  };
}

function getImportedUnits() {
  const imported = loadJson(STORAGE_KEYS.imported, []);
  const baseUnits = createEmptyUnits();

  if (!Array.isArray(imported) || !imported.length) {
    return baseUnits;
  }

  imported.map(normalizeUnit).forEach((importedUnit) => {
    const targetIndex = baseUnits.findIndex((unit) => unit.id === importedUnit.id);
    if (targetIndex >= 0) {
      baseUnits[targetIndex] = importedUnit;
    } else {
      baseUnits.push(importedUnit);
    }
  });

  return baseUnits.sort((a, b) => a.number - b.number);
}

function getCustomWords() {
  return loadJson(STORAGE_KEYS.custom, []);
}

function getMasteredMap() {
  return loadJson(STORAGE_KEYS.mastered, {});
}

function getUnits() {
  const units = getImportedUnits();

  getCustomWords().forEach((word) => {
    const unit = units.find((item) => item.id === word.unitId);
    if (unit) {
      unit.words.push(shapeWord(word, unit.id));
    }
  });

  return units;
}

function getCurrentUnit() {
  const units = getUnits();
  return units.find((unit) => unit.id === state.unitId) || units[0];
}

function makeWordId(word) {
  return `${word.unitId}:${normalize(word.english)}`;
}

function initUnitControls() {
  const units = getUnits();
  els.unitSelect.innerHTML = "";
  els.unitInput.innerHTML = "";
  els.importUnitInput.innerHTML = "";
  els.unitList.innerHTML = "";

  units.forEach((unit) => {
    const label = `Unit ${unit.number}: ${unit.title}`;
    const option = new Option(label, unit.id);
    els.unitSelect.append(option);
    els.unitInput.append(option.cloneNode(true));
    els.importUnitInput.append(option.cloneNode(true));

    const button = document.createElement("button");
    button.className = `unit-card ${unit.id === state.unitId ? "active" : ""}`;
    button.type = "button";
    button.dataset.unitId = unit.id;
    button.innerHTML = `
      <strong>Unit ${unit.number}</strong>
      <span>${escapeHtml(unit.title)}</span>
    `;
    els.unitList.append(button);
  });

  if (!units.some((unit) => unit.id === state.unitId)) {
    state.unitId = units[0].id;
  }

  els.unitSelect.value = state.unitId;
  els.unitInput.value = state.unitId;
  els.importUnitInput.value = state.unitId;
}

function setUnit(unitId) {
  state.unitId = unitId;
  state.testWords = [];
  state.results = [];
  localStorage.setItem(STORAGE_KEYS.selectedUnit, unitId);
  initUnitControls();
  renderAll();
}

function switchPanel(panelName) {
  const map = {
    pdf: [els.pdfTab, els.pdfPanel],
    learn: [els.learnTab, els.learnPanel],
    test: [els.testTab, els.testPanel],
    add: [els.addTab, els.addPanel],
    import: [els.importTab, els.importPanel],
  };

  Object.values(map).forEach(([tab, panel]) => {
    tab.classList.remove("active");
    panel.classList.remove("active");
  });

  const [tab, panel] = map[panelName];
  tab.classList.add("active");
  panel.classList.add("active");
}

function renderAll() {
  renderUnitHeader();
  renderWordTable();
  updateStats();
}

function renderUnitHeader() {
  const unit = getCurrentUnit();
  els.unitTitle.textContent = `Unit ${unit.number}: ${unit.title}`;
  els.unitDescription.textContent = unit.description;
  els.learnHeading.textContent = `Từ vựng Unit ${unit.number}`;
}

function renderWordTable() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  const query = normalize(els.searchInput.value);
  const words = unit.words.filter((word) => {
    const haystack = normalize(`${word.english} ${word.vietnamese} ${word.type} ${word.example}`);
    return !query || haystack.includes(query);
  });

  if (!words.length) {
    els.wordTable.innerHTML =
      '<div class="empty-state">Unit này chưa có dữ liệu từ vựng. Bạn có thể thêm từ thủ công hoặc import JSON trong tab Import.</div>';
    return;
  }

  els.wordTable.innerHTML = `
    <div class="word-row header">
      <span>#</span>
      <span>English</span>
      <span>Vietnamese</span>
      <span>Type</span>
      <span>Example</span>
      <span>Pronunciation</span>
      <span>Status</span>
    </div>
  `;

  words.forEach((word, index) => {
    const wordId = makeWordId(word);
    const row = document.createElement("div");
    row.className = "word-row";
    row.innerHTML = `
      <span class="index-pill">${index + 1}</span>
      <span class="word-main">${escapeHtml(word.english)}</span>
      <span class="meaning">${escapeHtml(word.vietnamese)}</span>
      <span class="type-tag">${escapeHtml(word.type || "word")}</span>
      <span class="example">${escapeHtml(word.example || "Tự đặt một câu với từ này.")}</span>
      <span class="pron-tools">
        ${word.phonetic ? `<span class="phonetic">${escapeHtml(word.phonetic)}</span>` : ""}
        <button class="mini-button" type="button" data-speak="${escapeHtml(word.english)}">Nghe</button>
        ${
          word.audio
            ? `<a class="mini-link" href="${escapeHtml(word.audio)}" target="_blank" rel="noreferrer">Audio</a>`
            : ""
        }
        <a class="mini-link" href="${escapeHtml(getOxfordUrl(word.english))}" target="_blank" rel="noreferrer">Oxford</a>
      </span>
      <label class="master-check">
        <input type="checkbox" data-mastered="${escapeHtml(wordId)}" ${mastered[wordId] ? "checked" : ""} />
        Đã thuộc
      </label>
    `;
    els.wordTable.append(row);
  });
}

function updateStats() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  const masteredCount = unit.words.filter((word) => mastered[makeWordId(word)]).length;
  const progress = loadJson(STORAGE_KEYS.progress, {});
  const unitProgress = progress[state.unitId] || { score: 0, total: unit.words.length };
  const readyPercent = unit.words.length ? Math.round((masteredCount / unit.words.length) * 100) : 0;

  els.wordCount.textContent = unit.words.length;
  els.masteredCount.textContent = masteredCount;
  els.scoreCount.textContent = `${unitProgress.score}/${unitProgress.total || unit.words.length}`;
  els.readyPercent.textContent = `${readyPercent}%`;
}

function getTestWords() {
  const unit = getCurrentUnit();
  const mastered = getMasteredMap();
  let words = unit.words;

  if (els.onlyUnmasteredInput.checked) {
    words = words.filter((word) => !mastered[makeWordId(word)]);
  }

  if (!words.length && unit.words.length) {
    words = unit.words;
  }

  return els.shuffleInput.checked ? shuffle(words) : [...words];
}

function startTest(words = getTestWords()) {
  if (!words.length) {
    switchPanel("learn");
    els.wordTable.innerHTML =
      '<div class="empty-state">Unit này chưa có dữ liệu để test. Hãy thêm từ thủ công hoặc import JSON trước.</div>';
    return;
  }

  state.testWords = words;
  state.currentIndex = 0;
  state.score = 0;
  state.results = [];
  state.answered = false;

  els.resultPanel.classList.add("hidden");
  els.questionCard.classList.remove("hidden");
  switchPanel("test");
  renderQuestion();
}

function shuffle(words) {
  const copy = [...words];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function renderQuestion() {
  const word = state.testWords[state.currentIndex];
  const total = state.testWords.length;

  if (!word) {
    finishTest();
    return;
  }

  els.questionIndex.textContent = `Câu ${state.currentIndex + 1}/${total}`;
  els.questionScore.textContent = `${state.score} đúng`;
  els.questionMeaning.textContent = word.vietnamese;
  els.questionMeta.textContent = `${word.type || "word"} - ${word.example || "Không có ví dụ"}`;
  els.answerInput.value = "";
  els.answerInput.disabled = false;
  els.skipButton.disabled = false;
  els.nextButton.classList.add("hidden");
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  state.answered = false;
  els.answerInput.focus();
}

function submitAnswer(event) {
  event.preventDefault();
  if (state.answered) {
    return;
  }

  const word = state.testWords[state.currentIndex];
  const userAnswer = normalize(els.answerInput.value);
  const answers = [word.english, ...(word.alternatives || [])].map(normalize);
  const isCorrect = answers.includes(userAnswer);

  state.answered = true;
  els.answerInput.disabled = true;
  els.skipButton.disabled = true;
  els.nextButton.classList.remove("hidden");

  if (isCorrect) {
    state.score += 1;
    els.feedback.textContent = `Đúng: ${word.english}`;
    els.feedback.classList.add("correct");
  } else {
    els.feedback.textContent = `Sai. Đáp án đúng là: ${word.english}`;
    els.feedback.classList.add("wrong");
  }

  state.results.push({
    word,
    userAnswer: els.answerInput.value.trim() || "(bỏ trống)",
    isCorrect,
  });
  els.questionScore.textContent = `${state.score} đúng`;
}

function skipQuestion() {
  if (state.answered) {
    return;
  }

  const word = state.testWords[state.currentIndex];
  state.answered = true;
  state.results.push({ word, userAnswer: "(bỏ qua)", isCorrect: false });
  els.answerInput.disabled = true;
  els.skipButton.disabled = true;
  els.feedback.textContent = `Đáp án đúng là: ${word.english}`;
  els.feedback.className = "feedback wrong";
  els.nextButton.classList.remove("hidden");
}

function nextQuestion() {
  if (!state.answered) {
    skipQuestion();
    return;
  }
  state.currentIndex += 1;
  renderQuestion();
}

function finishTest() {
  const total = state.results.length;
  const wrong = state.results.filter((result) => !result.isCorrect);
  const progress = loadJson(STORAGE_KEYS.progress, {});
  progress[state.unitId] = {
    score: state.score,
    total,
    updatedAt: new Date().toISOString(),
  };
  saveJson(STORAGE_KEYS.progress, progress);

  els.questionCard.classList.add("hidden");
  els.resultPanel.classList.remove("hidden");
  els.resultSummary.textContent = `Bạn đúng ${state.score}/${total} câu trong ${getCurrentUnit().title}. ${
    wrong.length ? "Các câu sai đã được liệt kê bên dưới." : "Không có câu sai."
  }`;
  els.resultList.innerHTML = "";

  state.results.forEach((result) => {
    const item = document.createElement("div");
    item.className = `result-item ${result.isCorrect ? "correct" : "wrong"}`;
    item.innerHTML = `
      <strong>${result.isCorrect ? "Đúng" : "Sai"}</strong>
      <span>${escapeHtml(result.word.vietnamese)} -> ${escapeHtml(result.word.english)}
      <br />Bạn nhập: ${escapeHtml(result.userAnswer)}</span>
    `;
    els.resultList.append(item);
  });

  els.retryWrongButton.disabled = wrong.length === 0;
  updateStats();
}

function addCustomWord(event) {
  event.preventDefault();

  const word = {
    unitId: els.unitInput.value,
    english: els.englishInput.value.trim(),
    vietnamese: els.vietnameseInput.value.trim(),
    type: els.typeInput.value.trim() || "custom",
    example: els.exampleInput.value.trim(),
  };

  if (!word.english || !word.vietnamese) {
    return;
  }

  const customWords = getCustomWords();
  customWords.push(word);
  saveJson(STORAGE_KEYS.custom, customWords);
  els.wordForm.reset();
  els.unitInput.value = state.unitId;
  initUnitControls();
  renderAll();
  switchPanel("learn");
}

function clearCustomWords() {
  if (!window.confirm("Xóa toàn bộ từ bạn đã tự thêm?")) {
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.custom);
  initUnitControls();
  renderAll();
}

function handlePdfFile(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  savePdfFile(file)
    .then(() => showPdfFile({ name: file.name, blob: file }))
    .catch((error) => {
      els.pdfFileName.textContent = `Không lưu được PDF: ${error.message}`;
    });
}

function openPdfDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PDF_DB_NAME, PDF_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
        db.createObjectStore(PDF_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePdfFile(file) {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PDF_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PDF_STORE_NAME);
    store.put({
      id: PDF_RECORD_KEY,
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      savedAt: new Date().toISOString(),
      blob: file,
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function loadSavedPdfFile() {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PDF_STORE_NAME, "readonly");
    const store = transaction.objectStore(PDF_STORE_NAME);
    const request = store.get(PDF_RECORD_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function showPdfFile(record) {
  if (state.pdfUrl) {
    URL.revokeObjectURL(state.pdfUrl);
  }
  state.pdfUrl = URL.createObjectURL(record.blob);
  els.pdfFrame.src = state.pdfUrl;
  els.pdfFileName.textContent = `Đang mở: ${record.name}. File này đã được lưu trong trình duyệt.`;
}

function importUnits() {
  try {
    const parsed = JSON.parse(els.importTextarea.value);
    const importedUnit = importParsedData(parsed, els.importUnitInput.value || state.unitId);
    els.importStatus.textContent = `Đã import ${importedUnit.words.length} mục vào Unit ${importedUnit.number}. Chọn unit khác ở ô "Import vào unit" để nhập bài tiếp theo.`;
    els.importStatus.className = "feedback correct";
    switchPanel("import");
  } catch (error) {
    els.importStatus.textContent = `Import lỗi: ${error.message}`;
    els.importStatus.className = "feedback wrong";
  }
}

function importParsedData(parsed, targetUnitId) {
  const units = getImportedUnits();
  const targetIndex = units.findIndex((unit) => unit.id === targetUnitId);

  if (targetIndex < 0) {
    throw new Error("Không tìm thấy unit cần import.");
  }

  const importedUnit = buildUnitForImport(parsed, units[targetIndex]);
  units[targetIndex] = importedUnit;
  saveJson(STORAGE_KEYS.imported, units);
  state.unitId = importedUnit.id;
  localStorage.setItem(STORAGE_KEYS.selectedUnit, state.unitId);
  initUnitControls();
  renderAll();
  return importedUnit;
}

function buildUnitForImport(parsed, targetUnit) {
  const firstItem = Array.isArray(parsed) ? parsed[0] : parsed;
  const sourceUnit =
    firstItem && typeof firstItem === "object" && Array.isArray(firstItem.words)
      ? firstItem
      : null;
  const sourceWords = sourceUnit ? sourceUnit.words : parsed;

  if (!Array.isArray(sourceWords)) {
    throw new Error("JSON phải là một unit có `words`, hoặc là một mảng từ.");
  }

  const importedWords = sourceWords
    .map((word) => shapeWord(word, targetUnit.id))
    .map(removeInvalidExample)
    .filter((word) => word.english && word.vietnamese);

  if (!importedWords.length) {
    throw new Error("Không có từ hợp lệ. Mỗi từ cần có `english` và `vietnamese`.");
  }

  return {
    ...targetUnit,
    title: sourceUnit?.title || targetUnit.title,
    description: sourceUnit?.description || targetUnit.description,
    words: importedWords,
  };
}

function removeInvalidExample(word) {
  if (!word.example || !word.english) {
    return word;
  }

  const example = normalizeForExampleCheck(word.example);
  const target = normalizeForExampleCheck(word.english);

  if (target && example.includes(target)) {
    return { ...word, example: "" };
  }

  return word;
}

function normalizeForExampleCheck(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exportCurrentData() {
  const data = getUnits().map((unit) => ({
    number: unit.number,
    title: unit.title,
    description: unit.description,
    words: unit.words.map(({ english, vietnamese, type, example, phonetic, audio, alternatives }) => ({
      english,
      vietnamese,
      type,
      example,
      phonetic,
      audio,
      alternatives,
    })),
  }));
  els.importTextarea.value = JSON.stringify(data, null, 2);
  els.importStatus.textContent = "Đã đưa dữ liệu hiện tại vào ô import.";
  els.importStatus.className = "feedback correct";
}

function getOxfordUrl(term) {
  return `https://www.oxfordlearnersdictionaries.com/search/english/?q=${encodeURIComponent(term)}`;
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function setAiImage(dataUrl, name) {
  state.aiImageDataUrl = dataUrl;
  state.aiImageName = name || "pasted-image";
  els.imagePreview.src = dataUrl;
  els.imagePreview.classList.remove("hidden");
  els.aiImportStatus.textContent = `Đã nhận ảnh: ${state.aiImageName}`;
  els.aiImportStatus.className = "feedback correct";
}

function clearAiImage() {
  state.aiImageDataUrl = "";
  state.aiImageName = "";
  els.imagePreview.removeAttribute("src");
  els.imagePreview.classList.add("hidden");
  els.imageFileInput.value = "";
  els.aiImportStatus.textContent = "";
  els.aiImportStatus.className = "feedback";
}

function readImageFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    els.aiImportStatus.textContent = "File được chọn không phải ảnh.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => setAiImage(reader.result, file.name);
  reader.onerror = () => {
    els.aiImportStatus.textContent = "Không đọc được ảnh.";
    els.aiImportStatus.className = "feedback wrong";
  };
  reader.readAsDataURL(file);
}

function handleImagePaste(event) {
  const item = [...(event.clipboardData?.items || [])].find((clipboardItem) =>
    clipboardItem.type.startsWith("image/")
  );
  if (!item) {
    return;
  }
  event.preventDefault();
  readImageFile(item.getAsFile());
}

async function aiImportImage() {
  const provider = els.aiProviderInput.value;
  const apiKey = els.aiApiKeyInput.value.trim();
  const model = els.aiModelInput.value.trim() || getDefaultAiModel(provider);

  if (!apiKey) {
    els.aiImportStatus.textContent = "Bạn cần nhập OpenAI API key.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  if (!state.aiImageDataUrl) {
    els.aiImportStatus.textContent = "Bạn cần dán hoặc chọn ảnh trước.";
    els.aiImportStatus.className = "feedback wrong";
    return;
  }

  els.aiImportButton.disabled = true;
  els.aiImportStatus.textContent = "AI đang đọc ảnh và tạo dữ liệu import...";
  els.aiImportStatus.className = "feedback";

  try {
    const responseText =
      provider === "nvidia"
        ? await callNvidiaVisionImport({
            apiKey,
            model,
            imageDataUrl: state.aiImageDataUrl,
            proxyUrl: els.aiProxyUrlInput.value.trim(),
          })
        : await callOpenAiVisionImport({ apiKey, model, imageDataUrl: state.aiImageDataUrl });
    const aiUnit = parseAiJsonResponse(responseText);
    const importedUnit = importParsedData(aiUnit, els.importUnitInput.value || state.unitId);
    els.importTextarea.value = JSON.stringify(aiUnit, null, 2);
    els.aiImportStatus.textContent = `Đã AI import ${importedUnit.words.length} mục vào Unit ${importedUnit.number}.`;
    els.aiImportStatus.className = "feedback correct";
    switchPanel("import");
  } catch (error) {
    els.aiImportStatus.textContent = `AI import lỗi: ${error.message}`;
    els.aiImportStatus.className = "feedback wrong";
  } finally {
    els.aiImportButton.disabled = false;
  }
}

function getDefaultAiModel(provider) {
  return provider === "nvidia" ? "meta/llama-3.2-11b-vision-instruct" : "gpt-4.1-mini";
}

function getAiPrompt() {
  return [
    "You are a strict JSON extraction engine. Do not explain, do not add markdown, do not add comments.",
    "Read the vocabulary image.",
    "Extract only vocabulary items, phrasal verbs, prepositional phrases, word formation items, definitions if visible, part of speech, and phonetic transcription if visible.",
    "Translate meanings into Vietnamese.",
    "The first character of your response must be { and the last character must be }.",
    "Return only valid JSON with this exact shape:",
    '{"title":"string","description":"string","words":[{"english":"string","vietnamese":"string","type":"string","phonetic":"string","example":"string"}]}',
    "For every item, create one short natural English example sentence.",
    "The example sentence must NOT contain the target english word or phrase, and must NOT contain an obvious inflected form of it.",
    "Use concise Vietnamese meanings. Leave phonetic as an empty string if not visible, but do not leave example empty.",
  ].join(" ");
}

async function callOpenAiVisionImport({ apiKey, model, imageDataUrl }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: getAiPrompt(),
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "unit_vocabulary_import",
          strict: true,
          schema: getUnitImportJsonSchema(),
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI API trả lỗi.");
  }

  return extractOpenAiResponseText(data);
}

async function callNvidiaVisionImport({ apiKey, model, imageDataUrl, proxyUrl }) {
  const payload = {
    model,
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON. Never describe the image in prose. Never wrap JSON in markdown.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: getAiPrompt(),
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
            },
          },
        ],
      },
    ],
  };
  const endpoint = proxyUrl || "https://integrate.api.nvidia.com/v1/chat/completions";
  const headers = { "Content-Type": "application/json" };
  const body = proxyUrl ? { apiKey, payload } : payload;

  if (!proxyUrl) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (!proxyUrl) {
      throw new Error(
        "NVIDIA chặn request trực tiếp từ trình duyệt (CORS). Hãy dùng Proxy URL cho NVIDIA."
      );
    }
    throw error;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "NVIDIA API trả lỗi.");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Không đọc được nội dung từ phản hồi NVIDIA.");
  }

  return stripJsonFence(typeof content === "string" ? content : JSON.stringify(content));
}

function getUnitImportJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["title", "description", "words"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      words: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["english", "vietnamese", "type", "phonetic", "example"],
          properties: {
            english: { type: "string" },
            vietnamese: { type: "string" },
            type: { type: "string" },
            phonetic: { type: "string" },
            example: { type: "string" },
          },
        },
      },
    },
  };
}

function extractOpenAiResponseText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  for (const outputItem of data.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (contentItem.type === "output_text" && contentItem.text) {
        return contentItem.text;
      }
    }
  }

  throw new Error("Không đọc được JSON từ phản hồi AI.");
}

function stripJsonFence(value) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseAiJsonResponse(value) {
  const cleaned = stripJsonFence(String(value || ""));
  const direct = tryParseJson(cleaned);
  if (direct) {
    return direct;
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const extracted = cleaned.slice(firstBrace, lastBrace + 1);
    const parsed = tryParseJson(extracted);
    if (parsed) {
      return parsed;
    }
  }

  const preview = cleaned.slice(0, 160).replace(/\s+/g, " ");
  throw new Error(
    `AI chưa trả JSON hợp lệ. Hãy bấm lại hoặc đổi model. Phản hồi bắt đầu bằng: ${preview}`
  );
}

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function clearImportedData() {
  if (!window.confirm("Xóa toàn bộ dữ liệu import?")) {
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.imported);
  state.unitId = "unit-01";
  localStorage.setItem(STORAGE_KEYS.selectedUnit, state.unitId);
  initUnitControls();
  renderAll();
  els.importStatus.textContent = "Đã xóa dữ liệu import.";
  els.importStatus.className = "feedback correct";
}

function bindEvents() {
  els.themeToggle.addEventListener("click", toggleTheme);
  els.ebookModeButton.addEventListener("click", toggleEbookMode);
  els.pdfInput.addEventListener("change", handlePdfFile);
  els.unitSelect.addEventListener("change", () => setUnit(els.unitSelect.value));
  els.importUnitInput.addEventListener("change", () => {
    setUnit(els.importUnitInput.value);
  });
  els.unitList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-unit-id]");
    if (button) {
      setUnit(button.dataset.unitId);
    }
  });

  els.pdfTab.addEventListener("click", () => switchPanel("pdf"));
  els.learnTab.addEventListener("click", () => switchPanel("learn"));
  els.testTab.addEventListener("click", () => switchPanel("test"));
  els.addTab.addEventListener("click", () => switchPanel("add"));
  els.importTab.addEventListener("click", () => switchPanel("import"));
  els.showLearnButton.addEventListener("click", () => switchPanel("learn"));
  els.startTestButton.addEventListener("click", () => startTest());
  els.startTestSideButton.addEventListener("click", () => startTest());
  els.resetTestButton.addEventListener("click", () => startTest());
  els.answerForm.addEventListener("submit", submitAnswer);
  els.skipButton.addEventListener("click", skipQuestion);
  els.nextButton.addEventListener("click", nextQuestion);
  els.retryWrongButton.addEventListener("click", () => {
    const wrongWords = state.results
      .filter((result) => !result.isCorrect)
      .map((result) => result.word);
    startTest(wrongWords);
  });
  els.searchInput.addEventListener("input", renderWordTable);
  els.wordTable.addEventListener("change", (event) => {
    const input = event.target.closest("[data-mastered]");
    if (!input) {
      return;
    }
    const mastered = getMasteredMap();
    mastered[input.dataset.mastered] = input.checked;
    saveJson(STORAGE_KEYS.mastered, mastered);
    updateStats();
  });
  els.wordTable.addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      speakText(speakButton.dataset.speak);
    }
  });
  els.wordForm.addEventListener("submit", addCustomWord);
  els.clearCustomButton.addEventListener("click", clearCustomWords);
  els.importButton.addEventListener("click", importUnits);
  els.exportDataButton.addEventListener("click", exportCurrentData);
  els.clearImportedButton.addEventListener("click", clearImportedData);
  els.imageDropZone.addEventListener("paste", handleImagePaste);
  els.imageDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.imageDropZone.classList.add("drag-over");
  });
  els.imageDropZone.addEventListener("dragleave", () => {
    els.imageDropZone.classList.remove("drag-over");
  });
  els.imageDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    els.imageDropZone.classList.remove("drag-over");
    readImageFile(event.dataTransfer.files[0]);
  });
  els.imageFileInput.addEventListener("change", () => {
    readImageFile(els.imageFileInput.files[0]);
  });
  els.clearImageButton.addEventListener("click", clearAiImage);
  els.aiImportButton.addEventListener("click", aiImportImage);
  els.aiProviderInput.addEventListener("change", () => {
    els.aiModelInput.value = getDefaultAiModel(els.aiProviderInput.value);
  });
}

async function init() {
  applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light");
  applyEbookMode(localStorage.getItem(STORAGE_KEYS.ebookMode) === "1");
  initUnitControls();
  bindEvents();
  renderAll();
  try {
    const savedPdf = await loadSavedPdfFile();
    if (savedPdf) {
      showPdfFile(savedPdf);
    }
  } catch (error) {
    els.pdfFileName.textContent = `Chọn file PDF để mở. Trình duyệt chưa nạp được PDF đã lưu: ${error.message}`;
  }
}

init();
