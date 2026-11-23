(() => {
  const labels = {
  "pt-BR": [
    "Entrar",
    "Criar uma conta"
  ],
  "hi-IN": [
    "साइन इन करें",
    "खाता बनाएँ"
  ],
  "pl-PL": [
    "Zaloguj się",
    "Utwórz konto"
  ],
  "es-419": [
    "Iniciar sesión",
    "Crear una cuenta"
  ],
  "nl-NL": [
    "Inloggen",
    "Account maken"
  ],
  "zh-TW": [
    "登入",
    "建立帳戶"
  ],
  "de-AT": [
    "Anmelden",
    "Konto erstellen"
  ],
  "ko-KR": [
    "로그인",
    "계정 만들기"
  ],
  "bg-BG": [
    "Вход",
    "Създаване на профил"
  ],
  "de-DE": [
    "Anmelden",
    "Konto erstellen"
  ],
  "fr-CH": [
    "Se connecter",
    "Créer un compte"
  ],
  "ro-RO": [
    "Autentificare",
    "Creează un cont"
  ],
  "pt-PT": [
    "Entrar",
    "Criar uma conta"
  ],
  "zh-CN": [
    "登录",
    "创建账户"
  ],
  "it-IT": [
    "Accedi",
    "Crea un account"
  ],
  "id-ID": [
    "Masuk",
    "Buat akun"
  ],
  "sr-RS": [
    "Пријава",
    "Направи налог"
  ],
  "fr-FR": [
    "Se connecter",
    "Créer un compte"
  ],
  "tr-TR": [
    "Giriş yap",
    "Hesap oluştur"
  ],
  "de-CH": [
    "Anmelden",
    "Konto erstellen"
  ],
  "el-GR": [
    "Σύνδεση",
    "Δημιουργία λογαριασμού"
  ],
  "th-TH": [
    "เข้าสู่ระบบ",
    "สร้างบัญชี"
  ],
  "vi-VN": [
    "Đăng nhập",
    "Tạo tài khoản"
  ],
  "es-ES": [
    "Iniciar sesión",
    "Crear una cuenta"
  ],
  "cs-CZ": [
    "Přihlásit se",
    "Vytvořit účet"
  ],
  "ja-JP": [
    "ログイン",
    "アカウント作成"
  ],
  "uk-UA": [
    "Увійти",
    "Створити обліковий запис"
  ],
  "en-US": [
    "Sign in",
    "Create an account"
  ],
  "ar": [
    "تسجيل الدخول",
    "إنشاء حساب"
  ],
  "ku": [
    "چوونەژوورەوە",
    "دروستکردنی هەژمار"
  ]
};
  // The learner session is always validated by the server, not by localStorage.
  let authenticated = false;
  let checking = null;
  function translateAccountLinks() {
    const lang = document.documentElement.lang;
    const [login, register] = labels[lang] || labels['en-US'];
    const signIn = document.querySelector('#account-login');
    const signUp = document.querySelector('#account-register');
    if (!signIn || !signUp) return;
    const account = lang === 'ar' ? 'حسابي' : lang === 'en-US' ? 'My Account' :
      globalThis.MAIC_LEARNER_LABELS?.[lang]?.learnerPortal || 'My Account';
    signIn.textContent = authenticated ? account : login;
    signUp.textContent = register;
    signUp.hidden = authenticated;
  }
  async function checkLearnerSession() {
    if (checking) return checking;
    checking = fetch('/api/learner/session', {credentials: 'same-origin', cache: 'no-store'})
      .then(response => {
        if (response.status === 200) authenticated = true;
        else if (response.status === 401) authenticated = false;
        translateAccountLinks();
      })
      .catch(() => { /* Preserve the last known state on network failures. */ })
      .finally(() => { checking = null; });
    return checking;
  }
  translateAccountLinks();
  new MutationObserver(translateAccountLinks).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  void checkLearnerSession();
  window.addEventListener('pageshow', checkLearnerSession);
  window.addEventListener('focus', () => { if (!document.hidden) void checkLearnerSession(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void checkLearnerSession(); });
})();
