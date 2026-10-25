type Creator = {
  name: string
  image: string
  title: string
  source: string
  photographer: string
  license: 'CC BY 3.0' | 'CC BY-SA 4.0'
  licenseUrl: string
}

const creators: Creator[] = [
  {
    name: 'Charli D’Amelio',
    image: `${import.meta.env.BASE_URL}creators/charli-damelio.jpg`,
    title: "Charli D'Amelio 2.jpg",
    source: 'https://commons.wikimedia.org/wiki/File:Charli_D%27Amelio_2.jpg',
    photographer: 'Priyanka Pruthi',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    name: 'Khaby Lame',
    image: `${import.meta.env.BASE_URL}creators/khaby-lame.jpg`,
    title: 'KhabyLame.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:KhabyLame.jpg',
    photographer: 'Gilzetbase',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    name: 'Addison Rae',
    image: `${import.meta.env.BASE_URL}creators/addison-rae.jpg`,
    title: 'Addison Rae portrait.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Addison_Rae_portrait.jpg',
    photographer: 'Alisha Rose Barnes',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    name: 'Bella Poarch',
    image: `${import.meta.env.BASE_URL}creators/bella-poarch.jpg`,
    title: 'Bella Poarch - Pink Aura Tour.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Bella_Poarch_-_Pink_Aura_Tour.jpg',
    photographer: 'Angie Freems',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    name: 'Kimberly Loaiza',
    image: `${import.meta.env.BASE_URL}creators/kimberly-loaiza.jpg`,
    title: 'Kimberly Loaiza.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Kimberly_Loaiza.jpg',
    photographer: 'Juan De Dios Pantoja OFICIAL',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
]

export default function CreatorMarquee() {
  return (
    <div className="mt-9 sm:mt-12 lg:mt-16">
      <div
        className="creator-viewport overflow-hidden"
        role="region"
        aria-label="Galería de creadores populares de TikTok"
      >
        <div className="creator-track flex w-max" aria-live="off">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex flex-none gap-3 pr-3 sm:gap-4 sm:pr-4"
              aria-hidden={copy > 0}
            >
              {creators.map((creator) => (
                <figure
                  key={`${copy}-${creator.name}`}
                  className="relative aspect-[0.69] w-36 flex-none overflow-hidden rounded-xl bg-ink-800 sm:w-48 lg:w-56"
                >
                  <img
                    src={creator.image}
                    alt={copy === 0 ? creator.name : ''}
                    loading={copy === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 font-display text-sm font-semibold text-white sm:text-base">
                    {creator.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-5xl flex-col items-center gap-2 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-white/55">
          Referentes globales de TikTok. Sus imágenes no implican colaboración ni respaldo de Live Brand.
        </p>
        <details className="text-xs text-white/50">
          <summary className="cursor-pointer underline decoration-white/30 underline-offset-4">
            Créditos de imágenes
          </summary>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:justify-end">
            {creators.map((creator) => (
              <li key={creator.name}>
                <a href={creator.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {creator.title}
                </a>{' '}
                · {creator.photographer} ·{' '}
                <a href={creator.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {creator.license}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )
}
