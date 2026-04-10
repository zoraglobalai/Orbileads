import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AppSidebar from '../../../components/AppSidebar'
import CollapsibleSection from '../../../components/tool-detail/CollapsibleSection'
import InfoPanel from '../../../components/tool-detail/InfoPanel'
import RunOptionsCard from '../../../components/tool-detail/RunOptionsCard'
import ToolDetailHeader from '../../../components/tool-detail/ToolDetailHeader'
import ToolInputSection from '../../../components/tool-detail/ToolInputSection'
import ToolTabs from '../../../components/tool-detail/ToolTabs'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../../lib/auth'
import { platforms } from '../../../lib/data/platforms'
import { tools } from '../../../lib/data/tools'
import { formatDateTimeLong, formatDuration } from '../../../lib/utils/dateFormat'
import { useRunManager } from '../../../hooks/useRunManager'
import type { RunRecord } from '../../../types/run'
import type { ToolRecord } from '../../../types/tool'

type ToolTabKey = 'input' | 'information' | 'runs' | 'integrations'

function ToolDetailPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const navigate = useNavigate()
  const { platformSlug, toolSlug } = useParams()
  const runManager = useRunManager()

  const platform = useMemo(
    () => platforms.find((entry) => entry.slug === platformSlug) ?? null,
    [platformSlug],
  )
  const tool = useMemo(
    () => tools.find((entry) => entry.platformSlug === platformSlug && entry.slug === toolSlug) ?? null,
    [platformSlug, toolSlug],
  )

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!platform || !tool) {
    return <Navigate to="/store" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <ToolDetailContent
        key={tool.id}
        tool={tool}
        navigate={navigate}
        pricingLabel={getPricingLabel(tool.id)}
        {...runManager}
      />
    </main>
  )
}

type ToolDetailContentProps = {
  tool: ToolRecord
  pricingLabel: string
  navigate: ReturnType<typeof useNavigate>
  createDefaultValues: ReturnType<typeof useRunManager>['createDefaultValues']
  getRunsForTool: ReturnType<typeof useRunManager>['getRunsForTool']
  recordRecentTool: ReturnType<typeof useRunManager>['recordRecentTool']
  startMockRun: ReturnType<typeof useRunManager>['startMockRun']
}

