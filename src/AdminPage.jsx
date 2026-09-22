import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "./supabase.js";
import { useSiteContent } from "./site-content.jsx";

const newId = () => crypto.randomUUID();

async function uploadImage(file, folder) {
  if (!file?.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be smaller than 8 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${newId()}.${extension}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, { cacheControl:"3600" });
  if (error) throw error;
  return supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}

function moveItem(items, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function LoginPanel({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setWorking(true);
    setError("");
    const result = await supabase.auth.signInWithPassword({ email, password });
    setWorking(false);
    if (result.error) return setError("That email or password didn’t work.");
    onSignedIn(result.data.session);
  }

  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <Link className="admin-wordmark" to="/">Teach2Learn</Link>
        <div className="section-kicker">Private content studio</div>
        <h1>Sign in to edit the site.</h1>
        <p>This page is intentionally not linked from the public website.</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <div className="admin-alert is-error">{error}</div>}
          <button className="admin-primary" disabled={working}>{working ? "Signing in…" : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}

function SetupPanel() {
  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <Link className="admin-wordmark" to="/">Teach2Learn</Link>
        <div className="section-kicker">One-time setup needed</div>
        <h1>Connect the content database.</h1>
        <p>The public site is still using its built-in content. Add the two Supabase values from <code>.env.example</code> to <code>.env.local</code>, then restart the development server.</p>
        <Link className="admin-secondary" to="/">Return to the website</Link>
      </section>
    </main>
  );
}

