import { useEffect, useState } from 'react'
import './App.css'

type StepState = 'done' | 'active' | 'idle'
type WorkflowStep = { label: string; detail: string; tool?: string; state: StepState }

const initialSteps: WorkflowStep[] = [
  { label: 'Understand request', detail: 'Profile and intent mapped', state: 'done' },
  { label: 'Discover tools', detail: '8 WebMCP capabilities available', state: 'done' },
  { label: 'Search opportunities', detail: 'Scanning trusted sources', tool: 'search_web', state: 'active' },
  { label: 'Compare candidates', detail: 'Waiting for search results', tool: 'compare_results', state: 'idle' },
  { label: 'Prepare applications', detail: 'Will create a tailored shortlist', tool: 'create_plan', state: 'idle' },
]

const tools = [
  { name: 'search_web', group: 'Research', calls: 12, status: 'running' },
  { name: 'extract_information', group: 'Research', calls: 28, status: 'ready' },
  { name: 'compare_results', group: 'Analysis', calls: 7, status: 'ready' },
  { name: 'create_plan', group: 'Planning', calls: 4, status: 'ready' },
  { name: 'request_approval', group: 'Actions', calls: 3, status: 'ready' },
  { name: 'execute_action', group: 'Actions', calls: 2, status: 'ready' },
]

const activity = [
  ['09:42:11', 'Agent started', 'system'],
  ['09:42:12', 'search_web()', 'tool'],
  ['09:42:15', 'extract_information()', 'tool'],
  ['09:42:18', 'compare_results()', 'tool'],
  ['09:42:21', 'approval_requested()', 'approval'],
]

