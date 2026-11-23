import { describe, expect, test } from "bun:test"
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render, screen } from "@testing-library/react"
import { ToolCard } from "@/components/tool-card"
import { tools } from "@/lib/tools"

function renderWithRouter(ui: () => React.ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: ui }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })
  return render(<RouterProvider router={router} />)
}

describe("ToolCard", () => {
  test("links to the tool and shows its title and summary", async () => {
    const tool = tools[0]
    renderWithRouter(() => <ToolCard tool={tool} />)

    const link = await screen.findByRole("link", { name: new RegExp(tool.title) })
    expect(link).toHaveAttribute("href", tool.path)
    expect(screen.getByText(tool.summary)).toBeInTheDocument()
  })

  test("marks new tools with a badge", async () => {
    const tool = tools.find((t) => "isNew" in t && t.isNew)
    if (!tool) throw new Error("expected at least one new tool")
    renderWithRouter(() => <ToolCard tool={tool} />)

    expect(await screen.findByText("New")).toBeInTheDocument()
  })
})
