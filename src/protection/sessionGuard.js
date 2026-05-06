"use strict";
/**
 * sessionGuard.js — نظام حماية الجلسة المتقدم
 * - مراقبة الجلسة وإعادة الاتصال التلقائية
 * - حماية من تصادم الرسائل المتزامنة
 * - كاشف الأعطال الصامتة مع إشعار فوري
 * - تنظيف الذاكرة الدورية لمنع تسرب الـ memory
 */

const chalk = require("chalk");

let _guardTimer    = null;
let _memCleanTimer = null;
let _failCount     = 0;
const MAX_FAILS    = 5;
const CHECK_MS     = 45_000;
const MEM_CLEAN_MS = 10 * 60_000;

function ts() {
  return new Date().toLocaleTimeString("en", { hour12: false });
}

function log(level, msg) {
  const icons = { info: chalk.cyan("•"), warn: chalk.yellow("⚠"), error: chalk.red("✘"), ok: chalk.green("✔") };
  console.log(`${chalk.gray(ts())} ${icons[level] || "•"} ${chalk.bold("[SESSION_GUARD]")} ${msg}`);
}

// ─── فحص صحة الجلسة ──────────────────────────────────────────────────────────
async function checkSession() {
  const api = global.api;
  if (!api) return;

  try {
    const lastActivity = global._lastActivity || 0;
    const sinceLastMs  = Date.now() - lastActivity;

    const sinceMin = Math.round(sinceLastMs / 60_000);

    if (sinceLastMs > 30 * 60_000) {
      log("warn", `لا نشاط منذ ${sinceMin} دقيقة — البوت قد يكون صامتاً`);
    }

    const appState = api.getAppState?.();
    if (!appState || !Array.isArray(appState) || appState.length === 0) {
      _failCount++;
      log("error", `AppState فارغ! (فشل ${_failCount}/${MAX_FAILS})`);
      if (_failCount >= MAX_FAILS) {
        log("error", "تجاوز حد الأخطاء — إشعار الداشبورد");
        _notifyDashboard("error", "⚠️ جلسة تالفة — أعد رفع الكوكيز");
        _failCount = 0;
      }
      return;
    }

    const hasCUser = appState.some(c => c.key === "c_user");
    const hasSBD   = appState.some(c => c.key === "sb" || c.key === "datr");
    if (!hasCUser || !hasSBD) {
      log("warn", "مفاتيح كوكيز أساسية مفقودة — الجلسة قد تكون منتهية");
      _notifyDashboard("warn", "⚠️ كوكيز ناقصة — تحقق من الجلسة");
    }

    _failCount = Math.max(0, _failCount - 1);

  } catch (e) {
    log("error", `فحص الجلسة: ${e.message}`);
  }
}

// ─── تنظيف الذاكرة ───────────────────────────────────────────────────────────
function cleanMemory() {
  try {
    const nc = global._nameCache;
    if (nc) {
      const uKeys = Object.keys(nc.u || {});
      const tKeys = Object.keys(nc.t || {});

      const MAX_CACHE = 500;
      if (uKeys.length > MAX_CACHE) {
        const toDelete = uKeys.slice(0, uKeys.length - MAX_CACHE);
        toDelete.forEach(k => delete nc.u[k]);
        log("info", `🧹 حذف ${toDelete.length} إدخال من cache المستخدمين`);
      }
      if (tKeys.length > MAX_CACHE) {
        const toDelete = tKeys.slice(0, tKeys.length - MAX_CACHE);
        toDelete.forEach(k => delete nc.t[k]);
        log("info", `🧹 حذف ${toDelete.length} إدخال من cache المجموعات`);
      }
    }

    if (global.gc) {
      try { global.gc(); } catch (_) {}
    }
  } catch (e) {
    log("warn", `تنظيف الذاكرة: ${e.message}`);
  }
}

// ─── إشعار الداشبورد ─────────────────────────────────────────────────────────
function _notifyDashboard(status, message) {
  try {
    const { getIO } = require("../dashboard/server");
    const io = getIO();
    if (io) io.emit("bot-status", { status, message });
  } catch (_) {}
}

// ─── حماية الإرسال المتزامن (Mutex) ──────────────────────────────────────────
const _sendLocks = new Map();

async function withSendLock(threadID, fn) {
  while (_sendLocks.get(threadID)) {
    await new Promise(r => setTimeout(r, 150));
  }
  _sendLocks.set(threadID, true);
  try {
    return await fn();
  } finally {
    _sendLocks.delete(threadID);
  }
}

// ─── حارس استثناءات عام ──────────────────────────────────────────────────────
function _setupGlobalGuards() {
  if (process.listenerCount("uncaughtException") === 0) {
    process.on("uncaughtException", (err) => {
      log("error", `استثناء غير محلوج: ${err.message}`);
      _notifyDashboard("warn", `⚠️ خطأ داخلي: ${String(err.message).slice(0, 80)}`);
    });
  }

  if (process.listenerCount("unhandledRejection") === 0) {
    process.on("unhandledRejection", (reason) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      log("warn", `Promise رُفضت بدون معالجة: ${msg.slice(0, 100)}`);
    });
  }
}

// ─── بدء / إيقاف ─────────────────────────────────────────────────────────────
function start() {
  if (_guardTimer) clearInterval(_guardTimer);
  if (_memCleanTimer) clearInterval(_memCleanTimer);

  _setupGlobalGuards();

  _guardTimer    = setInterval(checkSession, CHECK_MS);
  _memCleanTimer = setInterval(cleanMemory,  MEM_CLEAN_MS);

  log("ok", `✅ Session Guard نشط — فحص كل ${CHECK_MS / 1000}ث، تنظيف كل ${MEM_CLEAN_MS / 60_000}د`);
}

function stop() {
  if (_guardTimer)    clearInterval(_guardTimer);
  if (_memCleanTimer) clearInterval(_memCleanTimer);
  _guardTimer    = null;
  _memCleanTimer = null;
  log("info", "🔴 Session Guard أُوقف");
}

module.exports = { start, stop, withSendLock, checkSession, cleanMemory };