function ToolDetailContent({
  tool,
  pricingLabel,
  navigate,
  createDefaultValues,
  getRunsForTool,
  recordRecentTool,
  startMockRun,
}: ToolDetailContentProps) {
  const [activeTab, setActiveTab] = useState<ToolTabKey>('input')
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [latestStartedRun, setLatestStartedRun] = useState<RunRecord | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      tool.inputSections
        .filter((section) => section.collapsible)
        .map((section) => [section.id, section.id === 'run-options']),
    ),
  )
  const [values, setValues] = useState<Record<string, string | number | boolean>>(() =>
    createDefaultValues(tool),
  )

  useEffect(() => {
    recordRecentTool(tool)
  }, [recordRecentTool, tool])

  const toolRuns = getRunsForTool(tool.id).slice(0, 6)
  const inputSections = tool.inputSections.filter((section) => section.id !== 'run-options')
  const runOptionsSection = tool.inputSections.find((section) => section.id === 'run-options')

  function handleChange(fieldName: string, value: string | number | boolean) {
    setValues((current) => ({ ...current, [fieldName]: value }))
    setErrors((current) => {
      if (!current[fieldName]) {
        return current
      }

      const next = { ...current }
      delete next[fieldName]
      return next
    })
  }

  function validate() {
    const nextErrors: Record<string, string> = {}

    for (const section of tool.inputSections) {
      for (const field of section.fields ?? []) {
        if (!field.required) {
          continue
        }

        const value = values[field.name]
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (field.type === 'number' && Number.isNaN(value))

        if (isEmpty) {
          nextErrors[field.name] = `${field.label} is required`
        }
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleStart() {
    if (!validate()) {
      setActiveTab('input')
      setLatestStartedRun(null)
      setNotice('Please complete the required fields before starting the run.')
      return
    }

    const run = startMockRun(tool, values)
    setLatestStartedRun(run)
    setActiveTab('runs')
    setNotice(`Run started for ${run.toolName}. You can track the live status below.`)
  }

  function handleSave() {
    setNotice(
      'Task presets will be connected to backend workflows later. Your current input remains available in this session.',
    )
  }

  function handleRestoreExampleInput() {
    setValues(createDefaultValues(tool))
    setErrors({})
    setNotice('Example input restored.')
    setLatestStartedRun(null)
  }

  return (
    <section className="min-h-screen flex-1 bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="text-[var(--color-brand)] transition hover:text-[var(--color-brand-strong)]"
          >
            All Actors
          </button>
        </div>

        <div className="mt-4">
          <ToolDetailHeader
            tool={tool}
            pricingLabel={pricingLabel}
            onStart={handleStart}
            onSave={handleSave}
          />
        </div>

        {notice ? (
          <div className="mt-4 rounded-lg border border-[color:rgba(22,121,189,0.22)] bg-[var(--color-brand-muted)] px-4 py-3 text-sm text-[var(--color-brand-strong)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{notice}</p>
                {latestStartedRun ? (
                  <p className="mt-1 text-xs text-slate-600">
                    Run ID: {latestStartedRun.id} | Status: {latestStartedRun.status}
                  </p>
                ) : null}
              </div>

              {latestStartedRun ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('runs')}
                    className="rounded-md border border-[color:rgba(22,121,189,0.28)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-brand)] transition hover:bg-slate-50"
                  >
                    View tool runs
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/runs')}
                    className="rounded-md bg-[var(--color-brand)] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
                  >
                    Open all runs
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <ToolTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            runCount={toolRuns.length}
          />
        </div>

        {activeTab === 'input' ? (
          <div className="mt-6 space-y-5">
            <div className="max-w-5xl space-y-4 text-[15px] leading-7 text-slate-700">
              {tool.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {viewMode === 'form' ? (
              <>
                {inputSections.map((section) =>
                  section.collapsible ? (
                    <CollapsibleSection
                      key={section.id}
                      title={section.title}
                      description={section.description}
                      isOpen={Boolean(openSections[section.id])}
                      onToggle={() =>
                        setOpenSections((current) => ({
                          ...current,
                          [section.id]: !current[section.id],
                        }))
                      }
                    >
                      <ToolInputSection
                        section={section}
                        values={values}
                        errors={errors}
                        onChange={handleChange}
                      />
                    </CollapsibleSection>
                  ) : (
                    <section key={section.id} className="rounded-lg border border-slate-300 bg-white px-4 py-4">
                      <h3 className="text-[15px] font-semibold text-slate-950">{section.title}</h3>
                      {section.description ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                      ) : null}
                      <div className="mt-4">
                        <ToolInputSection
                          section={section}
                          values={values}
                          errors={errors}
                          onChange={handleChange}
                        />
                      </div>
                    </section>
                  ),
                )}

                {runOptionsSection?.contentLines ? (
                  <CollapsibleSection
                    title={runOptionsSection.title}
                    description={runOptionsSection.description}
                    isOpen={Boolean(openSections[runOptionsSection.id])}
                    onToggle={() =>
                      setOpenSections((current) => ({
                        ...current,
                        [runOptionsSection.id]: !current[runOptionsSection.id],
                      }))
                    }
                  >
                    <ToolInputSection
                      section={runOptionsSection}
                      values={values}
                      errors={errors}
                      onChange={handleChange}
                    />
                  </CollapsibleSection>
                ) : null}
              </>
            ) : (
              <section className="rounded-lg border border-slate-300 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-slate-950">JSON input</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      JSON mode is planned for advanced task templates and backend-driven payload
                      automation. The current frontend keeps the structured form as the active source
                      of truth for runs.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    Backend-ready
                  </span>
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-950 p-4">
                  <pre className="overflow-x-auto text-sm leading-7 text-slate-200">{`{
  "tool": "${tool.slugLabel}",
  "mode": "form-backed",
  "status": "json-editor-coming-soon",
  "note": "Use the Form tab to configure a run in this frontend build."
}`}</pre>
                </div>
              </section>
            )}

            <RunOptionsCard options={tool.runOptions} />

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <path d="M6 4.5v11l8-5.5-8-5.5Z" fill="currentColor" />
                </svg>
                {tool.footerActions[0] ?? tool.startButtonLabel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                {tool.footerActions[1] ?? 'Save'}
              </button>
              <button
                type="button"
                onClick={handleRestoreExampleInput}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                {tool.footerActions[2] ?? 'Restore example input'}
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === 'information' ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <InfoPanel title="Overview" description={tool.infoTab.overview} />
            <InfoPanel title="Best use cases" items={tool.infoTab.bestUseCases} />
            <InfoPanel title="Typical output fields" items={tool.infoTab.outputFields} />
            <InfoPanel title="Example workflow" description={tool.infoTab.exampleWorkflow} />
          </div>
        ) : null}

        {activeTab === 'runs' ? (
          <section className="mt-6 overflow-hidden rounded-lg border border-slate-300 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Recent runs for this tool</h2>
                <p className="mt-1 text-sm text-slate-500">Start a new run to populate this execution history.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/runs')}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Open all runs
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                {toolRuns.length === 0 ? (
                  <div className="px-6 py-12 text-sm text-slate-600">
                    No runs have been started for this tool yet.
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-[.7fr_1fr_.8fr_.7fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span>Status</span>
                      <span>Started</span>
                      <span>Results</span>
                      <span>Duration</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {toolRuns.map((run) => (
                        <div
                          key={run.id}
                          className="grid grid-cols-[.7fr_1fr_.8fr_.7fr] gap-4 px-6 py-4 text-sm text-slate-700"
                        >
                          <div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                run.status === 'Succeeded'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {run.status}
                            </span>
                          </div>
                          <div>{formatDateTimeLong(run.startedAt)}</div>
                          <div>{run.resultCount} results</div>
                          <div>{formatDuration(run.durationSeconds)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'integrations' ? (
          <div className="mt-6">
            <InfoPanel
              title="Automation and integrations"
              description="This tool can later be connected to workflow automations, outbound systems, enrichment pipelines, and CRM imports."
              items={[
                'Save outputs for downstream workflows',
                'Connect with lead qualification flows',
                'Push extracted records into future CRM sync pipelines',
              ]}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function getPricingLabel(toolId: string) {
  switch (toolId) {
    case 'tool-google-maps-business-scraper':
      return 'from $4.00 / 1,000 scraped places'
    case 'tool-google-maps-contact-extractor':
      return 'from $4.60 / 1,000 enriched businesses'
    case 'tool-youtube-scraper':
      return 'from $3.70 / 1,000 video results'
    case 'tool-youtube-channel-discovery':
      return 'from $3.20 / 1,000 channels'
    case 'tool-linkedin-company-employee-scraper':
      return 'from $5.40 / 1,000 employee records'
    case 'tool-linkedin-profile-scraper':
      return 'from $4.90 / 1,000 profile records'
    case 'tool-instagram-profile-scraper':
      return 'from $3.90 / 1,000 profile results'
    case 'tool-instagram-comment-extractor':
      return 'from $3.40 / 1,000 comments'
    default:
      return 'Usage-based pricing'
  }
}

export default ToolDetailPage
