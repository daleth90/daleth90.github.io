import { Date } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

function compareDate(a: Date, b: Date): number {
    const dateA = new globalThis.Date(a.getFullYear(), a.getMonth(), a.getDate())
    const dateB = new globalThis.Date(b.getFullYear(), b.getMonth(), b.getDate())
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        // If created date and modified date are equal, display only one date.
        // If created date is later than modified date, it means failed to get created date, display modified date.
        const showPeriod = compareDate(fileData.dates.created, fileData.dates.modified) < 0
        if (showPeriod) {
          segments.push(<span><Date date={fileData.dates.created} locale={cfg.locale} /> - <Date date={fileData.dates.modified} locale={cfg.locale} /></span>)
        }
        else {
          segments.push(<span><Date date={fileData.dates.modified} locale={cfg.locale} /></span>)
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
