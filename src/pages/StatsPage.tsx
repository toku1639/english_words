import { useRef, useState } from 'react'
import { StatBar } from '../components/ui/ProgressBar'
import { Button, PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../hooks/useAppData'
import { getStats } from '../types'

export function StatsPage() {
  const {
    words,
    progress,
    todayCount,
    streak,
    last7Days,
    exportProgress,
    importProgressFromFile,
    resetAllProgress,
  } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const stats = getStats(words, progress)
  const masteryRate = stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0
  const maxDayCount = Math.max(1, ...last7Days.map((d) => d.count))

  const showMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleImport = async (file: File) => {
    try {
      await importProgressFromFile(file)
      showMessage('進捗をインポートしました')
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'インポートに失敗しました')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="統計" subtitle="学習の進捗とデータ管理" />

      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>
      )}

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">習得率</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{masteryRate}%</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">今日</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{todayCount}</p>
          <p className="text-[11px] text-zinc-400">語回答</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">連続</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{streak}</p>
          <p className="text-[11px] text-zinc-400">日</p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-zinc-900">過去7日間</h2>
        <div className="mt-4 flex items-end justify-between gap-2">
          {last7Days.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className="w-full max-w-[2rem] rounded-t-md bg-zinc-900 transition-all"
                  style={{ height: `${Math.max(4, (day.count / maxDayCount) * 100)}%` }}
                  title={`${day.count} 語`}
                />
              </div>
              <span className="text-[10px] text-zinc-400">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-zinc-900">全体の進捗</h2>
        <div className="mt-4">
          <StatBar
            known={stats.known}
            unknown={stats.unknown}
            notStarted={stats.notStarted}
            total={stats.total}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-zinc-900">進捗のバックアップ</h2>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          エクスポートした JSON を GitHub の <code className="rounded bg-zinc-100 px-1">public/progress.json</code>{' '}
          としてコミットすると、次回アクセス時に自動で取り込まれます。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={exportProgress}>エクスポート</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            インポート
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImport(file)
              e.target.value = ''
            }}
          />
        </div>
        <details className="mt-4 text-xs text-zinc-500">
          <summary className="cursor-pointer font-medium text-zinc-600">GitHub での同期手順</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4 leading-relaxed">
            <li>「エクスポート」で JSON をダウンロード</li>
            <li>ファイル名を <code className="rounded bg-zinc-100 px-1">progress.json</code> に変更</li>
            <li><code className="rounded bg-zinc-100 px-1">public/progress.json</code> に配置して push</li>
            <li>デプロイ後、各端末でアプリを開くと自動マージ</li>
          </ol>
        </details>
        <Button
          variant="danger"
          size="sm"
          className="mt-4"
          onClick={() => {
            if (confirm('すべての学習進捗をリセットしますか？')) {
              resetAllProgress()
              showMessage('進捗をリセットしました')
            }
          }}
        >
          進捗をリセット
        </Button>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-sm font-semibold text-zinc-900">PWA とは？</h2>
        <p className="mt-2 text-xs leading-relaxed text-zinc-600">
          スマホのブラウザメニューから「ホーム画面に追加」すると、通常のアプリのようにアイコンから起動できます。
          ブラウザのタブやアドレスバーが非表示になり、学習に集中しやすくなります。
        </p>
      </section>
    </div>
  )
}
