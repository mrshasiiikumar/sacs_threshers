import React from "react";
import { useEffect, useMemo, useState } from "react";
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

function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loadingAuth) return <FullScreenLoader />;
  if (!session) return <Login />;

  return <Dashboard session={session} />;
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

function Dashboard({ session }) {
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

        <nav>
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
          <NavItem icon={<WalletCards />} label="New Settlement" active={page === "settlement"} onClick={() => setPage("settlement")} />
          <NavItem icon={<History />} label="History" active={page === "history"} onClick={() => setPage("history")} />
          <NavItem icon={<Users />} label="Workers" active={page === "workers"} onClick={() => setPage("workers")} />
          <NavItem icon={<BarChart3 />} label="Reports" active={page === "reports"} onClick={() => setPage("reports")} />
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
            />
          )}

          {page === "settlement" && (
            <SettlementPage
              workers={activeWorkers}
              onSaved={async () => {
                await loadData();
                setPage("history");
                showToast("Settlement saved successfully.");
              }}
              showToast={showToast}
            />
          )}

          {page === "history" && (
            <HistoryPage
              settlements={settlements}
              onOpen={setSelectedSettlement}
            />
          )}

          {page === "workers" && (
            <WorkersPage
              workers={workers}
              reload={loadData}
              showToast={showToast}
            />
          )}

          {page === "reports" && <ReportsPage settlements={settlements} />}
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

