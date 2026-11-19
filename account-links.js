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
  function translateAccountLinks() {
    const [login, register] = labels[document.documentElement.lang] || labels['en-US'];
    document.querySelector('#account-login').textContent = login;
    document.querySelector('#account-register').textContent = register;
  }
  translateAccountLinks();
  new MutationObserver(translateAccountLinks).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
})();
