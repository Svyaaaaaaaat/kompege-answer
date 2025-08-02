// ==UserScript==
// @name         kompege-answer
// @namespace    https://kompege.ru
// @version      1.0.0
// @description  Expansion of kompege
// @author       You
// @match        https://kompege.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kompege.ru
// @updateURL    https://github.com/Svyaaaaaaaat/kompege-answer/raw/refs/heads/main/kompege-answer.user.js
// @downloadURL  https://github.com/Svyaaaaaaaat/kompege-answer/raw/refs/heads/main/kompege-answer.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
#answerPopup,
#answerPopup * {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  background: transparent;
  box-sizing: border-box;
  color: inherit;
  text-decoration: none;
  outline: none;
  /* reset list styles */
  list-style: none;
  /* reset table borders */
  border-collapse: collapse;
  border-spacing: 0;
}

/* Отдельно для кнопок и интерактивных элементов */
#answerPopup button,
#answerPopup input,
#answerPopup select,
#answerPopup textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  background: none;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
  cursor: pointer;
}

#answerPopup input[type="number"]::-webkit-inner-spin-button,
#answerPopup input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#answerPopup input[type="number"] {
  -moz-appearance: textfield;
}

/* Убрать подчеркивания у ссылок */
#answerPopup a {
  text-decoration: none;
  color: inherit;
}

#answerPopup {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 15px 40px;
  max-width: 1000px;
  width: 100%;
  aspect-ratio: 16 / 9;
  z-index: 9999;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
html.dark-theme #answerPopup {
  background: rgb(31, 32, 34);
  color: #fff;
}
html.light-theme #answerPopup {
  background: #fff;
  color: #000;
}

#answerPopup h2 {
  user-select: none;
  font-size: 24px;
  margin-bottom: 20px;
}
#answerPopup .answer-popup__copy-message {
  position: absolute;
  font-size: 18px;
  top: 15px;
  right: 18px;
  user-select: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
#answerPopup .answer-popup__copy-message.show {
  opacity: 1;
  pointer-events: auto;
}
#answerPopup .answer-popup__answer-value {
  font-size: 18px;
  cursor: pointer;
}
#answerPopup.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}
/* Фон затемнения */
#popupOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 9998;
}
#popupOverlay.show {
  opacity: 1;
  pointer-events: auto;
}
.answer-popup__answer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  width: 100%;
}

#answerPopup .answer-popup__content {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  flex: 1;
  aspect-ratio: 16 / 9;
  width: 100%;
}
#answerPopup .answer-popup__video-block {
  flex: 1;
}
#answerPopup .answer-popup__iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
}
#answerPopup #taskInput {
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  text-align: center;
  max-width: 90px;
  cursor: auto;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: #555;
}
html.dark-theme #answerPopup #taskInput {
  background: #1f2022;
  color: #fff;
}
html.light-theme #answerPopup #taskInput {
  background: #fff;
  color: #000;
  border-color: #ccc;
}
#answerPopup #taskInput:focus {
  border-color: #999 !important;
}
#answerPopup .answer-popup__answer label span {
  position: absolute;
  top: 33px;
  left: 50px;
  font-size: 18px;
}

