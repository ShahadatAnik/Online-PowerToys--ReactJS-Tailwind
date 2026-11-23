import { Link } from "@tanstack/react-router"
import { ArrowLeft, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { tools } from "@/lib/tools"

export function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-16">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass />
          </EmptyMedia>
          <p className="font-display text-6xl leading-none text-primary">404</p>
          <EmptyTitle>This page drifted off into space</EmptyTitle>
          <EmptyDescription>
            The page you're looking for doesn't exist or has moved. Try one of these tools instead.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            {tools.slice(0, 4).map((tool) => (
              <Button key={tool.path} variant="outline" size="sm" asChild>
                <Link to={tool.path}>
                  <tool.icon />
                  {tool.title}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild>
            <Link to="/">
              <ArrowLeft />
              Back to all tools
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