function DashboardHome({ settlements, workers, onNew, onHistory }) {
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
                <span className="avatar small">{worker.name[0].toUpperCase()}</span>
                <span>{worker.name}</span>
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

function SettlementPage({ workers, onSaved, showToast }) {
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
                {worker.name}
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

function WorkersPage({ workers, reload, showToast }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function addWorker(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setBusy(true);
    const { error } = await supabase.from("workers").insert({
      name: name.trim(),
      phone: phone.trim() || null,
    });

    if (error) showToast(error.message, true);
    else {
      setName("");
      setPhone("");
      showToast("Worker added.");
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
    if (!window.confirm(`Delete ${worker.name}?`)) return;

    const { error } = await supabase.from("workers").delete().eq("id", worker.id);
    if (error) showToast(error.message, true);
    else {
      showToast("Worker deleted.");
      await reload();
    }
  }

  return (
    <div className="two-column">
      <section className="card">
        <div className="section-head">
          <div>
            <h3>Add worker</h3>
            <p className="muted">Add the people who can work on the thresher.</p>
          </div>
        </div>

        <form onSubmit={addWorker} className="form-grid">
          <label>
            Worker name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh" required />
          </label>
          <label>
            Phone (optional)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
          </label>
          <button className="primary full-span" disabled={busy}>
            <Plus size={17} /> {busy ? "Adding..." : "Add worker"}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h3>Worker list</h3>
            <p className="muted">{workers.length} workers in master list</p>
          </div>
        </div>

        <div className="worker-management">
          {workers.map((worker) => (
            <div className={`worker-row ${worker.active ? "" : "inactive"}`} key={worker.id}>
              <div className="worker-info">
                <span className="avatar small">{worker.name[0].toUpperCase()}</span>
                <div>
                  <strong>{worker.name}</strong>
                  <span>{worker.phone || "No phone number"}</span>
                </div>
              </div>
              <div className="button-row">
                <button className="secondary small-btn" onClick={() => toggleActive(worker)}>
                  {worker.active ? "Active" : "Inactive"}
                </button>
                <button className="icon-danger" onClick={() => deleteWorker(worker)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportsPage() {
  const [workers, setWorkers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);

    const [{ data: workerData, error: workerError }, { data: settlementData, error: settlementError }] =
      await Promise.all([
        supabase.from("workers").select("*").order("name"),
        supabase
          .from("settlements")
          .select(`
            id,
            work_date,
            total_income,
            diesel_expense,
            owner_share,
            workers_share,
            settlement_workers (
              id,
              worker_id,
              worker_name,
              wage_amount,
              payment_status
            )
          `)
          .order("work_date", { ascending: false }),
      ]);

    if (workerError) {
      console.error("Workers error:", workerError);
    }

    if (settlementError) {
      console.error("Settlements error:", settlementError);
    }

    setWorkers(workerData || []);
    setSettlements(settlementData || []);
    setLoading(false);
  }

  // Calculate individual worker earnings from ALL settlement records
  const workerReports = workers.map((worker) => {
    let totalEarnings = 0;
    let daysWorked = 0;
    let paidAmount = 0;
    let pendingAmount = 0;

    settlements.forEach((settlement) => {
      const workerRecord = settlement.settlement_workers?.find(
        (item) => item.worker_id === worker.id
      );

      if (workerRecord) {
        const amount = Number(workerRecord.wage_amount || 0);

        totalEarnings += amount;
        daysWorked += 1;

        if (workerRecord.payment_status === "paid") {
          paidAmount += amount;
        } else {
          pendingAmount += amount;
        }
      }
    });

    return {
      id: worker.id,
      name: worker.name,
      phone: worker.phone || "-",
      daysWorked,
      totalEarnings,
      paidAmount,
      pendingAmount,
    };
  });

  // Also include historical workers whose master record may have been deleted
  const historicalWorkers = {};

  settlements.forEach((settlement) => {
    settlement.settlement_workers?.forEach((worker) => {
      if (!workerReports.some((item) => item.id === worker.worker_id)) {
        if (!historicalWorkers[worker.worker_id]) {
          historicalWorkers[worker.worker_id] = {
            id: worker.worker_id,
            name: worker.worker_name,
            phone: "-",
            daysWorked: 0,
            totalEarnings: 0,
            paidAmount: 0,
            pendingAmount: 0,
          };
        }

        const item = historicalWorkers[worker.worker_id];
        const amount = Number(worker.wage_amount || 0);

        item.daysWorked += 1;
        item.totalEarnings += amount;

        if (worker.payment_status === "paid") {
          item.paidAmount += amount;
        } else {
          item.pendingAmount += amount;
        }
      }
    });
  });

  const allWorkerReports = [
    ...workerReports,
    ...Object.values(historicalWorkers),
  ].sort((a, b) => b.totalEarnings - a.totalEarnings);

  const totalWorkerEarnings = allWorkerReports.reduce(
    (sum, worker) => sum + worker.totalEarnings,
    0
  );

  const totalPaid = allWorkerReports.reduce(
    (sum, worker) => sum + worker.paidAmount,
    0
  );

  const totalPending = allWorkerReports.reduce(
    (sum, worker) => sum + worker.pendingAmount,
    0
  );

  const totalWorkDays = settlements.length;

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Worker Reports</h1>
          <p>Individual worker earnings across all recorded work days.</p>
        </div>

        <button className="secondary-button" onClick={loadReports}>
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Work Days</span>
          <strong>{totalWorkDays}</strong>
        </div>

        <div className="stat-card">
          <span>Workers</span>
          <strong>{allWorkerReports.length}</strong>
        </div>

        <div className="stat-card">
          <span>Total Worker Earnings</span>
          <strong>
            ₹{totalWorkerEarnings.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className="stat-card">
          <span>Pending Wages</span>
          <strong>
            ₹{totalPending.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      {/* Worker-wise report */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Individual Worker Earnings</h2>
            <p>All-time earnings from every recorded settlement.</p>
          </div>
        </div>

        {allWorkerReports.length === 0 ? (
          <div className="empty-state">
            <h3>No worker earnings yet</h3>
            <p>Complete a daily settlement to see worker earnings here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
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
                {allWorkerReports.map((worker, index) => (
                  <tr key={worker.id || `${worker.name}-${index}`}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{worker.name}</strong>
                    </td>

                    <td>
                      <span className="badge">
                        {worker.daysWorked} days
                      </span>
                    </td>

                    <td>
                      <strong>
                        ₹
                        {worker.totalEarnings.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </td>

                    <td>
                      <span className="status-paid">
                        ₹
                        {worker.paidAmount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    <td>
                      <span className="status-pending">
                        ₹
                        {worker.pendingAmount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan="3">TOTAL</th>

                  <th>
                    ₹
                    {totalWorkerEarnings.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </th>

                  <th>
                    ₹
                    {totalPaid.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </th>

                  <th>
                    ₹
                    {totalPending.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
  const [month, setMonth] = useState(dateISO().slice(0, 7));

  const filtered = settlements.filter((s) => s.work_date.startsWith(month));

  const totals = filtered.reduce(
    (a, s) => ({
      income: a.income + Number(s.total_income),
      diesel: a.diesel + Number(s.diesel_expense),
      owner: a.owner + Number(s.owner_share),
      workers: a.workers + Number(s.workers_share),
    }),
    { income: 0, diesel: 0, owner: 0, workers: 0 }
  );

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h3>Monthly report</h3>
          <p className="muted">Review income, diesel and profit for a selected month.</p>
        </div>
        <input className="month-input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      <div className="report-cards">
        <StatCard icon={<CircleDollarSign />} label="Income" value={money(totals.income)} />
        <StatCard icon={<Droplets />} label="Diesel" value={money(totals.diesel)} />
        <StatCard icon={<WalletCards />} label="Owner profit" value={money(totals.owner)} />
        <StatCard icon={<Users />} label="Worker share" value={money(totals.workers)} />
      </div>

      <div className="report-summary">
        <span>Work days</span>
        <strong>{filtered.length}</strong>
      </div>
    </section>
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
