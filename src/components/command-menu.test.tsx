import { describe, expect, test } from "bun:test"
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CommandMenu } from "@/components/command-menu"
import { ThemeProvider } from "@/components/theme-provider"
import { tools } from "@/lib/tools"

function renderMenu() {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <ThemeProvider>
          <CommandMenu />
        </ThemeProvider>
      ),
    }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })
  return render(<RouterProvider router={router} />)
}

describe("CommandMenu", () => {
  test("opens from the trigger and lists every tool", async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(await screen.findByRole("button", { name: "Search tools" }))

    expect(await screen.findByPlaceholderText(/tool name or keyword/)).toBeInTheDocument()
    for (const tool of tools) {
      expect(screen.getByRole("option", { name: new RegExp(tool.title) })).toBeInTheDocument()
    }
  })

  test("filters by whole terms instead of loose fuzzy matching", async () => {
    const user = userEvent.setup()
    renderMenu()
    await user.click(await screen.findByRole("button", { name: "Search tools" }))

    await user.type(await screen.findByPlaceholderText(/tool name or keyword/), "uuid")

    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("UUID Generator")
  })

  test("opens with the Ctrl+K shortcut", async () => {
    const user = userEvent.setup()
    renderMenu()
    await screen.findByRole("button", { name: "Search tools" })

    await user.keyboard("{Control>}k{/Control}")

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })
})
