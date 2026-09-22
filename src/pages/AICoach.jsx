import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Bot, User as UserIcon, Plus, Trash2, MessageSquare, Menu } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageHeader from '@/components/ui/PageHeader'
import coachAvatar from '@/assets/coach-avatar.png'
import Card, { CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { PageLoader, EmptyState } from '@/components/ui/Feedback'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { sendCoachChat } from '@/services/coachApi'
import {
  ensureConversation, subscribeConversations, subscribeConversationMessages,
  saveConversationMessage, deleteConversation, newConversationId,
} from '@/services/firestore'
import { workoutStreak } from '@/utils/dates'
import { weeklyWorkoutTarget, calcMacroTargets } from '@/utils/calculate'
import { todayPlanDay } from '@/services/ai/workoutGenerator'

const ACTIVE_KEY = 'afc-active-conversation'

const STARTER_PROMPTS = [
  'What workout should I do today?',
  'Create a beginner home workout.',
  'What should I eat today?',
  'Make me a weekly gym plan.',
  'Best exercises to lose belly fat?',
  'High-protein diet for muscle gain?',
  'How can I improve my workout consistency?',
]

/* ── markdown rendering (safe, no raw HTML) ───────────────────────── */
const mdComponents = {
  p: (props) => <p className="my-2 whitespace-pre-wrap first:mt-0 last:mb-0 leading-relaxed" {...props} />,
  h1: (props) => <h1 className="mt-3 mb-1.5 text-base font-bold first:mt-0" {...props} />,
  h2: (props) => <h2 className="mt-3 mb-1.5 text-[15px] font-bold first:mt-0" {...props} />,
  h3: (props) => <h3 className="mt-2.5 mb-1 text-sm font-bold first:mt-0" {...props} />,
  ul: (props) => <ul className="my-2 list-disc space-y-1 pl-5 first:mt-0" {...props} />,
  ol: (props) => <ol className="my-2 list-decimal space-y-1 pl-5 first:mt-0" {...props} />,
  li: (props) => <li className="pl-0.5 leading-relaxed" {...props} />,
  blockquote: (props) => <blockquote className="my-2 border-l-2 border-emerald-400/60 pl-3 text-zinc-500 dark:text-zinc-400" {...props} />,
  hr: () => <hr className="my-3 border-zinc-200 dark:border-white/10" />,
  a: (props) => <a className="font-semibold text-emerald-600 underline underline-offset-2 dark:text-emerald-400" target="_blank" rel="noreferrer" {...props} />,
  table: (props) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10">
      <table className="w-full text-left text-[12.5px]" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-zinc-100 dark:bg-white/[.06]" {...props} />,
  th: (props) => <th className="border-b border-zinc-200 px-3 py-2 font-bold dark:border-white/10" {...props} />,
  td: (props) => <td className="border-b border-zinc-100 px-3 py-1.5 align-top last:border-0 dark:border-white/[.06]" {...props} />,
  code: ({ children, className }) => {
    const text = String(children ?? '').replace(/\n$/, '')
    const isBlock = (className || '').includes('language-') || text.includes('\n')
    if (!isBlock) {
      return <code className="rounded-md bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[12.5px] text-emerald-700 dark:bg-white/10 dark:text-lime-300">{text}</code>
    }
    return (
      <div className="my-2.5 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
        <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-zinc-500 dark:border-white/10 dark:bg-white/[.05] dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" /><span className="h-2 w-2 rounded-full bg-amber-400/80" /><span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-1">{(className || '').replace('language-', '') || 'code'}</span>
        </div>
        <pre className="overflow-x-auto bg-zinc-50 p-3.5 font-mono text-[12.5px] leading-relaxed dark:bg-zinc-950/70"><code>{text}</code></pre>
      </div>
    )
  },
  pre: ({ children }) => <>{children}</>,
}

const timeOf = (m) => {
  try {
    const d = m.createdAt?.toDate?.() || (typeof m.createdAt === 'string' ? new Date(m.createdAt) : null)
    return d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''
  } catch { return '' }
}

const LOCAL_KEY = (m) => `${m.role}::${m.text}`

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1" aria-label="Coach is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-emerald-400" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </span>
  )
}