#answerPopup .answer-popup__solution-text {
  flex: 1;
  display: none;
  justify-content: center;
  align-items: center;
}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";

  const popup = document.createElement("div");
  popup.id = "answerPopup";
  popup.className = "answer-popup";
  popup.innerHTML = `
<h2>Решение!</h2>
<div class="answer-popup__content">
	<div class="answer-popup__video-block">
		<iframe class="answer-popup__iframe" sandbox="allow-scripts allow-same-origin" allowfullscreen></iframe>
	</div>
	<div class="answer-popup__solution-text">
	</div>
</div>
<div class="answer-popup__answer">
	<label for="taskInput" class="answer-popup__label">
		<span>Задание ?</span>
		<input type="number" id="taskInput" value="" min="1" />
	</label>
	<span class="answer-popup__answer-value">Ответ: ??? ???</span>
</div>
</div>
<div class="answer-popup__copy-message">Скопировано!</div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  const iframe = popup.querySelector(".answer-popup__iframe");
  const answerSpan = popup.querySelector(".answer-popup__answer-value");
  const copyMsg = popup.querySelector(".answer-popup__copy-message");
  const solutionText = popup.querySelector(".answer-popup__solution-text");
  const solutionVideo = popup.querySelector(".answer-popup__video-block");
  const taskNumber = popup.querySelector(".answer-popup__answer label span");
  const taskInput = popup.querySelector("#taskInput");
  let popupOpen = false;

  function reset() {
    answerSpan.textContent = "Ответ: ??? ???";
    solutionText.innerHTML = "";
    answerSpan.onclick = null;
    iframe.src = "";
    taskId = null;
    taskInput.value = "";
    taskNumber.textContent = "Задание ?";
  }

  function togglePopup() {
    const isShown = popup.classList.contains("show");
    if (isShown) {
      popupOpen = false;
      popup.classList.remove("show");
      overlay.classList.remove("show");
      reset();
    } else {
      popupOpen = true;
      popup.classList.add("show");
      overlay.classList.add("show");
    }
  }
  overlay.addEventListener("click", () => {
    togglePopup();
  });

  let taskId = null;

  function getTaskId() {
    const taskElement = document.querySelector(".task .text-bolder span");

    if (taskElement) {
      const match = taskElement.textContent.match(/№(\d+)/);
      if (match) {
        taskId = match[1];
        return taskId;
      }
    }
    return null;
  }

  function renderAnswer(answer) {
    answerSpan.textContent = `Ответ: ${answer}`;

    answerSpan.onclick = () => {
      navigator.clipboard
        .writeText(answer)
        .then(() => {
          copyMsg.classList.add("show");

          setTimeout(() => {
            copyMsg.classList.remove("show");
          }, 1500);
        })
        .catch((err) => {
          console.error("Не удалось скопировать:", err);
        });
    };
  }

  function renderVideo(data) {
    if (!iframe || !data.videotype || !data.video) {
      iframe.src = "";
      iframe.removeAttribute("allow");
      return;
    }
    solutionText.style.display = "none";
    solutionVideo.style.display = "block";

    let src = "";
    let allow = "";

    switch (data.videotype) {
      case "yt":
        const startTime = data.timecode
          ? `?start=${parseInt(data.timecode, 10)}`
          : "";
        src = `https://www.youtube.com/embed/${data.video}${startTime}`;
        allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        break;
      case "rutube":
        const rutubeStart = data.timecode
          ? `?t=${parseInt(data.timecode, 10)}`
          : "";
        src = `https://rutube.ru/play/embed/${data.video}${rutubeStart}`;
        allow = "autoplay; encrypted-media";
        break;
      case "vk":
        const [oid, id] = data.video.split("_");
        const time = data.timecode || ""; // В формате "1h17m55s" или ""
        const timeParam = time ? `&t=${time}` : "";
        src = `https://vk.com/video_ext.php?oid=-${oid}&id=${id}${timeParam}`;
        allow = "autoplay; encrypted-media";
        break;

      default:
        iframe.src = "";
        iframe.removeAttribute("allow");
        return;
    }

    iframe.src = src;
    iframe.setAttribute("allow", allow);
  }

  function renderNumber(number, taskId) {
    taskNumber.textContent = `Задание ${number}`;
    taskInput.value = taskId;
  }

  function renderSolveText(solve) {
    console.log(solve);
    solutionText.style.display = "flex";
    solutionVideo.style.display = "none";
    solutionText.innerHTML = solve;
  }

  function fetchAnswer(taskId) {
    fetch(`https://kompege.ru/api/v1/task/${taskId}`)
      .then((response) => response.json())
      .then((data) => {
        renderAnswer(data.key);
        renderNumber(data.number, data.taskId);
        if (data.solve_text) {
          renderSolveText(data.solve_text);
        }
        if (data.video) {
          renderVideo(data);
        }
      })
      .catch((error) => console.error("Ошибка запроса", error));
  }

  document.addEventListener("keydown", function (e) {
    const active = document.activeElement;
    const isTyping =
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable;
    const onlyC =
      e.code === "KeyC" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;
    if (onlyC && (!isTyping || popupOpen)) {
      togglePopup();
      getTaskId();
      if (taskId) {
        fetchAnswer(taskId);
      } else {
        console.warn("Не удалось найти номер задания.");
      }
    }
    if (e.key === "Escape" && popupOpen) {
      togglePopup();
    }
    if (e.key === "Enter" && popupOpen) {
      const value = taskInput.value.trim();
      if (/^\d+$/.test(value)) {
        fetchAnswer(value);
      }

      reset();
    }
  });
})();
