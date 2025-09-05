import { PageLayout, SharedLayout } from "./quartz/cfg"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import { FileTrieNode } from "./quartz/util/fileTrie"
import { isFolderPath } from "./quartz/util/path"
import * as Component from "./quartz/components"

function recentNotesFilter(data: QuartzPluginData): boolean {
  if (data.slug === "index") return false
  if (isFolderPath(data.slug ?? "")) return false

  if (typeof data.frontmatter?.recentnotes !== "undefined" &&
      (data.frontmatter?.recentnotes === false || data.frontmatter?.recentnotes === "false")) {
    return false
  }

  return true
}
  
// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 5,
        showTags: false,
        filter: recentNotesFilter,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'daleth90/daleth90.github.io.discussion',
        repoId: 'R_kgDOOx11vw',
        category: 'Comments',
        categoryId: 'DIC_kwDOOx11v84CqrSE',
        mapping: 'url',
        strict: true,
        reactionsEnabled: true,
        inputPosition: 'top',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/daleth90",
      "LinkedIn": "https://www.linkedin.com/in/wentaichi/",
      "Bluesky": "https://bsky.app/profile/daleth90.bsky.social",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
function explorerFilter(node: FileTrieNode): boolean {
  const omit = ["portfolio_en"]
  return !omit.some(s => node.slug.toLowerCase().includes(s))
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => {
        const omit = new Set(["index", "portfolio", "portfolio_en"])
        return page.fileData.slug !== undefined && !omit.has(page.fileData.slug.toLowerCase())
      },
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: explorerFilter,
	}),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: explorerFilter,
    }),
  ],
  right: [],
}