export default function AICoach() {
  const { user, profile, fitness } = useAuth()
  const { plan, dietPlan, logs, entries, todayEntry, dataLoading } = useData()
  const toast = useToast()

  const [conversations, setConversations] = useState([])
  const [activeCid, setActiveCid] = useState(null) // close → reopen always starts a NEW chat
  const [menuOpen, setMenuOpen] = useState(false)
  const [kbOverlap, setKbOverlap] = useState(0)
  const [serverMsgs, setServerMsgs] = useState(null) // null = loading
  const [localMsgs, setLocalMsgs] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const bottomRef = useRef(null)
  const taRef = useRef(null)
  const lastSendRef = useRef(null)

  /* conversations list (for the history menu) */
  useEffect(() => {
    if (!user) return undefined
    return subscribeConversations(user.uid, setConversations, () => setConversations([]))
  }, [user])

  /* messages of the active conversation (never touches optimistic echoes) */
  useEffect(() => {
    if (!user || !activeCid) { setServerMsgs([]); return undefined }
    setServerMsgs(null)
    return subscribeConversationMessages(user.uid, activeCid, setServerMsgs, () => setServerMsgs([]))
  }, [user, activeCid])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [serverMsgs, localMsgs, thinking])

  /* Mobile keyboard: on Android the layout viewport resizes (dvh shrinks) so the
     composer sits right above the keyboard. On iOS the keyboard OVERLAYS the
     page — detect the overlap and pad the page by exactly that much, then pin
     the window to the bottom so the composer is always visible above it. */
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return undefined
    const sync = () => {
      const overlap = Math.round(window.innerHeight - (vv.height + vv.offsetTop))
      setKbOverlap(overlap > 120 ? overlap : 0) // ignore toolbar show/hide noise
    }
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    return () => { vv.removeEventListener('resize', sync); vv.removeEventListener('scroll', sync) }
  }, [])

  /* context sent to the backend for personalization */
  const fitnessContext = useMemo(() => {
    if (!fitness && !profile) return null
    const latest = entries.find((e) => e.weight)
    const targets = dietPlan?.targets || calcMacroTargets(fitness || {})
    const today = todayPlanDay(plan)
    return {
      name: profile?.name, age: fitness?.age, gender: fitness?.gender,
      height: fitness?.height, weight: latest?.weight ?? fitness?.weight,
      goal: fitness?.goal, goalWeight: fitness?.goalWeight, activityLevel: fitness?.activityLevel,
      workoutPreference: fitness?.workoutPreference, experienceLevel: fitness?.experienceLevel,
      foodPreferences: fitness?.foodPreferences, allergies: fitness?.allergies || [],
      bmi: latest?.weight && fitness?.height ? Math.round((latest.weight / (fitness.height / 100) ** 2) * 10) / 10 : undefined,
      streak: workoutStreak(logs),
      weeklyDone: logs.filter((l) => l.date >= new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)).length,
      weeklyTarget: weeklyWorkoutTarget(fitness?.experienceLevel),
      calorieTarget: targets?.calories, proteinTarget: targets?.protein, carbsTarget: targets?.carbs, fatsTarget: targets?.fats,
      todayCalories: todayEntry?.calories,
      todayWorkout: today ? { focus: today.focus, duration: today.duration, exercises: today.exercises?.map((e) => e.name) } : undefined,
      recentWeight: [...entries].filter((e) => e.weight).sort((a, b) => a.date.localeCompare(b.date)).slice(-5)
        .map((e) => ({ date: e.date, weight: e.weight })),
    }
  }, [profile, fitness, plan, dietPlan, logs, entries, todayEntry])

  const activeTitle = useMemo(
    () => (activeCid ? conversations.find((c) => c.id === activeCid)?.title || 'Chat' : null),
    [activeCid, conversations],
  )

  const visible = useMemo(() => {
    const base = (serverMsgs || []).filter((m) => m && typeof m.text === 'string' && m.text.trim() && (m.role === 'user' || m.role === 'assistant'))
    const dedup = localMsgs.filter((l) => l.text?.trim() && !base.some((s) => LOCAL_KEY(s) === LOCAL_KEY(l)))
    return [...base, ...dedup]
  }, [serverMsgs, localMsgs])

  const handleComposerFocus = () => {
    const pin = () => window.scrollTo({ top: document.documentElement.scrollHeight })
    setTimeout(pin, 250)
    setTimeout(pin, 650) // after the keyboard finish animation
  }

  const startNewChat = () => {
    if (thinking) return
    setMenuOpen(false)
    setActiveCid(null)
    setServerMsgs([]); setLocalMsgs([])
    taRef.current?.focus()
  }

  const openConversation = (cid) => {
    if (cid === activeCid || thinking) return
    setMenuOpen(false)
    setActiveCid(cid)
    setLocalMsgs([])
  }

  const confirmClear = async () => {
    setClearOpen(false)
    if (activeCid && user) {
      try { await deleteConversation(user.uid, activeCid) } catch { toast.error('Could not delete the conversation — storage rules may be blocking it.') }
    }
    startNewChat()
    toast.success('Conversation cleared.')
  }

  const send = async (raw) => {
    const text = String(raw || '').trim()
    if (!text || thinking) return
    // guard against double-fire (Enter + implicit submit) within the same beat
    const now = Date.now()
    if (lastSendRef.current && lastSendRef.current.text === text && now - lastSendRef.current.at < 800) return
    lastSendRef.current = { text, at: now }
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'

    let cid = activeCid
    if (!cid) {
      // brand-new conversation: its first message becomes the title (deterministic,
      // independent of render-time `visible`); the server also re-asserts this.
      cid = newConversationId()
      if (user) ensureConversation(user.uid, cid, text).catch(() => {})
      setActiveCid(cid)
      try { localStorage.setItem(ACTIVE_KEY, cid) } catch { /* ignore */ }
    }

    const localUserId = `local-u-${Date.now()}`
    setLocalMsgs((m) => [...m, { id: localUserId, role: 'user', text }])
    setThinking(true)

    try {
      const history = visible.slice(-12).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content ?? m.text }))
      const data = await sendCoachChat({ message: text, conversationHistory: history, fitnessContext, conversationId: cid })

      const localReplyId = `local-c-${Date.now()}`
      setLocalMsgs((m) => [...m, { id: localReplyId, role: 'assistant', text: data.reply }])

      // Server already persisted both messages; if it couldn't (rules/network), save client-side.
      if (!data.saved && user) {
        try {
          await saveConversationMessage(user.uid, cid, { role: 'user', content: text, language: 'auto' })
          await saveConversationMessage(user.uid, cid, { role: 'assistant', content: data.reply, language: 'auto' })
        } catch { /* keep local echoes — storage currently blocked */ }
      }
    } catch (err) {
      const friendly = err.code === 'AI_NOT_CONFIGURED'
        ? 'Fitness Coach is not connected yet. Add your free Groq API key as GROQ_API_KEY in the project .env file and restart the API server — then this chat comes alive.'
        : err.message || 'Fitness Coach could not respond right now. Please try again.'
      setLocalMsgs((m) => [...m, { id: `err-${Date.now()}`, role: 'assistant', text: `⚠️ ${friendly}` }])
    } finally {
      setThinking(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(input)
    }
  }

  if (dataLoading || serverMsgs === null && activeCid) return <PageLoader label="Waking up your Fitness Coach…" />

  return (
    <>
      <PageHeader
        compact
        title="Fitness Coach"
        actions={(
          <>
            <Button variant="outline" size="sm" icon={<Trash2 size={14} />} onClick={() => (visible.length ? setClearOpen(true) : null)} disabled={!visible.length || thinking}>
              Clear
            </Button>
            <Button size="sm" icon={<Plus size={14} />} onClick={startNewChat} disabled={thinking}>New Chat</Button>
          </>
        )}
      />

      <div className="grid gap-5 transition-[padding] lg:grid-cols-[1fr_290px]" style={kbOverlap ? { paddingBottom: kbOverlap } : undefined}>
        {/* ── Chat ── */}
        <Card className="flex h-[calc(100dvh-252px)] min-h-[400px] flex-col overflow-hidden sm:h-[calc(100dvh-210px)] sm:min-h-[430px] lg:h-[calc(100dvh-165px)] lg:min-h-[460px]">
          <div className="relative flex items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-white/[.06] sm:px-5 sm:py-3.5">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[.06]"
              aria-label="Chat history menu"
            >
              <Menu size={16} />
            </button>
            <span className="relative">
              <img src={coachAvatar} alt="Fitness Coach" className="h-10 w-10 rounded-xl object-cover shadow-[0_0_16px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/30" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-zinc-900" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-zinc-900 dark:text-white">Fitness Coach</p>
              <p className="truncate text-[11px] font-medium text-emerald-500">
                {thinking ? 'Typing…' : activeTitle || 'New chat'}
              </p>
            </div>
            <span className="chip hidden border-zinc-300/60 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/[.05] dark:text-zinc-400 sm:inline-flex">
              <MessageSquare size={11} /> {visible.length} messages
            </span>
          </div>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-3 right-3 top-[64px] z-40 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900 sm:left-4 sm:w-96">
                  <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-white/[.07]">
                    <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">Chat History</p>
                    <button type="button" onClick={startNewChat} className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 px-2.5 py-1.5 text-[11.5px] font-bold text-zinc-950">
                      <Plus size={12} /> New chat
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto scrollbar-thin">
                    {conversations.length === 0 && (
                      <p className="px-4 py-6 text-center text-[12.5px] text-zinc-400">No saved chats yet — start talking!</p>
                    )}
                    {conversations.map((c) => (
                      <div key={c.id} className={`flex items-center gap-2 border-b border-zinc-50 last:border-0 dark:border-white/[.04] ${c.id === activeCid ? 'bg-emerald-500/[.07]' : ''}`}>
                        <button type="button" onClick={() => openConversation(c.id)} className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-left">
                          <MessageSquare size={13} className="shrink-0 text-zinc-400" />
                          <span className={`min-w-0 flex-1 truncate text-[13px] ${c.id === activeCid ? 'font-semibold text-emerald-600 dark:text-emerald-300' : 'text-zinc-600 dark:text-zinc-300'}`}>
                            {c.title || 'Conversation'}
                          </span>
                        </button>
                        {!thinking && (
                          <button
                            type="button"
                            aria-label={`Delete ${c.title || 'conversation'}`}
                            onClick={async () => {
                              try { await deleteConversation(user.uid, c.id) } catch { toast.error('Delete blocked — try again.') }
                              if (c.id === activeCid) startNewChat()
                            }}
                            className="mr-3 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-zinc-300 transition hover:bg-rose-500/10 hover:text-rose-500 dark:text-zinc-600"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 scrollbar-thin sm:px-5 sm:py-5">
            {visible.length === 0 && !thinking && (
              <div className="flex flex-col items-center py-4 text-center sm:py-6">
                <img src={coachAvatar} alt="Fitness Coach" className="h-16 w-16 rounded-3xl object-cover shadow-[0_0_28px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/40" />
                <h3 className="mt-4 font-display text-lg font-bold text-zinc-900 dark:text-white">Salam, {profile?.name?.split(' ')[0] || 'there'}! 👋</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Ask me anything — workouts, meals, diet & recovery. I reply in your language.
                </p>
                <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {STARTER_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-[13px] font-medium text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-emerald-400/60 hover:text-emerald-600 dark:border-white/[.08] dark:bg-white/[.03] dark:text-zinc-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {visible.map((m) => (
              <div key={m.id} className={`group flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : ''} animate-fade-up`}>
                {m.role !== 'user' && (
                  <img src={coachAvatar} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-cyan-400/25" />
                )}
                <div className={`max-w-[86%] sm:max-w-[75%] ${m.role === 'user' ? 'rounded-2xl rounded-br-md bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-3' : 'rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 text-zinc-700 shadow-sm dark:border-white/[.07] dark:bg-white/[.05] dark:text-zinc-200'}`}>
                  {m.role === 'user'
                    ? <p className="whitespace-pre-wrap break-words text-[14px] font-medium leading-relaxed text-zinc-950">{m.text}</p>
                    : (
                      <div className="text-[14px] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>{m.text}</Markdown>
                      </div>
                    )}
                  {timeOf(m) && (
                    <p className={`mt-1.5 text-[10px] font-medium ${m.role === 'user' ? 'text-zinc-900/50' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {timeOf(m)}
                    </p>
                  )}
                </div>
                {m.role === 'user' && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-200 text-zinc-500 dark:bg-white/[.08] dark:text-zinc-300"><UserIcon size={15} /></span>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex items-end gap-2.5">
                <img src={coachAvatar} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-cyan-400/25" />
                <div className="rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3.5 shadow-sm dark:border-white/[.07] dark:bg-white/[.05]"><TypingDots /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="border-t border-zinc-100 p-3.5 dark:border-white/[.06]"
          >
            <div className="flex items-end gap-2.5">
              <textarea
                ref={taRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
                }}
                onKeyDown={onKeyDown}
                onFocus={handleComposerFocus}
                enterKeyHint="send"
                placeholder="Ask anything…"
                className="field max-h-32 flex-1 resize-none !py-3"
                aria-label="Message your Fitness coach"
                disabled={thinking}
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="btn-primary shrink-0 !rounded-xl !px-4 !py-3 disabled:!opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-2 hidden text-center text-[10.5px] leading-snug text-zinc-400 dark:text-zinc-500 sm:block">
              AI answers are general wellness guidance, not medical advice · history is stored privately under your account
            </p>
          </form>
        </Card>

        {/* ── Right rail ── */}
        <div className="hidden space-y-5 lg:block">
          <Card className="p-5">
            <CardHeader icon={MessageSquare} title="Conversations" subtitle="New Chat keeps old ones" />
            <div className="mt-4 max-h-64 space-y-1.5 overflow-y-auto scrollbar-thin">
              {conversations.length === 0 && <p className="py-4 text-center text-[13px] text-zinc-400">No saved conversations yet.</p>}
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openConversation(c.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${c.id === activeCid
                    ? 'bg-gradient-to-r from-lime-400/15 to-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-300'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/[.05]'}`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  <span className="min-w-0 flex-1 truncate">{c.title || 'Conversation'}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader icon={Bot} title="Coach Context" subtitle="What personalizes fitness answers" />
            <dl className="mt-4 space-y-2.5 text-[13px]">
              {[
                ['Name', profile?.name || '—'],
                ['Goal', fitness?.goal || '—'],
                ['Weight', entries.find((e) => e.weight)?.weight ? `${entries.find((e) => e.weight).weight} kg` : fitness?.weight ? `${fitness.weight} kg` : '—'],
                ['Level', fitness?.experienceLevel || '—'],
                ['Preference', fitness?.workoutPreference || '—'],
                ['Streak', `${workoutStreak(logs)} day${workoutStreak(logs) === 1 ? '' : 's'}`],
                ['Allergies', fitness?.allergies?.length ? fitness.allergies.join(', ') : 'None'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 border-b border-dashed border-zinc-200 pb-2 last:border-0 dark:border-white/[.06]">
                  <dt className="text-zinc-400">{k}</dt>
                  <dd className="truncate font-semibold text-zinc-800 dark:text-zinc-100">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear this conversation?"
        subtitle="All messages in this conversation will be permanently removed from your account."
      >
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setClearOpen(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" icon={<Trash2 size={14} />} onClick={confirmClear}>Clear conversation</Button>
        </div>
      </Modal>
    </>
  )
}