function App() {
  const [prompt, setPrompt] = useState('Find Java and Spring Boot internships that match my profile, rank the best five, and prepare the applications.')
  const [steps, setSteps] = useState(initialSteps)
  const [isRunning, setIsRunning] = useState(true)
  const [approved, setApproved] = useState(false)
  const [activeNav, setActiveNav] = useState('Command center')

  useEffect(() => {
    if (!isRunning) return
    const timer = window.setInterval(() => {
      setSteps((current) => {
        const activeIndex = current.findIndex((step) => step.state === 'active')
        if (activeIndex === -1) return current
        return current.map((step, index) => {
          if (index === activeIndex) return { ...step, state: 'done' }
          if (index === activeIndex + 1) return { ...step, state: 'active' }
          return step
        })
      })
    }, 2200)
    return () => window.clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    if (steps[steps.length - 1].state === 'done') setIsRunning(false)
  }, [steps])

  const runTask = () => {
    setApproved(false)
    setSteps(initialSteps.map((step, index) => ({ ...step, state: index < 2 ? 'done' : index === 2 ? 'active' : 'idle' })))
    setIsRunning(true)
  }

  const approve = () => {
    setApproved(true)
    setIsRunning(false)
    setSteps((current) => current.map((step) => step.state === 'active' ? { ...step, state: 'done' } : step))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">af</span><span>actionflow<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace"><span className="workspace-avatar">JD</span><span><strong>Jordan Davis</strong><small>Personal workspace</small></span><span className="chevron">v</span></div>
        <nav>
          {['Command center', 'Activity log', 'Tool explorer'].map((item) => <button key={item} className={activeNav === item ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(item)}><span className="nav-icon">{item === 'Command center' ? '>' : item === 'Activity log' ? '=' : '[]'}</span>{item}<span className="nav-arrow">{activeNav === item ? '->' : ''}</span></button>)}
        </nav>
        <div className="sidebar-footer"><div className="connection"><span className="pulse"></span><span><strong>WebMCP connected</strong><small>8 tools available</small></span></div><button className="settings" aria-label="Open settings">::</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">COMMAND CENTER</span><h1>Make progress, on purpose.</h1></div><div className="top-actions"><span className="live-status"><span className="pulse"></span>Agent online</span><button className="icon-button" aria-label="Notifications">!</button><span className="profile">JD</span></div></header>
        {activeNav === 'Command center' ? <div className="content-grid">
          <section className="primary-column">
            <div className="command-panel"><div className="panel-kicker"><span className="spark">*</span> NEW TASK <span className="shortcut">shift + enter</span></div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Task description" /><div className="command-footer"><div className="context-chip"><span className="context-icon">+</span> Jordan's profile <span className="chip-close">x</span></div><button className="run-button" onClick={runTask}>Run task <span>-&gt;</span></button></div></div>
            <div className="section-heading"><div><span className="eyebrow">LIVE WORKFLOW</span><h2>Agent execution</h2></div><span className="run-id">RUN-2841 <span className="running-dot"></span></span></div>
            <div className="workflow-panel">{steps.map((step, index) => <div className={`workflow-row ${step.state}`} key={step.label}><div className="step-marker">{step.state === 'done' ? '✓' : step.state === 'active' ? <span className="spinner"></span> : (index + 1).toString().padStart(2, '0')}</div><div className="step-copy"><div className="step-title">{step.label} {step.tool && <code>{step.tool}()</code>}</div><div className="step-detail">{step.detail}</div></div>{step.state === 'active' && <span className="step-live">LIVE</span>}{step.state === 'done' && <span className="step-check">complete</span>}</div>)}
              <div className={`approval-panel ${approved ? 'approved' : ''}`}><div className="approval-icon">{approved ? '✓' : '!'}</div><div><strong>{approved ? 'Action approved' : 'Approval required'}</strong><p>{approved ? 'Your application packet is ready to submit.' : 'The agent found a strong match and needs your permission to prepare the next step.'}</p></div>{!approved && <div className="approval-actions"><button className="reject-button" onClick={() => setIsRunning(false)}>Reject</button><button className="approve-button" onClick={approve}>Approve <span>-&gt;</span></button></div>}</div>
            </div>
            <div className="results-strip"><span className="result-count">12 <small>matches found</small></span><span className="result-divider"></span><span><strong>Top signal</strong><small>Spring Boot + Java</small></span><span className="result-divider"></span><span><strong>Last updated</strong><small>just now</small></span><button className="view-results">View results <span>-&gt;</span></button></div>
          </section>

          <aside className="secondary-column"><div className="side-section"><div className="section-heading compact"><div><span className="eyebrow">AVAILABLE CAPABILITIES</span><h2>WebMCP tools</h2></div><span className="tool-count">8 / 8</span></div><div className="tool-list">{tools.map((tool) => <div className="tool-row" key={tool.name}><span className={`tool-status ${tool.status}`}></span><div><strong>{tool.name}</strong><small>{tool.group} <span className="call-count">{tool.calls} calls</span></small></div><span className="tool-chevron">&gt;</span></div>)}</div><button className="explorer-link" onClick={() => setActiveNav('Tool explorer')}>Open tool explorer <span>-&gt;</span></button></div>
            <div className="side-section activity-section"><div className="section-heading compact"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Audit trail</h2></div><button className="more-button" aria-label="More activity">...</button></div><div className="activity-list">{activity.map(([time, label, type]) => <div className="activity-row" key={time + label}><span className={`activity-icon ${type}`}>{type === 'tool' ? '>' : type === 'approval' ? '!' : '+'}</span><span>{label}</span><time>{time}</time></div>)}</div><button className="explorer-link" onClick={() => setActiveNav('Activity log')}>View full activity <span>-&gt;</span></button></div>
          </aside>
        </div> : activeNav === 'Activity log' ? <section className="full-view"><div className="section-heading view-heading"><div><span className="eyebrow">OBSERVABILITY</span><h2>Activity log</h2></div><span className="run-id">ALL EVENTS</span></div><div className="log-table">{activity.map(([time, label, type], index) => <div className="log-row" key={time + label}><span className={`activity-icon ${type}`}>{type === 'tool' ? '>' : type === 'approval' ? '!' : '+'}</span><span className="log-event"><strong>{label}</strong><small>{type === 'tool' ? 'WebMCP tool invocation completed' : type === 'approval' ? 'User decision checkpoint' : 'Workspace event'}</small></span><time>{time}</time><span className="log-success">{index === 4 ? 'pending' : 'success'}</span></div>)}</div></section> : <section className="full-view"><div className="section-heading view-heading"><div><span className="eyebrow">WEBMCP REGISTRY</span><h2>Tool explorer</h2></div><span className="run-id">8 CAPABILITIES</span></div><div className="explorer-grid">{tools.map((tool) => <article className="explorer-card" key={tool.name}><div className="explorer-card-top"><span className={`tool-status ${tool.status}`}></span><code>{tool.name}</code><span className="tool-chevron">&gt;</span></div><p>{tool.group} capability available to the agent.</p><footer><span>{tool.calls} calls this session</span><span className="ready-label">{tool.status}</span></footer></article>)}</div></section>}
      </main>
    </div>
  )
}

export default App
