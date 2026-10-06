
import React, { useEffect, useMemo, useState } from "react";
import { getLanguage, setLanguage, t } from "./i18n";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Droplets,
  History,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { supabase } from "./supabaseClient";

const locales = { en: "en-IN", te: "te-IN", kn: "kn-IN" };
const money = (value, language = "en") =>
  new Intl.NumberFormat(locales[language] || locales.en, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const dateISO = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const niceDate = (value, language = "en") =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(locales[language] || locales.en, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

function getWorkerName(worker, language) {
  if (language === "te") {
    return worker.name_te || worker.name;
  }

  if (language === "kn") {
    return worker.name_kn || worker.name;
  }

  return worker.name;
}

function getSettlementWorkerName(worker, language) {
  if (language === "te") {
    return worker.worker_name_te || worker.worker_name;
  }

  if (language === "kn") {
    return worker.worker_name_kn || worker.worker_name;
  }

  return worker.worker_name;
}

function Login({ language, onLanguageChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) setError(loginError.message);
    setBusy(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark">SAC</div>
        <h1><pre>{t(language, "    Thresher Manager")}</pre></h1>
        <p className="muted">{t(language, "adminLogin")}</p>
        <LanguageSelector language={language} onChange={onLanguageChange} />

        <form onSubmit={submit} className="stack">
          <label>
            {t(language, "email")}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(language, "email")}
            />
          </label>

          <label>
            {t(language, "password")}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t(language, "password")}
            />
          </label>

          {error && <div className="alert error">{error}</div>}

          <button className="primary full" disabled={busy}>
            {busy ? t(language, "signingIn") : t(language, "signIn")}
          </button>
        </form>

        <p className="login-note">
          {t(language, "createAdmin")}
        </p>
      </div>
    </div>
  );
}

