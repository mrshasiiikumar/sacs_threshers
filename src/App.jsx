
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

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const dateISO = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const niceDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
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

function Login() {
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
        <div className="brand-mark">TM</div>
        <h1>Thresher Manager</h1>
        <p className="muted">Admin login</p>

        <form onSubmit={submit} className="stack">
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </label>

          {error && <div className="alert error">{error}</div>}

          <button className="primary full" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-note">
          Create the admin user from Supabase Dashboard → Authentication → Users.
        </p>
      </div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="center-screen">
      <RefreshCw className="spin" size={28} />
      <span>Loading...</span>
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
  console.log("Language changed to:", lang);
  setLanguage(lang);
  setLanguageState(lang);
}

  if (loadingAuth) return <FullScreenLoader />;

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

  async function loadData() {
    setLoading(true);

    const [{ data: workerData, error: workerError }, { data: settlementData, error: settlementError }] =
      await Promise.all([
        supabase.from("workers").select("*").order("name"),
        supabase
          .from("settlements")
          .select(
            "id, work_date, total_income, diesel_expense, net_amount, owner_share, workers_share, worker_count, notes, created_at, settlement_workers(id, worker_id, worker_name, wage_amount, payment_status, paid_at)"
          )
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
  }, []);


  function showToast(message, isError = false) {
    setToast(`${isError ? "Error: " : ""}${message}`);
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
          <div className="brand-mark small">TM</div>
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
              {page === "dashboard" && "Dashboard"}
              {page === "settlement" && "Daily Settlement"}
              {page === "history" && "Settlement History"}
              {page === "workers" && "Worker Management"}
              {page === "reports" && "Reports"}
            </h2>
            <span className="muted">Crop thresher financial records</span>
          </div>
          <button className="icon-btn" onClick={loadData} title="Refresh">
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
/>
          )}

         {page === "reports" && (
  <ReportsPage
    settlements={settlements}
    language={language}
  />
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
          <h1>Good morning 👋</h1>
          <p className="muted">Keep your thresher income, diesel and worker wages organized.</p>
        </div>
        <button className="primary" onClick={onNew}>
          <Plus size={18} /> New settlement
        </button>
      </div>

      <div className="stat-grid">
        <StatCard icon={<CircleDollarSign />} label="Total income" value={money(totals.income)} />
        <StatCard icon={<Droplets />} label="Diesel expense" value={money(totals.diesel)} />
        <StatCard icon={<WalletCards />} label="Owner profit" value={money(totals.owner)} />
        <StatCard icon={<Users />} label="Workers paid share" value={money(totals.workers)} />
      </div>

      <div className="section-grid">
        <section className="card">
          <div className="section-head">
            <div>
              <h3>Recent settlements</h3>
              <p className="muted">Latest saved work records</p>
            </div>
            <button className="link-btn" onClick={onHistory}>View all</button>
          </div>

          {recent.length === 0 ? (
            <EmptyState text="No settlements yet. Create your first daily settlement." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Income</th>
                    <th>Diesel</th>
                    <th>Owner</th>
                    <th>Workers</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row) => (
                    <tr key={row.id}>
                      <td>{niceDate(row.work_date)}</td>
                      <td>{money(row.total_income)}</td>
                      <td>{money(row.diesel_expense)}</td>
                      <td>{money(row.owner_share)}</td>
                      <td>{row.worker_count} workers</td>
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
              <h3>Active workers</h3>
              <p className="muted">Available for today's selection</p>
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
            {workers.length > 10 && <span className="muted">+{workers.length - 10} more</span>}
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
    if (!workDate) return showToast("Select the work date.", true);
    if (calc.totalIncome <= 0) return showToast("Enter the total income.", true);
    if (calc.dieselExpense > calc.totalIncome)
      return showToast("Diesel expense cannot be greater than income.", true);
    if (!selectedIds.length)
      return showToast("Select at least one worker.", true);

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
            <h3>Daily work details</h3>
            <p className="muted">Enter today's thresher income and expenses.</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Work date
            <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
          </label>

          <label>
            Total income (₹)
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
            Diesel expense (₹)
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
            Notes
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional: crop, village, customer, tractor details..."
            />
          </label>
        </div>

        <div className="worker-select-head">
          <div>
            <h3>Select workers</h3>
            <p className="muted">{selectedIds.length} of {workers.length} selected</p>
          </div>
          <div className="button-row">
            <button className="secondary small-btn" onClick={selectAll}>Select all</button>
            <button className="secondary small-btn" onClick={clearAll}>Clear</button>
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
            <h3>Settlement preview</h3>
            <p className="muted">Calculated automatically before saving.</p>
          </div>
          <CheckCircle2 className="success-icon" />
        </div>

        <div className="calculation">
          <CalcRow label="Total income" value={money(calc.totalIncome)} />
          <CalcRow label="Less: diesel" value={`− ${money(calc.dieselExpense)}`} />
          <div className="calc-divider" />
          <CalcRow label="Net amount" value={money(calc.net)} strong />
          <CalcRow label="Owner share (50%)" value={money(calc.owner)} />
          <CalcRow label="Workers share (50%)" value={money(calc.workersShare)} />
          <CalcRow label={`Each worker (${selectedIds.length})`} value={money(calc.perWorker)} strong />
        </div>

        <div className="formula-box">
          <strong>Your rule</strong>
          <p>
            Income − diesel = net. Net is split equally between owner and workers.
            The workers' half is divided equally among today's selected workers.
          </p>
        </div>

        <button className="primary full" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save daily settlement"}
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

function HistoryPage({ settlements, onOpen }) {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h3>Settlement history</h3>
          <p className="muted">{settlements.length} saved work days</p>
        </div>
      </div>

      {settlements.length === 0 ? (
        <EmptyState text="No settlement records yet." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Income</th>
                <th>Diesel</th>
                <th>Net</th>
                <th>Owner</th>
                <th>Workers</th>
                <th>Workers' share</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((row) => (
                <tr key={row.id}>
                  <td>{niceDate(row.work_date)}</td>
                  <td>{money(row.total_income)}</td>
                  <td>{money(row.diesel_expense)}</td>
                  <td>{money(row.net_amount)}</td>
                  <td>{money(row.owner_share)}</td>
                  <td>{row.worker_count}</td>
                  <td>{money(row.workers_share)}</td>
                  <td>
                    <button className="link-btn" onClick={() => onOpen(row)}>Details</button>
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

function SettlementModal({ settlement, onClose, reload, showToast }) {
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
    if (!window.confirm("Delete this settlement and all its worker wage records?")) return;

    setBusy(true);
    const { error } = await supabase.from("settlements").delete().eq("id", settlement.id);

    if (error) showToast(error.message, true);
    else {
      showToast("Settlement deleted.");
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
            <h3>Settlement details</h3>
            <p className="muted">{niceDate(settlement.work_date)}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="detail-grid">
          <Detail label="Income" value={money(settlement.total_income)} />
          <Detail label="Diesel" value={money(settlement.diesel_expense)} />
          <Detail label="Net" value={money(settlement.net_amount)} />
          <Detail label="Owner" value={money(settlement.owner_share)} />
          <Detail label="Workers share" value={money(settlement.workers_share)} />
          <Detail label="Workers" value={settlement.worker_count} />
        </div>

        {settlement.notes && <div className="notes">{settlement.notes}</div>}

        <div className="section-head compact">
          <div>
            <h4>Worker wages</h4>
            <p className="muted">{paidCount}/{workersPaid.length} marked paid</p>
          </div>
        </div>

        <div className="wage-list">
          {workersPaid.map((worker) => (
            <div className="wage-row" key={worker.id}>
              <span>{worker.worker_name}</span>
              <strong>{money(worker.wage_amount)}</strong>
              <button
                className={`status-btn ${worker.payment_status === "paid" ? "paid" : ""}`}
                onClick={() => togglePayment(worker)}
                disabled={busy}
              >
                {worker.payment_status === "paid" ? "Paid" : "Mark paid"}
              </button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="danger-btn" onClick={deleteSettlement} disabled={busy}>
            <Trash2 size={16} /> Delete settlement
          </button>
          <button className="secondary" onClick={onClose}>Close</button>
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

function WorkersPage({ workers, reload, showToast, language, }) { const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [busy, setBusy] = useState(false); async function addWorker(e) { e.preventDefault(); if (!name.trim()) return; setBusy(true); const { error } = await supabase.from("workers").insert({ name: name.trim(), phone: phone.trim() || null, }); if (error) { showToast(error.message, true); } else { setName(""); setPhone(""); showToast(t(language, "workerAdded")); await reload(); } setBusy(false); } async function toggleActive(worker) { const { error } = await supabase .from("workers") .update({ active: !worker.active }) .eq("id", worker.id); if (error) { showToast(error.message, true); } else { await reload(); } } async function deleteWorker(worker) { const workerName = getWorkerName(worker, language); if (!window.confirm(`${t(language, "delete")} ${workerName}?`)) { return; } const { error } = await supabase .from("workers") .delete() .eq("id", worker.id); if (error) { showToast(error.message, true); } else { showToast(t(language, "workerDeleted")); await reload(); } } return ( <div className="two-column"> {/* ADD WORKER */} <section className="card"> <div className="section-head"> <div> <h3>{t(language, "addWorker")}</h3> <p className="muted"> {t(language, "addWorkerDescription")} </p> </div> </div> <form onSubmit={addWorker} className="form-grid"> <label> {t(language, "workerName")} <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh" required /> </label> <label> {t(language, "phoneOptional")} <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" /> </label> <button className="primary full-span" disabled={busy} > <Plus size={17} /> {busy ? t(language, "adding") : t(language, "addWorkerButton")} </button> </form> </section> {/* WORKER LIST */} <section className="card"> <div className="section-head"> <div> <h3>{t(language, "workerList")}</h3> <p className="muted"> {workers.length} {t(language, "workersMasterList")} </p> </div> </div> <div className="worker-management"> {workers.map((worker) => { const workerName = getWorkerName(worker, language); return ( <div className={`worker-row ${ worker.active ? "" : "inactive" }`} key={worker.id} > <div className="worker-info"> <span className="avatar small"> {workerName[0]?.toUpperCase()} </span> <div> <strong>{workerName}</strong> <span> {worker.phone || t(language, "noPhone")} </span> </div> </div> <div className="button-row"> <button className="secondary small-btn" onClick={() => toggleActive(worker)} > {worker.active ? t(language, "active") : t(language, "inactive")} </button> <button className="icon-danger" onClick={() => deleteWorker(worker)} title={t(language, "delete")} > <Trash2 size={16} /> </button> </div> </div> ); })} </div> </section> </div> ); }

function ReportsPage({ settlements }) {
  const workerMap = {};

  // Get worker earnings from all saved settlement records
  settlements.forEach((settlement) => {
    const workers = settlement.settlement_workers || [];

    workers.forEach((worker) => {
      const id = worker.worker_id || worker.worker_name;

      if (!workerMap[id]) {
        workerMap[id] = {
          id,
          name: worker.worker_name || "Unknown Worker",
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
          label="Total Workers"
          value={workerReports.length}
        />

        <StatCard
          icon={<CalendarDays />}
          label="Total Work Days"
          value={settlements.length}
        />

        <StatCard
          icon={<CircleDollarSign />}
          label="Total Worker Earnings"
          value={money(totalEarnings)}
        />

        <StatCard
          icon={<WalletCards />}
          label="Pending Wages"
          value={money(totalPending)}
        />
      </div>

      {/* Worker Earnings Table */}
      <section className="card">
        <div className="section-head">
          <div>
            <h3>Individual Worker Earnings</h3>
            <p className="muted">
              Total earnings from all recorded work days
            </p>
          </div>
        </div>

        {workerReports.length === 0 ? (
          <EmptyState text="No worker earnings available yet." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Worker Name</th>
                  <th>Days Worked</th>
                  <th>Total Earnings</th>
                  <th>Paid</th>
                  <th>Pending</th>
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
                      {worker.daysWorked} day
                      {worker.daysWorked !== 1 ? "s" : ""}
                    </td>

                    <td>
                      <strong>{money(worker.totalEarnings)}</strong>
                    </td>

                    <td>
                      {money(worker.paidAmount)}
                    </td>

                    <td>
                      {money(worker.pendingAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan="3">TOTAL</th>

                  <th>{money(totalEarnings)}</th>

                  <th>{money(totalPaid)}</th>

                  <th>{money(totalPending)}</th>
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
