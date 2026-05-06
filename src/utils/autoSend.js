"use strict";
/**
 * autoSend.js — نظام الإرسال التلقائي
 * تفعيل: "انسخ" | إيقاف: "توقف"
 * يرسل رسالة ثابتة كل 20-30 ثانية بشكل عشوائي مع typing indicator
 */

const chalk = require("chalk");

const AUTO_MESSAGE = `𝑨𝑼𝑻𝑶 𝑹𝑬𝑷𝑳𝒀

𝑲𝑰𝑵𝑮 𝑴𝑼𝒁𝑨𝑵 『༴‌卍⋆‌🕷️👑』⇣؍.َِ

🕷️𝑳𝑶𝑹𝑫 𝐒𝐏𝐈𝐃𝐄𝐑𝐒 ..➪ 𝑴𝑼𝒁𝑨𝑵 𝑲𝑶𝑵🕷️

♕︎ 𝑻𝑯𝑬 𝑩𝑬𝑺𝑻  ♕︎

𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅝𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅚𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅗𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅛𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅕𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅘𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅡𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸𖢩🅐𖢩👑𖢩𒁢𖢩🕷️𖢩𒁢𖢩🩸

〘🥊─卍─🥊〙


𝐒𝐏𝐈𝐃𝐄𝐑𝐒 𝑻𝑯𝑬 𝑺𝑻𝑹𝑶𝑵𝑮𝑬𝑺𝑻 𝑶𝑭 𝑨𝑳𝑳 𝑻𝑰𝑴𝑬  『༴‌卍⋆‌🕷️』⇣؍.َِ

𝑲𝑰𝑵𝑮 𝑴𝑼𝒁𝑨𝑵┊ 🕷️👑』⇣┊`;

const MIN_MS = 20_000;
const MAX_MS = 30_000;

const _timers  = new Map();
const _paused  = new Set();

const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const sleep   = ms => new Promise(r => setTimeout(r, ms));

function log(msg) {
  const ts = new Date().toLocaleTimeString("ar-DZ", { hour12: false });
  console.log(`${chalk.gray(ts)} ${chalk.magenta("⚡")} ${chalk.bold.magenta("[AUTO_SEND]")} ${msg}`);
}

async function sendCycle(api, threadID) {
  if (_paused.has(threadID)) return;
  if (!global.api || !api) return;

  try {
    await api.sendTypingIndicator(threadID);
    const typingMs = randInt(1500, 4000);
    await sleep(typingMs);

    if (_paused.has(threadID)) return;

    await new Promise((resolve) => {
      api.sendMessage(AUTO_MESSAGE, threadID, (err) => {
        if (err) log(`خطأ في الإرسال إلى ${threadID}: ${err.error || err.message || err}`);
        resolve();
      });
    });

    log(`✅ أُرسلت إلى ${chalk.cyan(threadID)}`);
  } catch (e) {
    log(`خطأ: ${e.message}`);
  }

  if (!_paused.has(threadID) && _timers.has(threadID)) {
    const nextMs = randInt(MIN_MS, MAX_MS);
    log(`⏱ التالية بعد ${(nextMs / 1000).toFixed(0)}ث`);
    const timer = setTimeout(() => sendCycle(api, threadID), nextMs);
    _timers.set(threadID, timer);
  }
}

function start(api, threadID) {
  if (_timers.has(threadID) && !_paused.has(threadID)) {
    return false;
  }
  _paused.delete(threadID);

  if (_timers.has(threadID)) clearTimeout(_timers.get(threadID));

  const firstDelay = randInt(MIN_MS, MAX_MS);
  log(`🟢 بدأ للمحادثة ${chalk.cyan(threadID)} — أول إرسال بعد ${(firstDelay / 1000).toFixed(0)}ث`);

  const timer = setTimeout(() => sendCycle(api, threadID), firstDelay);
  _timers.set(threadID, timer);
  return true;
}

function stop(threadID) {
  if (!_timers.has(threadID) && !_paused.has(threadID)) return false;
  _paused.add(threadID);
  if (_timers.has(threadID)) {
    clearTimeout(_timers.get(threadID));
    _timers.delete(threadID);
  }
  log(`🔴 أُوقف للمحادثة ${chalk.cyan(threadID)}`);
  return true;
}

function stopAll() {
  for (const [tid, timer] of _timers.entries()) {
    clearTimeout(timer);
    _paused.add(tid);
  }
  _timers.clear();
  log("🔴 أُوقفت جميع المحادثات");
}

function isActive(threadID) {
  return _timers.has(threadID) && !_paused.has(threadID);
}

function getActiveThreads() {
  return [..._timers.keys()].filter(tid => !_paused.has(tid));
}

module.exports = { start, stop, stopAll, isActive, getActiveThreads, AUTO_MESSAGE };
