import { useNavigate } from "@tanstack/react-router"
import { House, Monitor, Moon, Search, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useModHotkey } from "@/hooks/use-hotkey"
import { useMounted } from "@/hooks/use-mounted"
import { toolCategories, tools } from "@/lib/tools"

/**
 * Every search term must appear in the item's label or keywords. Label matches rank
 * above keyword-only matches. (cmdk's default fuzzy match is too loose for short queries.)
 */
function filterItems(value: string, search: string, keywords: string[] = []) {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean)
  const label = value.toLowerCase()
  const haystack = `${label} ${keywords.join(" ").toLowerCase()}`
  if (!terms.every((term) => haystack.includes(term))) return 0
  return terms.every((term) => label.includes(term)) ? 1 : 0.5
}

function useIsMac() {
  const mounted = useMounted()
  return mounted && /Mac|iPhone|iPad/.test(navigator.userAgent)
}

/** Global ⌘K / Ctrl+K palette for jumping between tools and switching theme. */
export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const isMac = useIsMac()

  useModHotkey("k", () => setOpen((value) => !value))

  const run = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-9 justify-start px-0 text-muted-foreground max-sm:justify-center sm:w-56 sm:px-3 md:w-64"
        aria-label="Search tools"
      >
        <Search />
        <span className="hidden flex-1 text-left sm:inline">Search tools…</span>
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search tools"
        description="Jump to a tool or run a command"
      >
        <Command filter={filterItems}>
          <CommandInput placeholder="Type a tool name or keyword…" />
          <CommandList>
            <CommandEmpty>No tools found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => run(() => navigate({ to: "/" }))}>
                <House />
                Home
              </CommandItem>
            </CommandGroup>
            {toolCategories.map((category) => (
              <CommandGroup key={category} heading={category}>
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <CommandItem
                      key={tool.path}
                      value={tool.title}
                      keywords={[...tool.keywords]}
                      onSelect={() => run(() => navigate({ to: tool.path }))}
                    >
                      <tool.icon />
                      {tool.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => run(() => setTheme("light"))}>
                <Sun />
                Light theme
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme("dark"))}>
                <Moon />
                Dark theme
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme("system"))}>
                <Monitor />
                System theme
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