export default function AdminPage() {
  const { refresh } = useSiteContent();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(null);
  const [team, setTeam] = useState([]);
  const [boards, setBoards] = useState([]);
  const [deletedTeam, setDeletedTeam] = useState([]);
  const [deletedBoards, setDeletedBoards] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const previousRobots = document.querySelector('meta[name="robots"]')?.content;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
    return () => {
      if (previousRobots) robots.content = previousRobots;
      else robots.remove();
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) {
      setAuthorized(null);
      return;
    }
    async function loadEditor() {
      setChecking(true);
      const { data:isAdmin, error:adminError } = await supabase.rpc("is_site_admin");
      if (adminError || !isAdmin) {
        setAuthorized(false);
        setChecking(false);
        return;
      }
      setAuthorized(true);
      const [teamResult, boardResult] = await Promise.all([
        supabase.from("team_members").select("*").order("sort_order"),
        supabase.from("science_fair_boards").select("*").order("sort_order"),
      ]);
      if (teamResult.error || boardResult.error) setMessage("The editor could not load the saved content.");
      else {
        setTeam(teamResult.data.map((item) => ({ id:item.id, name:item.name, role:item.role, image:item.image_url })));
        setBoards(boardResult.data.map((item) => ({ id:item.id, title:item.title, url:item.destination_url, preview:item.preview_url })));
      }
      setChecking(false);
    }
    loadEditor();
  }, [session]);

  if (!isSupabaseConfigured) return <SetupPanel />;
  if (checking) return <main className="admin-shell admin-loading">Opening the content studio…</main>;
  if (!session) return <LoginPanel onSignedIn={setSession} />;
  if (authorized === false) return <main className="admin-shell admin-login-shell"><section className="admin-login-card"><h1>Access not enabled.</h1><p>This account is signed in but has not been added as a site administrator.</p><button className="admin-secondary" onClick={() => supabase.auth.signOut()}>Sign out</button></section></main>;

  const updateTeam = (index, field, value) => setTeam((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]:value } : item));
  const updateBoard = (index, field, value) => setBoards((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]:value } : item));

  async function chooseImage(file, folder, callback) {
    setMessage("Uploading image…");
    try {
      const url = await uploadImage(file, folder);
      callback(url);
      setMessage("Image uploaded. Save changes when you’re ready.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveAll() {
    setSaving(true);
    setMessage("");
    const teamRows = team.map((item, index) => ({ id:item.id, name:item.name.trim(), role:item.role.trim(), image_url:item.image, sort_order:index }));
    const boardRows = boards.map((item, index) => ({ id:item.id, title:item.title.trim(), destination_url:item.url.trim(), preview_url:item.preview, sort_order:index }));
    const operations = [
      teamRows.length ? supabase.from("team_members").upsert(teamRows) : Promise.resolve({ error:null }),
      boardRows.length ? supabase.from("science_fair_boards").upsert(boardRows) : Promise.resolve({ error:null }),
      deletedTeam.length ? supabase.from("team_members").delete().in("id", deletedTeam) : Promise.resolve({ error:null }),
      deletedBoards.length ? supabase.from("science_fair_boards").delete().in("id", deletedBoards) : Promise.resolve({ error:null }),
    ];
    const results = await Promise.all(operations);
    const error = results.find((result) => result.error)?.error;
    if (error) setMessage(`Could not save: ${error.message}`);
    else {
      setDeletedTeam([]);
      setDeletedBoards([]);
      await refresh();
      setMessage("Changes published successfully.");
    }
    setSaving(false);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><Link className="admin-wordmark" to="/">Teach2Learn</Link><span>Content studio</span></div>
        <div><Link className="admin-view-site" to="/" target="_blank">View website ↗</Link><button onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      </header>
      <div className="admin-content">
        <section className="admin-intro"><div><div className="section-kicker">Private editor</div><h1>Update the site without touching code.</h1><p>Add, remove, reorder, or replace content. Public cards keep their original proportions automatically.</p></div><button className="admin-primary" onClick={saveAll} disabled={saving}>{saving ? "Publishing…" : "Publish changes"}</button></section>
        {message && <div className="admin-alert">{message}</div>}

        <section className="admin-editor-section">
          <div className="admin-section-heading"><div><h2>Team members</h2><p>Names, positions, and portrait photographs.</p></div><button className="admin-secondary" onClick={() => setTeam((items) => [...items, { id:newId(), name:"", role:"", image:"/teach2learn-logo.png" }])}>Add position</button></div>
          <div className="admin-list">
            {team.map((member, index) => (
              <article className="admin-item team-admin-item" key={member.id}>
                <div className="admin-image-field"><img src={member.image} alt="" /><label>Replace photo<input type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files[0], "team", (url) => updateTeam(index, "image", url))} /></label></div>
                <div className="admin-fields"><label>Name<input value={member.name} onChange={(event) => updateTeam(index, "name", event.target.value)} /></label><label>Position<input value={member.role} onChange={(event) => updateTeam(index, "role", event.target.value)} /></label></div>
                <div className="admin-item-actions"><button aria-label="Move up" onClick={() => setTeam((items) => moveItem(items, index, -1))}>↑</button><button aria-label="Move down" onClick={() => setTeam((items) => moveItem(items, index, 1))}>↓</button><button className="is-danger" onClick={() => { setDeletedTeam((items) => [...items, member.id]); setTeam((items) => items.filter((item) => item.id !== member.id)); }}>Remove</button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-editor-section">
          <div className="admin-section-heading"><div><h2>Science fair boards</h2><p>Board title, clickable destination, and 4:3 preview image.</p></div><button className="admin-secondary" onClick={() => setBoards((items) => [...items, { id:newId(), title:"", url:"", preview:"/teach2learn-logo.png" }])}>Add board</button></div>
          <div className="admin-list">
            {boards.map((board, index) => (
              <article className="admin-item board-admin-item" key={board.id}>
                <div className="admin-image-field is-board"><img src={board.preview} alt="" /><label>Replace preview<input type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files[0], "boards", (url) => updateBoard(index, "preview", url))} /></label></div>
                <div className="admin-fields"><label>Display title<input value={board.title} onChange={(event) => updateBoard(index, "title", event.target.value)} /></label><label>Canva or document link<input type="url" value={board.url} onChange={(event) => updateBoard(index, "url", event.target.value)} /></label></div>
                <div className="admin-item-actions"><button aria-label="Move up" onClick={() => setBoards((items) => moveItem(items, index, -1))}>↑</button><button aria-label="Move down" onClick={() => setBoards((items) => moveItem(items, index, 1))}>↓</button><button className="is-danger" onClick={() => { setDeletedBoards((items) => [...items, board.id]); setBoards((items) => items.filter((item) => item.id !== board.id)); }}>Remove</button></div>
              </article>
            ))}
          </div>
        </section>

        <div className="admin-save-bar"><span>{message}</span><button className="admin-primary" onClick={saveAll} disabled={saving}>{saving ? "Publishing…" : "Publish changes"}</button></div>
      </div>
    </main>
  );
}