function FullScreenLoader({ language }) {
  return (
    <div className="center-screen">
      <RefreshCw className="spin" size={28} />
      <span>{t(language, "loading")}</span>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [language, setLanguageState] = useState(getLanguage());

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) setSession(data.session);
        if (isMounted) setLoadingAuth(false);
      })
      .catch(() => {
        if (isMounted) setLoadingAuth(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setLoadingAuth(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  function changeLanguage(lang) {
    setLanguage(lang);
    setLanguageState(lang);
  }

  if (loadingAuth) return <FullScreenLoader language={language} />;

if (!session) {
  return (
    <Login
      language={language}
      onLanguageChange={changeLanguage}
    />
  );
}

return (
  <Dashboard
    session={session}
    language={language}
    onLanguageChange={changeLanguage}
  />
);
}
function LanguageSelector({ language, onChange }) {
  return (
    <div className="language-selector">
      <button
        className={language === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        English
      </button>

      <button
        className={language === "te" ? "active" : ""}
        onClick={() => onChange("te")}
      >
        తెలుగు
      </button>

      <button
        className={language === "kn" ? "active" : ""}
        onClick={() => onChange("kn")}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
}

function Dashboard({
  session,
  language,
  onLanguageChange,
}) {
  const [page, setPage] = useState("dashboard");
const [workers, setWorkers] = useState([]);
const [settlements, setSettlements] = useState([]);
const [selectedSettlement, setSelectedSettlement] = useState(null);
const [loading, setLoading] = useState(true);
const [toast, setToast] = useState("");
const [businessId, setBusinessId] = useState(null);

  async function loadData() {
  setLoading(true);

  // Get the business assigned to the logged-in user
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    showToast(profileError.message, true);
    setLoading(false);
    return;
  }

  if (!profile?.business_id) {
    showToast("No business is assigned to this user", true);
    setLoading(false);
    return;
  }

  const currentBusinessId = profile.business_id;
  setBusinessId(currentBusinessId);

  const [
    { data: workerData, error: workerError },
    { data: settlementData, error: settlementError },
  ] = await Promise.all([
    supabase
      .from("workers")
      .select("*")
      .eq("business_id", currentBusinessId)
      .order("name"),

    supabase
      .from("settlements")
      .select(
        "id, business_id, work_date, total_income, diesel_expense, net_amount, owner_share, workers_share, worker_count, notes, created_at, settlement_workers(id, worker_id, worker_name, worker_name_te, worker_name_kn, wage_amount, payment_status, paid_at)"
      )
      .eq("business_id", currentBusinessId)
      .order("work_date", { ascending: false }),
  ]);

  if (workerError) showToast(workerError.message, true);
  if (settlementError) showToast(settlementError.message, true);

  setWorkers(workerData || []);
  setSettlements(settlementData || []);
  setLoading(false);
}

 useEffect(() => {
  loadData();
}, [session.user.id]);


  function showToast(message, isError = false) {
    setToast(`${isError ? `${t(language, "error")}: ` : ""}${message}`);
    window.setTimeout(() => setToast(""), 3500);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const activeWorkers = workers.filter((w) => w.active);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">SAC</div>
          <div>
            <strong>Thresher</strong>
            <span>Manager</span>
          </div>
        </div>

        <LanguageSelector
          language={language}
          onChange={onLanguageChange}
        />

  <nav>
  <NavItem
    icon={<LayoutDashboard />}
    label={t(language, "dashboard")}
    active={page === "dashboard"}
    onClick={() => setPage("dashboard")}
  />

  <NavItem
    icon={<WalletCards />}
    label={t(language, "newSettlement")}
    active={page === "settlement"}
    onClick={() => setPage("settlement")}
  />

  <NavItem
    icon={<History />}
    label={t(language, "history")}
    active={page === "history"}
    onClick={() => setPage("history")}
  />

  <NavItem
    icon={<Users />}
    label={t(language, "workers")}
    active={page === "workers"}
    onClick={() => setPage("workers")}
  />

  <NavItem
    icon={<BarChart3 />}
    label={t(language, "reports")}
    active={page === "reports"}
    onClick={() => setPage("reports")}
  />
</nav>

        <div className="sidebar-bottom">
          <div className="signed-user">
            <div className="avatar">{(session.user.email || "A")[0].toUpperCase()}</div>
            <div>
              <strong>Admin</strong>
              <span>{session.user.email}</span>
            </div>
          </div>
          <button className="ghost full" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>
              {page === "dashboard" && t(language, "dashboard")}
              {page === "settlement" && t(language, "dailySettlement")}
              {page === "history" && t(language, "settlementHistoryTitle")}
              {page === "workers" && t(language, "workers")}
              {page === "reports" && t(language, "reports")}
            </h2>
            <span className="muted">{t(language, "cropRecords")}</span>
          </div>
          <button className="icon-btn" onClick={loadData} title={t(language, "refresh")}>
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </header>

        <div className="content">
          {page === "dashboard" && (
           <DashboardHome
          settlements={settlements}
          workers={activeWorkers}
          onNew={() => setPage("settlement")}
          onHistory={() => setPage("history")}
          language={language}
           />
          )}

          {page === "settlement" && (
            <SettlementPage
             workers={activeWorkers}
             onSaved={async () => {
             await loadData();
             setPage("history");
             showToast(t(language, "settlementSaved"));
              }}
            showToast={showToast}
            language={language}
            />
          )}

          {page === "history" && (
            <HistoryPage
  settlements={settlements}
  onOpen={setSelectedSettlement}
  language={language}
/>
          )}

          {page === "workers" && (
           <WorkersPage
  workers={workers}
  reload={loadData}
  showToast={showToast}
  language={language}
  businessId={businessId}
/>
          )}

         {page === "reports" && (
  <ReportsPage settlements={settlements} language={language} />
)}
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}

      {selectedSettlement && (
        <SettlementModal
          settlement={selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          reload={loadData}
          showToast={showToast}
          language={language}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DashboardHome({
  settlements,
  workers,
  onNew,
  onHistory,
  language,
}) {
  const totals = useMemo(
    () =>
      settlements.reduce(
        (acc, row) => {
          acc.income += Number(row.total_income);
          acc.diesel += Number(row.diesel_expense);
          acc.net += Number(row.net_amount);
          acc.owner += Number(row.owner_share);
          acc.workers += Number(row.workers_share);
          return acc;
        },
        { income: 0, diesel: 0, net: 0, owner: 0, workers: 0 }
      ),
    [settlements]
  );

  const recent = settlements.slice(0, 5);

  return (
    <>
      <div className="hero-row">
        <div>
          <h1>{t(language, "SHASI THRESHERS")}</h1>
          <p className="muted">{t(language, "organizeRecords")}</p>
        </div>
        <button className="primary" onClick={onNew}>
          <Plus size={18} /> {t(language, "newSettlement")}
        </button>
      </div>

      <div className="stat-grid">
        <StatCard icon={<CircleDollarSign />} label={t(language, "totalIncome")} value={money(totals.income, language)} />
        <StatCard icon={<Droplets />} label={t(language, "dieselExpense")} value={money(totals.diesel, language)} />
        <StatCard icon={<WalletCards />} label={t(language, "ownerProfit")} value={money(totals.owner, language)} />
        <StatCard icon={<Users />} label={t(language, "workersPaidShare")} value={money(totals.workers, language)} />
      </div>

      <div className="section-grid">
        <section className="card">
          <div className="section-head">
            <div>
              <h3>{t(language, "recentSettlements")}</h3>
              <p className="muted">{t(language, "latestRecords")}</p>
            </div>
            <button className="link-btn" onClick={onHistory}>{t(language, "viewAll")}</button>
          </div>

          {recent.length === 0 ? (
            <EmptyState text={t(language, "noSettlements")} />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t(language, "date")}</th>
                    <th>{t(language, "income")}</th>
                    <th>{t(language, "diesel")}</th>
                    <th>{t(language, "owner")}</th>
                    <th>{t(language, "workerCount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr key={row.id}>
                      <td>{niceDate(row.work_date, language)}</td>
                      <td>{money(row.total_income, language)}</td>
                      <td>{money(row.diesel_expense, language)}</td>
                      <td>{money(row.owner_share, language)}</td>
                      <td>{row.worker_count} {t(language, "workersLabel")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-head">
            <div>
              <h3>{t(language, "activeWorkers")}</h3>
              <p className="muted">{t(language, "availableToday")}</p>
            </div>
          </div>
          <div className="worker-mini-list">
            {workers.slice(0, 10).map((worker) => (
              <div className="worker-mini" key={worker.id}>
                <span className="avatar small">
  {getWorkerName(worker, language)[0]?.toUpperCase()}
</span>
<span>{getWorkerName(worker, language)}</span>
              </div>
            ))}
            {workers.length > 10 && <span className="muted">+{workers.length - 10} {t(language, "more")}</span>}
          </div>
        </section>
      </div>
    </>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SettlementPage({
  workers,
  onSaved,
  showToast,
  language,
}) {
  const [workDate, setWorkDate] = useState(dateISO());
  const [income, setIncome] = useState("");
  const [diesel, setDiesel] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const calc = useMemo(() => {
    const totalIncome = Math.max(0, Number(income) || 0);
    const dieselExpense = Math.max(0, Number(diesel) || 0);
    const net = Math.max(0, totalIncome - dieselExpense);
    const owner = net / 2;
    const workersShare = net / 2;
    const perWorker = selectedIds.length ? workersShare / selectedIds.length : 0;

    return { totalIncome, dieselExpense, net, owner, workersShare, perWorker };
  }, [income, diesel, selectedIds.length]);

  function toggleWorker(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function selectAll() {
    setSelectedIds(workers.map((w) => w.id));
  }

  function clearAll() {
    setSelectedIds([]);
  }

  async function save() {
    if (!workDate) return showToast(t(language, "selectDate"), true);
    if (calc.totalIncome <= 0) return showToast(t(language, "enterTotalIncome"), true);
    if (calc.dieselExpense > calc.totalIncome)
      return showToast(t(language, "dieselGreater"), true);
    if (!selectedIds.length)
      return showToast(t(language, "selectAtLeastOne"), true);

    setSaving(true);

    const { error } = await supabase.rpc("create_settlement", {
      p_work_date: workDate,
      p_total_income: calc.totalIncome,
      p_diesel_expense: calc.dieselExpense,
      p_worker_ids: selectedIds,
      p_notes: notes.trim() || null,
    });

    if (error) {
      showToast(error.message, true);
    } else {
      await onSaved();
    }

    setSaving(false);
  }

  return (
    <div className="two-column">
      <section className="card">
        <div className="section-head">
          <div>
            <h3>{t(language, "dailyWorkDetails")}</h3>
            <p className="muted">{t(language, "enterIncome")}</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            {t(language, "workDate")}
            <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
          </label>

          <label>
            {t(language, "totalIncomeRupees")}
            <input
              type="number"
              min="0"
              step="0.01"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="20000"
            />
          </label>

          <label>
            {t(language, "dieselExpenseRupees")}
            <input
              type="number"
              min="0"
              step="0.01"
              value={diesel}
              onChange={(e) => setDiesel(e.target.value)}
              placeholder="2500"
            />
          </label>

          <label className="full-span">
            {t(language, "notes")}
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(language, "optionalNotes")}
            />
          </label>
        </div>

        <div className="worker-select-head">
          <div>
            <h3>{t(language, "selectWorkers")}</h3>
            <p className="muted">{selectedIds.length}/{workers.length} {t(language, "selected")}</p>
          </div>
          <div className="button-row">
            <button className="secondary small-btn" onClick={selectAll}>{t(language, "selectAll")}</button>
            <button className="secondary small-btn" onClick={clearAll}>{t(language, "clear")}</button>
          </div>
        </div>

        <div className="worker-grid">
          {workers.map((worker) => {
            const selected = selectedIds.includes(worker.id);
            return (
              <button
                type="button"
                key={worker.id}
                className={`worker-btn ${selected ? "selected" : ""}`}
                onClick={() => toggleWorker(worker.id)}
              >
                <span className="check-dot">{selected ? "✓" : ""}</span>
                {getWorkerName(worker, language)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card calculation-card">
        <div className="section-head">
          <div>
            <h3>{t(language, "settlementPreview")}</h3>
            <p className="muted">{t(language, "calculatedAutomatically")}</p>
          </div>
          <CheckCircle2 className="success-icon" />
        </div>

        <div className="calculation">
          <CalcRow label={t(language, "totalIncome")} value={money(calc.totalIncome, language)} />
          <CalcRow label={`− ${t(language, "diesel")}`} value={money(calc.dieselExpense, language)} />
          <div className="calc-divider" />
          <CalcRow label={t(language, "netAmount")} value={money(calc.net, language)} strong />
          <CalcRow label={t(language, "ownerShare")} value={money(calc.owner, language)} />
          <CalcRow label={t(language, "workersShare")} value={money(calc.workersShare, language)} />
          <CalcRow label={`${t(language, "eachWorker")} (${selectedIds.length})`} value={money(calc.perWorker, language)} strong />
        </div>

        <div className="formula-box">
          <strong>{t(language, "yourRule")}</strong>
          <p>{t(language, "ruleDescription")}</p>
        </div>

        <button className="primary full" onClick={save} disabled={saving}>
          {saving ? t(language, "saving") : t(language, "saveSettlement")}
        </button>
      </section>
    </div>
  );
}

function CalcRow({ label, value, strong }) {
  return (
    <div className={`calc-row ${strong ? "strong" : ""}`}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function HistoryPage({ settlements, onOpen, language }) {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h3>{t(language, "settlementHistory")}</h3>
          <p className="muted">{settlements.length} {t(language, "savedWorkDays")}</p>
        </div>
      </div>

      {settlements.length === 0 ? (
        <EmptyState text={t(language, "noSettlementRecords")} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t(language, "date")}</th>
                <th>{t(language, "income")}</th>
                <th>{t(language, "diesel")}</th>
                <th>{t(language, "net")}</th>
                <th>{t(language, "owner")}</th>
                <th>{t(language, "workerCount")}</th>
                <th>{t(language, "workerShare")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((row) => (
                <tr key={row.id}>
                  <td>{niceDate(row.work_date, language)}</td>
                  <td>{money(row.total_income, language)}</td>
                  <td>{money(row.diesel_expense, language)}</td>
                  <td>{money(row.net_amount, language)}</td>
                  <td>{money(row.owner_share, language)}</td>
                  <td>{row.worker_count}</td>
                  <td>{money(row.workers_share, language)}</td>
                  <td>
                    <button className="link-btn" onClick={() => onOpen(row)}>{t(language, "details")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SettlementModal({ settlement, onClose, reload, showToast, language }) {
  const [busy, setBusy] = useState(false);

  async function togglePayment(item) {
    setBusy(true);

    const nextStatus = item.payment_status === "paid" ? "pending" : "paid";
    const { error } = await supabase
      .from("settlement_workers")
      .update({
        payment_status: nextStatus,
        paid_at: nextStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", item.id);

    if (error) showToast(error.message, true);
    else await reload();

    setBusy(false);
  }

  async function deleteSettlement() {
    if (!window.confirm(t(language, "deleteSettlementConfirm"))) return;

    setBusy(true);
    const { error } = await supabase.from("settlements").delete().eq("id", settlement.id);

    if (error) showToast(error.message, true);
    else {
      showToast(t(language, "settlementDeleted"));
      onClose();
      await reload();
    }
    setBusy(false);
  }

  const workersPaid = settlement.settlement_workers || [];
  const paidCount = workersPaid.filter((w) => w.payment_status === "paid").length;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3>{t(language, "settlementDetails")}</h3>
            <p className="muted">{niceDate(settlement.work_date, language)}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="detail-grid">
          <Detail label={t(language, "income")} value={money(settlement.total_income, language)} />
          <Detail label={t(language, "diesel")} value={money(settlement.diesel_expense, language)} />
          <Detail label={t(language, "net")} value={money(settlement.net_amount, language)} />
          <Detail label={t(language, "owner")} value={money(settlement.owner_share, language)} />
          <Detail label={t(language, "workersShare")} value={money(settlement.workers_share, language)} />
          <Detail label={t(language, "workerCount")} value={settlement.worker_count} />
        </div>

        {settlement.notes && <div className="notes">{settlement.notes}</div>}

        <div className="section-head compact">
          <div>
            <h4>{t(language, "workerWages")}</h4>
            <p className="muted">{paidCount}/{workersPaid.length} {t(language, "markedPaid")}</p>
          </div>
        </div>

        <div className="wage-list">
          {workersPaid.map((worker) => (
            <div className="wage-row" key={worker.id}>
              <span>{getSettlementWorkerName(worker, language)}</span>
              <strong>{money(worker.wage_amount, language)}</strong>
              <button
                className={`status-btn ${worker.payment_status === "paid" ? "paid" : ""}`}
                onClick={() => togglePayment(worker)}
                disabled={busy}
              >
                {worker.payment_status === "paid" ? t(language, "paid") : t(language, "markPaid")}
              </button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="danger-btn" onClick={deleteSettlement} disabled={busy}>
            <Trash2 size={16} /> {t(language, "deleteSettlement")}
          </button>
          <button className="secondary" onClick={onClose}>{t(language, "close")}</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function WorkersPage({
  workers,
  reload,
  showToast,
  language,
  businessId,
}) {
  const [name, setName] = useState("");
  const [nameTe, setNameTe] = useState("");
  const [nameKn, setNameKn] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function addWorker(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);

    const { error } = await supabase.from("workers").insert({
  business_id: businessId,
  name: name.trim(),
  name_te: nameTe.trim() || null,
  name_kn: nameKn.trim() || null,
  phone: phone.trim() || null,
});

    if (error) {
      showToast(error.message, true);
    } else {
      setName("");
      setNameTe("");
      setNameKn("");
      setPhone("");
      showToast(t(language, "workerAdded"));
      await reload();
    }
    setBusy(false);
  }

  async function toggleActive(worker) {
    const { error } = await supabase
      .from("workers")
      .update({ active: !worker.active })
      .eq("id", worker.id);

    if (error) showToast(error.message, true);
    else await reload();
  }

  async function deleteWorker(worker) {
    const workerName = getWorkerName(worker, language);
    if (!window.confirm(`${t(language, "delete")} ${workerName}?`)) return;

    const { error } = await supabase
      .from("workers")
      .delete()
      .eq("id", worker.id);

    if (error) {
      showToast(error.message, true);
    } else {
      showToast(t(language, "workerDeleted"));
      await reload();
    }
  }

  return (
    <div className="two-column">
      <section className="card">
        <div className="section-head">
          <div>
            <h3>{t(language, "addWorker")}</h3>
            <p className="muted">{t(language, "addWorkerDescription")}</p>
          </div>
        </div>
        <form onSubmit={addWorker} className="form-grid">
          <label>
            {t(language, "workerName")}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t(language, "enter Name")}
              required
            />
          </label>
         
          <label>
            {t(language, "phoneOptional")}
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="9876543210"
            />
          </label>
          <button className="primary full-span" disabled={busy}>
            <Plus size={17} /> {busy ? t(language, "adding") : t(language, "addWorkerButton")}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h3>{t(language, "workerList")}</h3>
            <p className="muted">{workers.length} {t(language, "workersMasterList")}</p>
          </div>
        </div>
        <div className="worker-management">
          {workers.map((worker) => {
            const workerName = getWorkerName(worker, language);
            return (
              <div
                className={`worker-row ${worker.active ? "" : "inactive"}`}
                key={worker.id}
              >
                <div className="worker-info">
                  <span className="avatar small">{workerName[0]?.toUpperCase()}</span>
                  <div>
                    <strong>{workerName}</strong>
                    <span>{worker.phone || t(language, "noPhone")}</span>
                  </div>
                </div>
                <div className="button-row">
                  <button
                    className="secondary small-btn"
                    onClick={() => toggleActive(worker)}
                  >
                    {worker.active ? t(language, "active") : t(language, "inactive")}
                  </button>
                  <button
                    className="icon-danger"
                    onClick={() => deleteWorker(worker)}
                    title={t(language, "delete")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ReportsPage({ settlements, language }) {
  const workerMap = {};

  // Get worker earnings from all saved settlement records
  settlements.forEach((settlement) => {
    const workers = settlement.settlement_workers || [];

    workers.forEach((worker) => {
      const id = worker.worker_id || worker.worker_name;

      if (!workerMap[id]) {
        workerMap[id] = {
          id,
          name: getSettlementWorkerName(worker, language) || t(language, "unknownWorker"),
          daysWorked: 0,
          totalEarnings: 0,
          paidAmount: 0,
          pendingAmount: 0,
        };
      }

      const amount = Number(worker.wage_amount || 0);

      workerMap[id].daysWorked += 1;
      workerMap[id].totalEarnings += amount;

      if (worker.payment_status === "paid") {
        workerMap[id].paidAmount += amount;
      } else {
        workerMap[id].pendingAmount += amount;
      }
    });
  });

  const workerReports = Object.values(workerMap).sort(
    (a, b) => b.totalEarnings - a.totalEarnings
  );

  const totalEarnings = workerReports.reduce(
    (sum, worker) => sum + worker.totalEarnings,
    0
  );

  const totalPaid = workerReports.reduce(
    (sum, worker) => sum + worker.paidAmount,
    0
  );

  const totalPending = workerReports.reduce(
    (sum, worker) => sum + worker.pendingAmount,
    0
  );

  return (
    <div>
      {/* Report Summary */}
      <div className="stat-grid">
        <StatCard
          icon={<Users />}
          label={t(language, "totalWorkers")}
          value={workerReports.length}
        />

        <StatCard
          icon={<CalendarDays />}
          label={t(language, "totalWorkDays")}
          value={settlements.length}
        />

        <StatCard
          icon={<CircleDollarSign />}
          label={t(language, "totalWorkerEarnings")}
          value={money(totalEarnings, language)}
        />

        <StatCard
          icon={<WalletCards />}
          label={t(language, "pendingWages")}
          value={money(totalPending, language)}
        />
      </div>

      {/* Worker Earnings Table */}
      <section className="card">
        <div className="section-head">
          <div>
            <h3>{t(language, "individualWorkerEarnings")}</h3>
            <p className="muted">{t(language, "allTimeEarnings")}</p>
          </div>
        </div>

        {workerReports.length === 0 ? (
          <EmptyState text={t(language, "noWorkerEarnings")} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t(language, "workerNameReport")}</th>
                  <th>{t(language, "daysWorked")}</th>
                  <th>{t(language, "totalEarnings")}</th>
                  <th>{t(language, "paid")}</th>
                  <th>{t(language, "pending")}</th>
                </tr>
              </thead>

              <tbody>
                {workerReports.map((worker, index) => (
                  <tr key={worker.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{worker.name}</strong>
                    </td>

                    <td>
                      {worker.daysWorked} {t(language, worker.daysWorked === 1 ? "day" : "days")}
                    </td>

                    <td>
                      <strong>{money(worker.totalEarnings, language)}</strong>
                    </td>

                    <td>
                      {money(worker.paidAmount, language)}
                    </td>

                    <td>
                      {money(worker.pendingAmount, language)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan="3">{t(language, "total")}</th>

                  <th>{money(totalEarnings, language)}</th>

                  <th>{money(totalPaid, language)}</th>

                  <th>{money(totalPending, language)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty">
      <CalendarDays size={30} />
      <span>{text}</span>
    </div>
  );
}

export default App;
