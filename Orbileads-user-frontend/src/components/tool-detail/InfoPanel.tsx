type InfoPanelProps = {
  title: string
  description?: string
  items?: string[]
}

function InfoPanel({ title, description, items }: InfoPanelProps) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white px-4 py-4">
      <h3 className="text-[16px] font-semibold text-slate-950">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
      {items && items.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default InfoPanel
